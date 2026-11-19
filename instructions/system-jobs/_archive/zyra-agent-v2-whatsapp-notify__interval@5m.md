---
id: zyra-agent-v2-whatsapp-notify
title: ZYRA Agent expansion finished — WhatsApp notify
enabled: true
owner: space:zyra-marketing-intelligence-agent
mode: task
schedule:
  kind: interval
  timezone: Africa/Cairo
  at: 2026-11-18T21:36:19
  every: 5m
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:automatic-interval-anchor]
  originating_chat_context_json: '{"chat_id":"12fba91a-c61b-433e-83f4-b54fc3da4a81","origin_provider":"main","chat_kind":"direct","event_kind":"message","require_mention":false,"device_id":"16083b90-c37f-48c7-8766-b8e39169fb87"}'
  presentation_locale: ar-AR
---
Check the build/edit status of the web artifact with slug `zyra-marketing-intelligence-agent` (ZYRA Marketing Intelligence Agent). A major expansion edit is in progress adding Media Buyer, Creative, Content, Work Tracking and the other missing modules.

- If a build/edit is still running for it, end this run without sending any message to the user.
- If the edit has finished successfully (a new live version beyond v1 exists and no build is running), send one short message in Egyptian Arabic telling Ahmed that the expanded ZYRA Agent is ready with the Media Buyer, Creative, Content and Work Tracking sections, and that he can open it from his Muse Library/sidebar to review it. Then remove or disable this scheduled job (id `zyra-agent-v2-whatsapp-notify`) so it does not run again.
- If the edit failed or was cancelled, send one short message in Egyptian Arabic saying the expansion did not finish and that the details are in the main chat, then remove or disable this scheduled job (id `zyra-agent-v2-whatsapp-notify`) so it does not run again.
