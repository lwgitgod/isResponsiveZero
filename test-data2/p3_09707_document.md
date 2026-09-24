## Brightline Release Notes — v2.16.4
Released June 4, 2025

**New**
- Dark mode
- Calendar sync with Outlook

### Notes

Accessibility fixes were made to keyboard navigation. The API now handles recurring events across time zones on supported browsers. The API logs more detail about CSV files with unusual encodings for enterprise workspaces.

Notifications logs more detail about custom field types starting this release. Performance improvements apply to all workspaces automatically. The admin console correctly validates archived projects for enterprise workspaces. Exports logs more detail about large attachments behind a feature flag.

Feature flags allow gradual rollout to all tenants. Known issues are tracked on the status page. Search is faster at processing webhook retries behind a feature flag. Notifications better supports recurring events across time zones on supported browsers.

**Fixed**
- Timezone bug on recurring events
- Duplicate notifications

BLV-0014245
