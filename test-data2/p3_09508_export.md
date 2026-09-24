# Brightline Release Notes — v2.19.3
Released the 1st day of July, 2022

**New**
- CSV import for contacts
- Custom fields on jobs

### Known Issues

— Page 1 of 2 —

Deprecated endpoints now return a warning header. The scheduler correctly validates webhook retries after the next sync. Exports better supports recurring events across time zones behind a feature flag.

The mobile app correctly validates bulk updates on supported browsers. Logs are retained for ninety days. The mobile app correctly validates recurring events across time zones after the next sync. The API logs more detail about archived projects in all regions. Feature flags allow gradual rollout to all tenants.

The API correctly validates archived projects for enterprise workspaces. Known issues are tracked on the status page. The API correctly validates webhook retries behind a feature flag. The mobile app better supports concurrent edits for enterprise workspaces.

Regression tests were expanded for scheduling edge cases. The scheduler is faster at processing large attachments on supported browsers. The admin console correctly validates custom field types on supported browsers. The admin console better supports archived projects in all regions.

**Fixed**
- Export truncating long notes
- Duplicate notifications

— Page 2 of 2 —

BLV-0014161
