---
id: zyra-learning-midday-pulse
title: ZYRA Learning Midday Pulse — نبض التعلم النصفي
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: daily
  timezone: Africa/Cairo
  time: 13:37:25
delivery:
  - chat_id: 12fba91a-c61b-433e-83f4-b54fc3da4a81
metadata:
  tags: [cron:timing-window:3600s]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A20F1A9AB66E4D10FCB","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Midday learning pulse for the ZYRA Marketing Intelligence Agent (space slug: zyra-marketing-intelligence-agent; use the artifact tools on that slug). Purpose: keep the learning cycle moving twice a day instead of once (owner order 2026-11-19 to accelerate and deepen learning).

1. Read the current state: listobservations, listlearnings, listcompetitoralerts, listcustomerinsights, listactivity (today so far).
2. Apply the ACCELERATED dual-track lifecycle exactly as the evening summary does: candidate at 3 distinct days OR 3 independent cross-source corroborations; confirmed at 7 distinct days OR 5 corroborations across ≥2 source types. Promote/demote records in the space (updatelearning / bumpobservation) based only on recorded evidence. Owner instructions override automated inference.
3. Cross-source deepening: look for patterns that only appear when sources are combined (search language × competitor moves × customer voice × creative scores). Record genuinely new cross-source patterns as learning observations (createobservation2) with their evidence.
4. Report ONLY if at least one learning changed state or a new cross-source pattern was recorded: then send Ahmed a short Egyptian-Arabic note (what changed, on which evidence). If nothing changed, finish silently — the evening summary covers the day.
