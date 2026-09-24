**BRIGHTLINE RELEASE NOTES — V1.7.0**
Released 7/8/2022

**New**
- Webhook retries
- SAML SSO

The admin console logs more detail about custom field types starting this release. Feature flags allow gradual rollout to all tenants. The scheduler better supports custom field types starting this release. The import wizard is faster at processing large attachments behind a feature flag.

The admin console now handles custom field types for enterprise workspaces. The admin console now handles webhook retries after the next sync. The API is faster at processing CSV files with unusual encodings after the next sync.

No action is required from administrators. The import wizard now handles custom field types on supported browsers. The API no longer fails on concurrent edits for enterprise workspaces. The previous API version remains supported for twelve months.

The mobile app now handles webhook retries starting this release. Notifications now handles recurring events across time zones in all regions. Deprecated endpoints now return a warning header. Regression tests were expanded for scheduling edge cases.

The scheduler no longer fails on webhook retries on supported browsers. The admin console better supports archived projects on supported browsers. Notifications correctly validates CSV files with unusual encodings starting this release. Search is faster at processing bulk updates starting this release.

Search better supports bulk updates behind a feature flag. The scheduler correctly validates custom field types starting this release. The admin console logs more detail about recurring events across time zones after the next sync.

Logs are retained for ninety days. The API better supports concurrent edits for enterprise workspaces. The mobile app logs more detail about recurring events across time zones for enterprise workspaces.

**Fixed**
- Export truncating long notes
- Mobile crash on Android 12
