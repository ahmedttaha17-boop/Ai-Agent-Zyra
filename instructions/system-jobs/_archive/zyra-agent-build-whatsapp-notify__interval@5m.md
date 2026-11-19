---
id: zyra-agent-build-whatsapp-notify
title: ZYRA Agent build finished — WhatsApp notify
enabled: true
owner: space:zyra-marketing-intelligence-agent
mode: task
schedule:
  kind: interval
  timezone: Africa/Cairo
  at: 2026-11-18T21:30:11
  every: 5m
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:automatic-interval-anchor]
  originating_chat_context_json: '{"chat_id":"12fba91a-c61b-433e-83f4-b54fc3da4a81","origin_provider":"main","chat_kind":"direct","event_kind":"message","require_mention":false,"device_id":"cf91a682-bfeb-4806-baf8-5bbad3d70fef"}'
  presentation_locale: en-GB
---
Check the build status of the web artifact with slug `zyra-marketing-intelligence-agent` (ZYRA Marketing Intelligence Agent).

- If a build is still running for it, end this run without sending any message to the user.
- If the build has finished successfully, send one short message in Egyptian Arabic telling Ahmed that the ZYRA Marketing Intelligence Agent space is ready, that he can open it from his Muse Library/sidebar to review it, and briefly name what it includes: Command Center, Work Queue, COD Calculator, Creative Validator, Approvals and Learning Log. Then remove this scheduled job (id `zyra-agent-build-whatsapp-notify`) so it does not run again.
- If the build failed or was cancelled, send one short message in Egyptian Arabic saying the build did not finish and that the details are in the main chat, then remove this scheduled job (id `zyra-agent-build-whatsapp-notify`) so it does not run again.
