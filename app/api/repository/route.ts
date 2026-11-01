import { NextRequest, NextResponse } from 'next/server';

function allowedUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !['raw.githubusercontent.com','github.com','gist.githubusercontent.com'].includes(url.hostname)) throw new Error('Only HTTPS GitHub repository URLs are supported.');
  return url;
}

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get('url');
  if (!input) return NextResponse.json({ error: 'Missing repository manifest URL.' }, { status: 400 });
  try {
    let url = allowedUrl(input);
    if (url.hostname === 'github.com') {
      const match = url.pathname.match(/^\/([^/]+)\/([^/]+)(?:\/blob\/([^/]+)\/(.+))?$/);
      if (!match) throw new Error('Use a raw repo.json URL or a GitHub repository URL.');
      url = new URL(match[4] ? `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${match[3]}/${match[4]}` : `https://raw.githubusercontent.com/${match[1]}/${match[2]}/HEAD/repo.json`);
    }
    const response = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 300 } });
    if (!response.ok) return NextResponse.json({ error: `Repository returned HTTP ${response.status}.` }, { status: response.status });
    const data = await response.json();
    return NextResponse.json({ data, source: url.toString() }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load repository.' }, { status: 400 });
  }
}
