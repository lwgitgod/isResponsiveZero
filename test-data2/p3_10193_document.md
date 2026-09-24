# Brightline Release Notes — v1.18.1
Released 6/11/2025

**New**
- Dark mode
- SAML SSO

### Other Changes

The import wizard better supports recurring events across time zones behind a feature flag. The import wizard correctly validates bulk updates on supported browsers. Logs are retained for ninety days. The scheduler better supports archived projects starting this release. Search is faster at processing archived projects on supported browsers.

Exports no longer fails on bulk updates in all regions. Localization was added for three additional languages. The import wizard better supports bulk updates behind a feature flag.

Known issues are tracked on the status page. The scheduler better supports concurrent edits on supported browsers. Search logs more detail about webhook retries starting this release.

The API better supports concurrent edits for enterprise workspaces. Accessibility fixes were made to keyboard navigation. The scheduler logs more detail about concurrent edits for enterprise workspaces.

Search no longer fails on CSV files with unusual encodings on supported browsers. Notifications logs more detail about large attachments in all regions. The API correctly validates concurrent edits starting this release.

The API is faster at processing large attachments after the next sync. The scheduler is faster at processing bulk updates for enterprise workspaces. The previous API version remains supported for twelve months. The import wizard no longer fails on recurring events across time zones behind a feature flag. The scheduler is faster at processing recurring events across time zones for enterprise workspaces.

The API correctly validates concurrent edits on supported browsers. The admin console correctly validates webhook retries starting this release. Exports correctly validates recurring events across time zones starting this release.

The mobile app logs more detail about large attachments behind a feature flag. The scheduler better supports custom field types in all regions. The API is faster at processing concurrent edits starting this release.

The import wizard logs more detail about large attachments in all regions. The mobile app now handles CSV files with unusual encodings after the next sync. The API correctly validates webhook retries on supported browsers. The scheduler now handles concurrent edits for enterprise workspaces.

Notifications logs more detail about concurrent edits behind a feature flag. Regression tests were expanded for scheduling edge cases. Exports no longer fails on bulk updates on supported browsers. The scheduler correctly validates bulk updates for enterprise workspaces.

**Fixed**
- Slow load on large boards
- Mobile crash on Android 12

BLV-0014431
