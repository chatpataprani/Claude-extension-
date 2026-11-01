import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBridgeBase() {
  const raw = process.env.CNCVERSE_BRIDGE_URL;
  if (!raw) return null;
  const url = new URL(raw);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
    throw new Error("CNCVERSE_BRIDGE_URL must use HTTPS (HTTP is allowed only for localhost).");
  }
  return url.toString().replace(/\/$/, "");
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const base = getBridgeBase();
    if (!base) {
      return NextResponse.json(
        { error: "CloudStream runtime is not connected. Set CNCVERSE_BRIDGE_URL to your authorised CNCVerse Bridge server URL." },
        { status: 503 },
      );
    }

    const { path } = await context.params;
    const safePath = path.join("/");
    if (!/^(manifest\.json|catalog\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.:-]+(?:\/[a-zA-Z0-9_.:%=&+~% -]+)?\.json|meta\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.:-]+\.json|stream\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.:-]+\.json)$/.test(safePath)) {
      return NextResponse.json({ error: "Unsupported bridge API path." }, { status: 400 });
    }

    const target = new URL(`${base}/${safePath}`);
    request.nextUrl.searchParams.forEach((value, key) => target.searchParams.set(key, value));
    const upstream = await fetch(target, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Bridge request failed." }, { status: 502 });
  }
}
