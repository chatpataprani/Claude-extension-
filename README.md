# Dbweb

<div align="center">
<img src="android/app/src/main/res/drawable/dbweb_launcher_foreground.png" width="128" alt="Dbweb logo">

### Your media. Your extensions. Your experience.

[![Android Build](https://img.shields.io/github/actions/workflow/status/chatpataprani/Claude-extension-/dbweb-android.yml?style=for-the-badge&logo=githubactions)](https://github.com/chatpataprani/Claude-extension-/actions/workflows/dbweb-android.yml)
[![Android](https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android)](https://www.android.com/)
[![Kotlin](https://img.shields.io/badge/Language-Kotlin-7F52FF?style=for-the-badge&logo=kotlin)](https://kotlinlang.org/)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge&logo=gnu)](LICENSE)

[Website](https://webdd.freeddns.org) · [Source](android/) · [Builds](https://github.com/chatpataprani/Claude-extension-/actions) · [Issues](https://github.com/chatpataprani/Claude-extension-/issues)
</div>

---

## About
Dbweb is a media application for Android phones, tablets, and Android TV. It combines supported media playback with a flexible extension and plugin system.

## Features
- 📺 Media playback and player controls for supported sources.
- 🧩 Manual extension repository addition.
- 📦 Install, enable, disable, update, and remove plugins.
- 🔎 Search plugins and manage repositories.
- 💬 Subtitles and ⬇️ downloads where supported by providers.
- 📱 Phone, tablet, and Android TV layouts.
- 🌐 Quick links to the official Dbweb website.

## Add extensions and plugins
1. Open **Settings → Extensions**.
2. Select **Add Repository** and enter a trusted repository URL.
3. Open the repository plugin list.
4. Select a plugin and follow the installation prompt.
5. Manage installed plugins from the Extensions or Plugins screens.

> Only add repositories and plugins you trust. Third-party sources are independently maintained and may have their own requirements.

A native first-party Dbweb catalogue is not configured yet because a public catalogue manifest/API has not been provided. Manual repository support remains available.

## Download
Open [GitHub Actions](https://github.com/chatpataprani/Claude-extension-/actions/workflows/dbweb-android.yml), select the latest successful build, and download the **Dbweb-Android-stable-debug** artifact. The current artifact is a debug APK, not a Play Store production-signed release.

## Build from source
Requirements: JDK 21, Android SDK API 37, and Build Tools 37.0.0.

```bash
git clone https://github.com/chatpataprani/Claude-extension-.git
cd Claude-extension-/android
chmod +x ./gradlew
./gradlew --no-daemon :app:assembleStableDebug
```

APK output: `app/build/outputs/apk/stable/debug/app-stable-debug.apk`.

## Project structure
```text
.
├── android/                 # Android application source
│   ├── app/                 # Main application module
│   ├── gradle/              # Gradle wrapper
│   └── README.md            # Android build notes
└── .github/workflows/
    └── dbweb-android.yml
```

## Contributing
Fork the repository, create a branch, test your changes, and open a pull request. Report bugs through [GitHub Issues](https://github.com/chatpataprani/Claude-extension-/issues).

## License
Applicable GPL-3.0 licensing and third-party notices are retained. See [LICENSE](LICENSE) and the notices included with the source. Third-party plugins and repositories may have separate licences.

---
<div align="center">**Dbweb — Made for a better media experience.**</div>
