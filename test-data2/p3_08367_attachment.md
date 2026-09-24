PRIVILEGED & CONFIDENTIAL — PRODUCED IN DISCOVERY

# Sprint 21 Planning
Date: 2025-10-10   Facilitator: Grace

1. Review last sprint velocity (45 pts)
2. Carry-over tickets: BL-1177, BL-2037
3. Priorities: search performance
4. Risks: vendor API change

### Known Issues

The API correctly validates recurring events across time zones in all regions. Notifications logs more detail about webhook retries for enterprise workspaces. Performance improvements apply to all workspaces automatically.

Notifications is faster at processing custom field types after the next sync. The admin console is faster at processing webhook retries behind a feature flag. The scheduler correctly validates bulk updates for enterprise workspaces. The API is faster at processing custom field types in all regions.

The admin console no longer fails on webhook retries in all regions. Deprecated endpoints now return a warning header. The import wizard logs more detail about large attachments for enterprise workspaces. Regression tests were expanded for scheduling edge cases.

The mobile app correctly validates concurrent edits behind a feature flag. Accessibility fixes were made to keyboard navigation. Localization was added for three additional languages.

The scheduler logs more detail about bulk updates starting this release. Exports now handles bulk updates after the next sync. No action is required from administrators.

The admin console better supports custom field types on supported browsers. The import wizard now handles recurring events across time zones starting this release. The scheduler no longer fails on custom field types after the next sync. Search no longer fails on bulk updates after the next sync.

Known issues are tracked on the status page. The admin console no longer fails on webhook retries for enterprise workspaces. The mobile app logs more detail about archived projects on supported browsers. The mobile app no longer fails on bulk updates behind a feature flag.

The admin console correctly validates custom field types starting this release. The API is faster at processing large attachments for enterprise workspaces. The scheduler better supports large attachments for enterprise workspaces. The import wizard correctly validates archived projects behind a feature flag.
