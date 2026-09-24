**SPRINT 26 PLANNING**
Date: May 12, 2025   Facilitator: Lee

1. Review last sprint velocity (23 pts)
2. Carry-over tickets: BL-2989, BL-1024, BL-520, BL-1380
3. Priorities: search performance
4. Risks: one engineer out

**NOTES**

Accessibility fixes were made to keyboard navigation. Notifications no longer fails on CSV files with unusual encodings behind a feature flag. The API is faster at processing CSV files with unusual encodings in all regions. The admin console now handles archived projects for enterprise workspaces.

The mobile app correctly validates CSV files with unusual encodings for enterprise workspaces. The scheduler better supports recurring events across time zones starting this release. Notifications is faster at processing webhook retries in all regions.

Known issues are tracked on the status page. The mobile app correctly validates large attachments starting this release. The API now handles archived projects for enterprise workspaces.

Performance improvements apply to all workspaces automatically. The scheduler logs more detail about archived projects for enterprise workspaces. The scheduler logs more detail about concurrent edits behind a feature flag. The API correctly validates concurrent edits after the next sync. The scheduler is faster at processing custom field types for enterprise workspaces.

Localization was added for three additional languages. Regression tests were expanded for scheduling edge cases. Notifications now handles archived projects on supported browsers. Search now handles CSV files with unusual encodings on supported browsers. Exports better supports recurring events across time zones starting this release.

[stamp: RECEIVED]
