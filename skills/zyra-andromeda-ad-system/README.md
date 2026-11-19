# ZYRA Andromeda Skill-Driven Agent Architecture (Portable Package v2.2)

حزمة مهارة متكاملة وقابلة للنقل للعمل مع أي نموذج ذكاء اصطناعي (Claude, ChatGPT, Gemini, Cursor, Antigravity) لتشغيل نظام التسويق والكرييتف واقتصاديات الـ COD لبراند **Zyra Care** بدورة **`ZYRA THINK → ACT → CRITIQUE → VALIDATE`**.

## هيكل الملفات (Folder Structure)

```text
zyra-andromeda-ad-system/
├── README.md                                       # دليل التركيب والاستخدام لأي موديل
├── SKILL.md                                        # الموجّه الرئيسي + دورة الـ 8 مراحل + التوجيه التلقائي
├── references/
│   ├── 01-meta-and-domino-frameworks.md            # هندسة Andromeda 2.0 / GEM / GenRecs + الدومينو + CIS
│   ├── 02-static-video-organic-playbooks.md        # Static Ads 2027 + Trust Content (4 C's, 70/20/10, 75/20/5) + علم النفس
│   └── 03-financial-diagnostics-compliance.md      # اقتصاديات COD ومنع Double Counting + تشخيص Funnel + الامتثال
└── scripts/
    ├── cod_cohort_calc.py                          # حاسبة الـ Cohort واقتصاديات الـ COD وتحليل الحساسية
    └── validate_zyra_output.py                     # المدقق البرمجي المستقل للامتثال الطبي وسياسات Meta
```

## طريقة الاستخدام مع أي موديل آخر

1. **في Claude Code / Cursor / Windsurf / Agent Frameworks:** ضع مجلد `zyra-andromeda-ad-system/` داخل مجلد `.skills/` أو `skills/` في مشروعك، وسيتعرف الوكيل تلقائياً على `SKILL.md` ويستدعي ملفات `references/` والـ `scripts/` حسب المهمة.
2. **في Claude Projects أو ChatGPT Custom GPTs:** ارفع `SKILL.md` في التعليمات الأساسية (System Instructions) وارفع الملفات الثلاثة في `references/` كـ Knowledge Base، واطلب من الموديل اتباع دورة الـ 8 مراحل (`UNDERSTAND → RETRIEVE → PLAN → EXECUTE → CRITIQUE → VALIDATE → REVISE → DELIVER & LEARN`).
3. **تشغيل المدقق المالي ومدقق الامتثال برمجياً:**
   - فحص إعلان: `python3 scripts/validate_zyra_output.py --text "<نص الإعلان>" --retinol`
   - حساب Cohort مالي: `python3 scripts/cod_cohort_calc.py --placed 100 --cancelled 10 --rto 18 --spend 16000 --rev 850`
