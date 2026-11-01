"use client";

import { useEffect, useMemo, useState } from "react";
import JSZip from "jszip";
import { getInstalledExtensions, removeInstalledExtension, saveInstalledExtension, type InstalledExtension } from "@/lib/extension-store";
import { ArrowUpRight, Bookmark, Check, ChevronRight, Film, Github, Search, Settings2, ShieldAlert, Sparkles, Tv, X } from "lucide-react";

type Plugin = { name?: string; internalName?: string; description?: string; version?: number; authors?: string[]; url?: string; fileHash?: string; iconUrl?: string; status?: number; tvTypes?: string[]; language?: string; };
type SavedRepo = { url: string; name: string; description: string; plugins: Plugin[]; error?: string };

const CNC_REPO_URL = "https://raw.githubusercontent.com/NivinCNC/CNCVerse-Cloud-Stream-Extension/refs/heads/builds/CNC.json";

async function loadRepo(url: string): Promise<SavedRepo> {
  const get = async (target: string) => {
    const response = await fetch(`/api/repository?url=${encodeURIComponent(target)}`);
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Could not load repository");
    return body.data;
  };
  const manifest = await get(url);
  const lists: string[] = Array.isArray(manifest.pluginLists) ? manifest.pluginLists : [];
  const pluginData = await Promise.all(lists.map(async (list) => {
    try { const value = await get(list); return Array.isArray(value) ? value : []; } catch { return []; }
  }));
  return { url, name: manifest.name || new URL(url).hostname, description: manifest.description || "CloudStream extension repository", plugins: pluginData.flat() };
}

export default function Home() {
  const [repos, setRepos] = useState<SavedRepo[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [active, setActive] = useState("Discover");
  const [installed, setInstalled] = useState<InstalledExtension[]>([]);
  const [installing, setInstalling] = useState<string | null>(null);

  useEffect(() => { getInstalledExtensions().then(setInstalled).catch(() => {}); }, []);
  useEffect(() => {
    loadRepo(CNC_REPO_URL).then(repo => setRepos([repo])).catch(error => {
      setMessage(error instanceof Error ? error.message : "Unable to load CNCVerse extensions.");
      setRepos([]);
    });
  }, []);

  const plugins = useMemo(() => repos.flatMap(r => r.plugins.map(p => ({ ...p, _repo: r.name }))), [repos]);
  const filtered = plugins.filter(p => `${p.name || p.internalName || ""} ${p.description || ""} ${p.language || ""} ${(p.tvTypes || []).join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  // This web client is intentionally pinned to the CNCVerse repository.
  async function installExtension(plugin: Plugin & { _repo: string }) {
    if (!plugin.url) { setMessage("This repository entry has no package URL."); return; }
    setInstalling(plugin.url); setMessage("");
    try {
      const params = new URLSearchParams({ url: plugin.url });
      if (plugin.fileHash) params.set("sha256", plugin.fileHash);
      const response = await fetch("/api/extension?" + params.toString());
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Extension download failed.");
      }
      const bytes = await response.arrayBuffer();
      const zip = await JSZip.loadAsync(bytes);
      const manifestFile = zip.file("manifest.json");
      if (!manifestFile) throw new Error("Package does not contain the CloudStream manifest.json.");
      const manifest = JSON.parse(await manifestFile.async("text"));
      if (!manifest.pluginClassName) throw new Error("Manifest is missing pluginClassName.");
      const entry: InstalledExtension = {
        url: plugin.url,
        name: manifest.name || plugin.name || plugin.internalName || "CloudStream extension",
        internalName: plugin.internalName || manifest.pluginClassName,
        version: Number.isFinite(Number(manifest.version)) ? Number(manifest.version) : null,
        pluginClassName: manifest.pluginClassName,
        requiresResources: Boolean(manifest.requiresResources),
        installedAt: Date.now(),
        packageBytes: bytes,
        checksum: response.headers.get("X-Extension-SHA256") || "",
      };
      await saveInstalledExtension(entry);
      setInstalled(await getInstalledExtensions());
      setMessage(entry.name + " package saved in this browser.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not install extension package.");
    } finally { setInstalling(null); }
  }
  async function uninstallExtension(url: string) {
    await removeInstalledExtension(url);
    setInstalled(await getInstalledExtensions());
    setMessage("Extension package removed from this browser.");
  }


  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brandIcon"><Film size={21}/></div><div><strong>CloudStream</strong><span>WEB EXPERIMENT</span></div></div>
      <div className="navLabel">LIBRARY</div>
      {["Discover", "Extensions", "Repositories"].map((item, i) => <button key={item} className={active === item ? "navItem selected" : "navItem"} onClick={() => setActive(item)}>{i === 0 ? <Tv size={18}/> : i === 1 ? <Sparkles size={18}/> : <Settings2 size={18}/>}<span>{item}</span>{item === "Extensions" && <small>{plugins.length}</small>}</button>)}
      <div className="sidebarBottom"><div className="runtimeNotice"><ShieldAlert size={17}/><div><b>Compatibility preview</b><p>Android extensions need a compatible runtime before they can execute in a browser.</p></div></div><a className="sourceLink" href="https://github.com/recloudstream/cloudstream" target="_blank" rel="noreferrer"><Github size={16}/> Original CloudStream <ArrowUpRight size={14}/></a></div>
    </aside>
    <section className="main">
      <header className="topbar"><div className="crumb">CloudStream <ChevronRight size={14}/> <b>{active}</b></div><div className="topRight"><span className="statusDot"/> Browser edition <button className="iconButton" aria-label="Settings"><Settings2 size={18}/></button></div></header>
      <div className="content">
        <div className="hero"><div className="eyebrow"><span/> OPEN SOURCE MEDIA CENTER</div><h1>Your extensions.<br/><em>Your library.</em></h1><p>A browser-first CloudStream experience for the CNCVerse extension collection.</p><div className="heroActions"><a className="secondary" href="https://github.com/chatpataprani/Claude-extension-" target="_blank" rel="noreferrer">View project <ArrowUpRight size={15}/></a><a className="secondary" href="/bridge">Open runtime <ArrowUpRight size={15}/></a></div><div className="heroGlow"/></div>
        <div className="sectionHead"><div><div className="eyebrow muted">YOUR CATALOG</div><h2>{active === "Repositories" ? "Repositories" : active === "Extensions" ? "Installed sources" : "Explore extensions"}</h2></div><div className="countPill">{plugins.length} extensions · {installed.length} stored</div></div>
        <div className="searchRow"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search extensions, languages, categories..."/>{query && <button onClick={() => setQuery("")}><X size={16}/></button>}</div>
        {active === "Repositories" ? <div className="repoGrid">{repos.map(r => <div className="repoCard" key={r.url}><div className="repoIcon"><Github size={20}/></div><div className="repoInfo"><b>{r.name}</b><p>{r.description}</p><small>{r.plugins.length} extensions · {r.url}</small></div><span className="tag">Official source</span></div>)}</div> : <div className="pluginGrid">{filtered.map((p,i) => <article className="pluginCard" key={p.internalName || p.name || i}><div className="pluginTop"><div className="pluginIcon">{p.iconUrl ? <img src={p.iconUrl} alt=""/> : <Film size={20}/>}</div><span className="tag">{p.language || "Unknown"}</span></div><h3>{p.name || p.internalName || "Unnamed extension"}</h3><p>{p.description || "No description provided by this extension."}</p><div className="pluginFoot"><span>{p._repo}</span><span>v{p.version ?? "—"}</span></div><div className="pluginActions">{installed.some(item => item.url === p.url) ? <><span className="storedBadge"><Check size={13}/> Package stored</span><button className="remove" onClick={() => p.url && uninstallExtension(p.url)}>Remove</button></> : <button className="installButton" disabled={!p.url || installing === p.url} onClick={() => installExtension(p)}>{installing === p.url ? "Downloading..." : "Install package"}</button>}</div></article>)}
        {filtered.length === 0 && <div className="empty"><div className="emptyIcon"><Bookmark size={22}/></div><h3>No extensions found</h3><p>Try another search term.</p></div>}</div>}
        <div className="footnote"><ShieldAlert size={16}/><span>Package storage is a preview only. To run CNCVerse extensions, connect an authorised CNCVerse Bridge server and use the Runtime page.</span></div>
      </div>
    </section>
  </main>;
}
