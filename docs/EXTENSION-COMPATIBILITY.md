# CNCVerse extension compatibility

## Architecture

CNCVerse publishes CloudStream `.cs3` extensions. These are Android/Kotlin plugins, not browser JavaScript modules. The browser cannot load their DEX bytecode, instantiate their plugin classes, or provide Android framework APIs.

This web app uses a separate CNCVerse Bridge runtime for execution. The bridge exposes a Stremio-compatible API; the web app consumes its manifest, catalogs, metadata and stream results.

## Current implementation

- Pinned CNCVerse repository manifest and plugin-list loading.
- Package download, checksum validation, manifest inspection and browser storage (inspection only; not execution).
- `/bridge` page for bridge connection status, catalog browsing, catalog search, metadata and stream discovery.
- `/api/bridge/*` server-side proxy for manifest, catalog, metadata and stream requests.
- Bridge URL is configured with the server-side `CNCVERSE_BRIDGE_URL` environment variable and is never supplied by the browser.

## Required setup

1. Obtain and run an authorised CNCVerse Bridge server.
2. Set `CNCVERSE_BRIDGE_URL` to its HTTPS base URL in the deployment environment.
3. Ensure the bridge server has the CNCVerse repository installed and the desired extensions enabled.
4. Open `/bridge` and verify that the bridge manifest and catalogs load.

The separate CNCVerse Bridge repository states that its source is proprietary and requires explicit permission before copying, modifying or redistributing it. This project does not copy or bundle that code.

## Known limitations

- Without a configured bridge server, the app can list and store packages but cannot execute them.
- Some stream URLs may not play in a browser due to HLS, DRM, authentication, CORS, geo-restrictions or provider-specific requirements.
- A returned stream is not a guarantee that the provider is available or that playback is supported.
- Do not label a downloaded package as active; package storage and runtime execution are separate states.
