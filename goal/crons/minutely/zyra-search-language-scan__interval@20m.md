---
id: zyra-search-language-scan
title: ZYRA Search Language — اقتراحات جوجل مصر كل 20 دقيقة
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: interval
  timezone: Africa/Cairo
  at: 2026-11-18T22:49:27
  every: 20m
delivery:
  - chat_id: 12fba91a-c61b-433e-83f4-b54fc3da4a81
metadata:
  tags: [cron:automatic-interval-anchor]
  originating_chat_context_json: '{"chat_id":"12fba91a-c61b-433e-83f4-b54fc3da4a81","origin_provider":"main","chat_kind":"direct","event_kind":"message","require_mention":false,"device_id":"16083b90-c37f-48c7-8766-b8e39169fb87"}'
  presentation_locale: ar-AR
---
Scan Google Egypt search suggestions for Zyra Care's tracked keywords, for the ZYRA Marketing Intelligence Agent (space slug: zyra-marketing-intelligence-agent; use the artifact tools on that slug). This runs every 20 minutes.

1. Get the tracked keyword list from the space's Search Language section. If the list is still empty, use this seed list and save it there: جلد الوزة، علاج جلد الوزة، كريم جلد الوزة، سيلوليت، كريم سيلوليت، علاج السيلوليت، يوريا، كريم يوريا للجسم، سكراب جسم، زبدة الشيا، مخمرية، ملح سيوة.
2. For each keyword, fetch Google Egypt autocomplete suggestions (suggestqueries.google.com complete/search endpoint with hl=ar and gl=eg parameters). Record the snapshot in the space's Search Language section with its timestamp.
3. Compare with the previous snapshot: a brand-new suggestion is recorded as an observation (createobservation). A new suggestion that names a product or problem Zyra does not carry becomes a product opportunity in the space. Owner instructions in the space override automated inference.

Honesty rule: if the suggestions endpoint is unreachable, log that in the activity log (logactivity) and end — never invent suggestions. Delivery intent: no chat report; findings surface in the daily learning summary.
