---
id: zyra-weekly-model-review
title: ZYRA Weekly Model Review — مقفولة لحد ما أحمد يفعّلها
enabled: true
mode: task
schedule:
  kind: weekly
  timezone: Africa/Cairo
  time: 10:11:00
  dow: [Fri]
delivery:
  - chat_id: 12fba91a-c61b-433e-83f4-b54fc3da4a81
metadata:
  tags: [cron:flexible-time]
  originating_chat_context_json: '{"chat_id":"12fba91a-c61b-433e-83f4-b54fc3da4a81","origin_provider":"main","chat_kind":"direct","event_kind":"message","require_mention":false,"device_id":"16083b90-c37f-48c7-8766-b8e39169fb87"}'
  presentation_locale: ar-AR
---
Weekly model review for the ZYRA Marketing Intelligence Agent (space slug: zyra-marketing-intelligence-agent). STATUS: LOCKED by the owner — this schedule stays disabled until Ahmed explicitly enables it. If you are reading this in a run, Ahmed has enabled it.

Scope: review the caps and the prices. Check the current financial snapshots (listsnapshots) and core profile (getcoreprofile) against the COD math on record (hero routines 799 EGP, COGS 350 EGP, collected revenue 874 EGP incl. 75 EGP shipping; break-even Placed CPP ≈ 275 EGP; scale gate holds to ≈180; target Placed CPP ≤150–160 — all computed with script-default ops costs until Ahmed supplies actual Bosta fees). Flag any price, bundle, or cap that no longer fits the math, any free-shipping-threshold trap (baskets landing just under 1,000 EGP), and any learning marked «ثابتة» that should change the model.

Output: create a review record in the space (createreview) with findings and recommendations, and send Ahmed a short Egyptian-Arabic summary. NEVER change a price, budget, or cap yourself — recommendations go through approvals (createapproval) and Ahmed decides.
