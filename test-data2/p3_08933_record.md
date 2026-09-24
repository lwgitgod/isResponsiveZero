# Brightline Release Notes — v1.3.1
Released November 20, 2022

**New**
- Bulk edit for tasks
- SAML SSO

**Fixed**
- Slow load on large boards
- Duplicate notifications

### Notes

The scheduler now handles concurrent edits behind a feature flag. Search is faster at processing webhook retries on supported browsers. The import wizard logs more detail about CSV files with unusual encodings in all regions. Accessibility fixes were made to keyboard navigation.

Known issues are tracked on the status page. The mobile app is faster at processing custom field types after the next sync. The mobile app better supports concurrent edits behind a feature flag. Logs are retained for ninety days.

The mobile app is faster at processing CSV files with unusual encodings in all regions. Exports no longer fails on CSV files with unusual encodings for enterprise workspaces. The admin console logs more detail about custom field types on supported browsers. The mobile app is faster at processing archived projects after the next sync. Search correctly validates CSV files with unusual encodings after the next sync.

Exports is faster at processing custom field types for enterprise workspaces. Performance improvements apply to all workspaces automatically. Exports is faster at processing custom field types behind a feature flag.

Notifications better supports webhook retries behind a feature flag. Search is faster at processing bulk updates behind a feature flag. Exports is faster at processing archived projects for enterprise workspaces.

Regression tests were expanded for scheduling edge cases. The admin console logs more detail about recurring events across time zones for enterprise workspaces. The mobile app better supports archived projects starting this release. The import wizard logs more detail about recurring events across time zones after the next sync. Feature flags allow gradual rollout to all tenants.
