import { NextRequest, NextResponse } from 'next/server';

const CNC_OWNER = 'NivinCNC';
const CNC_REPO = 'CNCVerse-Cloud-Stream-Extension';
const CNC_BRANCH = 'builds';
const CNC_MANIFEST = 'https://raw.githubusercontent.com/NivinCNC/CNCVerse-Cloud-Stream-Extension/refs/heads/builds/CNC.json';

function allowedUrl(value: string) {
  const url = new URL(value);
  const prefix = `/${CNC_OWNER}/${CNC_REPO}/`;
  const isManifest = url.toString() === CNC_MANIFEST;
  const isBuildAsset = url.hostname === 'raw.githubusercontent.com' &&
    url.pathname.startsWith(prefix) &&
    (url.pathname.includes('/builds/') || url.pathname.startsWith(`${prefix}${CNC_BRANCH}/`));
  if (url.protocol !== 'https:' || url.hostname !== 'raw.githubusercontent.com' || (!isManifest && !isBuildAsset)) {
    throw new Error('Only the approved CNCVerse CloudStream repository is enabled.');
  }
  return url;
}

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get('url');
  if (!input) return NextResponse.json({ error: 'Missing repository manifest URL.' }, { status: 400 });
  try {
    const url = allowedUrl(input);
    const response = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 300 } });
    if (!response.ok) return NextResponse.json({ error: `Repository returned HTTP ${response.status}.` }, { status: response.status });
    const data = await response.json();
    return NextResponse.json({ data, source: url.toString() }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load repository.' }, { status: 400 });
  }
}
