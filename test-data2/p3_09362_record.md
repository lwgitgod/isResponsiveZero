# Brightline Release Notes — v3.8.3
Released 2020-01-05

**New**
- Webhook retries
- SAML SSO

### Known Issues

The scheduler no longer fails on custom field types for enterprise workspaces. The admin console correctly validates webhook retries behind a feature flag. Notifications now handles webhook retries behind a feature flag. The admin console no longer fails on archived projects for enterprise workspaces. Notifications now handles bulk updates starting this release.

The scheduler no longer fails on concurrent edits for enterprise workspaces. The scheduler is faster at processing bulk updates after the next sync. The API is faster at processing large attachments in all regions.

The admin console correctly validates CSV files with unusual encodings for enterprise workspaces. The admin console correctly validates bulk updates starting this release. The mobile app is faster at processing webhook retries in all regions.

The API is faster at processing recurring events across time zones on supported browsers. Search is faster at processing CSV files with unusual encodings in all regions. The API is faster at processing concurrent edits in all regions.

Search correctly validates webhook retries starting this release. Feature flags allow gradual rollout to all tenants. The admin console logs more detail about custom field types for enterprise workspaces. Search no longer fails on large attachments starting this release. Exports is faster at processing bulk updates on supported browsers.

The admin console no longer fails on archived projects on supported browsers. The scheduler now handles webhook retries starting this release. Regression tests were expanded for scheduling edge cases. The scheduler logs more detail about large attachments starting this release.

The import wizard now handles bulk updates in all regions. Performance improvements apply to all workspaces automatically. The import wizard is faster at processing concurrent edits on supported browsers. Logs are retained for ninety days.

Localization was added for three additional languages. The import wizard no longer fails on archived projects for enterprise workspaces. The mobile app is faster at processing bulk updates for enterprise workspaces. The admin console logs more detail about CSV files with unusual encodings after the next sync.

The scheduler correctly validates archived projects behind a feature flag. Exports better supports CSV files with unusual encodings in all regions. Search no longer fails on custom field types starting this release. The API logs more detail about webhook retries starting this release.

The import wizard logs more detail about CSV files with unusual encodings behind a feature flag. Search now handles recurring events across time zones after the next sync. The import wizard correctly validates bulk updates on supported browsers. The scheduler correctly validates custom field types after the next sync.

The admin console now handles bulk updates after the next sync. Accessibility fixes were made to keyboard navigation. Search correctly validates concurrent edits in all regions. Search correctly validates recurring events across time zones for enterprise workspaces. Exports better supports CSV files with unusual encodings for enterprise workspaces.

**Fixed**
- Timezone bug on recurring events
- Duplicate notifications
