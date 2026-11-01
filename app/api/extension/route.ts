import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = new Set([
  'raw.githubusercontent.com',
  'github.com',
  'objects.githubusercontent.com',
  'release-assets.githubusercontent.com',
]);
const MAX_BYTES = 35 * 1024 * 1024;

function validateUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !ALLOWED_HOSTS.has(url.hostname)) {
    throw new Error('Extension downloads must come from HTTPS GitHub URLs.');
  }
  return url;
}

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get('url');
  const expectedHash = request.nextUrl.searchParams.get('sha256');
  if (!source) return NextResponse.json({ error: 'Missing extension URL.' }, { status: 400 });

  try {
    const url = validateUrl(source);
    const upstream = await fetch(url, { redirect: 'follow', headers: { Accept: 'application/octet-stream' }, signal: AbortSignal.timeout(25_000) });
    if (!upstream.ok) return NextResponse.json({ error: `Extension host returned HTTP ${upstream.status}.` }, { status: upstream.status });
    validateUrl(upstream.url);
    const declaredSize = Number(upstream.headers.get('content-length') || 0);
    if (declaredSize > MAX_BYTES) return NextResponse.json({ error: 'Extension package exceeds the 35 MB limit.' }, { status: 413 });

    const bytes = new Uint8Array(await upstream.arrayBuffer());
    if (bytes.byteLength > MAX_BYTES) return NextResponse.json({ error: 'Extension package exceeds the 35 MB limit.' }, { status: 413 });

    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const actualHash = 'sha256-' + Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    if (expectedHash && expectedHash !== actualHash) {
      return NextResponse.json({ error: 'Extension checksum verification failed.' }, { status: 422 });
    }

    return new NextResponse(bytes, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Length': String(bytes.byteLength),
        'Content-Disposition': 'attachment; filename="cloudstream-extension.cs3"',
        'X-Extension-SHA256': actualHash,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to download extension.' }, { status: 400 });
  }
}
