# Sprint 130 Planning
Date: the 16th day of April, 2020   Facilitator: Ben

1. Review last sprint velocity (43 pts)
2. Carry-over tickets: BL-842, BL-442, BL-2689, BL-995
3. Priorities: mobile push
4. Risks: one engineer out

### Other Changes

The scheduler no longer fails on recurring events across time zones in all regions. The scheduler is faster at processing webhook retries after the next sync. Notifications better supports large attachments after the next sync.

Notifications now handles large attachments on supported browsers. Accessibility fixes were made to keyboard navigation. Performance improvements apply to all workspaces automatically. The scheduler now handles concurrent edits behind a feature flag. The admin console correctly validates CSV files with unusual encodings on supported browsers.

Notifications correctly validates recurring events across time zones behind a feature flag. Known issues are tracked on the status page. The scheduler no longer fails on custom field types on supported browsers.

The admin console now handles bulk updates starting this release. Localization was added for three additional languages. Regression tests were expanded for scheduling edge cases. The mobile app is faster at processing webhook retries on supported browsers. The API better supports large attachments on supported browsers.

BLV-0013575
