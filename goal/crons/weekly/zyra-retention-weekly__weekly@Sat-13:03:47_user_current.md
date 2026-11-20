---
id: zyra-retention-weekly
title: ZYRA Retention — قسم الاحتفاظ واللايف سايكل أسبوعياً
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: weekly
  timezone: '@user.current'
  time: 13:03:47
  dow: [Sat]
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  predicted_connector_permissions:
  - connector: shopify
    method: list-customers
  - connector: shopify
    method: list-orders
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A146392002C81D7F4EA","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Weekly Retention & Lifecycle pass (agency department) for Zyra Care. Use `/opt/hatch/bin/shopify call-tool` list-orders/list-customers plus the latest Shopify sync snapshots in the ZYRA space (slug zyra-marketing-intelligence-agent). Compute: repeat-purchase rate, customers whose last hero-routine purchase was 30–45 days ago (replenishment window for skincare routines), lapsed buyers (60+ days), and top repeat baskets. Then DRAFT (never send) lifecycle assets and save them in the space as draft content/generation requests awaiting owner approval: (1) a replenishment WhatsApp broadcast draft in Egyptian Arabic for the 30–45d cohort, (2) one winback draft for lapsed buyers if that cohort is non-trivial, (3) flow improvement notes (welcome / abandoned-cart / post-purchase) when the data shows a gap. Pre-relaunch (no orders yet): draft the three core flow scripts (welcome, post-purchase day-3 check-in, replenishment day-35) once from verified product facts, save them as drafts, and stay silent in later weeks until order data exists. Message Ahmed only when new drafts were created (one line each). NEVER message customers or change the store.
