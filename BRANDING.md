# Dbweb Android App Branding

## Official identity
- App name: **Dbweb**
- Official website: https://webdd.freeddns.org
- Official logo: the original Dbweb W emblem supplied by the project owner. Use the original artwork; do not redraw, replace, or stylize it into a different logo.

## Required placement in the Android app
1. Use the official W emblem for the launcher icon, adaptive icon foreground, splash screen, and app identity surfaces.
2. Keep the emblem's proportions and make it clearly visible at launcher-icon size. Prepare transparent-background and density-appropriate Android assets from the original logo.
3. Add a clearly labelled **Dbweb Website** link in the app's About screen and Settings. It must open https://webdd.freeddns.org in the user's default browser.
4. Also show the website address in the About screen as a tappable link.
5. Use the official Dbweb name and logo consistently; do not introduce CloudStream branding into ordinary user-facing app UI. Preserve all legally required upstream notices and licences.

## Dbweb Extensions
- Add a first-class **Extensions** section in the app that uses the official Dbweb extension catalogue at https://webdd.freeddns.org.
- Users should be able to browse, search, inspect details, install, update, and uninstall extensions from this section.
- The catalogue should display extension name, icon, description, version, compatibility, and publisher/source details.
- The normal user interface must not ask users to manually add extension repositories or manually import extension files. Dbweb is the recommended and primary extension source.
- Keep the compatible CloudStream extension runtime so supported extensions can work; do not remove the runtime itself.
- Validate extension compatibility and file integrity before installation, and clearly warn users that extensions are third-party code.
- Do not silently install or update extensions. Ask for user confirmation before installation and updates.
- If the catalogue cannot be reached, show a clear offline/retry state rather than implying that extensions are available.

### Required in-app message
Show this message in the Extensions screen when the catalogue is empty, unavailable, or before the user opens the catalogue:

**Get extensions from Dbweb**

Find and install extensions safely through the official Dbweb extension catalogue.

**Visit Dbweb Extensions**

The button must open the official Dbweb extension catalogue on https://webdd.freeddns.org. Do not invent a catalogue route; use the confirmed route once implemented. Until a dedicated catalogue page exists, link to the website homepage.

## Verification before release
- Check the launcher icon on light and dark wallpapers.
- Check the splash screen and About/Settings link on a physical Android device or emulator.
- Check that the Extensions screen directs users to Dbweb and that the website button opens the correct destination.
- Test catalogue browsing, install, update, and uninstall with compatible test extensions.
- Do not claim all extensions work; report compatibility based on actual tests.
- Do not mark branding or extension integration complete until the original logo and catalogue integration are in the app, the APK has been built, and the flows have been checked.
