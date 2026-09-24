# Brightline Release Notes — v2.6.9
Released 6/28/2024

**New**
- Bulk edit for tasks
- Custom fields on jobs

**Fixed**
- Timezone bug on recurring events
- Duplicate notifications

### Known Issues

Search now handles recurring events across time zones starting this release. The admin console now handles bulk updates in all regions. The admin console no longer fails on large attachments in all regions. The mobile app is faster at processing custom field types starting this release. The import wizard now handles concurrent edits behind a feature flag.

Known issues are tracked on the status page. Search better supports webhook retries after the next sync. Regression tests were expanded for scheduling edge cases.

The API now handles webhook retries starting this release. The import wizard is faster at processing concurrent edits behind a feature flag. The import wizard correctly validates large attachments on supported browsers. Search now handles custom field types starting this release. Notifications no longer fails on webhook retries for enterprise workspaces.

The mobile app now handles webhook retries on supported browsers. The admin console correctly validates webhook retries starting this release. The scheduler now handles large attachments in all regions. The API better supports concurrent edits after the next sync. Deprecated endpoints now return a warning header.

The scheduler better supports custom field types for enterprise workspaces. The admin console better supports recurring events across time zones on supported browsers. The previous API version remains supported for twelve months. Logs are retained for ninety days. Performance improvements apply to all workspaces automatically.

Search now handles concurrent edits on supported browsers. Exports correctly validates large attachments in all regions. Exports now handles concurrent edits after the next sync. The mobile app correctly validates concurrent edits for enterprise workspaces. The mobile app logs more detail about recurring events across time zones behind a feature flag.

The scheduler correctly validates webhook retries for enterprise workspaces. The scheduler is faster at processing bulk updates behind a feature flag. Exports better supports large attachments starting this release. Localization was added for three additional languages.

The import wizard is faster at processing bulk updates on supported browsers. The API is faster at processing custom field types starting this release. The scheduler correctly validates CSV files with unusual encodings on supported browsers. The scheduler correctly validates bulk updates after the next sync.

Notifications logs more detail about custom field types on supported browsers. Notifications correctly validates archived projects on supported browsers. Exports is faster at processing recurring events across time zones behind a feature flag.

No action is required from administrators. The admin console is faster at processing recurring events across time zones on supported browsers. Search correctly validates archived projects for enterprise workspaces. The mobile app now handles concurrent edits after the next sync.

The admin console no longer fails on bulk updates after the next sync. Search better supports concurrent edits starting this release. The scheduler correctly validates archived projects in all regions.

Notifications is faster at processing custom field types starting this release. Exports now handles CSV files with unusual encodings after the next sync. Notifications no longer fails on recurring events across time zones in all regions.

The API logs more detail about custom field types in all regions. Search logs more detail about archived projects on supported browsers. The API correctly validates bulk updates after the next sync. The import wizard no longer fails on custom field types in all regions.

The import wizard no longer fails on concurrent edits behind a feature flag. The scheduler correctly validates archived projects for enterprise workspaces. The import wizard correctly validates recurring events across time zones after the next sync. The admin console better supports webhook retries behind a feature flag.
