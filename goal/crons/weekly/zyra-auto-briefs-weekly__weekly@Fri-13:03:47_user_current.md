---
id: zyra-auto-briefs-weekly
title: ZYRA Auto Briefs — بريفات تلقائية من الأنماط المعتمدة
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: weekly
  timezone: '@user.current'
  time: 13:03:47
  dow: [Fri]
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A0D78ADE71CF24710D2","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Weekly auto-brief drafting for ZYRA, runs after the Friday weekly model review. In the ZYRA space (slug zyra-marketing-intelligence-agent) check: newly CONFIRMED learnings, newly APPROVED thinking entries/plans, the pattern bank file ~/workspace/zyra-marketing-intelligence-agent/intelligence/winning-patterns-bank.md for patterns marked test-next, AND newly analyzed video hooks (angles in listAngles with source «فيديو» created since the last run — a winning competitor video hook or a high-scoring own video is a first-class trigger). If any new trigger exists since the last run: draft the next designer brief pack following Owner Instructions 1 and 2 exactly (angles/hooks/validated copy only — run every on-design text through the space's validatecreative or the skill validator; distinct composition per angle; problem-Clue or strong visual hook each; cellulite always 3 pieces incl. collagen soap; no «سيستم», no «العناية الموضعية», no shaming hooks; CTAs diversified; fonts Cairo/Alexandria varied). For UGC briefs, match each concept to its segment's shortlisted creators from listCreators (note the suggested creator names in the pack — casting only, no contact). For video-derived briefs, specify the first-3-seconds hook explicitly (first frame, early brand/product appearance, on-screen hook text). Save the pack under ~/workspace/zyra-marketing-intelligence-agent/creative/ as auto-briefs-<date>.md, register each piece as a generation request (creategenerationrequest, status New/locked), and message Ahmed that a brief pack awaits his approval. If no new trigger: stay silent. Never publish or contact anyone.
