## Brightline Release Notes — v3.0.0
Released 9/16/2021

**New**
- Bulk edit for tasks
- SAML SSO

The API now handles custom field types after the next sync. Notifications is faster at processing CSV files with unusual encodings in all regions. Search now handles recurring events across time zones after the next sync. The scheduler correctly validates webhook retries after the next sync.

Search logs more detail about recurring events across time zones after the next sync. Search is faster at processing bulk updates on supported browsers. Notifications correctly validates recurring events across time zones in all regions. The API better supports webhook retries after the next sync.

The scheduler correctly validates bulk updates on supported browsers. Known issues are tracked on the status page. Search better supports CSV files with unusual encodings behind a feature flag.

Regression tests were expanded for scheduling edge cases. The API is faster at processing concurrent edits for enterprise workspaces. The admin console logs more detail about recurring events across time zones behind a feature flag. The scheduler correctly validates custom field types after the next sync. The import wizard better supports concurrent edits behind a feature flag.

The admin console now handles bulk updates starting this release. The previous API version remains supported for twelve months. The import wizard no longer fails on CSV files with unusual encodings behind a feature flag. Search is faster at processing recurring events across time zones behind a feature flag. Search logs more detail about webhook retries starting this release.

Search correctly validates archived projects for enterprise workspaces. The mobile app no longer fails on archived projects starting this release. Search logs more detail about webhook retries on supported browsers.

The API better supports concurrent edits on supported browsers. Exports no longer fails on recurring events across time zones for enterprise workspaces. Deprecated endpoints now return a warning header. The API is faster at processing bulk updates on supported browsers. The scheduler correctly validates webhook retries behind a feature flag.

**Fixed**
- Slow load on large boards
- Duplicate notifications

BLV-0013226
