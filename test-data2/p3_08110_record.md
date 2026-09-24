**BRIGHTLINE RELEASE NOTES — V2.9.6**
Released 2025-08-23

**New**
- CSV import for contacts
- SAML SSO

**NOTES**

The admin console correctly validates archived projects on supported browsers. The mobile app logs more detail about bulk updates in all regions. Deprecated endpoints now return a warning header. The mobile app now handles webhook retries in all regions. Regression tests were expanded for scheduling edge cases.

Search logs more detail about bulk updates starting this release. The API logs more detail about bulk updates in all regions. Notifications correctly validates webhook retries behind a feature flag.

Exports is faster at processing concurrent edits on supported browsers. Performance improvements apply to all workspaces automatically. Notifications better supports concurrent edits starting this release. The mobile app no longer fails on bulk updates on supported browsers. The import wizard no longer fails on archived projects in all regions.

The API correctly validates webhook retries in all regions. The admin console is faster at processing archived projects in all regions. Search no longer fails on bulk updates behind a feature flag. The previous API version remains supported for twelve months.

Localization was added for three additional languages. The API correctly validates large attachments after the next sync. Exports correctly validates CSV files with unusual encodings starting this release. Notifications logs more detail about CSV files with unusual encodings behind a feature flag.

Feature flags allow gradual rollout to all tenants. Search correctly validates concurrent edits for enterprise workspaces. Search correctly validates webhook retries for enterprise workspaces. Notifications no longer fails on concurrent edits on supported browsers. The import wizard now handles CSV files with unusual encodings in all regions.

Exports better supports large attachments behind a feature flag. Exports better supports webhook retries after the next sync. The admin console is faster at processing webhook retries starting this release. The mobile app logs more detail about CSV files with unusual encodings behind a feature flag. Known issues are tracked on the status page.

The admin console correctly validates bulk updates in all regions. Notifications logs more detail about large attachments after the next sync. The API is faster at processing concurrent edits on supported browsers. The scheduler better supports CSV files with unusual encodings in all regions. The admin console logs more detail about bulk updates behind a feature flag.

**Fixed**
- Export truncating long notes
- Mobile crash on Android 12
