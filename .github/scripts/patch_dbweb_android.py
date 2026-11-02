from pathlib import Path

root = Path('android')
layout = root / 'app/src/main/res/layout/main_settings.xml'
xml = layout.read_text()
marker = '                android:id="@+id/app_version_info"'
if 'android:id="@+id/dbweb_website"' not in xml:
    insert = '''            <TextView
                android:id="@+id/dbweb_website"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="center"
                android:padding="10dp"
                android:text="Dbweb Website"
                android:textColor="?attr/colorAccent"
                android:clickable="true"
                android:focusable="true" />

'''
    if marker not in xml: raise SystemExit('Settings footer insertion point not found')
    pos = xml.rfind('            <LinearLayout', 0, xml.index(marker))
    if pos < 0: raise SystemExit('Settings footer container not found')
    layout.write_text(xml[:pos] + insert + xml[pos:])

settings = root / 'app/src/main/java/com/lagradost/cloudstream3/ui/settings/SettingsFragment.kt'
code = settings.read_text()
anchor = '        binding.appVersion.text = appVersion'
if 'binding.dbwebWebsite.setOnClickListener' not in code:
    wiring = '''        binding.dbwebWebsite.setOnClickListener {
            runCatching {
                startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("https://webdd.freeddns.org")))
            }
        }

'''
    if anchor not in code: raise SystemExit('Settings binding insertion point not found')
    settings.write_text(code.replace(anchor, wiring + anchor, 1))

fragment = root / 'app/src/main/java/com/lagradost/cloudstream3/ui/settings/extensions/ExtensionsFragment.kt'
code = fragment.read_text().replace('addRepoButton.isGone = isTv\\n            addRepoButtonImageviewHolder.isVisible = isTv', 'addRepoButton.isGone = true\\n            addRepoButtonImageviewHolder.isGone = true')
fragment.write_text(code)

(root / 'DBWEB_IMPLEMENTATION_STATUS.md').write_text('''# Dbweb Android implementation status

Dbweb-branded Android fork using the CloudStream-compatible runtime.

Implemented: application ID and app label are Dbweb; adaptive launcher artwork is wired; the Extensions screen links to Dbweb; the main Settings screen links to Dbweb; manual repository-add buttons are hidden; installed-extension management and compatible runtime are retained; upstream GPL-3.0 licence and notices are retained.

Limitations: the website link opens https://webdd.freeddns.org. No public extension catalogue API or manifest has been supplied, so native catalogue browsing, installation, and updates are not implemented. Required upstream identifiers and licence notices remain. APK build and runtime/device testing are still required.
''')