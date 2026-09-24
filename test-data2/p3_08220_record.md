# Brightline Release Notes — v4.0.0
Released February 22, 2025

**New**
- Webhook retries
- Custom fields on jobs

### Other Changes

Search no longer fails on recurring events across time zones in all regions. Exports correctly validates webhook retries in all regions. Exports now handles concurrent edits after the next sync.

No action is required from administrators. The import wizard is faster at processing custom field types starting this release. Known issues are tracked on the status page. The API better supports archived projects for enterprise workspaces. The mobile app better supports custom field types on supported browsers.

Search logs more detail about archived projects after the next sync. The API no longer fails on large attachments for enterprise workspaces. The API logs more detail about large attachments on supported browsers. The mobile app now handles archived projects after the next sync.

The scheduler correctly validates recurring events across time zones on supported browsers. Search logs more detail about concurrent edits starting this release. The API now handles webhook retries in all regions. Exports no longer fails on bulk updates in all regions. The import wizard is faster at processing recurring events across time zones on supported browsers.

The mobile app better supports large attachments in all regions. The scheduler correctly validates concurrent edits on supported browsers. The scheduler correctly validates concurrent edits after the next sync. The scheduler logs more detail about large attachments in all regions. Feature flags allow gradual rollout to all tenants.

Notifications no longer fails on webhook retries after the next sync. The import wizard logs more detail about recurring events across time zones starting this release. The mobile app logs more detail about recurring events across time zones starting this release. The import wizard is faster at processing custom field types after the next sync. Exports better supports CSV files with unusual encodings in all regions.

Localization was added for three additional languages. Logs are retained for ninety days. The admin console now handles bulk updates for enterprise workspaces. The scheduler no longer fails on recurring events across time zones starting this release. The import wizard logs more detail about CSV files with unusual encodings after the next sync.

The admin console correctly validates archived projects in all regions. The API now handles bulk updates for enterprise workspaces. Notifications correctly validates concurrent edits in all regions. The import wizard better supports webhook retries in all regions. The API now handles concurrent edits in all regions.

Deprecated endpoints now return a warning header. The scheduler correctly validates large attachments for enterprise workspaces. The scheduler better supports archived projects in all regions. Notifications better supports archived projects on supported browsers.

The API logs more detail about recurring events across time zones for enterprise workspaces. Exports no longer fails on webhook retries behind a feature flag. The previous API version remains supported for twelve months. Notifications better supports bulk updates for enterprise workspaces.

The import wizard now handles recurring events across time zones on supported browsers. The API now handles archived projects for enterprise workspaces. Exports no longer fails on webhook retries on supported browsers. Accessibility fixes were made to keyboard navigation.

The API logs more detail about archived projects in all regions. Notifications correctly validates custom field types after the next sync. Performance improvements apply to all workspaces automatically. The API is faster at processing recurring events across time zones behind a feature flag.

**Fixed**
- Export truncating long notes
- Mobile crash on Android 12

BLV-0013620
