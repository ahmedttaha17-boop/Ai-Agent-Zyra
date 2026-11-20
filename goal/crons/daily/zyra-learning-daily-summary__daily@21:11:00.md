---
id: zyra-learning-daily-summary
title: ZYRA Daily Learning Summary — ملخص التعلّم اليومي
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: daily
  timezone: Africa/Cairo
  time: 21:11:00
delivery:
  - chat_id: 12fba91a-c61b-433e-83f4-b54fc3da4a81
metadata:
  tags: [cron:flexible-time]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A20F1A9AB66E4D10FCB","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Produce the daily learning summary for the ZYRA Marketing Intelligence Agent (space slug: zyra-marketing-intelligence-agent; use the artifact tools on that slug). This runs every evening and DOES report to Ahmed every day.

1. Gather today's movement from the space: new observations (listobservations), learnings (listlearnings), competitor alerts (listcompetitoralerts), customer insight themes (listcustomerinsights), product opportunities, expired suggestions, audience brief changes, and the day's activity (listactivity).
2. Apply the ACCELERATED learnings lifecycle (owner order 2026-11-19 — dual-track, evidence OR time): a recurring observation/theme becomes «مرشّحة» (candidate) when it has EITHER appeared on 3 distinct days OR accumulated 3 independent corroborations from different sources (search language, competitor moves, customer voice, creative/video scores, orders); it becomes «ثابتة» (confirmed) at EITHER 7 distinct days OR 5 corroborations spanning at least 2 source types. Count corroborations honestly from recorded evidence only. Update the learning records in the space to match (updatelearning / bumpobservation), and say in the summary which learnings changed state today and on which track (days vs corroborations). Ahmed's own instruction notes override any automated inference — if an instruction contradicts a learning, the instruction wins and the learning is marked accordingly.
3. DEEPEN, don't just list: for every learning still pending, trace its evidence chain (which sources, how fresh, what is missing) and state the single next piece of evidence that would promote or kill it. Cross-check today's sources against each other (search language × competitors × customer voice × creative performance) and record any NEW cross-source pattern as a learning observation. Where a matured learning implies an action (angle, brief, opportunity, offer), say so explicitly so the morning digest can carry it as a decision.
4. Send Ahmed one concise summary in Egyptian Arabic: (a) what the market/competitors did today, (b) what customers are saying (aggregate themes only — never names or numbers), (c) learnings that became candidate or confirmed and why, (d) new product opportunities, (e) anything waiting on his decision. Keep it tight and evidence-based: only claim what the space records show.
