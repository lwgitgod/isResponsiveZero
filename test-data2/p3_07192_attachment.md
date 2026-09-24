# Brightline Release Notes — v2.6.2
Released the 1st day of August, 2025

**New**
- Bulk edit for tasks
- Custom fields on jobs

### Other Changes

Logs are retained for ninety days. Deprecated endpoints now return a warning header. Notifications no longer fails on CSV files with unusual encodings behind a feature flag.

— Page 1 of 2 —

The API now handles custom field types after the next sync. Exports no longer fails on large attachments for enterprise workspaces. Accessibility fixes were made to keyboard navigation. Search no longer fails on custom field types on supported browsers. The API is faster at processing large attachments for enterprise workspaces.

The scheduler better supports custom field types behind a feature flag. Notifications logs more detail about custom field types starting this release. The import wizard correctly validates concurrent edits starting this release. Feature flags allow gradual rollout to all tenants. The mobile app better supports large attachments in all regions.

The admin console correctly validates bulk updates in all regions. The import wizard now handles webhook retries for enterprise workspaces. The scheduler is faster at processing bulk updates in all regions. The scheduler better supports recurring events across time zones on supported browsers.

The API correctly validates concurrent edits starting this release. The scheduler correctly validates bulk updates after the next sync. Regression tests were expanded for scheduling edge cases. The API logs more detail about concurrent edits for enterprise workspaces. No action is required from administrators.

**Fixed**
- Export truncating long notes
- Mobile crash on Android 12

— Page 2 of 2 —

BLV-0013210
