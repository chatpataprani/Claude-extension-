# Dbweb for Android

Dbweb is a media and streaming application for Android phones, tablets, and Android TV. This repository contains the Android application source and automated build workflow.

## Features

- Dbweb application name, package ID, launcher artwork, and visual branding.
- Media discovery and playback through supported providers.
- Extension and plugin support using compatible repository packages.
- Manual repository addition: open **Extensions**, choose **Add Repository**, and enter a trusted repository URL.
- Browse plugins from added repositories, then install, enable, disable, update, or remove them.
- Manage installed repositories and plugins.
- Search the available plugin list.
- Subtitles, playback controls, watch progress, and download features provided by supported providers and the installed runtime.
- Phone and Android TV layouts.
- Dbweb website shortcuts in Settings and the Extensions screen.

## Installing extensions and plugins

1. Open **Settings → Extensions**.
2. Tap **Add Repository**.
3. Enter the repository URL. Add a display name if requested.
4. After the repository loads, open its plugin list.
5. Select a plugin and follow the install prompt.
6. Manage installed plugins from the Extensions and Plugins screens.

Only add repositories and plugins from sources you trust. Third-party repositories and providers are not operated or verified by Dbweb. Availability, playback quality, subtitles, authentication, and downloads depend on each provider and plugin.

Manual repository controls are intentionally available. The Dbweb website shortcut is an additional link; it does not replace manual repository support. A curated first-party catalogue is not included until a public Dbweb catalogue manifest/API is configured.

## Build the APK

The GitHub Actions workflow **Build Dbweb Android APK** builds the stable debug variant, verifies the generated APK signature, calculates its SHA-256 checksum, and uploads the APK as an artifact.

1. Open the repository's **Actions** tab.
2. Select **Build Dbweb Android APK**.
3. Choose **Run workflow** to start a fresh build, or let a push to the Android source trigger it.
4. Wait for the workflow to finish successfully.
5. Open the completed run and download the **Dbweb-Android-stable-debug** artifact.

The APK is a debug build, not a Play Store-signed production release. A successful build confirms compilation and signature verification; test the app on your target Android device before distributing it.

### Local build requirements

- JDK 21
- Android SDK with API 37 and Build Tools 37.0.0
- Gradle wrapper included in the android directory

From the repository root:

    cd android
    chmod +x ./gradlew
    ./gradlew --no-daemon :app:assembleStableDebug

The APK output is:

    android/app/build/outputs/apk/stable/debug/app-stable-debug.apk

## Project links

- Website: https://webdd.freeddns.org
- Android source: android/
- Build workflow: .github/workflows/dbweb-android.yml

## Licensing and third-party components

This project retains applicable upstream notices and GPL-3.0 licensing for components distributed under that licence. See LICENSE and the licence notices included with the source. Third-party extensions and repositories may have their own licences and terms.
