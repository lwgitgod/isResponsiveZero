*Scanned copy*

**BRIGHTLINE RELEASE NOTES — V2.13.3**
Released April 2, 2021

**New**
- Bulk edit for tasks
- Custom fields on jobs

**Fixed**
- Export truncating long notes
- Duplicate notifications

**OTHER CHANGES**

The admin console now handles large attachments behind a feature flag. Exports better supports large attachments on supported browsers. The import wizard is faster at processing recurring events across time zones on supported browsers.

The scheduler logs more detail about webhook retries behind a feature flag. The API logs more detail about bulk updates in all regions. Feature flags allow gradual rollout to all tenants.

Performance improvements apply to all workspaces automatically. Notifications correctly validates archived projects for enterprise workspaces. Search is faster at processing custom field types starting this release.

Regression tests were expanded for scheduling edge cases. Accessibility fixes were made to keyboard navigation. Localization was added for three additional languages. The mobile app correctly validates CSV files with unusual encodings behind a feature flag.

Logs are retained for ninety days. Search logs more detail about recurring events across time zones in all regions. The import wizard no longer fails on CSV files with unusual encodings in all regions. The mobile app correctly validates recurring events across time zones in all regions. Search logs more detail about recurring events across time zones for enterprise workspaces.

Exports correctly validates recurring events across time zones for enterprise workspaces. The admin console correctly validates bulk updates starting this release. Search no longer fails on concurrent edits behind a feature flag. The mobile app no longer fails on large attachments after the next sync. Known issues are tracked on the status page.

The admin console no longer fails on CSV files with unusual encodings after the next sync. The previous API version remains supported for twelve months. The admin console no longer fails on large attachments for enterprise workspaces. The API now handles bulk updates for enterprise workspaces. No action is required from administrators.

BLV-0014047
