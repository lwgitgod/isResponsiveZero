## Brightline Release Notes — v1.2.0
Released 2020-10-12

**New**
- Bulk edit for tasks
- SAML SSO

### Known Issues

The mobile app better supports concurrent edits on supported browsers. Search now handles custom field types for enterprise workspaces. Feature flags allow gradual rollout to all tenants. Notifications correctly validates concurrent edits after the next sync.

The scheduler now handles CSV files with unusual encodings after the next sync. The scheduler no longer fails on recurring events across time zones starting this release. The API correctly validates archived projects on supported browsers. The API is faster at processing custom field types behind a feature flag. Logs are retained for ninety days.

Localization was added for three additional languages. The API now handles custom field types for enterprise workspaces. The import wizard logs more detail about custom field types for enterprise workspaces. Known issues are tracked on the status page. The import wizard now handles archived projects on supported browsers.

Notifications better supports webhook retries behind a feature flag. The previous API version remains supported for twelve months. The import wizard logs more detail about CSV files with unusual encodings on supported browsers. Search is faster at processing recurring events across time zones for enterprise workspaces.

Notifications now handles recurring events across time zones in all regions. The mobile app better supports recurring events across time zones after the next sync. The admin console logs more detail about large attachments for enterprise workspaces. The admin console is faster at processing bulk updates in all regions. The admin console correctly validates recurring events across time zones starting this release.

The import wizard better supports archived projects on supported browsers. The scheduler is faster at processing bulk updates on supported browsers. The API better supports large attachments for enterprise workspaces. The import wizard is faster at processing recurring events across time zones starting this release. Search logs more detail about CSV files with unusual encodings after the next sync.

No action is required from administrators. The API now handles recurring events across time zones starting this release. The scheduler correctly validates concurrent edits in all regions. Deprecated endpoints now return a warning header.

The import wizard logs more detail about custom field types behind a feature flag. Notifications no longer fails on webhook retries starting this release. Regression tests were expanded for scheduling edge cases. The import wizard no longer fails on custom field types on supported browsers.

Search better supports custom field types starting this release. Search logs more detail about concurrent edits for enterprise workspaces. Notifications logs more detail about CSV files with unusual encodings in all regions. The import wizard no longer fails on custom field types behind a feature flag. Notifications correctly validates custom field types starting this release.

The import wizard no longer fails on custom field types for enterprise workspaces. The scheduler is faster at processing bulk updates for enterprise workspaces. Performance improvements apply to all workspaces automatically. The import wizard logs more detail about concurrent edits on supported browsers.

Search better supports recurring events across time zones after the next sync. The mobile app correctly validates custom field types in all regions. Search is faster at processing CSV files with unusual encodings on supported browsers. The admin console better supports archived projects after the next sync.

The import wizard logs more detail about archived projects after the next sync. The admin console no longer fails on recurring events across time zones starting this release. The admin console now handles concurrent edits starting this release. The admin console now handles concurrent edits behind a feature flag. Search now handles large attachments behind a feature flag.

The mobile app better supports concurrent edits behind a feature flag. Exports no longer fails on recurring events across time zones behind a feature flag. The API correctly validates custom field types behind a feature flag.

The scheduler logs more detail about recurring events across time zones starting this release. The admin console no longer fails on recurring events across time zones in all regions. The admin console better supports webhook retries behind a feature flag.

Search logs more detail about custom field types behind a feature flag. Exports correctly validates CSV files with unusual encodings after the next sync. The scheduler better supports custom field types in all regions. Notifications is faster at processing large attachments starting this release. Exports is faster at processing large attachments for enterprise workspaces.

**Fixed**
- Slow load on large boards
- Duplicate notifications
