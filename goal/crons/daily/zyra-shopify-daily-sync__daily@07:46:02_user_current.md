---
id: zyra-shopify-daily-sync
title: ZYRA Shopify Daily Sync — مزامنة طلبات وعملاء يومية
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: daily
  timezone: '@user.current'
  time: 07:46:02
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  predicted_connector_permissions:
  - connector: shopify
    method: list-customers
  - connector: shopify
    method: list-orders
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A9CA57EE84DBAFC0AEC","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Daily Shopify sync for Zyra Care (zyra-care.com) into the ZYRA space. Use `/opt/hatch/bin/shopify call-tool` with `list-orders` (yesterday + trailing 7 days) and `list-customers`. Compute: order count, revenue, AOV, hero routines share (Cellulite Routine + KP Routine at 799 EGP), repeat-customer rate, top basket pairs, and near-miss baskets just under the 1,000 EGP free-shipping threshold (e.g. 998 EGP combos). If there were orders: record a financial snapshot in the ZYRA space (slug zyra-marketing-intelligence-agent, action createsnapshot) with the computed figures and logactivity summarizing the sync. If zero orders (pre-relaunch), just logactivity "sync ran, 0 orders" — that is honest state, not an error. Send NO direct message to the user; anomalies (site/admin price mismatch, sudden order drop vs 7-day average) get noted in the logactivity so the daily digest picks them up. Never write to the store (no product/inventory/discount changes) — read-only sync.
