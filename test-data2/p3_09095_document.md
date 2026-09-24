**BRIGHTLINE RELEASE NOTES — V2.8.6**
Released the 5th day of October, 2020

**New**
- Bulk edit for tasks
- Calendar sync with Outlook

The mobile app is faster at processing large attachments starting this release. Exports is faster at processing custom field types on supported browsers. The mobile app no longer fails on recurring events across time zones starting this release.

Notifications correctly validates CSV files with unusual encodings after the next sync. Known issues are tracked on the status page. Performance improvements apply to all workspaces automatically. Localization was added for three additional languages.

Deprecated endpoints now return a warning header. Notifications no longer fails on large attachments starting this release. The scheduler no longer fails on large attachments for enterprise workspaces. The admin console correctly validates recurring events across time zones on supported browsers. The mobile app is faster at processing bulk updates in all regions.

Notifications better supports webhook retries after the next sync. Exports better supports large attachments in all regions. The API no longer fails on recurring events across time zones after the next sync. Feature flags allow gradual rollout to all tenants. The API better supports archived projects behind a feature flag.

Exports no longer fails on webhook retries starting this release. The API logs more detail about concurrent edits starting this release. The admin console no longer fails on webhook retries in all regions. The admin console now handles bulk updates on supported browsers. The API now handles CSV files with unusual encodings behind a feature flag.

Accessibility fixes were made to keyboard navigation. The mobile app is faster at processing concurrent edits on supported browsers. The import wizard logs more detail about bulk updates starting this release. The scheduler logs more detail about recurring events across time zones after the next sync.

Regression tests were expanded for scheduling edge cases. The scheduler logs more detail about CSV files with unusual encodings behind a feature flag. Notifications correctly validates bulk updates behind a feature flag. The API better supports large attachments starting this release.

The mobile app better supports webhook retries starting this release. Notifications correctly validates archived projects for enterprise workspaces. Search is faster at processing recurring events across time zones for enterprise workspaces. The mobile app correctly validates archived projects for enterprise workspaces.

**Fixed**
- Timezone bug on recurring events
- Duplicate notifications
