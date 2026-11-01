"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Film, Play, Search, Server, Tv } from "lucide-react";

type Catalog = { type: string; id: string; name: string; extra?: { name: string; isRequired?: boolean }[] };
type AddonManifest = { name?: string; version?: string; description?: string; catalogs?: Catalog[]; resources?: (string | { name: string })[] };
type MetaPreview = { id: string; type: string; name: string; poster?: string; background?: string; description?: string; year?: string | number; genres?: string[] };
type Stream = { name?: string; title?: string; url?: string; externalUrl?: string; description?: string; behaviorHints?: { notWebReady?: boolean } };

async function bridge<T>(path: string): Promise<T> {
  const response = await fetch("/api/bridge/" + path, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Bridge returned HTTP ${response.status}`);
  return data as T;
}

export default function BridgePage() {
  const [manifest, setManifest] = useState<AddonManifest | null>(null);
  const [catalogIndex, setCatalogIndex] = useState(0);
  const [items, setItems] = useState<MetaPreview[]>([]);
  const [selected, setSelected] = useState<MetaPreview | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const catalogs = manifest?.catalogs || [];
  const activeCatalog = catalogs[catalogIndex];
  const supportsStreams = useMemo(() => (manifest?.resources || []).some((r) => (typeof r === "string" ? r : r.name) === "stream"), [manifest]);

  useEffect(() => {
    bridge<AddonManifest>("manifest.json").then((value) => {
      setManifest(value);
      if (!value.catalogs?.length) setError("The connected runtime did not publish any catalogs.");
    }).catch((e) => setError(e instanceof Error ? e.message : "Could not connect to runtime."));
  }, []);

  async function loadCatalog(search = "") {
    if (!activeCatalog) return;
    setBusy(true); setError(""); setSelected(null); setStreams([]);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      const suffix = params.size ? "?" + params.toString() : "";
      const result = await bridge<{ metas?: MetaPreview[] }>(`catalog/${encodeURIComponent(activeCatalog.type)}/${encodeURIComponent(activeCatalog.id)}.json${suffix}`);
      setItems(result.metas || []);
      if (!(result.metas || []).length) setError(search ? "No matches. This catalog may not support search." : "This catalog is empty.");
    } catch (e) { setError(e instanceof Error ? e.message : "Catalog request failed."); }
    finally { setBusy(false); }
  }

  useEffect(() => { if (activeCatalog) loadCatalog(); }, [catalogIndex, manifest]);

  async function openTitle(item: MetaPreview) {
    setSelected(item); setStreams([]); setError(""); setBusy(true);
    try {
      const meta = await bridge<{ meta?: MetaPreview }>(`meta/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}.json`);
      const title = meta.meta || item;
      setSelected(title);
      const result = await bridge<{ streams?: Stream[] }>(`stream/${encodeURIComponent(title.type)}/${encodeURIComponent(title.id)}.json`);
      setStreams(result.streams || []);
      if (!(result.streams || []).length) setError("No streams were returned for this title.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load streams."); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-[#090d13] text-white">
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#090d13]/90 px-4 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3"><Link href="/" className="rounded-xl border border-white/10 p-2 text-white/70 hover:text-white" aria-label="Back"><ArrowLeft size={18}/></Link><div><div className="font-semibold tracking-wide">CloudStream Runtime</div><div className="text-xs text-white/45">CNCVerse Bridge connection</div></div></div>
        <div className="flex items-center gap-2 text-xs text-white/50"><Server size={15}/>{manifest ? "Connected" : "Checking runtime"}</div>
      </div>
    </header>
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#182536] to-[#10151e] p-6 md:p-9">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[.18em] text-cyan-300"><Tv size={15}/> EXTENSION-POWERED STREAMING</div>
        <h1 className="max-w-2xl text-3xl font-semibold md:text-5xl">One runtime. The whole extension library.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">The browser connects to a CloudStream-compatible bridge server. The bridge executes the Android extensions and returns catalogs and streams through a Stremio-compatible API.</p>
        {manifest && <p className="mt-4 text-sm text-emerald-300">{manifest.name || "Bridge"} {manifest.version ? `· v${manifest.version}` : ""}</p>}
      </section>

      {!manifest && <section className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><div className="mb-2 flex items-center gap-2 font-medium"><Server size={18}/> Runtime not connected</div><p className="text-sm leading-6 text-white/60">Set <code className="rounded bg-black/30 px-1.5 py-1 text-cyan-200">CNCVERSE_BRIDGE_URL</code> in your hosting environment to the HTTPS URL of an authorised CNCVerse Bridge server, then redeploy. The browser cannot execute .cs3 packages by itself.</p>{error && <p className="mt-4 break-words text-sm text-amber-300">{error}</p>}</section>}

      {manifest && <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <select value={catalogIndex} onChange={e => setCatalogIndex(Number(e.target.value))} className="rounded-xl border border-white/10 bg-[#141c27] px-4 py-3 text-sm outline-none">{catalogs.map((c,i)=><option key={c.id+i} value={i}>{c.name} · {c.type}</option>)}</select>
            <form className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3" onSubmit={e=>{e.preventDefault();loadCatalog(query);}}><Search size={17} className="shrink-0 text-white/40"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search this catalog..." className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"/><button className="text-sm text-cyan-300">Search</button></form>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {items.map(item=><button key={item.id} onClick={()=>openTitle(item)} className={`overflow-hidden rounded-2xl border text-left transition ${selected?.id===item.id?"border-cyan-300":"border-white/10 hover:border-white/30"} bg-white/[.03]`}><div className="aspect-[2/3] bg-[#18202b]">{item.poster?<img src={item.poster} alt="" className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-white/25"><Film size={32}/></div>}</div><div className="p-3"><div className="line-clamp-2 text-sm font-medium">{item.name}</div><div className="mt-1 text-xs text-white/40">{item.year || item.type}</div></div></button>)}
          </div>
          {busy && <p className="mt-5 text-sm text-cyan-200">Loading…</p>}
          {error && <p className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-sm text-amber-200">{error}</p>}
        </section>
        <aside className="h-fit rounded-2xl border border-white/10 bg-white/[.03] p-5 lg:sticky lg:top-24">
          {selected ? <><div className="flex gap-4">{selected.poster&&<img src={selected.poster} alt="" className="h-28 w-20 rounded-lg object-cover"/>}<div><h2 className="font-semibold">{selected.name}</h2><p className="mt-1 text-xs text-white/45">{selected.year} {selected.genres?.join(" · ")}</p></div></div><p className="mt-4 text-sm leading-6 text-white/55">{selected.description || "No description available."}</p><div className="mt-5 space-y-2"><div className="text-xs font-semibold uppercase tracking-wider text-white/45">Available streams</div>{streams.map((stream,i)=><div key={i} className="rounded-xl border border-white/10 p-3"><div className="text-sm font-medium">{stream.name || stream.title || `Source ${i+1}`}</div>{stream.description&&<p className="mt-1 text-xs text-white/45">{stream.description}</p>}{stream.url&&<a href={stream.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs text-cyan-300"><Play size={14}/> Open stream <ExternalLink size={13}/></a>}{stream.externalUrl&&<a href={stream.externalUrl} target="_blank" rel="noreferrer" className="mt-3 ml-3 inline-flex items-center gap-2 text-xs text-white/60">Open provider <ExternalLink size={13}/></a>}</div>)}</div></>:<div className="py-10 text-center text-sm text-white/40"><Film size={28} className="mx-auto mb-3 opacity-50"/>Choose a title to load its available streams.</div>}
          {!supportsStreams&&<p className="mt-4 text-xs text-amber-300">This bridge manifest does not advertise stream support.</p>}
        </aside>
      </div>}
      <footer className="mt-12 border-t border-white/10 pt-5 text-xs leading-5 text-white/35">Playback depends on the returned stream format and browser support. Some providers require login, cookies, region access, or a native player. Only use content you are authorised to access.</footer>
    </div>
  </main>;
}
