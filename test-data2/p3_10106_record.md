# Brightline Release Notes — v4.8.8
Released March 17, 2025

**New**
- Bulk edit for tasks
- Calendar sync with Outlook

**Fixed**
- Timezone bug on recurring events
- Duplicate notifications

### Known Issues

Exports is faster at processing concurrent edits starting this release. The import wizard correctly validates large attachments for enterprise workspaces. Feature flags allow gradual rollout to all tenants. Notifications no longer fails on bulk updates starting this release. Search logs more detail about bulk updates for enterprise workspaces.

The import wizard no longer fails on bulk updates for enterprise workspaces. Accessibility fixes were made to keyboard navigation. The import wizard correctly validates archived projects starting this release.

Notifications better supports webhook retries behind a feature flag. Exports no longer fails on concurrent edits for enterprise workspaces. Deprecated endpoints now return a warning header.

Exports is faster at processing large attachments starting this release. Exports now handles concurrent edits in all regions. The import wizard now handles CSV files with unusual encodings after the next sync.

Exports better supports webhook retries behind a feature flag. Exports logs more detail about concurrent edits after the next sync. The previous API version remains supported for twelve months. The API correctly validates recurring events across time zones in all regions.

Search no longer fails on archived projects starting this release. Notifications now handles custom field types on supported browsers. The import wizard is faster at processing archived projects behind a feature flag. Notifications better supports webhook retries for enterprise workspaces. The mobile app no longer fails on archived projects on supported browsers.

The API correctly validates webhook retries after the next sync. Exports now handles recurring events across time zones in all regions. Exports logs more detail about webhook retries in all regions. The admin console logs more detail about recurring events across time zones for enterprise workspaces.

The API logs more detail about large attachments behind a feature flag. The mobile app is faster at processing webhook retries starting this release. The mobile app now handles archived projects in all regions. Search is faster at processing webhook retries behind a feature flag. The admin console is faster at processing archived projects on supported browsers.

Search is faster at processing archived projects in all regions. Notifications logs more detail about concurrent edits behind a feature flag. Exports no longer fails on archived projects on supported browsers. Search no longer fails on bulk updates on supported browsers. The mobile app is faster at processing recurring events across time zones behind a feature flag.

Search correctly validates CSV files with unusual encodings behind a feature flag. The scheduler no longer fails on archived projects in all regions. Exports now handles concurrent edits starting this release.

Exports no longer fails on archived projects for enterprise workspaces. Notifications no longer fails on custom field types starting this release. The API is faster at processing concurrent edits on supported browsers. Performance improvements apply to all workspaces automatically.

BLV-0014396
