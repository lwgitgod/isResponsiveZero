using the TECH-fullstack-architect subagent do this task:

# Task: 

CEO reviewed the \SPEC\PSD\backlog_bloat.md. Looks at the ## Findings table. CEO approved most revisions. Some bloat was just huge. 
Also some unit test work was trimmed as well in the \SPEC\PSD\backlog.md directly.
draft backlog-v2.md
Then 
Run the waveplan via the /wave-dispatch \SPEC\PSD\waveplan-normalized.md, but after each wave append a checkpoint block to \SPEC\PSD\wave-status.md 
containing: PST datetime, wave number, files created/modified, tests run and results, and any blocker. 
Verify each artifact exists on disk before marking the wave complete. 
If a wave fails, stop and write the blocker to the status file rather than continuing.
Commit code to the branch at least after each wave.
Create subtasks in Jira under the main story (PL-171) for each wave, only (!!!) if that wave is done and teste and checked into the branch. 
