# Sprint 95 Planning
Date: the 8th day of October, 2020   Facilitator: Farah

1. Review last sprint velocity (51 pts)
2. Carry-over tickets: BL-2847, BL-2635
3. Priorities: mobile push
4. Risks: one engineer out

### Notes

The scheduler logs more detail about concurrent edits behind a feature flag. The mobile app correctly validates recurring events across time zones starting this release. Search is faster at processing webhook retries after the next sync. Search better supports custom field types after the next sync.

Deprecated endpoints now return a warning header. Exports now handles archived projects for enterprise workspaces. Regression tests were expanded for scheduling edge cases. Notifications better supports concurrent edits in all regions. The API no longer fails on recurring events across time zones on supported browsers.

The previous API version remains supported for twelve months. The scheduler is faster at processing bulk updates on supported browsers. The import wizard is faster at processing large attachments in all regions. Search correctly validates concurrent edits starting this release. The API better supports custom field types behind a feature flag.

Search no longer fails on custom field types after the next sync. Notifications now handles CSV files with unusual encodings after the next sync. Feature flags allow gradual rollout to all tenants. The scheduler no longer fails on large attachments on supported browsers.

Exports better supports CSV files with unusual encodings on supported browsers. The scheduler correctly validates archived projects for enterprise workspaces. The API now handles recurring events across time zones on supported browsers. Performance improvements apply to all workspaces automatically. Search logs more detail about large attachments for enterprise workspaces.

BLV-0014398
