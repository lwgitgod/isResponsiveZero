# Brightline Release Notes — v2.0.7
Released the 9th day of February, 2023

**New**
- Webhook retries
- Custom fields on jobs

**Fixed**
- Slow load on large boards
- Mobile crash on Android 12

— Page 1 of 2 —

### Notes

Exports correctly validates concurrent edits on supported browsers. Search correctly validates CSV files with unusual encodings in all regions. Accessibility fixes were made to keyboard navigation. Deprecated endpoints now return a warning header. Exports correctly validates custom field types for enterprise workspaces.

Exports no longer fails on recurring events across time zones behind a feature flag. Known issues are tracked on the status page. Search is faster at processing recurring events across time zones starting this release. Regression tests were expanded for scheduling edge cases. Search no longer fails on concurrent edits starting this release.

Exports better supports concurrent edits after the next sync. Notifications correctly validates large attachments behind a feature flag. The API correctly validates CSV files with unusual encodings in all regions.

Search now handles recurring events across time zones starting this release. The admin console logs more detail about concurrent edits in all regions. The import wizard is faster at processing webhook retries in all regions. The API now handles custom field types in all regions.

The API logs more detail about webhook retries in all regions. The mobile app correctly validates archived projects behind a feature flag. Notifications correctly validates recurring events across time zones after the next sync. Localization was added for three additional languages. Search better supports bulk updates on supported browsers.

The scheduler is faster at processing recurring events across time zones on supported browsers. No action is required from administrators. Notifications correctly validates archived projects after the next sync. The scheduler now handles custom field types starting this release.

The scheduler correctly validates bulk updates on supported browsers. The import wizard no longer fails on bulk updates starting this release. The scheduler better supports concurrent edits behind a feature flag. Search correctly validates CSV files with unusual encodings after the next sync. Exports now handles custom field types behind a feature flag.

— Page 2 of 2 —
