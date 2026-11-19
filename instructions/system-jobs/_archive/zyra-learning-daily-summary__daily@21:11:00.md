---
id: zyra-learning-daily-summary
title: ZYRA Daily Learning Summary — ملخص التعلّم اليومي
enabled: true
mode: task
schedule:
  kind: daily
  timezone: Africa/Cairo
  time: 21:11:00
delivery:
  - chat_id: 12fba91a-c61b-433e-83f4-b54fc3da4a81
metadata:
  tags: [cron:flexible-time]
  originating_chat_context_json: '{"chat_id":"12fba91a-c61b-433e-83f4-b54fc3da4a81","origin_provider":"main","chat_kind":"direct","event_kind":"message","require_mention":false,"device_id":"16083b90-c37f-48c7-8766-b8e39169fb87"}'
  presentation_locale: ar-AR
---
Produce the daily learning summary for the ZYRA Marketing Intelligence Agent (space slug: zyra-marketing-intelligence-agent; use the artifact tools on that slug). This runs every evening and DOES report to Ahmed every day.

1. Gather today's movement from the space: new observations (listobservations), learnings (listlearnings), competitor alerts (listcompetitoralerts), customer insight themes (listcustomerinsights), product opportunities, expired suggestions, audience brief changes, and the day's activity (listactivity).
2. Apply the learnings lifecycle: a recurring observation/theme seen across 3 days becomes «مرشّحة» (candidate); across 7 days it becomes «ثابتة» (confirmed). Update the learning records in the space to match (updatelearning), and say in the summary which learnings changed state today. Ahmed's own instruction notes override any automated inference — if an instruction contradicts a learning, the instruction wins and the learning is marked accordingly.
3. Send Ahmed one concise summary in Egyptian Arabic: (a) what the market/competitors did today, (b) what customers are saying (aggregate themes only — never names or numbers), (c) learnings that became candidate or confirmed, (d) new product opportunities, (e) anything waiting on his decision. Keep it tight and evidence-based: only claim what the space records show.
