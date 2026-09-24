# Brightline Release Notes — v2.19.2
Released January 9, 2020

**New**
- Bulk edit for tasks
- Custom fields on jobs

### Known Issues

Known issues are tracked on the status page. Search correctly validates bulk updates behind a feature flag. Exports correctly validates webhook retries in all regions. The admin console logs more detail about CSV files with unusual encodings starting this release. Accessibility fixes were made to keyboard navigation.

The API better supports bulk updates after the next sync. The scheduler better supports archived projects in all regions. Exports is faster at processing large attachments for enterprise workspaces. The scheduler better supports large attachments starting this release.

The API is faster at processing bulk updates in all regions. The API correctly validates archived projects for enterprise workspaces. The mobile app is faster at processing large attachments on supported browsers. Deprecated endpoints now return a warning header. The scheduler correctly validates recurring events across time zones in all regions.

Notifications is faster at processing large attachments starting this release. Search now handles webhook retries behind a feature flag. The mobile app correctly validates webhook retries in all regions. Regression tests were expanded for scheduling edge cases. The admin console better supports CSV files with unusual encodings after the next sync.

Search no longer fails on CSV files with unusual encodings after the next sync. The import wizard correctly validates large attachments starting this release. The mobile app now handles bulk updates on supported browsers. The API is faster at processing large attachments on supported browsers. The mobile app better supports CSV files with unusual encodings for enterprise workspaces.

Logs are retained for ninety days. The mobile app now handles large attachments behind a feature flag. Performance improvements apply to all workspaces automatically. Notifications is faster at processing webhook retries in all regions. Notifications correctly validates CSV files with unusual encodings in all regions.

**Fixed**
- Slow load on large boards
- Mobile crash on Android 12

BLV-0014265
