# CloudStream Web

A browser client for the CNCVerse CloudStream extension collection, with a bridge-powered catalog and stream interface.

## How extension execution works

CloudStream `.cs3` files contain Android/Kotlin plugin code. A browser cannot execute those packages. This project therefore uses a separate, CloudStream-compatible CNCVerse Bridge server as the execution runtime and talks to its Stremio-compatible HTTP API.

- The Discover page reads the pinned CNCVerse repository manifest and lists its extensions.
- Package storage remains available for inspection, but downloading a `.cs3` file does not execute it.
- The **Runtime** page reads catalogs, metadata and stream results from the connected bridge server.
- The Next.js API route proxies only the bridge manifest, catalog, metadata and stream endpoints. The bridge URL stays server-side.

## Connect the runtime

1. Install the official [CNCVerse Bridge Android app](https://github.com/NivinCNC/CNCVerse-Bridge/releases/latest) or a supported Linux release. Start its server and install/enable the CNCVerse extension repository inside Bridge.
2. The easiest remote connection is an HTTPS Cloudflare Tunnel. Bridge documents this under **Stremio Mode**; it requires a domain managed by Cloudflare. Keep the Bridge server and tunnel running while using the website.
3. In Vercel → Project → Settings → Environment Variables, set `CNCVERSE_BRIDGE_URL` to the HTTPS addon base URL. Remove the trailing `/manifest.json`; do not include that path.
4. Redeploy, open **Runtime**, and confirm that the bridge manifest loads. The Runtime page can then browse catalogs, search catalogs that declare a `search` extra, fetch metadata, and request streams.

If the runtime is not connected, the Runtime page explains the missing configuration. No fake local execution is attempted.

## Limitations

- A bridge server must be running and reachable over HTTPS.
- The bridge server must have the CNCVerse repository and extensions installed/enabled.
- Playback depends on stream format and browser support. Some providers require authentication, cookies, region access, or a native player.
- Vercel is used only for the web frontend and a small API proxy. It is not used to execute Android extension code.

## Development

- Node.js 20+
- `npm install`
- `npm run dev`

Set `CNCVERSE_BRIDGE_URL` in `.env.local` when testing the runtime locally.
