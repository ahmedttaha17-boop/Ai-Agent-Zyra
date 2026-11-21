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
  originating_chat_context_json: '{"chat_id":"99a20216-39ad-4d27-ab4f-adc02b030d68","binding_epoch":1,"origin_provider":"whatsapp","original_reply_target_id":"whatsapp_channel","chat_kind":"direct","message_id":"3AB8B0BA0EDBF0186533","conversation_id":"whatsapp_channel","provider":"whatsapp","delivery_target_id":"whatsapp_channel","event_kind":"message","require_mention":false}'
  presentation_locale: en-US
---
مهمة النسخ الاحتياطي اليومي لسستم زيرا: حدّث نسخة الباك اب وارفعها على GitHub الخاص (repo: Ai-Agent-Zyra عند ahmedttaha17-boop) — **طريق الرفع اتغيّر بتاريخ 2026-11-20: بقى Git مباشر عبر SSH** (المفتاح مضاف على حساب المالك ومتحقق منه) بدل كونكتور GitHub النصي، فالباك اب دلوقتي شامل الثنائيات كمان.

بيئة الرفع (ثابتة ومتجربة): الكلون الدائم في ~/workspace/zyra-git. أي عملية Git شبكية لازم تتنفذ بـ GIT_SSH_COMMAND="ssh -F /home/hatch/.ssh/config" (الكونفيج ده فيه تحويل github.com لـ ssh.github.com:443 عبر نفق البروكسي ومسار المفتاح الصريح — بدونه الـ SSH بيقع لأن الجلسة شغالة كـ root وبيتها /root). ممنوع منعًا باتًا طباعة أو حفظ أي سر (كلمة سر البروكسي بتتقرا من البيئة تلقائيًا بواسطة سكربت النفق).

الخطوات:
1. حدّث شجرة التجميع ~/workspace/zyra-system-repo من المصادر الحية (نصوص): ملفات الوكيل والذاكرة (~/AGENTS.md و~/MEMORY.md و~/USER.md و~/IDENTITY.md و~/SOUL.md و~/TOOLS.md و~/memory/**)، ملفات شغل زيرا (~/workspace/zyra-marketing-intelligence-agent/ و~/workspace/zyra-competitors/)، السكيلز الستة من ~/workspace/custom-skills/، مستندات كونكتور ميتا (من غير أسرار)، تعريفات الكرونز وملفات الهدف من ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/ و~/workspace/cron.d/، سورس المساحة لو اتغير، وتفريغ SQL جديد لقاعدة بيانات المساحة الحية في data/app-db.sql، وأي صادرات جديدة في exports/.
2. زامِن الكلون ~/workspace/zyra-git: الأول git pull --rebase (بنفس GIT_SSH_COMMAND)، وبعدين انسخ شجرة التجميع لمساراتها في الكلون زي ما هي مرسومة، وحدّث الثنائيات في أماكنها المتفق عليها: مساحة شغل زيرا كاملة بثنائياتها في workfiles/zyra-marketing-intelligence-agent/ (تصاميم منتجة وخطوط وأصول في أماكنها الطبيعية)، مجلدات مراجعة التصاميم ~/workspace/zyra-design-review{,-v2,-v3} ← binaries/design-review/{v1,v2,v3}، لقطات تدقيق المساحة من ~/workspace/ts-spaces/zyra-marketing-intelligence-agent/audits/ ← binaries/space-audits/، قاعدة البيانات الحية app.db ← binaries/db/app.db، الشعار ← binaries/logo/logo_2.png، وأحدث PDF منهج لو اتبنى ← binaries/curriculum-pdf/. استثنِ دائمًا: __pycache__ و*.pyc وnode_modules وdist.
3. حدّث تاريخ README.md ومحتوياته لو في جديد (قسم الثنائيات بقى «مُضمَّنة عبر Git مباشر» — حافظ على صياغته الحالية وحدّث الأرقام/التواريخ بس).
4. فحص أسرار إلزامي على شجرة الكلون كلها (من غير .git) قبل أي كوميت (أنماط: token، api_key، password=، secret، Bearer، ghp_، sk-، EAAB). لو لقيت سرًا حقيقيًا: وقف فورًا وابعت للمالك على واتساب اسم الملف ونوع النمط فقط (من غير قيمة السر أبدًا).
5. git add -A (بيشمل الحذف — الملفات الميتة بتتشال من الريبو صح دلوقتي) وكوميت «باك اب يومي — YYYY-MM-DD» وادفع (push) بنفس GIT_SSH_COMMAND. اتأكد بعد الدفع: git ls-remote origin main يطابق HEAD المحلي + مطابقة عينتين (ملف نصي زي agent/MEMORY.md وملف ثنائي زي binaries/db/app.db بالحجم أو الهاش). لو الـ SSH فشل بالمصادقة: دي مشكلة طريق الرفع — ابعت للمالك على واتساب إن الرفع المباشر واقف (المفتاح ممكن يكون اتشال) وإن الباك اب المحلي جاهز.
6. سجّل نتيجة الجولة في سجل نشاط المساحة (logactivity). النجاح صامت (من غير رسالة للمالك)؛ الفشل أو توقف فحص الأسرار أو فشل الـ SSH = رسالة واتساب قصيرة للمالك بالمشكلة والخطوة المطلوبة منه. ممنوع منعًا باتًا: نشر أي شيء علنًا، تغيير الريبو من Private، أو رفع أي سر.
