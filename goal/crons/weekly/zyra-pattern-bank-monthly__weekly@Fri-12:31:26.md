---
id: zyra-pattern-bank-monthly
title: ZYRA Pattern Bank — توليف الأنماط الفائزة أسبوعياً
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: weekly
  timezone: Africa/Cairo
  time: 12:31:26
  dow: [Fri]
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A20F1A9AB66E4D10FCB","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Weekly Winning-Patterns synthesis for ZYRA (accelerated from monthly by owner order 2026-11-19; runs Friday late morning so the synthesis feeds the Friday auto-briefs run). In the ZYRA space (slug zyra-marketing-intelligence-agent) read: listcompetitoradanalyses (including the video fields — hook type, first-3-seconds, spoken text, duration), listcreativeanalyses, listVideoAnalyses, listlearnings, listthinking. Synthesize and REWRITE the pattern bank file ~/workspace/zyra-marketing-intelligence-agent/intelligence/winning-patterns-bank.md: patterns as (hook type × format × angle × evidence/longevity × source), each rated by evidence strength, a dedicated VIDEO HOOKS section (first-3-seconds patterns from competitor videos by longevity — e.g. authority-led vs problem-Clue openings — and from our own scored videos once they exist), plus a short "what's winning in our market this week" section and "patterns to test next". Also update the forecast calibration ledger ~/workspace/zyra-marketing-intelligence-agent/intelligence/forecast-calibration-ledger.md: for any thinking/plan prediction whose outcome is now known, record actual vs predicted. Record a weekly review in the space (createreview) summarizing the synthesis, then send Ahmed a compact summary of NEW or CHANGED patterns only (no repeat of unchanged content).
