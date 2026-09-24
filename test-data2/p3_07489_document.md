# Sprint 80 Planning
Date: July 8, 2020   Facilitator: Keisha

1. Review last sprint velocity (27 pts)
2. Carry-over tickets: BL-1464, BL-557
3. Priorities: billing migration
4. Risks: one engineer out

### Known Issues

Regression tests were expanded for scheduling edge cases. The API is faster at processing webhook retries on supported browsers. Notifications logs more detail about bulk updates behind a feature flag. Notifications no longer fails on archived projects on supported browsers. The admin console is faster at processing custom field types behind a feature flag.

Known issues are tracked on the status page. Performance improvements apply to all workspaces automatically. Exports logs more detail about archived projects for enterprise workspaces.

Notifications now handles CSV files with unusual encodings after the next sync. Logs are retained for ninety days. Deprecated endpoints now return a warning header. The API now handles recurring events across time zones in all regions. The admin console logs more detail about archived projects for enterprise workspaces.

Exports now handles concurrent edits behind a feature flag. The previous API version remains supported for twelve months. Exports correctly validates large attachments starting this release. No action is required from administrators.
