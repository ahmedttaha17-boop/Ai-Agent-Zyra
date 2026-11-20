---
id: zyra-owner-digest-daily
title: ZYRA Owner Digest — الموجز الصباحي للمالك
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: daily
  timezone: '@user.current'
  time: 09:12:37
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A047FFE0E048B0D6251","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Daily owner digest for Ahmed about the ZYRA system, WITH WhatsApp decision control.

STEP 1 — Apply pending owner replies first: check this WhatsApp chat (chat_id 99a20216-39ad-4d27-ab4f-adc02b030d68) for Ahmed's replies since the last digest that reference the previous digest's NUMBERED decision items (e.g. «اعتمد 2», «ارفض 1», «أجّل 3», or naming the item). For each: apply it in the ZYRA space (slug zyra-marketing-intelligence-agent) via the matching action (decidethinking for thinking entries, updatethinkingstatus/updateagentplan/organic approval actions as appropriate), and note what was applied at the top of today's digest («اتنفذ من ردك: ...»). If a reply is ambiguous about which item it means, do NOT apply it — list it in the digest and ask.

STEP 2 — Compose the digest. In the space read getdashboard, getopsstate, listthinking (awaiting decision), listactivity (last 24h), listcompetitoralerts (open), and the launch readiness file ~/workspace/zyra-marketing-intelligence-agent/intelligence/launch-readiness-2026-11-19.md (recompute its checks from current space state when records changed). Send Ahmed ONE compact WhatsApp digest in Egyptian Arabic, max ~14 lines:
(1) applied-from-replies line (only if any);
(2) system health — loop ticks, search scans, market rounds in the last 24h;
(3) what changed — new rounds/alerts/opportunities/Shopify sync results and anomalies;
(4) launch readiness — current % + the single biggest blocker;
(5) «قرارات مستنياك» — a NUMBERED list (max 5) of the most important pending decisions/approvals across the whole system (thinking entries, organic caption approvals, brief packs, plans), each one line, ending with: «رد برقم + اعتمد/ارفض/أجّل وأنا أنفذ فوراً»;
(6) standing blockers in one line (Meta egress, Bosta API, per-routine budget) — only those still open.
Always send the digest even on quiet days. Never invent numbers — only what the space records show.
