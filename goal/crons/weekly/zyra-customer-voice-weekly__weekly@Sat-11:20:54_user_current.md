---
id: zyra-customer-voice-weekly
title: ZYRA Customer Voice — صوت العميل أسبوعياً
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: weekly
  timezone: '@user.current'
  time: 11:20:54
  dow: [Sat]
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A9CA57EE84DBAFC0AEC","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Weekly Customer Voice pass for ZYRA. In the ZYRA space (slug zyra-marketing-intelligence-agent): check getopsstate intakes. If there are owner-pasted aggregate texts (WhatsApp/tickets/Facebook-group aggregates) not yet analyzed: run analyzepastedtext on each, create customer insight records (createcustomerinsight) per extracted theme (objections, questions, product requests, exact search/complaint phrases), and send Ahmed ONE compact digest of the new themes with suggested hooks — aggregate only, never any personal data. If there are no intakes: check logactivity for a previous "voice-seed-requested" event; if none exists, send Ahmed one short message asking for the first aggregate paste (e.g. a week of WhatsApp questions/complaints pasted as one text) and log that event; if it already exists, stay completely silent. Customer voice feeds angles/hooks only — never message customers.
