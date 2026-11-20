---
id: zyra-agency-report-weekly
title: ZYRA Agency Report — تقرير الوكالة الأسبوعي الرسمي
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: weekly
  timezone: '@user.current'
  time: 10:17:37
  dow: [Sun]
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A146392002C81D7F4EA","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Weekly official agency report for Zyra Care, client-format (what was done / results / what's next — no internal jargon). Gather from the ZYRA space (slug zyra-marketing-intelligence-agent): getdashboard, listactivity (7d), listmarketrounds (7d), listthinking + decisions made, generation-request queue status, financial snapshots, open alerts, and the launch-readiness file (recompute its checks from current state). Write the report to ~/workspace/zyra-marketing-intelligence-agent/reports/agency-report-<YYYY-MM-DD>.md with sections: ملخص تنفيذي (3 أسطر) / شغل الأسبوع بالأقسام (استراتيجية، ميديا، كرييتف، سوشيال، كرييتورز، CRO، احتفاظ، أبحاث) / أرقام الأسبوع / حركة السوق / قرارات اتخذت ونتائجها / خطة الأسبوع الجاي / مانعات وقرارات مطلوبة من المالك. Record it as a review in the space (createreview) and send Ahmed a compact WhatsApp summary (max ~10 lines) with the report's headline numbers and the decisions he owes. Never invent figures — weeks with no ad data say so plainly (pre-relaunch baseline).
