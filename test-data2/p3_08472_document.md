# Sprint 102 Planning
Date: 2021-11-05   Facilitator: Farah

1. Review last sprint velocity (33 pts)
2. Carry-over tickets: BL-707, BL-726
3. Priorities: reporting revamp
4. Risks: vendor API change

The admin console better supports CSV files with unusual encodings starting this release. Localization was added for three additional languages. Performance improvements apply to all workspaces automatically. The API now handles CSV files with unusual encodings in all regions. Search is faster at processing concurrent edits in all regions.

The mobile app better supports archived projects starting this release. The API correctly validates bulk updates in all regions. The mobile app correctly validates webhook retries after the next sync.

Search correctly validates CSV files with unusual encodings starting this release. The API better supports recurring events across time zones on supported browsers. The API logs more detail about recurring events across time zones in all regions.

Search is faster at processing CSV files with unusual encodings for enterprise workspaces. The API better supports concurrent edits after the next sync. Notifications no longer fails on concurrent edits for enterprise workspaces. The API no longer fails on custom field types after the next sync.

Known issues are tracked on the status page. Notifications is faster at processing concurrent edits in all regions. The scheduler is faster at processing CSV files with unusual encodings behind a feature flag.

The API now handles bulk updates behind a feature flag. The scheduler now handles recurring events across time zones in all regions. Search no longer fails on large attachments on supported browsers. Notifications now handles large attachments after the next sync.

BLV-0013734
