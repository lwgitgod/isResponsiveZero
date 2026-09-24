# Brightline Release Notes — v2.5.0
Released July 3, 2025

**New**
- Bulk edit for tasks
- Custom fields on jobs

**Fixed**
- Export truncating long notes
- Duplicate notifications

### Other Changes

The import wizard logs more detail about bulk updates starting this release. Accessibility fixes were made to keyboard navigation. Exports logs more detail about bulk updates starting this release. Exports no longer fails on bulk updates after the next sync.

The admin console no longer fails on webhook retries in all regions. The scheduler no longer fails on archived projects for enterprise workspaces. The API is faster at processing large attachments after the next sync.

Known issues are tracked on the status page. Feature flags allow gradual rollout to all tenants. Exports no longer fails on bulk updates behind a feature flag. The admin console now handles recurring events across time zones after the next sync. The import wizard now handles large attachments starting this release.

The API logs more detail about CSV files with unusual encodings after the next sync. The import wizard correctly validates concurrent edits in all regions. Notifications correctly validates archived projects on supported browsers.

Exports no longer fails on concurrent edits for enterprise workspaces. The API correctly validates bulk updates on supported browsers. Notifications now handles custom field types after the next sync. Exports better supports bulk updates on supported browsers. Search correctly validates archived projects for enterprise workspaces.

The API now handles large attachments behind a feature flag. The API better supports large attachments in all regions. Search now handles recurring events across time zones behind a feature flag.

The import wizard better supports concurrent edits behind a feature flag. Exports is faster at processing webhook retries on supported browsers. The admin console now handles recurring events across time zones in all regions. The admin console correctly validates large attachments behind a feature flag. The admin console better supports custom field types on supported browsers.

BLV-0013272
