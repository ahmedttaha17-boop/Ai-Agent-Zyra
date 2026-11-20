---
id: zyra-system-backup-daily
title: ZYRA System Backup — باك اب يومي على GitHub
enabled: true
owner: goal:zyra-care-relaunch-and-marketing-intelligence-agent
mode: task
schedule:
  kind: daily
  timezone: Africa/Cairo
  time: 04:52:09
delivery:
  - chat_id: 99a20216-39ad-4d27-ab4f-adc02b030d68
metadata:
  tags: [cron:timing-window:3600s]
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3AA7860D39CFD1A00CBA","conversation_id":"whatsapp_channel","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
مهمة النسخ الاحتياطي اليومي لسستم زيرا: حدّث نسخة الباك اب وارفعها على GitHub الخاص (repo: Ai-Agent-Zyra عند ahmedttaha17-boop) باتباع نفس إجراء أول باك اب بتاريخ 2026-11-20:

1. حدّث شجرة التجميع ~/workspace/zyra-system-repo من المصادر الحية (نصوص فقط — بدون ثنائيات: صور، زيب، خطوط، app.db نفسه، node_modules، dist): ملفات الوكيل والذاكرة (~/AGENTS.md و~/MEMORY.md و~/USER.md و~/IDENTITY.md و~/SOUL.md و~/TOOLS.md و~/memory/**)، ملفات شغل زيرا (~/workspace/zyra-marketing-intelligence-agent/ و~/workspace/zyra-competitors/)، السكيلز الستة من ~/workspace/custom-skills/، مستندات كونكتور ميتا (من غير أسرار)، تعريفات الكرونز وملفات الهدف من ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/ و~/workspace/cron.d/، سورس المساحة لو اتغير، وتفريغ SQL جديد لقاعدة بيانات المساحة الحية في data/app-db.sql، وأي صادرات نصية جديدة في exports/ (زي ملف المنهج HTML وأي نسخة PDF جاهزة كمستند نصي الوصف).
2. حدّث تاريخ README.md ومحتوياته لو في جديد.
3. فحص أسرار إلزامي على الشجرة كلها قبل أي رفع (أنماط: token، api_key، password=، secret، Bearer، ghp_، sk-، EAAB). لو لقيت سرًا حقيقيًا: وقف الرفع فورًا وابعت للمالك على واتساب اسم الملف ونوع النمط فقط (من غير قيمة السر أبدًا).
4. ارفع كل الملفات الجديدة والمتغيرة للريبو عبر كونكتور GitHub برسالة كوميت مؤرخة «باك اب يومي — YYYY-MM-DD»، وتأكد بقراءة شجرة الريبو بعد الرفع ومطابقة 3 ملفات عينة (MEMORY.md ومكتبة الصيغ وapp-db.sql).
5. سجّل نتيجة الجولة في سجل نشاط المساحة (logactivity). النجاح صامت (من غير رسالة للمالك)؛ الفشل أو توقف الرفع بسبب فحص الأسرار = رسالة واتساب قصيرة للمالك بالمشكلة والخطوة المطلوبة منه. ممنوع منعًا باتًا: نشر أي شيء علنًا، تغيير الريبو من Private، أو رفع أي سر.
