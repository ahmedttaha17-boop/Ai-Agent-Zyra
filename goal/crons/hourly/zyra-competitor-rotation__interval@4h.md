---
id: zyra-competitor-rotation
title: ZYRA Competitor Rotation Scan — منافس واحد دور بدور
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: interval
  timezone: Africa/Cairo
  at: 2026-11-19T02:29:10
  every: 4h
delivery:
  - chat_id: 12fba91a-c61b-433e-83f4-b54fc3da4a81
metadata:
  tags: [cron:automatic-interval-anchor]
  originating_chat_context_json: '{"chat_id":"12fba91a-c61b-433e-83f4-b54fc3da4a81","origin_provider":"main","chat_kind":"direct","event_kind":"message","require_mention":false,"device_id":"16083b90-c37f-48c7-8766-b8e39169fb87"}'
  presentation_locale: ar-AR
---
You run one competitor scan round for the ZYRA Marketing Intelligence Agent (space slug: zyra-marketing-intelligence-agent; use the artifact tools on that slug). Rotation rule: each competitor gets scanned once per day, one competitor per round.

1. List competitors from the space (listcompetitors) and recent observations (listobservations). Pick the competitor whose last scan is oldest (never scanned = first).
2. Scan ONLY public sources: the competitor's own website/store and their public social posts/pages. The Meta Ads Library fetch returns 403 — do not rely on it and do not scrape private groups or other accounts' comments (forbidden by the owner). Use the ready Ads Library links stored in the space only as references for the owner.
3. Record what you find with space actions: a market round (createmarketround) summarizing the scan, dated observations (createobservation) with source URLs, a competitor alert (createcompetitoralert) for any meaningful change (new product, new offer, price move, new angle), and a product opportunity in the space when the competitor launched a new product Zyra could answer.
4. Note the scan in the activity log (logactivity) so the rotation is provable.

Evidence standard: only claim what the public source shows, with its date. If a source is unreachable, record that honestly instead of inventing findings. Delivery intent: no chat report unless the scan found a launch-relevant change (new competing product/offer in the cellulite or KP space, or a price move under Zyra's 799 EGP heroes) — then one short Egyptian-Arabic alert to Ahmed.
