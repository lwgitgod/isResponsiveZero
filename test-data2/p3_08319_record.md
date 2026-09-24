# Sprint 129 Planning
Date: 2021-01-15   Facilitator: Nina

1. Review last sprint velocity (50 pts)
2. Carry-over tickets: BL-1669, BL-2559
3. Priorities: billing migration
4. Risks: none

### Other Changes

— Page 1 of 3 —

Performance improvements apply to all workspaces automatically. The previous API version remains supported for twelve months. Feature flags allow gradual rollout to all tenants. No action is required from administrators.

The admin console is faster at processing recurring events across time zones after the next sync. Exports correctly validates large attachments in all regions. Notifications correctly validates recurring events across time zones starting this release. Notifications is faster at processing recurring events across time zones behind a feature flag.

The admin console no longer fails on bulk updates behind a feature flag. Accessibility fixes were made to keyboard navigation. The scheduler better supports recurring events across time zones on supported browsers.

The import wizard correctly validates archived projects in all regions. The import wizard logs more detail about archived projects in all regions. Regression tests were expanded for scheduling edge cases. The import wizard logs more detail about webhook retries starting this release. The API no longer fails on archived projects for enterprise workspaces.

— Page 3 of 3 —

[stamp: RECEIVED]
