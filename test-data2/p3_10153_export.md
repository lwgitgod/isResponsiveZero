# Brightline Release Notes — v5.7.8
Released February 10, 2024

**New**
- Dark mode
- Calendar sync with Outlook

### Known Issues

Performance improvements apply to all workspaces automatically. Feature flags allow gradual rollout to all tenants. Localization was added for three additional languages. The import wizard no longer fails on webhook retries on supported browsers.

Notifications is faster at processing large attachments after the next sync. The scheduler now handles archived projects after the next sync. The API logs more detail about large attachments in all regions. Known issues are tracked on the status page. The import wizard correctly validates large attachments in all regions.

The scheduler now handles recurring events across time zones after the next sync. Search correctly validates webhook retries on supported browsers. The mobile app now handles webhook retries in all regions. Search logs more detail about CSV files with unusual encodings in all regions. The admin console better supports bulk updates for enterprise workspaces.

The scheduler logs more detail about CSV files with unusual encodings behind a feature flag. The admin console better supports archived projects behind a feature flag. Notifications better supports archived projects after the next sync. The previous API version remains supported for twelve months. The API no longer fails on large attachments on supported browsers.

The scheduler better supports CSV files with unusual encodings starting this release. The scheduler is faster at processing concurrent edits for enterprise workspaces. Regression tests were expanded for scheduling edge cases. The scheduler logs more detail about webhook retries after the next sync. The mobile app correctly validates concurrent edits on supported browsers.

The API now handles webhook retries in all regions. The scheduler logs more detail about custom field types after the next sync. Exports logs more detail about archived projects on supported browsers. The scheduler is faster at processing recurring events across time zones after the next sync.

Logs are retained for ninety days. The admin console logs more detail about CSV files with unusual encodings on supported browsers. The mobile app logs more detail about recurring events across time zones in all regions.

The import wizard correctly validates webhook retries in all regions. The admin console correctly validates recurring events across time zones after the next sync. Exports better supports large attachments in all regions. Notifications correctly validates large attachments for enterprise workspaces.

The API no longer fails on CSV files with unusual encodings after the next sync. The admin console no longer fails on concurrent edits in all regions. The scheduler no longer fails on recurring events across time zones in all regions. Search now handles webhook retries behind a feature flag.

Search no longer fails on archived projects behind a feature flag. The scheduler is faster at processing large attachments behind a feature flag. Notifications better supports large attachments on supported browsers.

The import wizard no longer fails on large attachments in all regions. Deprecated endpoints now return a warning header. Search better supports webhook retries starting this release.

**Fixed**
- Slow load on large boards
- Duplicate notifications
