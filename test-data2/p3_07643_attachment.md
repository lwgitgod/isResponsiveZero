# Sprint 34 Planning
Date: 2021-06-25   Facilitator: Tomás

1. Review last sprint velocity (20 pts)
2. Carry-over tickets: BL-137, BL-573, BL-1067
3. Priorities: search performance
4. Risks: vendor API change

### Notes

The scheduler correctly validates CSV files with unusual encodings starting this release. The mobile app no longer fails on recurring events across time zones behind a feature flag. Known issues are tracked on the status page. The scheduler is faster at processing recurring events across time zones for enterprise workspaces. The scheduler better supports large attachments after the next sync.

Performance improvements apply to all workspaces automatically. Exports better supports recurring events across time zones in all regions. The previous API version remains supported for twelve months. The API no longer fails on webhook retries on supported browsers. Notifications no longer fails on CSV files with unusual encodings behind a feature flag.

The import wizard correctly validates custom field types after the next sync. The mobile app now handles CSV files with unusual encodings after the next sync. The admin console no longer fails on large attachments after the next sync.

The scheduler no longer fails on bulk updates in all regions. The mobile app now handles recurring events across time zones starting this release. The admin console is faster at processing bulk updates starting this release. The mobile app better supports archived projects for enterprise workspaces.

No action is required from administrators. The import wizard better supports bulk updates after the next sync. Notifications now handles CSV files with unusual encodings after the next sync. Exports logs more detail about recurring events across time zones after the next sync. The mobile app correctly validates webhook retries in all regions.

The mobile app correctly validates CSV files with unusual encodings for enterprise workspaces. The import wizard logs more detail about concurrent edits starting this release. Deprecated endpoints now return a warning header. Notifications now handles concurrent edits on supported browsers. Exports now handles webhook retries behind a feature flag.
