---
id: zyra-meta-feed-retry
title: ZYRA Meta Feed Retry — محاولة ربط ميتا يومياً
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: daily
  timezone: '@user.current'
  time: 08:44:46
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3A9CA57EE84DBAFC0AEC","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
Daily retry of the Meta Marketing API connection for ZYRA. Run the helper: `python3 ~/workspace/custom-connectors/custom.meta-marketing-api/bin/meta_api.py me` (then `adaccounts` if me succeeds). Known state: authenticated calls have been refused at Muse's egress layer with a generic proxy 4xx HTML page before reaching Meta; the ads_read token is stored in the secure connection and has never been judged. If the call STILL returns the generic proxy 4xx: write one line in today's daily memory noting the retry failed the same way, and send NO message to the user. If it SUCCEEDS (real JSON from Meta): (1) list ad accounts and identify the account named "Main"; (2) in the ZYRA space (slug zyra-marketing-intelligence-agent) record a market observation + logactivity noting Meta is connected with the account name/id; (3) message Ahmed immediately in the main delivery chat: Meta connected, account identified, and that performance pulling starts fresh from relaunch as baseline per his data policy. Never print or store the token anywhere.
