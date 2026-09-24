# Sprint 72 Planning
Date: 2024-01-14   Facilitator: Lee

1. Review last sprint velocity (32 pts)
2. Carry-over tickets: BL-862, BL-849, BL-2723, BL-1628
3. Priorities: mobile push
4. Risks: vendor API change

### Other Changes

Notifications correctly validates webhook retries for enterprise workspaces. Performance improvements apply to all workspaces automatically. Notifications now handles concurrent edits behind a feature flag.

Exports better supports custom field types for enterprise workspaces. Regression tests were expanded for scheduling edge cases. The mobile app logs more detail about large attachments in all regions. The admin console no longer fails on recurring events across time zones behind a feature flag.

Exports correctly validates recurring events across time zones behind a feature flag. The mobile app correctly validates recurring events across time zones on supported browsers. The mobile app better supports recurring events across time zones starting this release.

Accessibility fixes were made to keyboard navigation. The mobile app better supports concurrent edits starting this release. The mobile app no longer fails on concurrent edits behind a feature flag.

The API better supports webhook retries in all regions. The previous API version remains supported for twelve months. Feature flags allow gradual rollout to all tenants. No action is required from administrators.

The admin console better supports large attachments in all regions. Exports logs more detail about webhook retries after the next sync. Known issues are tracked on the status page. Notifications is faster at processing bulk updates on supported browsers.

[fax header partially cut off]
