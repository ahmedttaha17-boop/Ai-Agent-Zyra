---
id: zyra-website-daily-read
enabled: true
owner: space:zyra-marketing-intelligence-agent
execution:
  kind: space_action
  slug: zyra-marketing-intelligence-agent
  action: importWebsiteData
  args: {}
mode: task
schedule:
  kind: daily
  timezone: '@user.current'
  time: 07:30:00
metadata:
  originating_chat_context_json: '{"chat_id":"12fba91a-c61b-433e-83f4-b54fc3da4a81","origin_provider":"main","chat_kind":"direct","event_kind":"message","require_mention":false,"device_id":"16083b90-c37f-48c7-8766-b8e39169fb87"}'
  presentation_locale: ar-AR
---
Invoke the web artifact's published scheduled action and retain its run history.
