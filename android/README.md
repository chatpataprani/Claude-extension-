# Dbweb for Android

Dbweb is an Android media-player application built on the CloudStream-compatible extension runtime.

## What is included

- Dbweb app name and application ID.
- Dbweb launcher artwork and a clean dark launcher background.
- Phone and Android TV layouts.
- Built-in media playback, downloads, subtitles, watch tracking, and extension support inherited from the upstream-compatible runtime.
- A Dbweb website shortcut in Settings.
- A Dbweb website action in the Extensions empty state.
- Existing installed-extension management and update mechanisms.

## Extensions

The application keeps the compatible extension engine. The Extensions screen can manage repositories and installed extensions already configured on the device. The empty state links to the official Dbweb website.

A native, curated Dbweb catalogue is not enabled yet because a public catalogue manifest/API has not been configured. The website shortcut must not be mistaken for automatic in-app catalogue installation. Do not install repositories or extensions you do not trust.

## Build

Use the GitHub Actions workflow **Build Dbweb Android APK**. It builds the stable debug variant and uploads the verified APK as a workflow artifact.

## Upstream and licensing

This project is a rebranded fork. The upstream CloudStream-compatible source, notices, and GPL-3.0 licence are retained. See [LICENSE](LICENSE) and the upstream project at https://github.com/recloudstream/cloudstream for the original project and its history.

## Project website

https://webdd.freeddns.org
