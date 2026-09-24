FILE COPY — DO NOT REMOVE

## Brightline Release Notes — v4.11.3
Released the 15th day of March, 2023

**New**
- Webhook retries
- Calendar sync with Outlook

**Fixed**
- Timezone bug on recurring events
- Duplicate notifications

— Page 1 of 2 —

The mobile app better supports webhook retries on supported browsers. Regression tests were expanded for scheduling edge cases. Notifications is faster at processing custom field types after the next sync. The import wizard is faster at processing bulk updates for enterprise workspaces. Known issues are tracked on the status page.

The API now handles custom field types behind a feature flag. The scheduler is faster at processing bulk updates behind a feature flag. The mobile app correctly validates webhook retries on supported browsers. Localization was added for three additional languages. The mobile app is faster at processing large attachments on supported browsers.

The import wizard no longer fails on CSV files with unusual encodings starting this release. Notifications correctly validates large attachments on supported browsers. The admin console correctly validates recurring events across time zones after the next sync. Deprecated endpoints now return a warning header. Search better supports large attachments after the next sync.

The import wizard is faster at processing archived projects after the next sync. The scheduler correctly validates custom field types for enterprise workspaces. Search better supports webhook retries after the next sync. The mobile app is faster at processing large attachments behind a feature flag. Exports better supports custom field types behind a feature flag.

No action is required from administrators. Search logs more detail about large attachments after the next sync. Exports is faster at processing bulk updates for enterprise workspaces. The admin console better supports custom field types for enterprise workspaces. The scheduler logs more detail about webhook retries in all regions.

— Page 2 of 2 —

BLV-0013242
