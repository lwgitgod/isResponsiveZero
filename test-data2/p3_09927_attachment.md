# Brightline Release Notes — v5.0.4
Released 12/10/2021

**New**
- Bulk edit for tasks
- Calendar sync with Outlook

### Other Changes

Search no longer fails on recurring events across time zones starting this release. The mobile app correctly validates recurring events across time zones starting this release. The import wizard logs more detail about concurrent edits after the next sync. Logs are retained for ninety days.

The admin console logs more detail about custom field types in all regions. The API is faster at processing CSV files with unusual encodings in all regions. Search now handles concurrent edits on supported browsers.

The previous API version remains supported for twelve months. Exports is faster at processing recurring events across time zones after the next sync. The import wizard now handles recurring events across time zones for enterprise workspaces.

The scheduler better supports CSV files with unusual encodings starting this release. The scheduler better supports recurring events across time zones behind a feature flag. Notifications now handles concurrent edits in all regions. Performance improvements apply to all workspaces automatically.

The admin console is faster at processing bulk updates in all regions. Regression tests were expanded for scheduling edge cases. The API logs more detail about webhook retries after the next sync.

**Fixed**
- Timezone bug on recurring events
- Duplicate notifications

BLV-0014342
