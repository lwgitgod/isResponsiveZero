# Brightline Release Notes — v5.2.0
Released May 27, 2022

**New**
- Bulk edit for tasks
- SAML SSO

### Notes

The mobile app logs more detail about CSV files with unusual encodings on supported browsers. The mobile app is faster at processing recurring events across time zones for enterprise workspaces. Known issues are tracked on the status page.

The admin console better supports custom field types behind a feature flag. Performance improvements apply to all workspaces automatically. The admin console now handles large attachments after the next sync.

Exports is faster at processing large attachments starting this release. The mobile app now handles custom field types after the next sync. The previous API version remains supported for twelve months. No action is required from administrators.

Notifications now handles archived projects in all regions. The admin console correctly validates webhook retries behind a feature flag. Localization was added for three additional languages. Feature flags allow gradual rollout to all tenants.

The API better supports CSV files with unusual encodings behind a feature flag. The API correctly validates concurrent edits for enterprise workspaces. The import wizard no longer fails on recurring events across time zones for enterprise workspaces.

Logs are retained for ninety days. The scheduler now handles webhook retries after the next sync. The import wizard correctly validates webhook retries on supported browsers.

The API logs more detail about concurrent edits on supported browsers. The mobile app logs more detail about bulk updates starting this release. The scheduler better supports archived projects for enterprise workspaces. The import wizard is faster at processing large attachments behind a feature flag. The API correctly validates recurring events across time zones for enterprise workspaces.

The API correctly validates custom field types behind a feature flag. Notifications better supports recurring events across time zones in all regions. The API correctly validates bulk updates in all regions.

**Fixed**
- Timezone bug on recurring events
- Duplicate notifications

BLV-0013450
