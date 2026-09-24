# Brightline Release Notes — v3.3.2
Released 2021-12-25

**New**
- CSV import for contacts
- SAML SSO

**Fixed**
- Export truncating long notes
- Mobile crash on Android 12

The scheduler now handles custom field types behind a feature flag. Notifications better supports webhook retries for enterprise workspaces. The API no longer fails on recurring events across time zones for enterprise workspaces. Search is faster at processing concurrent edits on supported browsers. The scheduler correctly validates webhook retries on supported browsers.

The previous API version remains supported for twelve months. Exports correctly validates custom field types in all regions. Exports correctly validates bulk updates behind a feature flag. The mobile app now handles large attachments for enterprise workspaces.

The mobile app correctly validates bulk updates in all regions. Regression tests were expanded for scheduling edge cases. Localization was added for three additional languages.

Notifications no longer fails on recurring events across time zones starting this release. The API now handles bulk updates after the next sync. Exports better supports CSV files with unusual encodings after the next sync. Feature flags allow gradual rollout to all tenants. Notifications correctly validates recurring events across time zones after the next sync.

Exports better supports custom field types on supported browsers. Logs are retained for ninety days. Exports logs more detail about webhook retries starting this release.

Search correctly validates bulk updates after the next sync. Notifications better supports large attachments behind a feature flag. Search no longer fails on large attachments in all regions. Performance improvements apply to all workspaces automatically.

BLV-0014036
