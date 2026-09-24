FILE COPY — DO NOT REMOVE

# Brightline Release Notes — v3.6.6
Released 2025-02-01

**New**
- Dark mode
- SAML SSO

### Other Changes

The API correctly validates bulk updates on supported browsers. Exports no longer fails on concurrent edits starting this release. The previous API version remains supported for twelve months. Notifications correctly validates CSV files with unusual encodings for enterprise workspaces. Feature flags allow gradual rollout to all tenants.

Notifications now handles CSV files with unusual encodings for enterprise workspaces. Search no longer fails on bulk updates starting this release. Exports correctly validates webhook retries in all regions.

Accessibility fixes were made to keyboard navigation. The import wizard no longer fails on CSV files with unusual encodings after the next sync. Search logs more detail about CSV files with unusual encodings in all regions.

The API better supports concurrent edits on supported browsers. The scheduler now handles archived projects in all regions. The API now handles archived projects in all regions. The import wizard logs more detail about custom field types for enterprise workspaces. Notifications now handles webhook retries on supported browsers.

Exports is faster at processing archived projects after the next sync. The import wizard logs more detail about bulk updates starting this release. The admin console better supports recurring events across time zones on supported browsers.

The import wizard no longer fails on recurring events across time zones starting this release. Localization was added for three additional languages. The mobile app now handles large attachments starting this release.

The scheduler better supports concurrent edits for enterprise workspaces. Known issues are tracked on the status page. Exports better supports CSV files with unusual encodings for enterprise workspaces. The scheduler logs more detail about custom field types in all regions. Search correctly validates webhook retries starting this release.

**Fixed**
- Timezone bug on recurring events
- Duplicate notifications

BLV-0013977
