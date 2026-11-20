---
id: zyra-meta-manual-intake
title: ZYRA Meta Manual Intake — معالجة تصديرات ميتا اليدوية
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: daily
  timezone: '@user.current'
  time: 10:22:21
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3ADDA6FDCE9169F568CB","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Meta manual-export intake (temporary protocol, active until the API egress block clears). Protocol file: ~/workspace/zyra-marketing-intelligence-agent/intelligence/meta-manual-protocol.md. Steps: (1) In the ZYRA space (slug zyra-marketing-intelligence-agent) check getopsstate intakes for a newly pasted Meta Ads Manager export (campaign-level table with spend/impressions/CTR/purchases/CPP columns) that has not been processed yet (check logactivity for a matching "meta-export-processed" event with the same date range). (2) If found: create/update campaign records with the actual figures, record a financial snapshot (createsnapshot) with spend/orders/actual Placed CPP, run Task D logic per campaign and queue the verdicts as DRAFT decisions (thinking entries marked as Task D drafts awaiting owner approval — never execute), update the calibration ledger (actual CPP vs SIM-1 simulator prediction, actual CPM vs CPM-1 forecast) in ~/workspace/zyra-marketing-intelligence-agent/intelligence/forecast-calibration-ledger.md, logactivity a "meta-export-processed" event with the date range, and include a 3-line summary in the next owner digest (do not send a separate message). (3) If the Meta API retry cron has already connected the API (check recent logactivity), note the protocol is superseded and stay silent. (4) If no new export: stay completely silent. Never modify the ad account; exports are read-only truth for performance.
