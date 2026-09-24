## Brightline Release Notes — v3.9.0
Released August 5, 2020

**New**
- CSV import for contacts
- Custom fields on jobs

### Notes

Exports now handles webhook retries starting this release. The import wizard logs more detail about bulk updates on supported browsers. The mobile app is faster at processing recurring events across time zones on supported browsers. The previous API version remains supported for twelve months. Notifications now handles large attachments in all regions.

The scheduler better supports large attachments on supported browsers. Exports no longer fails on custom field types for enterprise workspaces. Notifications better supports recurring events across time zones behind a feature flag.

The admin console correctly validates large attachments for enterprise workspaces. The mobile app now handles archived projects for enterprise workspaces. Search correctly validates large attachments in all regions. Accessibility fixes were made to keyboard navigation.

Search now handles recurring events across time zones for enterprise workspaces. Exports logs more detail about bulk updates on supported browsers. The API correctly validates bulk updates for enterprise workspaces. The mobile app logs more detail about webhook retries on supported browsers.

**Fixed**
- Export truncating long notes
- Duplicate notifications
