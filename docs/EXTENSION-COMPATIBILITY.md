# CloudStream extension compatibility

## What this project can do today

The web client understands the official CloudStream repository manifest and plugin-list schema. It can download a published `.cs3` package from an approved GitHub host, verify the repository's SHA-256 hash, inspect its ZIP-level `manifest.json`, and store the package in browser IndexedDB.

## Why this is not yet the same as the Android app

The official Android loader opens a `.cs3` package with Android's `PathClassLoader`, reads `manifest.json`, instantiates the declared Kotlin plugin class, and calls its lifecycle hooks. A browser cannot load Android DEX bytecode or provide Android framework classes such as `Context`, `Resources`, and Android networking APIs.

A JVM server alone is not automatically compatible: Android-specific APIs, DEX bytecode, plugin lifecycle, resources, and network/security boundaries all need to be handled. Running arbitrary third-party extension code directly in a shared web process would also be unsafe.

## Runtime roadmap

1. Keep repository and package handling compatible with the official schema.
2. Build an isolated Android-compatible execution worker (not in the Next.js request process).
3. Implement the CloudStream plugin API surface and Android API shims required by real extensions.
4. Expose only a narrow, typed provider interface to the web client.
5. Test against a compatibility matrix of real public extensions before claiming support.

Until that worker exists, installed packages are stored and inspected but **not executed**. The web app must never label a package as active or working when only downloaded.
