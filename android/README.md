# Dbweb for Android

Dbweb is a media and streaming application for Android phones, tablets, and Android TV.

## Features

- Dbweb app name, application ID, launcher artwork, and branding.
- Media discovery and playback through supported providers.
- Extension repository support with manual repository addition.
- Plugin browsing, installation, enabling, disabling, updating, and removal.
- Installed repository management and plugin search.
- Subtitles, playback controls, watch progress, and download capabilities provided by supported providers and the installed runtime.
- Phone and Android TV layouts.
- Dbweb website shortcuts in Settings and the Extensions screen.

## Add extensions and plugins

1. Open **Settings → Extensions**.
2. Tap **Add Repository**.
3. Enter the repository URL and an optional display name.
4. Wait for the repository and its plugin list to load.
5. Select a plugin and follow the installation prompt.
6. Return to the Extensions or Plugins screen to manage installed plugins.

Manual repository addition is supported and remains visible in the app. Add only repositories and plugins you trust. Third-party content, provider availability, playback, subtitles, authentication, and downloads depend on those providers and plugins.

A curated first-party Dbweb catalogue is not currently configured because no public catalogue manifest/API has been supplied. The website shortcut links to the Dbweb website and is not an automatic in-app catalogue.

## Build

The GitHub Actions workflow **Build Dbweb Android APK** builds the stable debug APK, verifies its signature, calculates a SHA-256 checksum, and uploads it as the **Dbweb-Android-stable-debug** artifact.

To build locally, use JDK 21 and Android SDK API 37 with Build Tools 37.0.0:

    cd android
    chmod +x ./gradlew
    ./gradlew --no-daemon :app:assembleStableDebug

Output:

    app/build/outputs/apk/stable/debug/app-stable-debug.apk

The generated artifact is a debug build, not a production Play Store release. Test it on your target device before distribution.

## Licensing

Applicable upstream notices and GPL-3.0 licensing are retained. See LICENSE and the licence notices in the source. Third-party plugins and repositories may have separate licences and terms.

## Website

https://webdd.freeddns.org
