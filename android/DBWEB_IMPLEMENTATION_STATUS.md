# Dbweb Android implementation status

## Implemented

- Application ID: com.chatpataprani.dbweb.
- Dbweb app name and debug build label.
- Dbweb launcher artwork wired to adaptive launcher resources.
- Dark neutral launcher background and monochrome launcher artwork.
- Dbweb website shortcut in Settings.
- Dbweb website action in the Extensions screen.
- Manual repository addition on phones and Android TV.
- Repository parsing and installation flow.
- Existing plugin discovery, installation, enable/disable, update, and removal screens.
- Plugin search and installed-plugin management.
- Existing media runtime and compatible repository package support.
- Default English app strings use Dbweb branding.
- Applicable GPL-3.0 licence and required notices are retained.

## Current limitations

- The website shortcut opens the Dbweb website; it is not a native catalogue.
- No public Dbweb catalogue manifest/API has been configured. Native first-party catalogue browsing and one-tap installation from a Dbweb catalogue are therefore not available.
- Third-party repository and provider behaviour depends on each repository, plugin, and service.
- CI compilation and APK signature verification do not replace testing on physical Android phones and Android TV devices.

## Build verification

The **Build Dbweb Android APK** workflow runs :app:assembleStableDebug, checks that the APK exists, verifies its signature, calculates its SHA-256 checksum, and uploads the APK artifact. A build is verified only when the workflow completes successfully.
