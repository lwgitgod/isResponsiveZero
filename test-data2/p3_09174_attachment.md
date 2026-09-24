# Brightline Release Notes — v4.19.8
Released 2023-12-11

**New**
- Bulk edit for tasks
- Custom fields on jobs

### Known Issues

The mobile app now handles custom field types on supported browsers. Exports correctly validates large attachments behind a feature flag. Notifications better supports large attachments behind a feature flag.

No action is required from administrators. The mobile app logs more detail about archived projects behind a feature flag. The admin console logs more detail about bulk updates starting this release. The API is faster at processing archived projects in all regions.

The admin console correctly validates webhook retries on supported browsers. Logs are retained for ninety days. The API now handles large attachments behind a feature flag.

The admin console better supports bulk updates in all regions. The scheduler no longer fails on custom field types on supported browsers. The API now handles recurring events across time zones on supported browsers. The API now handles archived projects in all regions. Search is faster at processing recurring events across time zones on supported browsers.

Known issues are tracked on the status page. The import wizard is faster at processing custom field types starting this release. The import wizard logs more detail about webhook retries after the next sync. Search no longer fails on archived projects for enterprise workspaces.

**Fixed**
- Slow load on large boards
- Mobile crash on Android 12

[stamp: RECEIVED]

BLV-0014017
