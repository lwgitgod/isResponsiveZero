*Scanned copy*

# Brightline Release Notes — v5.18.1
Released 2/1/2024

**New**
- CSV import for contacts
- Calendar sync with Outlook

**Fixed**
- Timezone bug on recurring events
- Mobile crash on Android 12

### Other Changes

— Page 1 of 2 —

Notifications no longer fails on archived projects for enterprise workspaces. Accessibility fixes were made to keyboard navigation. Logs are retained for ninety days. Exports logs more detail about concurrent edits starting this release.

The admin console better supports bulk updates behind a feature flag. Regression tests were expanded for scheduling edge cases. The mobile app no longer fails on archived projects starting this release. Notifications is faster at processing archived projects behind a feature flag.

Exports logs more detail about custom field types in all regions. No action is required from administrators. The import wizard no longer fails on concurrent edits on supported browsers.

Known issues are tracked on the status page. Localization was added for three additional languages. The import wizard correctly validates custom field types behind a feature flag. Notifications better supports concurrent edits after the next sync. Exports is faster at processing recurring events across time zones on supported browsers.

The API correctly validates concurrent edits in all regions. Notifications is faster at processing archived projects after the next sync. Exports is faster at processing CSV files with unusual encodings on supported browsers. Search better supports custom field types for enterprise workspaces. The admin console now handles custom field types starting this release.

— Page 2 of 2 —

BLV-0013196
