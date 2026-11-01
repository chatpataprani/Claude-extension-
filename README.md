# CloudStream Web

A browser client for the CNCVerse CloudStream extension collection, with a bridge-powered catalog and stream interface.

## How extension execution works

CloudStream `.cs3` files contain Android/Kotlin plugin code. A browser cannot execute those packages. This project therefore uses a separate, CloudStream-compatible CNCVerse Bridge server as the execution runtime and talks to its Stremio-compatible HTTP API.

- The Discover page reads the pinned CNCVerse repository manifest and lists its extensions.
- Package storage remains available for inspection, but downloading a `.cs3` file does not execute it.
- The **Runtime** page reads catalogs, metadata and stream results from the connected bridge server.
- The Next.js API route proxies only the bridge manifest, catalog, metadata and stream endpoints. The bridge URL stays server-side.

## Connect the runtime

1. Obtain and run an authorised CNCVerse Bridge server. The bridge project is maintained separately; its published repository currently states that its source is proprietary and requires explicit permission for copying, modification or redistribution. Do not copy its source into this project without permission.
2. In your Vercel project (or local environment), set `CNCVERSE_BRIDGE_URL=https://your-bridge-host.example`. Use the base URL only; do not append `/manifest.json`.
3. Redeploy, open **Runtime**, and confirm that the bridge manifest loads.

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
