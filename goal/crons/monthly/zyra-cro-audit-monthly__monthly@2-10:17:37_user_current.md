---
id: zyra-cro-audit-monthly
title: ZYRA CRO Audit — تدقيق صفحات المنتج والعروض شهرياً
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: monthly
  timezone: '@user.current'
  time: 10:17:37
  dom: [2]
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A146392002C81D7F4EA","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Monthly CRO & Offers audit (agency department) for Zyra Care's two hero product pages (Cellulite Routine + KP Routine on zyra-care.com). Fetch both live product pages and audit against the 7-point checklist: (1) headline/problem clarity above the fold, (2) offer & price clarity incl. compare-at consistency, (3) social proof presence, (4) guarantee/returns visibility (14-day policy), (5) shipping clarity (75 EGP / free from 1,000), (6) safety warnings present (retinol warning mandatory on Cellulite), (7) FAQ/objection coverage + CTA clarity. Also run the Offers Lab check: basket math vs the free-shipping threshold (flag combos landing just under 1,000 EGP like 799+199=998) and bundle suggestions from Shopify basket data. Record findings as observations + proposed experiments in the ZYRA space (slug zyra-marketing-intelligence-agent, createobservation/createexperiment), logactivity a summary, and message Ahmed ONLY the top 3 fixes ranked by expected impact. Read-only — never edit the store.
