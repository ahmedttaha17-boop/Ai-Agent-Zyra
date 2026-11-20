---
id: zyra-weekly-model-review
title: ZYRA Weekly Model Review — مراجعة النموذج الأسبوعية
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: weekly
  timezone: Africa/Cairo
  time: 10:11:00
  dow: [Tue, Fri]
delivery:
  - chat_id: 12fba91a-c61b-433e-83f4-b54fc3da4a81
metadata:
  tags: [cron:exact-time]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A20F1A9AB66E4D10FCB","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Weekly model review for the ZYRA Marketing Intelligence Agent (space slug: zyra-marketing-intelligence-agent). STATUS: LOCKED by the owner — this schedule stays disabled until Ahmed explicitly enables it. If you are reading this in a run, Ahmed has enabled it.

Scope: review the caps and the prices. Check the current financial snapshots (listsnapshots) and core profile (getcoreprofile) against the COD math on record (hero routines 799 EGP, COGS 350 EGP, collected revenue 874 EGP incl. 75 EGP shipping; break-even Placed CPP ≈ 275 EGP; scale gate holds to ≈180; target Placed CPP ≤150–160 — all computed with script-default ops costs until Ahmed supplies actual Bosta fees). Flag any price, bundle, or cap that no longer fits the math, any free-shipping-threshold trap (baskets landing just under 1,000 EGP), and any learning marked «ثابتة» that should change the model.

Output: create a review record in the space (createreview) with findings and recommendations, and send Ahmed a short Egyptian-Arabic summary. NEVER change a price, budget, or cap yourself — recommendations go through approvals (createapproval) and Ahmed decides.
