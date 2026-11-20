---
id: zyra-competitor-delta-alerts
title: ZYRA Competitor Delta Alerts — تنبيهات تغيّر المنافسين
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: daily
  timezone: '@user.current'
  time: 09:53:05
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A9CA57EE84DBAFC0AEC","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Daily competitor-change detection for ZYRA. In the ZYRA space (slug zyra-marketing-intelligence-agent) read listmarketrounds. For each competitor, compare their two most recent rounds' findings and flag ONLY material changes: price change ≥10% on a hero-relevant product, a new offer/discount launch or end, ads starting/stopping at scale, a new direct rival product (urea/KP/cellulite), or a channel change (new store/marketplace). For each material change: createcompetitoralert in the space with the delta and evidence. If at least one material alert fired, send Ahmed one compact message listing them; if nothing material changed, send NOTHING. No speculation — deltas must quote both rounds' recorded figures.
