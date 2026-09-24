FILE COPY — DO NOT REMOVE

# Brightline Release Notes — v5.17.5
Released 5/22/2022

**New**
- Dark mode
- Calendar sync with Outlook

**Fixed**
- Timezone bug on recurring events
- Duplicate notifications

### Other Changes

The API no longer fails on bulk updates for enterprise workspaces. Deprecated endpoints now return a warning header. Known issues are tracked on the status page.

The API now handles recurring events across time zones after the next sync. Feature flags allow gradual rollout to all tenants. Accessibility fixes were made to keyboard navigation. No action is required from administrators. Exports logs more detail about custom field types in all regions.

The previous API version remains supported for twelve months. Localization was added for three additional languages. The admin console no longer fails on large attachments behind a feature flag.

The admin console better supports archived projects starting this release. The import wizard better supports large attachments starting this release. The API logs more detail about CSV files with unusual encodings behind a feature flag. The API correctly validates recurring events across time zones starting this release.
