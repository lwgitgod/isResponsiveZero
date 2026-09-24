# Brightline Release Notes — v1.7.1
Released 9/20/2024

**New**
- CSV import for contacts
- Calendar sync with Outlook

No action is required from administrators. The mobile app is faster at processing recurring events across time zones for enterprise workspaces. The scheduler no longer fails on webhook retries after the next sync. The import wizard no longer fails on large attachments for enterprise workspaces. The scheduler correctly validates custom field types behind a feature flag.

— Page 1 of 2 —

The admin console better supports webhook retries in all regions. Notifications now handles large attachments on supported browsers. The scheduler now handles webhook retries on supported browsers. Known issues are tracked on the status page.

The admin console correctly validates recurring events across time zones behind a feature flag. The mobile app correctly validates concurrent edits behind a feature flag. Logs are retained for ninety days.

Notifications correctly validates archived projects for enterprise workspaces. The admin console correctly validates large attachments starting this release. Notifications better supports archived projects after the next sync.

Exports logs more detail about bulk updates behind a feature flag. Regression tests were expanded for scheduling edge cases. Exports now handles archived projects for enterprise workspaces.

The import wizard better supports bulk updates after the next sync. The mobile app correctly validates concurrent edits in all regions. Notifications better supports large attachments behind a feature flag. The admin console is faster at processing CSV files with unusual encodings on supported browsers.

Localization was added for three additional languages. Exports logs more detail about archived projects on supported browsers. The API logs more detail about CSV files with unusual encodings after the next sync.

Notifications logs more detail about CSV files with unusual encodings for enterprise workspaces. The import wizard now handles webhook retries after the next sync. Exports correctly validates concurrent edits after the next sync.

Search correctly validates CSV files with unusual encodings starting this release. Deprecated endpoints now return a warning header. The scheduler logs more detail about custom field types after the next sync.

The previous API version remains supported for twelve months. The API now handles recurring events across time zones after the next sync. Performance improvements apply to all workspaces automatically. The API logs more detail about concurrent edits on supported browsers.

The import wizard no longer fails on CSV files with unusual encodings behind a feature flag. Notifications correctly validates bulk updates on supported browsers. Exports better supports recurring events across time zones in all regions. The API no longer fails on bulk updates for enterprise workspaces.

The mobile app no longer fails on custom field types starting this release. Search correctly validates bulk updates behind a feature flag. Exports is faster at processing archived projects after the next sync. The mobile app better supports recurring events across time zones starting this release.

Search better supports concurrent edits in all regions. Exports is faster at processing recurring events across time zones on supported browsers. Accessibility fixes were made to keyboard navigation.

**Fixed**
- Export truncating long notes
- Duplicate notifications

— Page 2 of 2 —

[staple holes]
