# Dbweb Android — implementation status

## Implemented in the repository
- Application ID: `com.chatpataprani.dbweb`.
- User-facing app name: Dbweb (including the debug build label).
- Dbweb launcher foreground artwork is referenced by the adaptive launcher resources.
- Dark neutral launcher background; monochrome launcher uses Dbweb artwork.
- Dbweb website shortcut in Settings.
- Dbweb website action in the Extensions empty state.
- Manual add-repository buttons are hidden in the normal Extensions UI.
- Existing installed-extension management and compatible runtime are retained.
- Default English app strings use Dbweb branding.
- Upstream GPL-3.0 licence and required notices are retained.

## Not represented as complete
- The website action opens `https://webdd.freeddns.org`; it is not a native extension catalogue.
- No public Dbweb catalogue manifest/API has been configured. Native catalogue browsing, one-tap installation, and catalogue-driven updates therefore remain unavailable.
- CloudStream-compatible internal package names, namespaces, and protocol identifiers remain where required for extension compatibility and upstream licence compliance.
- A successful CI build verifies compilation and APK signature integrity, not full runtime behaviour on every phone or Android TV device.

## Release verification
The GitHub Actions workflow **Build Dbweb Android APK** builds `:app:assembleStableDebug`, checks the output APK, verifies its signature, calculates its SHA-256 checksum, and uploads it as an artifact. A release should only be called verified when that workflow completes successfully.
