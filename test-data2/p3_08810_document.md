CONFIDENTIAL

## Brightline Release Notes — v1.3.4
Released 2025-01-14

**New**
- Webhook retries
- Calendar sync with Outlook

**Fixed**
- Timezone bug on recurring events
- Duplicate notifications

### Known Issues

No action is required from administrators. The admin console no longer fails on concurrent edits for enterprise workspaces. The scheduler better supports bulk updates behind a feature flag.

The API better supports large attachments starting this release. The scheduler better supports bulk updates after the next sync. Notifications better supports large attachments after the next sync. Localization was added for three additional languages.

Accessibility fixes were made to keyboard navigation. The import wizard is faster at processing custom field types starting this release. Feature flags allow gradual rollout to all tenants.

The mobile app better supports webhook retries after the next sync. The import wizard correctly validates recurring events across time zones in all regions. The mobile app logs more detail about custom field types starting this release.

The scheduler logs more detail about large attachments starting this release. Notifications is faster at processing large attachments starting this release. The API no longer fails on webhook retries after the next sync. Search no longer fails on large attachments in all regions.
