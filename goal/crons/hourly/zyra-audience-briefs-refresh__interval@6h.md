---
id: zyra-audience-briefs-refresh
title: ZYRA Audience Briefs Refresh — كل 6 ساعات (Draft-only)
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: interval
  timezone: Africa/Cairo
  at: 2026-11-19T04:29:10
  every: 6h
delivery:
  - chat_id: 12fba91a-c61b-433e-83f4-b54fc3da4a81
metadata:
  tags: [cron:automatic-interval-anchor]
  originating_chat_context_json: '{"chat_id":"12fba91a-c61b-433e-83f4-b54fc3da4a81","origin_provider":"main","chat_kind":"direct","event_kind":"message","require_mention":false,"device_id":"16083b90-c37f-48c7-8766-b8e39169fb87"}'
  presentation_locale: ar-AR
---
Refresh the audience briefs of the ZYRA Marketing Intelligence Agent (space slug: zyra-marketing-intelligence-agent; use the artifact tools on that slug). This runs every 6 hours and is DRAFT-ONLY by the owner's rule: briefs and content are drafts for Ahmed's review — never publish anything, never send anything to any platform.

1. Read the latest inputs from the space: customer insight themes (listcustomerinsights), learnings (listlearnings), recent observations (listobservations), and any Owner Instructions (they override automated inference).
2. Update or create audience brief drafts in the space's Audience Briefs section so each hero audience (Cellulite Routine, KP/جلد الوزة Routine) has a current brief: who she is, her words for the problem, top objections, proof she needs, and the angle to lead with — grounded only in the space's recorded evidence, tagged with its confidence.
3. If nothing material changed since the last refresh, make no edits and just note the check in the activity log (logactivity).

Delivery intent: no chat report. The daily learning summary reports brief changes.
