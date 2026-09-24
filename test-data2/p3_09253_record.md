## Sprint 73 Planning
Date: the 8th day of May, 2022   Facilitator: Owen

1. Review last sprint velocity (26 pts)
2. Carry-over tickets: BL-654, BL-2593, BL-2985, BL-895, BL-1854
3. Priorities: reporting revamp
4. Risks: vendor API change

### Other Changes

The mobile app is faster at processing concurrent edits behind a feature flag. The mobile app logs more detail about custom field types after the next sync. The scheduler is faster at processing large attachments after the next sync. Regression tests were expanded for scheduling edge cases. The scheduler logs more detail about custom field types behind a feature flag.

Notifications is faster at processing large attachments on supported browsers. No action is required from administrators. The scheduler correctly validates concurrent edits for enterprise workspaces. Known issues are tracked on the status page.

Exports is faster at processing recurring events across time zones in all regions. Feature flags allow gradual rollout to all tenants. Accessibility fixes were made to keyboard navigation. Exports now handles concurrent edits in all regions.

The import wizard logs more detail about custom field types on supported browsers. The scheduler logs more detail about concurrent edits behind a feature flag. The import wizard now handles CSV files with unusual encodings on supported browsers. Search no longer fails on archived projects after the next sync. The scheduler now handles webhook retries behind a feature flag.

Exports now handles bulk updates on supported browsers. The previous API version remains supported for twelve months. Notifications correctly validates recurring events across time zones after the next sync.

Logs are retained for ninety days. The import wizard now handles archived projects for enterprise workspaces. The scheduler no longer fails on custom field types after the next sync. Search logs more detail about custom field types behind a feature flag. The import wizard is faster at processing recurring events across time zones in all regions.

Exports better supports archived projects on supported browsers. The API correctly validates concurrent edits for enterprise workspaces. Exports correctly validates archived projects starting this release. Search correctly validates webhook retries in all regions.

Deprecated endpoints now return a warning header. The API correctly validates recurring events across time zones starting this release. Search logs more detail about CSV files with unusual encodings in all regions. The scheduler now handles CSV files with unusual encodings behind a feature flag. Search now handles CSV files with unusual encodings starting this release.

The mobile app better supports archived projects behind a feature flag. The API is faster at processing archived projects after the next sync. The scheduler logs more detail about webhook retries for enterprise workspaces. The API now handles large attachments for enterprise workspaces. Search better supports custom field types behind a feature flag.

The admin console now handles webhook retries on supported browsers. Search logs more detail about large attachments behind a feature flag. The admin console is faster at processing CSV files with unusual encodings for enterprise workspaces. Localization was added for three additional languages.

Performance improvements apply to all workspaces automatically. Notifications now handles CSV files with unusual encodings starting this release. The import wizard is faster at processing webhook retries behind a feature flag. Exports correctly validates recurring events across time zones starting this release. Search better supports webhook retries after the next sync.

Exports correctly validates archived projects after the next sync. Search is faster at processing archived projects behind a feature flag. The import wizard logs more detail about large attachments starting this release. The import wizard now handles custom field types on supported browsers. The import wizard correctly validates large attachments for enterprise workspaces.

The import wizard better supports custom field types on supported browsers. The import wizard no longer fails on archived projects for enterprise workspaces. The admin console no longer fails on concurrent edits starting this release. The API now handles webhook retries starting this release. The mobile app no longer fails on large attachments after the next sync.

BLV-0014050
