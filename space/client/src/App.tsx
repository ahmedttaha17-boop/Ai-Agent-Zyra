import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SafeAreaTopScrim } from "@hatch/space-sdk/client";
import { actionFields } from "@hatch/space-sdk/fields" with { type: "macro" };
import { api } from "./api";
import zyraLogo from "./assets/zyra-logo.png";
import type { Actions } from "../../server/src/actions";

const FIELDS = actionFields<typeof Actions>();

const STAGES = ["UNDERSTAND","RETRIEVE","PLAN","EXECUTE","CRITIQUE","VALIDATE","REVISE","DELIVER & LEARN"];
const TASK_TYPES: Record<string,string> = { A:"A — Daily Static Production", B:"B — Weekly Flywheel Review", C:"C — Monthly/Quarterly Strategy Review", D:"D — Kill / Pause / Scale Decision", E:"E — New Product Cold Start", F:"F — AEO Compliance Audit", G:"G — Competitive Intelligence Brief" };
const STATUSES = ["New","Investigating","Ready for Review","Approved","Rejected","Deferred","Executing","Completed","Failed","Outcome Review"];
const EVIDENCE = ["VERIFIED","ZYRA PROVEN","HYPOTHESIS","ESTIMATED","UNKNOWN","OUTDATED"];
const ROLES = ["Media Buyer","Creative","Content","Analyst","Owner"];
const ANGLES = ["Problem-Based","Benefit/Mechanism","Emotional","Social Proof","Objection-Smashing","Offer/Value"];
const STATIC_FORMATS = ["IG Story Q&A Box (STAT-15)","Native IG Story","Us vs. Them (STAT-17)","Call-Out Arrows (STAT-18)","Post-It Note","Whiteboard (STAT-19)","Highlighted Customer Review","Founder/Doctor Honest Note","Before/After Experience","Body Writing","Press Snippet","Statistics Proof","Multi-SKU Collage","Classic Headline + Offer Bar + Benefit CTA"];
const VIDEO_FORMATS = ["UGC Testimonial","Founder Direct-to-Camera","Problem/Solution Demo","Unboxing / First Use","Before-After Routine","Myth-Busting","Routine / How-To","Offer / COD Explainer"];
const PIPELINE = ["دراسة المنافسين (Website + Meta Library + TikTok Library)","تحقق السوق والمنتج (Validation Triad)","استخراج الزوايا والهوكات","إنتاج الكرييتيف + فحص Validator","بناء وهيكلة الحملة (3:2:2 / Tiers)","الإطلاق كقرار معتمد من المالك","متابعة الأداء + تشخيص Funnel","قرار KILL / ITERATE / SCALE (Task D)","تسجيل النتيجة والتعلم"];
const META_RULES = [
  { t:"1. No Hallucination", d:"ممنوع اختراع أرقام أو اقتباسات عملاء أو بيانات منافسين أو دراسات. الناقص يُقال صراحة: DATA NOT PROVIDED / SOURCE REQUIRED، مع Confidence معلن." },
  { t:"2. COD Math is Law", d:"‏GPT < 0 ⇒ ممنوع التوصية بالإطلاق نهائياً. ‏GPT < 15% من AOV ⇒ ممنوع الـ SCALE (KEEP أو ITERATE فقط). لا حدس إبداعي يلغي اقتصاديات الوحدة." },
  { t:"3. Payday is Law", d:"في وضع DO NOT SCALE ممنوع زيادة ميزانية أو توسعة جمهور — حتى «زيادة صغيرة للاختبار». في CAUTION: ‏Scale بحد أقصى +10% مع تنبيه RTO جاهز ومعايير قتل معلنة." },
  { t:"4. One Task Per Session", d:"مهمة واحدة A–G في كل جلسة عمل وتُنفذ كاملة بدورة الـ 8 مراحل — تعدد المهام في مخرج واحد يفسد الجودة." },
  { t:"5. Egyptian Arabic Default", d:"كل كوبي عميل بالعامية المصرية (مش فصحى ومش إنجليزي): «يا» و«بت» للمؤنث طبيعية، نبرة صديقة صريحة، أرقام غربية، والعملة «جنيه» في الكوبي." },
  { t:"6. No Vagueness", d:"كل توصية: محددة (من X إلى Y) + قابلة للقياس (هدف رقمي) + قابلة للتنفيذ (بميعاد) + موثقة (بقاعدة/فريمورك). «حسّن الهوك» ليست توصية." },
  { t:"7. Transparency on Limitations", d:"النظام أداة دعم قرار: لا وصول حي لبيانات منصات الإعلانات ولا Bosta ولا محادثات واتساب ولا مخزون لحظي. أي قرار يحتاج بيانات غائبة يُعلن غيابها ولا يُخمّن." },
  { t:"8. Chain of Reasoning", d:"كل توصية بسلسلة منطق ظاهرة: لأن [بيانات X] ← حسب [قاعدة/فريمورك] ← إذن [توصية Y]. تعارض الفريموركس يُعرض ويُحسم بالـ Priority Hierarchy علناً." },
  { t:"9. No Creative Death Without Funeral", d:"كل KILL يوثق: أنجل + هوك + سبب القتل بالمقياس والعتبة + التاريخ + إعادة توجيه الميزانية المحررة + حظر إعادة الاستخدام 90 يوماً في Dead Angle Graveyard." },
  { t:"10. Version Awareness", d:"النظام لا يعدّل نفسه: أي تغيير قاعدة يُعرض كـ PROPOSED CHANGE (الحالية/المقترحة/الأثر) ولا يسري إلا باعتماد المالك الصريح." },
];
const AEO_POINTS = [
  { n:1, t:"No medical claims", d:"ممنوع «يعالج/يشفي/يقضي على» وأي لغة علاجية — الوصف تجميلي/مظهري فقط." },
  { n:2, t:"No before/after implying medical transformation", d:"ممنوع قبل/بعد يوحي بتحول طبي أو نتيجة جسدية مضمونة." },
  { n:3, t:"Disclaimer present if efficacy language used", d:"أي لغة فعالية تستلزم إخلاء مسؤولية/تحذير مناسب (الريتينول: الحمل والرضاعة إلزامي)." },
  { n:4, t:"No comparison to specific brands by name", d:"المقارنة بالفئة مسموحة («بديل أرخص من سيروم أجنبي») — تسمية براند منافس ممنوعة." },
  { n:5, t:"No guarantee language", d:"ممنوع «مضمون/نتيجة أكيدة» — الصياغة: designed to / formulated for / بيحسّن المظهر مع الانتظام." },
  { n:6, t:"No unverified statistics", d:"أي نسبة/رقم نتيجة («97% لاحظوا فرق») يحتاج مصدر موثق وإلا يُحذف أو يُوسم SOURCE REQUIRED." },
];
const EGYPT_RULES = [
  { t:"Payday Cycle (Appendix D)", d:"المرتبات 25–1: أيام 1–5 سيولة عالية (أفضل أيام الإنفاق)، 6–14 عادي، 15–24 سيولة منخفضة (ممنوع زيادة ميزانية >10% وأفضل قتل للمقصرين 5–10 بعد نظافة بيانات ما بعد المرتب)، 25–31 أسبوع مرتب بحذر. أفضل إطلاق كرييتيف جديد: 25–28. ⚠️ ملحوظة: شريط النظام يطبق قراءة PART 7 الأشد حذراً (حظر SCALE من 25 لـ 5) — اختلاف جزئي بين المصدرين، والحسم قرار مالك." },
  { t:"COD Culture", d:"الدفع عند الاستلام هو الأساسي مش بديل — العميلة المصرية لا تثق في الكارت خصوصاً في الجمال. تأكيد واتساب إلزامي قبل الشحن (اسم/عنوان/تليفون/منتج/سعر + رقم طلب وميعاد تسليم متوقع). «غيّرت رأيي» هو سبب الرفض الأول — التأكيد بيقلله. RTO طبيعي 10–15%، وأعلى من 20% = مشكلة." },
  { t:"WhatsApp Culture", d:"التواصل حوار شخصي سريع — تأكيد خلال دقائق من الطلب، ومتابعة استباقية عند أي تأخير شحن. ممنوع ردود آلية باردة أو «تم خاص»." },
  { t:"Language & Tone", d:"عامية مصرية فقط في كوبي العميل: «إيه» مش «ما»، «حاجة» مش «شيء»، «مفيش» مش «لا يوجد»، «بص» مش «انظر». أرقام غربية (0-9) والعملة «جنيه» في الكوبي." },
  { t:"Seasonality", d:"شتاء (نوفمبر–فبراير): جفاف — يوريا وشيا وترطيب عميق طلب عالٍ. صيف (يونيو–أغسطس): خفيف/خالي زيت. موسم أفراح (أكتوبر–يناير): زاوية روتين العروسة. رمضان: روتين ليلي أثناء الصيام. العيدان: هدايا — الإطلاق قبل العيد بـ 30 يوم. عودة مدارس (سبتمبر): جمهور 18–25 ونقطة سعر أقل." },
  { t:"Delivery Realities", d:"الويبسايت يعلن شحن خلال 3–5 أيام عمل لكل المحافظات — لا توعّد أبداً بتسليم تاني يوم خارج القاهرة، وأي زمن توصيل يُقاس من بيانات التشغيل الفعلية لا من جداول عامة." },
  { t:"Pricing Psychology", d:"العميلة بتقارن وبتحسب: مرجع Appendix D أن روتين ZYRA عند 799 يقابل بدائل أجنبية 1200+ — المقارنة بالفئة والروتين الكامل (أوفر من شراء كل منتج لوحده) هي زاوية القيمة، مع شحن مجاني من 1000 EGP كحافز سلة." },
];
const DECISION_RULES = [
  { t:"Kill / Scale Thresholds (Task D)", src:"Master Prompt v2.0 — PART 7 + Task D", d:"‏GPT<0 ⇒ KILL فوري · ‏GPT<15% AOV ⇒ DO NOT SCALE · ‏CTR <50% من متوسط الحساب بعد 3 أيام ⇒ KILL · ‏<70% بعد 7 أيام ⇒ ITERATE · ‏>120% بعد 7 أيام ⇒ SCALE candidate (+20% تدريجي عبر Approvals) · ممنوع قتل إعلان جديد قبل 48–72 ساعة (Day Trade Trap).", st:"Active" },
  { t:"Freshness Limits", src:"Master Prompt v2.0 — Task D Step 5", d:"تجاوز عمر الكرييتيف: Tier 1 ‏>14 يوم · Tier 2 ‏>21 يوم · Tier 3 ‏>7 أيام = STALE — التجديد قبل أي زيادة ميزانية.", st:"Active" },
  { t:"Cold Start Protocol (PART 4)", src:"Master Prompt v2.0 — PART 4", d:"يسري عندما: منتج <14 يوم أو <50 طلب أو بلا مقاييس. كل GPT تقديري [EST] · ممنوع 75/20/5 — استخدم 100% Exploration · هيكلة 3×2×3 بدل 3:2:2 · عتبة قتل أرحم (7 أيام مش 3) · بوابة AEO أشد (ادعاءات جديدة = مخاطرة أعلى) · قواعد Payday تسري بلا استثناء. بعد يوم 14 أو 50 طلب: Task D على الكل، ترقية أفضل 2 لـ Proven، قتل الباقي، إزالة [EST] والانتقال للمعيار القياسي.", st:"Active — يسري على منتجات الـ Relaunch الآن" },
  { t:"Similarity Penalty + Cold Start Score", src:"Andromeda v2.2", d:"إعلانات جديدة تبدأ Score = 0 وتُعاقب التنويعات المتطابقة — التنويع الحقيقي في الزاوية/الهوك/الفورمات شرط، و4-Question Similarity Audit قبل الإطلاق.", st:"Active" },
  { t:"حد إنفاق 2× Target CPP — إشارة قتل/مراجعة", src:"مرجع استشاري — كورس إطلاق الإعلانات بالـ AI (ai.html)", d:"لو كرييتيف صرف ضعف الـ CPP المستهدف من غير إشارة تحويل كافية، دي إشارة قتل/مراجعة إضافية. تكتيكات تشغيل مرافقة من نفس المصدر: صيغ Flex وPage Posts. ⚠️ قاعدة استشارية فقط: خاضعة لبوابات GPT وTask D — عند أي تعارض تتغلب أطر المالك (COD Math أولاً).", st:"Advisory — لا تلغي Task D" },
];
const BRAND_RULES = [
  { t:"الهوية البصرية", d:"Deep Teal ‏#013835 + Warm Ivory ‏#FFF2E9 + Terracotta ‏#E2915A (من مصدر البراند في ملفات النظام) · خطوط Alexandria للعناوين وTajawal للنصوص · تصوير نظيف فاخر بتنوع درجات بشرة مصرية حقيقية." },
  { t:"الصوت", d:"دافئ، مباشر، مصري-نسائي، صريح بلا مبالغة: «بنقولك المتوقع بالظبط وإمتى المنتج مش مناسب ليكي» (صوت الويبسايت نفسه). ممنوع كلام شركات أو بيع عدواني." },
  { t:"CTA", d:"بالعامية المصرية، مباشر، بلا صيغة مبني للمجهول: «اطلبي وادفعي عند الاستلام»." },
  { t:"اتجاه النص", d:"كل نص عربي RTL كامل — ممنوع خلط LTR/RTL في سطر واحد في التصميم." },
  { t:"Naming", d:"CIS Tag: ‏ZYRA_[Product]_[Angle]_[Hook]_[Format]_[Talent]_[Lever]_V[#] — وصيغة Master Prompt البديلة {PRODUCT}_{RING}_{FORMAT}_{VARIANT}_{DATE} موسومة في التعارضات ضمن مكتبة الفريموركس.", },
];
const CLAIMS = {
  banned: ["يعالج / علاج / يشفي", "نهائي / نهائياً", "يقضي على السيلوليت أو يزيله", "تخسيس / تنحيف", "مضمون 100% / نتيجة مضمونة", "أي نسبة نتائج بلا مصدر (97% لاحظوا…)", "تسمية براند منافس في مقارنة", "وعود تسليم تاني يوم خارج القاهرة"],
  approved: ["بيحسّن ملمس ومظهر الجلد مع الانتظام", "نعومة وترطيب من أول أسبوع", "تحسّن تدريجي في مظهر السطح خلال 4–8 أسابيع", "مصمم لـ / معمول عشان (designed to / formulated for)", "أوفر من شراء كل منتج لوحده (للروتينات)", "الدفع عند الاستلام + شحن مجاني من 1000 جنيه"],
};
const CONFLICTS = [
  { t:"تعريف 3:2:2", a:"Master Prompt v2.0: ‏3 Ad Sets × 2 Audiences × 2 Creatives", b:"Andromeda v2.2: ‏3 Visuals × 2 Primary Texts × 2 Headlines = 12 تركيبة", note:"النظام يعرض التعريفين موسومين بالمصدر. باني الهيكلة في Media Buyer يستخدم تعريف Andromeda v2.2 (12 تركيبة) لأنه التعريف التشغيلي الأحدث — قرار المالك مطلوب للحسم النهائي." },
  { t:"معنى 75/20/5", a:"Master Prompt v2.0: ‏Creative Mix", b:"Andromeda v2.2: ‏Topic Depth (75% حل مشاكل عميق / 20% مجاور / 5% إنساني)", note:"قسم Content يتتبع 75/20/5 كـ Topic Depth و70/20/10 كـ Innovation منفصلين تماماً. الحسم النهائي قرار مالك." },
  { t:"حالة 4PI+2", a:"Master Prompt v2.0: ‏Product Lifecycle معرّف بمراحل", b:"Andromeda v2.2: ‏UNVERIFIED FRAMEWORK DEFINITION", note:"يُعرض كموسوم تعارض — لا تُبنى عليه قواعد Scaling آلية حتى قرار المالك." },
  { t:"عدد نقاط AEO", a:"Master Prompt: ‏6 نقاط أساسية", b:"Appendix C: ‏تطورت إلى 10 نقاط", note:"الـ Validator الحالي يطبق الفحوصات الحتمية الموثقة في سكربت v2.2. توسيع البوابة لـ 10 نقاط يحتاج اعتماد المالك لقائمة النقاط النهائية." },
];
const FRAMEWORKS = [
  { title:"3:2:2 (Andromeda v2.2)", body:"3 Visuals × 2 Primary Texts × 2 Headlines = 12 تركيبة. الـ Visuals من نفس الفورمات، وPrimary Text = Hook سطرين + سياق 150–200 كلمة. ⚠️ يوجد تعريف مختلف في Master Prompt — شوف التعارضات." },
  { title:"5 Olympic Rings", body:"5 أدوار إقناع: 3 Hello + 2 Close لعرض Hero واحد. أدوار في رحلة العميل — مش تسلسل إلزامي. نظرياً 5×12 = 60 تركيبة." },
  { title:"70/20/10 ≠ 75/20/5", body:"70/20/10 = ابتكار ومخاطرة (70% مثبت / 20% متغير واحد / 10% جريء). 75/20/5 = عمق مواضيع في Andromeda وCreative Mix في Master Prompt — تعارض موسوم، وممنوع تحويل أيٍّ منهما لنسب ميزانية." },
  { title:"6 Master Angles", body:"Problem-Based · Benefit/Mechanism · Emotional · Social Proof · Objection-Smashing · Offer/Value. ‏5 Hooks على نفس السكربت = زاوية واحدة بـ5 تنويعات." },
  { title:"CIS Tagging", body:"ZYRA_[Product]_[Angle]_[Hook]_[Format]_[Talent]_[Lever]_V[#] — Hook → Hook Rate · Format & Talent → Hold Rate & Outbound CTR · Angle & Lever → CVR, CPP, AOV, Win Rate" },
  { title:"The 4 C's — Content Intro", body:"Call Out → Contextual Credibility → Compass → Core Learning. Time-to-Value أقل من 60 ثانية." },
  { title:"Rule of One + Domino Tiers", body:"كل إعلان: 1 Emotional Need + 1 Life Moment + 1 Resolved Objection + 1 Proof. ‏CBO: أقل من 35 طلب/أسبوع = Tier 1 · ‏35–70 = Tier 2 · أكثر من 70 = Tier 3. ‏Attribution: 7-day click، استبعاد Audience Network." },
  { title:"Andromeda 2.0 Guardrails", body:"Creative Similarity Penalty على التنويعات المتكررة. الإعلانات الجديدة تبدأ Score = 0 — ممنوع قتل إعلان جديد في أول 48–72 ساعة (Day Trade Trap)." },
  { title:"7-Stage Flywheel", body:"Research → Strategy → Written Brief → Production → 5-Question Creative Q&A → Testing & Analysis → Learning & Dual Scaling" },
  { title:"Sequential Diagnosis", body:"Outbound Click → LPV → ATC → IC → Placed → Confirmed → Delivered. حكم من 7 حقول. Hook وCTR عاليان ليسا دليلاً قاطعاً على جودة الجمهور." },
];
const EMERGENCY = [
  { t:"أزمة COD / انهيار التسليم", d:"أوقف أي SCALE فوراً، راجع WhatsApp Confirmation % وDelivery % من المدخلات الأساسية، شخّص RTO حسب المنطقة، واعرض خطة على المالك قبل أي تغيير ميزانية." },
  { t:"تعليق حساب إعلاني", d:"لا تحاول الالتفاف. وثّق سبب التعليق، راجع الـ Validator على آخر كرييتيف، وجهّز ملف الاستئناف — التنفيذ الخارجي بموافقة المالك فقط." },
  { t:"نفاد مخزون منتج Hero", d:"علّم المنتج في المدخلات الأساسية، أوقف مقترحات SCALE الخاصة به عبر Approvals، وحوّل الميزانية المقترحة لمنتج بديل موثق فقط بعد اعتماد." },
  { t:"حرب أسعار منافسين", d:"سجّل ملاحظة سوق بمصدر وتاريخ من Ads Library/الويبسايت، لا ترد بسعر أو خصم بدون طلب اعتماد Discount صريح من المالك." },
];
const METRICS_GLOSSARY = [["Hook Rate","مشاهدات 3 ثواني ÷ Impressions — يقيس قوة الـ Hook (CIS: Hook)"],["Hold Rate","مشاهدات 50%+ ÷ مشاهدات — يقيس الـ Body والفورمات والموهبة"],["Outbound CTR","نقرات خارجية ÷ Impressions"],["CPM","تكلفة 1000 ظهور"],["Placed CPP","إجمالي الإنفاق ÷ الطلبات الموضوعة"],["Delivered CPP","إجمالي الإنفاق ÷ الطلبات المُسلّمة — لنفس الـ Cohort والفترة فقط"],["GPT","Gross Profit per Transaction بعد كل تكاليف الـ COD — Priority 1"],["Net COD Rate","WhatsApp Confirmation % × Delivery %"],["NDR","Delivered ÷ Placed لنفس الـ Cohort"]];
const SEASONALITY = ["رمضان والعيد: طلب مرتفع على روتينات العناية — جهّز كرييتيف قبل الموسم بـ 30 يوم (Seasonal launch −30d)","الصيف: مشاكل العرق والتصبغات والشمس في المقدمة","الشتاء: الجفاف والترطيب العميق","موسم الأفراح: روتينات تجهيز العروسة","Payday شهرياً: ذروة 25–5 وانخفاض حذر 15–24"];

type Tab = "thinking"|"command"|"relaunch"|"campaigns"|"content"|"organic"|"market"|"ops"|"finance"|"ask"|"system";
const TABS: {id:Tab,label:string,en:string}[] = [
  { id:"thinking", label:"تفكير زيرا وقراراتنا", en:"Zyra Thinking & Decisions" },
  { id:"command", label:"لوحة القيادة", en:"Dashboard" },
  { id:"relaunch", label:"الريلونش", en:"Relaunch" },
  { id:"campaigns", label:"الحملات والميديا باير", en:"Campaigns & Media Buyer" },
  { id:"content", label:"المحتوى والكرييتف", en:"Content & Creative" },
  { id:"organic", label:"الأورجانيك", en:"Organic — Social Media" },
  { id:"market", label:"السوق والمنافسين", en:"Market & Competitors" },
  { id:"ops", label:"التشغيل والتعلّم", en:"Operations & Learning" },
  { id:"finance", label:"المالية والتدقيق", en:"Finance & Audit" },
  { id:"ask", label:"اسأل زيرا", en:"Ask Zyra" },
  { id:"system", label:"النظام والإعدادات", en:"System & Settings" },
];

function paydayInfo() {
  const day = new Date().getDate();
  if (day >= 25 || day <= 5) return { state:"PAYDAY" as const, label:"Payday Peak (25–5) — SCALE BLOCKED", day };
  if (day >= 15) return { state:"CAUTION" as const, label:"Pre-Payday Dip (15–24) — CAUTION", day };
  return { state:"SCALE_OK" as const, label:"SCALE OK", day };
}
function freshness(iso?: string | null): { icon: string; label: string; stale: boolean } {
  if (!iso) return { icon:"⚪", label:"لا بيانات", stale:true };
  const hrs = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (hrs < 1) return { icon:"🟢", label:"حديثة (< ساعة)", stale:false };
  if (hrs <= 6) return { icon:"🟡", label:"متوسطة الحداثة (1–6 ساعات)", stale:false };
  if (hrs <= 24) return { icon:"🔴", label:"قديمة (> 6 ساعات)", stale:false };
  return { icon:"🔴", label:"⚠️ تجاوزت 24 ساعة — حدّث قبل أي قرار", stale:true };
}
const GOVERNANCE = "AI يفسّر — الكود يحسب. AI يقترح — الإنسان يقرر. الكود يفرض — AI لا يتجاوز.";
const GROWTH_STAGES = [
  { n:1, t:"تأسيس وفهم", d:"مدخلات موثقة وكل ادعاء موسوم: VERIFIED / ZYRA PROVEN / HYPOTHESIS / ESTIMATED / UNKNOWN — بلا وسم = بلا وزن.", go:"system" as Tab },
  { n:2, t:"أوديت 8 ركائز", d:"تدقيق شامل (بريف/أداء/حساب/منتجات/CRO/سوشيال/عمليات/احتفاظ) قبل أي صرف جديد.", go:"finance" as Tab },
  { n:3, t:"نفسية عميل وهندسة عروض وكرييتيف", d:"5 Whys و7Ws وRule of One وهندسة عرض — كرييتيف مبني على نفسية العميلة لا على ذوق.", go:"content" as Tab },
  { n:4, t:"إنتاج وصفحة هبوط", d:"إنتاج الأصول وScent Match كامل مع صفحة الهبوط 1:1.", go:"content" as Tab },
  { n:5, t:"فحص ما قبل الإطلاق وتستينج منظم", d:"AEO + COD + Payday + هيكلة اختبار بمتغير واحد وقواعد قتل معلنة مسبقاً.", go:"campaigns" as Tab },
  { n:6, t:"نقد وفحص حتمي", d:"Validator وTask D وأدوات حتمية — الكود يحسب والـ AI يفسّر فقط.", go:"campaigns" as Tab },
  { n:7, t:"تدقيق مغلق وسكيل وتعلم", d:"حلقة مغلقة: Outcome Review ← تعلم موثق ← Scale مشروط بالبوابات أو قتل مدفون بسبب.", go:"ops" as Tab },
];
const PRECEDENCE_RULES = [
  { t:"أسبقية أطر زيرا", d:"عند أي تعارض: COD Math والامتثال (AEO) وهوية البراند تتغلب على أي افتراضيات عامة أو منهجيات مستوردة (بما فيها قواعد الكورس الاستشارية)." },
  { t:"ممنوع وجوه بشرية مولّدة بالـ AI أو UGC مزيف", d:"لزيرا: UGC/FGC حقيقي وسلطة خبير فقط. أي طلب توليد بصري لا يشمل وجوهاً بشرية مولّدة ولا شهادات مصطنعة — المنتج والمشهد والملمس فقط." },
  { t:"ممنوع ازدواج الحساب", d:"الإنفاق يُحسب مرة واحدة: ممنوع طرح Placed CPP وDelivered CPP معاً، والمرتجعات (RTO) تُحسب في الـ Cohort نفسه بلا تكرار." },
  { t:"تأكيد المالك الصريح قبل أي أثر خارجي", d:"لا نشر، لا تغيير ميزانية، لا تغيير سعر، لا إيقاف حملة، لا رسائل عملاء — دون تأكيد صريح وموثق من المالك في الاعتمادات." },
];
const AUDIT_PILLARS: { n:number; t:string; items:string[] }[] = [
  { n:1, t:"بريف المالك وحالة Offline-to-Online", items:["بريف مكتوب: أهداف وقيود وميزانيات معتمدة","حالة القنوات: أوفلاين/أونلاين ونقاط البيع الحالية","الجمهور والمناطق المستهدفة موثقة","قيود تشغيلية معلنة (مخزون/فريق/مواعيد)"] },
  { n:2, t:"أوديت الأداء — أفضل فترة مقابل فترة الهبوط", items:["أفضل فترة أداء محددة وموثقة بالأرقام","فترة الهبوط محددة وأسبابها المرجحة مكتوبة","أرقام المتجر وAds Manager مدمجة في عرض واحد","فصل أثر الموسمية والـ Payday عن أثر الكرييتيف"] },
  { n:3, t:"أوديت حساب الإعلانات وتقسيم Andromeda", items:["بنية الحساب الحالية موثقة كما هي","تقسيم شرائح Andromeda من 3–7 شرائح حسب الإشارات","استبعاد Audience Network مؤكد","نافذة إسناد موحدة (7-day click) على الكل"] },
  { n:4, t:"مصفوفة المنتجات والمخزون", items:["تصنيف Best / Mid / Worst مبني على أدلة","Units per Order محسوب لكل منتج","حالة مخزون الهيروين مؤكدة فعلياً","منتجات Worst مستبعدة من الإعلان أو مرشحة للإيقاف"] },
  { n:5, t:"فحص CRO — سبع صفحات + حاسبة فانل", items:["الصفحة الرئيسية","صفحة المنتج/الروتين (Scent Match + عرض + ضمانات)","صفحة التجميعة/الفئة","سلة الشراء","إتمام الطلب والدفع عند الاستلام","صفحة التأكيد/الشكر وخطوة واتساب","صفحة الأسئلة والسياسات","حاسبة فانل بمعدلات فعلية: Click ← LPV ← ATC ← IC ← Placed ← Delivered"] },
  { n:6, t:"أوديت السوشيال", items:["آخر 30 منشور مصنفة (تعليمي/إثبات/عرض)","التفاعل الحقيقي مقابل عدد المتابعين مقاس","أصول UGC متاحة وحقوقها واضحة","فجوات المحتوى مقابل زوايا الإعلانات محددة"] },
  { n:7, t:"العمليات والتغليف", items:["زمن تأكيد واتساب الفعلي مقاس","جودة التغليف وتجربة فتح العلبة مراجعة","أزمنة توصيل فعلية حسب المحافظة","خطة وقاية من الـ RTO مكتوبة"] },
  { n:8, t:"الاحتفاظ والـ LTV", items:["معدل تكرار الشراء معروف أو مقدّر بوسم [EST]","قيمة العميل خلال 90 يوم محسوبة","قنوات ما بعد الشراء شغالة (واتساب/رسائل)","عروض إعادة شراء موثقة ومعتمدة"] },
];
const inp = "w-full rounded-xl px-3 py-2 border text-sm";
const inpStyle = { background:"var(--bg)", borderColor:"var(--border)" } as const;
const card = { background:"var(--surface)", border:"1px solid var(--border)" } as const;
function Empty({ title, hint }: { title:string; hint:string }) {
  return <div className="rounded-2xl p-6 text-center" style={{...card, borderStyle:"dashed"}}><p className="font-normal">{title}</p><p className="text-sm mt-1" style={{color:"var(--dim)"}}>{hint}</p></div>;
}
function DelBtn({ label, onClick }: { label:string; onClick:()=>void }) {
  return <button aria-label={label} onClick={onClick} className="text-xs font-normal px-3 py-1.5 rounded-full shrink-0" style={{color:"var(--danger)",border:"1px solid var(--border)"}}>حذف</button>;
}

/* ---- Section icons (stroke SVG, colored per department) ---- */
function Svg({ children }: { children: ReactNode }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
const NAV_ICONS: Record<Tab, ReactNode> = {
  thinking: <Svg><path d="M9.5 3.5A2.6 2.6 0 0 1 12 6c0 1.1-.5 1.7-1.1 2.4-.5.6-.9 1.2-.9 2.1H7.6c0-1.3-.3-2-1.1-3A4.6 4.6 0 1 1 9.5 3.5Z"/><path d="M8 15.5h3.4M8.4 19h2.6M9.7 21.5h.01"/></Svg>,
  command: <Svg><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></Svg>,
  relaunch: <Svg><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></Svg>,
  campaigns: <Svg><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/></Svg>,
  content: <Svg><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m5 19 5.5-5.5 3 3L17 13l2 2"/></Svg>,
  organic: <Svg><path d="M5 19.5C5 10.5 12 4.5 20.5 4.5c0 8.5-6 15-15 15Z"/><path d="M5 19.5c3-6.5 7.5-11 13-13.5"/></Svg>,
  market: <Svg><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></Svg>,
  ops: <Svg><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 3v4.2h-4.2"/></Svg>,
  finance: <Svg><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5h.01M18 14.5h.01"/></Svg>,
  ask: <Svg><path d="M12 3l1.7 4.6 4.6 1.7-4.6 1.7L12 15.6l-1.7-4.6L5.7 9.3l4.6-1.7L12 3Z"/><path d="M18.6 15.2l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8.8-2.1Z"/></Svg>,
  system: <Svg><path d="M4 7h9"/><path d="M19 7h1"/><circle cx="16" cy="7" r="2.2"/><path d="M4 17h3"/><path d="M13 17h7"/><circle cx="10" cy="17" r="2.2"/></Svg>,
};
const NAV_MAIN: Tab[] = ["thinking","command","relaunch","campaigns","content","organic","market","ops","finance"];

/* ---- Lightweight CSS bar chart (real data only; designed empty frame) ---- */
function BarChart({ title, items, unit = "", grad = "var(--grad-finance)" }: { title: string; items: { label: string; value: number; highlight?: boolean }[]; unit?: string; grad?: string }) {
  const max = Math.max(1, ...items.map(i=>Math.abs(i.value)));
  return (
    <div className="rounded-2xl p-4 mt-4" style={card}>
      <h3 className="font-bold text-sm">{title}</h3>
      {items.length===0 ? (
        <div className="mt-3 rounded-xl p-4 text-center text-sm" style={{background:"var(--bg)",border:"1px dashed var(--border)",color:"var(--dim)"}}>لسه مفيش بيانات — أول ما تتسجل أرقام حقيقية هتظهر هنا كمخطط.</div>
      ) : (
        <div className="grid gap-2.5 mt-3">
          {items.map((i,idx)=>(
            <div key={idx} className="flex items-center gap-3" title={`${i.label}: ${i.value}${unit}`}>
              <span className="text-xs font-normal w-36 shrink-0 truncate" style={i.highlight ? {color:"var(--sec-relaunch)"} : undefined}>{i.label}</span>
              <div className="progress-track flex-1" style={{height:12}}><div className="progress-fill h-full" style={{width: `${Math.max(3, Math.abs(i.value)/max*100)}%`, background: i.value < 0 ? "var(--danger)" : grad}} /></div>
              <span className="text-xs font-normal w-20 shrink-0" dir="ltr" style={{textAlign:"left"}}>{i.value.toLocaleString("en-US")}{unit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- CPP gauge: owner-approved hero thresholds [EST] ---- */
function CppGauge() {
  const max = 300; const pos = (v:number)=> `${Math.min(100, v/max*100)}%`;
  const zones = [ { to: 160, bg:"rgba(2,122,72,0.20)", label:"منطقة الهدف" }, { to: 180, bg:"rgba(224,168,62,0.25)", label:"بوابة السكيل" }, { to: 275, bg:"rgba(181,71,8,0.16)", label:"قبل التعادل" }, { to: 300, bg:"rgba(180,35,24,0.14)", label:"خسارة" } ];
  let prev = 0;
  return (
    <div className="rounded-2xl p-4 mt-4" style={card}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="font-bold text-sm">مقياس الـ CPP — هيروات الريلونش (Placed CPP)</h3>
        <span className="pill pill-draft">أرقام [EST] من حسابات المالك</span>
      </div>
      <div className="relative mt-4 mb-1" style={{height:18}}>
        <div className="absolute inset-0 rounded-full overflow-hidden flex" dir="ltr">
          {zones.map(z=>{ const w = (z.to-prev)/max*100; prev = z.to; return <span key={z.label} style={{width:`${w}%`,background:z.bg}} />; })}
        </div>
        {[{v:155,l:"الهدف ≤150–160",c:"var(--success)"},{v:180,l:"بوابة Scale ‏180",c:"var(--warning)"},{v:275,l:"التعادل ≈275",c:"var(--danger)"}].map(m=>(
          <span key={m.l} className="absolute" style={{left:pos(m.v),top:-3,bottom:-3,width:3,borderRadius:2,background:m.c,transform:"translateX(-50%)"}} title={m.l} />
        ))}
      </div>
      <div className="flex justify-between text-[11px] font-normal mt-2" style={{color:"var(--dim)"}} dir="ltr"><span>0</span><span style={{color:"var(--success)"}}>هدف 150–160</span><span style={{color:"var(--warning)"}}>Scale ≤180</span><span style={{color:"var(--danger)"}}>تعادل ≈275</span><span>300+</span></div>
      <p className="text-xs mt-2 leading-relaxed" style={{color:"var(--dim)"}}>COGS الهيروين 350 جنيه (من المالك) · العائد لكل مُسلّم 874 (799 + شحن 75) · بافتراضات باقة التشغيل الافتراضية — رسوم Bosta الفعلية لسه غير مؤكدة، فالأرقام تقديرية لحد ما تتثبت.</p>
    </div>
  );
}
function useCountUp(target: number, ms = 700) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setV(target); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / ms); setV(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}
function CountUp({ value }: { value: number }) { const v = useCountUp(value); return <>{v}</>; }

/* ---- Progress ring (conic gradient, pure CSS) ---- */
function ProgressRing({ pct, size = 40, color = "var(--accent)", track = "var(--border)", children }: { pct: number; size?: number; color?: string; track?: string; children?: ReactNode }) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, borderRadius: "999px", background: `conic-gradient(${color} ${p * 3.6}deg, ${track} 0deg)` }} role="img" aria-label={`${p}%`}>
      <span className="absolute rounded-full flex items-center justify-center font-normal" style={{ inset: 3.5, background: "var(--surface)", color: "var(--text)", fontSize: size <= 34 ? 9 : 11 }}>{children ?? `${p}%`}</span>
    </span>
  );
}

/* ================= Sub-tabs (merged sections inside a host tab) ================= */
function SubTabs({ host, cur, setSub, items }: { host: string; cur: string; setSub: (h: string, v: string)=>void; items: {id:string;label:string}[] }) {
  return (
    <div className="flex gap-2 flex-wrap mb-5" role="tablist" aria-label="أقسام فرعية">
      {items.map(i=>(
        <button key={i.id} role="tab" aria-selected={cur===i.id} onClick={()=>setSub(host, i.id)} className="px-4 py-2 rounded-full text-sm font-normal" style={cur===i.id ? {background:"var(--teal)",color:"#FFF6EE",boxShadow:"var(--shadow-card)"} : {background:"var(--surface)",border:"1px solid var(--border)",color:"var(--text)"}}>{i.label}</button>
      ))}
    </div>
  );
}

/* ================= Performance trend (real snapshots only) ================= */
function TrendChart({ snapshots }: { snapshots: any[] }) {
  const metrics = [
    { k:"delivered", label:"الطلبات المسلمة" },
    { k:"cpp", label:"تكلفة الطلب المسلم (CPP)" },
    { k:"contributionDelivered", label:"هامش المساهمة" },
    { k:"breakevenRoas", label:"العائد على الإنفاق" },
  ] as const;
  const [mk, setMk] = useState<(typeof metrics)[number]["k"]>("delivered");
  const pts = [...snapshots].reverse();
  const W = 560, H = 148, PL = 44, PR = 14, PT = 18, PB = 24;
  const vals = pts.map(p=>Number(p[mk]) || 0);
  const max = Math.max(1, ...vals) * 1.15;
  const x = (i:number)=> pts.length<=1 ? (PL + (W-PL-PR)/2) : PL + (i*(W-PL-PR)/(pts.length-1));
  const y = (v:number)=> PT + (1 - v/max) * (H-PT-PB);
  const line = pts.map((_p,i)=>`${x(i)},${y(vals[i] ?? 0)}`).join(" ");
  const area = pts.length>1 ? `M ${x(0)},${y(vals[0] ?? 0)} ` + pts.slice(1).map((_p,i)=>`L ${x(i+1)},${y(vals[i+1] ?? 0)}`).join(" ") + ` L ${x(pts.length-1)},${H-PB} L ${x(0)},${H-PB} Z` : "";
  const last = pts[pts.length-1];
  return (
    <div className="rounded-2xl p-4" style={card}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="font-bold">اتجاه الأداء</h3>
        <div className="flex gap-1.5 flex-wrap" role="tablist" aria-label="مقاييس الاتجاه">
          {metrics.map(m=>(
            <button key={m.k} role="tab" aria-selected={mk===m.k} onClick={()=>setMk(m.k)} className="text-xs font-normal px-3 py-1.5 rounded-full" style={mk===m.k ? {background:"var(--accent)",color:"#FFFFFF"} : {background:"var(--surface2)",color:"var(--text)"}}>{m.label}</button>
          ))}
        </div>
      </div>
      {mk==="cpp" ? (
        <div className="mt-3 rounded-xl p-3.5 text-center text-sm" style={{background:"var(--bg)",border:"1px dashed var(--border)",color:"var(--dim)"}}>مفيش CPP مسجل بعد — اللقطات المالية الحالية لا تحمل إنفاقاً إعلانياً فعلياً لكل طلب. أول Cohort بإنفاق حقيقي يتحسب من «المالية والتدقيق» هيبدأ خط الـ CPP هنا.</div>
      ) : pts.length===0 ? (
        <div className="mt-3 rounded-xl p-3.5 text-center text-sm" style={{background:"var(--bg)",border:"1px dashed var(--border)",color:"var(--dim)"}}>لسه مفيش لقطات مالية — أول لقطة من «المالية والتدقيق» هتبدأ خط الاتجاه هنا. مفيش أي أرقام معروضة من غير مصدر.</div>
      ) : (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-2" style={{width:"100%",height:"auto",maxHeight:240,display:"block"}} role="img" aria-label="مخطط اتجاه الأداء من اللقطات المالية المسجلة">
            <defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0E5A52" stopOpacity="0.30" /><stop offset="100%" stopColor="#0E5A52" stopOpacity="0.02" /></linearGradient></defs>
            {[0.25, 0.55, 0.85].map(f=>(<line key={f} x1={PL} x2={W-PR} y1={PT+(H-PT-PB)*f} y2={PT+(H-PT-PB)*f} stroke="var(--border)" strokeWidth="1" />))}
            <text x={PL-6} y={y(max/1.15)+4} textAnchor="end" fontSize="10" fill="var(--dim)">{Math.round(max/1.15).toLocaleString("en-US")}</text>
            <text x={PL-6} y={H-PB+4} textAnchor="end" fontSize="10" fill="var(--dim)">0</text>
            {pts.length>1 && <path d={area} fill="url(#trendFill)" />}
            {pts.length>1 && <polyline points={line} fill="none" stroke="#0E5A52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
            {pts.map((p,i)=>(<circle key={p.id} cx={x(i)} cy={y(vals[i] ?? 0)} r={i===pts.length-1 ? 5 : 3.5} fill={i===pts.length-1 ? "#013835" : "#8FC1B5"} stroke="#FFF6EE" strokeWidth="1.5" />))}
            {pts.map((p,i)=>(<text key={"t"+p.id} x={x(i)} y={H-6} textAnchor="middle" fontSize="9.5" fill="var(--dim)">{(p.period || new Date(p.createdAt).toLocaleDateString("ar-EG")).slice(0, 14)}</text>))}
            {last && (<g><rect x={Math.min(W-118, Math.max(PL, x(pts.length-1)-56))} y={Math.max(2, y(vals[vals.length-1] ?? 0)-34)} width="112" height="22" rx="7" fill="#013835" /><text x={Math.min(W-118, Math.max(PL, x(pts.length-1)-56))+56} y={Math.max(2, y(vals[vals.length-1] ?? 0)-34)+15} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#FFF6EE">{(vals[vals.length-1] ?? 0).toLocaleString("en-US")}</text></g>)}
          </svg>
          <p className="text-xs mt-1" style={{color:"var(--dim)"}}>{pts.length===1 ? "نقطة بيانات واحدة حتى الآن (آخر لقطة مالية) — خط الاتجاه بيترسم من لقطتين فأكثر، وكل نقطة هنا لقطة حقيقية مسجلة." : `${pts.length} لقطات مالية مسجلة — كل نقطة لقطة حقيقية، من الأقدم للأحدث.`}</p>
        </>
      )}
    </div>
  );
}

/* ================= Dashboard (reference layout, real data only) ================= */
function DashboardHome({ dash, snapshots, tasks, work, approvals, alerts, goals, plans, completeness, overdue, outcomeDue, inv, nav, onRefresh, statusSlot }: any) {
  const decide = useMutation({ mutationFn: async(v:any)=> await api.decideApproval({ id:v.id, status:v.status as "Approved" }), onSuccess: inv });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "صباح الخير" : "مساء الخير";
  const latest = snapshots[0] ?? null;
  const isEst = latest ? /EST/.test((latest.label ?? "") + " " + (latest.notes ?? "")) : false;
  const fLatest = latest ? freshness(latest.createdAt) : null;
  const pending = approvals.filter((a:any)=>a.status==="Pending");
  const executingWork = work.filter((w:any)=>w.status==="Executing");
  const executingTasks = tasks.filter((t:any)=>t.status==="Executing");
  const goal0 = goals[0] ?? null;
  const donutPct = goal0 && goal0.target>0 ? Math.min(100, Math.round(goal0.current/goal0.target*100)) : completeness.pct;
  const kpis = latest ? [
    { label:"الطلبات المسلمة", value: latest.delivered, money:false, cpp:false, icon:<Svg><path d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10"/></Svg> },
    { label:"تكلفة الطلب المسلم (CPP)", value: 0, money:true, cpp:true, icon:<Svg><circle cx="9" cy="9" r="6"/><path d="M14.5 5.5a6 6 0 1 1-8.6 8.6"/><path d="M9 6.5v5M7.2 8.2c.5-.5 1.1-.7 1.8-.7 1 0 1.8.6 1.8 1.4 0 2-3.6 1.2-3.6 3 0 .8.8 1.4 1.8 1.4.7 0 1.3-.2 1.8-.7"/></Svg> },
    { label:"هامش المساهمة", value: latest.contributionDelivered, money:true, cpp:false, icon:<Svg><path d="M4 19V9M9.5 19V5M15 19v-8M20 19V7"/></Svg> },
    { label:"صافي المساهمة", value: Math.round(latest.contributionDelivered * latest.delivered), money:true, cpp:false, icon:<Svg><path d="m4 15 5-5 3.5 3.5L19 7"/><path d="M14.5 7H19v4.5"/></Svg> },
  ] : [];
  const disc: { icon: ReactNode; bg: string; color: string; title: string; detail: string; go: ()=>void }[] = [];
  const newAlert = alerts.find((a:any)=>a.status==="New");
  if (newAlert) disc.push({ icon:<Svg><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/></Svg>, bg:"var(--warning-soft)", color:"var(--warning)", title:`اكتشاف عرض/تغيّر منافس: ${newAlert.competitor}`, detail: newAlert.detail || newAlert.changeType, go:()=>nav("market","market","watch") });
  if (overdue.length) disc.push({ icon:<Svg><path d="M12 8v5l3 2"/><circle cx="12" cy="12" r="9"/></Svg>, bg:"var(--danger-soft)", color:"var(--danger)", title:`${overdue.length} عنصر شغل متأخر عن الاستحقاق`, detail:"راجع الـ Next Action وحدّث الحالة قبل أي شغل جديد", go:()=>nav("relaunch","relaunch","work") });
  if ((dash?.approvalsPending ?? 0)>0) disc.push({ icon:<Svg><path d="M12 3 5 5.8v5.4c0 4.5 3 7.7 7 9.3 4-1.6 7-4.8 7-9.3V5.8L12 3Z"/><path d="m9 11.6 2.2 2.2 4.3-4.3"/></Svg>, bg:"var(--info-soft)", color:"var(--info)", title:`${dash.approvalsPending} اعتماد بانتظار قرارك`, detail:"مفيش أي تنفيذ خارجي هيحصل قبل موافقتك الصريحة", go:()=>nav("campaigns","campaigns","approvals") });
  if (completeness.pct<100) disc.push({ icon:<Svg><path d="M9 3.5A2.5 2.5 0 0 1 11.5 6c0 1-.5 1.6-1 2.2-.4.5-.5 1-.5 1.8H7.5c0-1.2-.3-1.9-1-2.7A4.5 4.5 0 1 1 9 3.5Z"/><path d="M9 13.5v.01M5 20.5h9"/></Svg>, bg:"var(--warning-soft)", color:"var(--warning)", title:`المدخلات الأساسية مكتملة ${completeness.pct}% بس`, detail:"أي قرار قبل الاكتمال يفضل Provisional — أكمل الناقص", go:()=>nav("system","system","inputs") });
  if ((dash?.tasksReady ?? 0)>0) disc.push({ icon:<Svg><path d="M10 3h4"/><path d="M10 3v5.5L4.8 18a2 2 0 0 0 1.8 3h10.8a2 2 0 0 0 1.8-3L14 8.5V3"/><path d="M7.5 14.5h9"/></Svg>, bg:"var(--success-soft)", color:"var(--success)", title:`${dash.tasksReady} مهمة جاهزة للمراجعة`, detail:"راجعها واعتمد أو ارجعها بخطوة تصحيح واحدة", go:()=>nav("campaigns","campaigns","tasks") });
  if (outcomeDue.length) disc.push({ icon:<Svg><path d="M4 19V9M9.5 19V5M15 19v-8M20 19V7"/></Svg>, bg:"var(--info-soft)", color:"var(--info)", title:`${outcomeDue.length} عنصر مستحق مراجعة نتائج`, detail:"قارن المتوقع بالفعلي وسجّل التعلم في سجل التعلم", go:()=>nav("relaunch","relaunch","work") });
  const queueTasks = [...tasks].sort((a:any,b:any)=>{ const rank=(s:string)=> s==="Ready for Review"?0 : s==="New"?1 : 2; return rank(a.status)-rank(b.status); }).slice(0,4);
  const queueWork = work.filter((w:any)=>!["Completed","Failed"].includes(w.status)).slice(0,4);
  const pillFor = (s:string)=> s==="Ready for Review" ? "pill pill-draft" : s==="New" ? "pill pill-pending" : s==="Executing" ? "pill pill-live" : "pill pill-locked";
  const pillLabel = (s:string)=> ({ "Ready for Review":"جاهزة للمراجعة", "New":"جديدة", "Executing":"قيد التنفيذ", "Investigating":"قيد التحقيق", "Outcome Review":"مراجعة النتائج", "Approved":"معتمدة" } as Record<string,string>)[s] ?? s;
  const priBars = (p:string)=>{ const n = p==="Critical"||p==="High" ? 3 : p==="Medium" ? 2 : 1; const c = n===3 ? "var(--danger)" : n===2 ? "var(--warning)" : "var(--dim)"; return (<span className="flex items-end gap-[3px]" dir="ltr" aria-hidden>{[5,9,13].map((h,i)=>(<span key={i} style={{width:4,height:h,borderRadius:2,background: i<n ? c : "var(--border)"}} />))}</span>); };
  const steps = [
    { n:1, t:"املأ المدخلات الأساسية", go:()=>nav("system","system","inputs"), done: completeness.pct>=80, active: completeness.pct>0 },
    { n:2, t:"ادرس السوق والمنافسين", go:()=>nav("market","market","watch"), done: (dash?.marketRoundsTotal ?? 0)>0, active: (dash?.marketRoundsTotal ?? 0)>0 },
    { n:3, t:"جهّز الكرييتيف وافحصه", go:()=>nav("content","content","creative"), done: (dash?.creativesTotal ?? 0)>0, active: (dash?.creativesTotal ?? 0)>0 },
    { n:4, t:"ابنِ الحملة وقرّر", go:()=>nav("campaigns","campaigns","campaigns"), done: (dash?.campaignsTotal ?? 0)>0, active: (dash?.campaignsTotal ?? 0)>0 },
    { n:5, t:"تابع وقرّر Kill/Scale وتعلّم", go:()=>nav("relaunch","relaunch","work"), done: (dash?.experimentsTotal ?? 0)>0, active: (dash?.campaignsTotal ?? 0)>0 },
  ];
  return (
    <section>
      {/* Greeting header — reference layout */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-normal" style={{color:"var(--accent)"}}>☀️ {greeting}، مالك زيرا</p>
          <h2 className="font-cairo font-bold text-2xl md:text-[28px] leading-snug mt-1">إليك ما اكتشفه فريق زيرا الذكي اليوم</h2>
          <p className="text-sm mt-1" style={{color:"var(--dim)"}}>يبحث • يحلل • يكتشف الفرص • يقترح الحلول • بانتظار قراراتك</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--surface)",border:"1px solid var(--border)"}}>📅 آخر 7 أيام</span>
          <button onClick={()=>nav("campaigns","campaigns","approvals")} aria-label="التنبيهات والاعتمادات المعلقة" className="relative w-10 h-10 rounded-full flex items-center justify-center" style={{background:"var(--surface)",border:"1px solid var(--border)"}}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 9.5a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13.5 6 9.5"/><path d="M10 19a2.2 2.2 0 0 0 4 0"/></svg>
            {(dash?.approvalsPending ?? 0)>0 && <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-normal flex items-center justify-center" style={{background:"#D92D20",color:"#fff"}}>{dash.approvalsPending}</span>}
          </button>
          <span className="flex items-center gap-2 ps-1 pe-3 py-1 rounded-full" style={{background:"var(--surface)",border:"1px solid var(--border)"}}><span className="w-8 h-8 rounded-full flex items-center justify-center font-normal text-sm" style={{background:"var(--teal)",color:"#FFF6EE"}}>A</span><span className="text-xs font-normal">مالك زيرا</span></span>
        </div>
      </div>

      {/* System-status collapsible — directly under the greeting, dashboard only */}
      {statusSlot}

      {/* KPI row — latest real financial snapshot only */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {latest ? kpis.map(k=>(
          <div key={k.label} className="rounded-2xl p-4 lift" style={card}>
            <div className="flex items-start justify-between gap-2">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:"var(--teal-soft)",color:"#0E5A52"}}><span className="w-5 h-5 block">{k.icon}</span></span>
              <span className={isEst ? "pill pill-draft" : "pill pill-live"}>{isEst ? "[EST] تقديري" : "مسجل"}</span>
            </div>
            {k.cpp ? (<>
              <div className="font-cairo text-[30px] font-bold mt-3 leading-none" style={{color:"var(--dim)"}}>—</div>
              <div className="text-xs mt-1.5" style={{color:"var(--dim)"}}>{k.label}</div>
              <p className="text-[11px] mt-2" style={{color:"var(--dim)"}}>لسه مفيش Cohort بإنفاق إعلاني فعلي مسجل — بيتحسب من حاسبة COD في «المالية والتدقيق» أول ما تتوفر بيانات إنفاق حقيقية.</p>
            </>) : (<>
              <div className="font-cairo text-[30px] font-bold mt-3 leading-none"><CountUp value={Math.round(k.value)} />{k.money && <span className="text-xs font-normal" style={{color:"var(--dim)"}}> جنيه</span>}</div>
              <div className="text-xs mt-1.5" style={{color:"var(--dim)"}}>{k.label}{k.label==="هامش المساهمة" ? " (لكل طلب مُسلّم)" : ""}</div>
              <p className="text-[11px] mt-2" style={{color:"var(--dim)"}}>آخر لقطة: {latest.label}{latest.period ? ` · ${latest.period}` : ""} · {fLatest?.icon} {fLatest?.label}</p>
            </>)}
          </div>
        )) : [0,1,2,3].map(i=>(
          <div key={i} className="rounded-2xl p-4" style={{...card, borderStyle:"dashed"}}>
            <div className="font-cairo text-[30px] font-bold mt-1" style={{color:"var(--dim)"}}>—</div>
            <div className="text-xs mt-1.5" style={{color:"var(--dim)"}}>بانتظار أول لقطة مالية</div>
            <button onClick={()=>nav("finance","finance","finance")} className="text-[11px] font-normal underline mt-2">احسب Cohort في المالية ←</button>
          </div>
        ))}
      </div>
      <p className="text-[11px] mt-2" style={{color:"var(--dim)"}}>مقارنة بآخر 7 أيام: خط الأساس بيبدأ من أيام الـ Relaunch — لسه مفيش فترة سابقة كاملة، فمفيش نسب تغيّر معروضة لحد ما تتكوّن بيانات حقيقية. {isEst && "أرقام اللقطة الحالية تقديرية [EST] بافتراضات تشغيلية — رسوم Bosta الفعلية لسه غير مؤكدة."}</p>

      <div className="dash-grid gap-4 mt-4 items-start">
        <div className="grid grid-cols-1 gap-4 min-w-0">
          <TrendChart snapshots={snapshots} />

          {/* AI discoveries */}
          <div className="rounded-2xl p-4" style={card}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold">✦ أهم اكتشافات زيرا الذكية</h3>
              <button onClick={()=>nav("relaunch","relaunch","work")} className="text-xs font-normal" style={{color:"var(--accent)"}}>عرض التفاصيل ←</button>
            </div>
            <div className="grid gap-1 mt-2">
              {disc.length===0 && <p className="text-sm py-2" style={{color:"var(--dim)"}}>لا اكتشافات جديدة دلوقتي — النظام بيراقب الاستحقاقات والاعتمادات والمنافسين واكتمال المدخلات، وأي إشارة هتظهر هنا فوراً.</p>}
              {disc.map((d,i)=>(
                <button key={i} onClick={d.go} className="flex items-center gap-3 py-2.5 text-right w-full" style={{borderTop: i>0 ? "1px solid var(--border)" : undefined}}>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{background:d.bg,color:d.color}}><span className="w-[18px] h-[18px] block">{d.icon}</span></span>
                  <span className="flex-1 min-w-0"><span className="block font-normal text-sm truncate">{d.title}</span><span className="block text-xs mt-0.5 truncate" style={{color:"var(--dim)"}}>{d.detail}</span></span>
                  <span aria-hidden style={{color:"var(--dim)"}}>‹</span>
                </button>
              ))}
            </div>
          </div>

          {/* Smart work queue */}
          <div className="rounded-2xl p-4" style={card}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-bold">قائمة المهام الذكية ({(dash?.tasksTotal ?? 0) + (dash?.workTotal ?? 0)} عنصر)</h3>
              <button onClick={()=>nav("relaunch","relaunch","work")} className="text-xs font-normal" style={{color:"var(--accent)"}}>عرض القائمة كاملة ←</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-3">
              {[
                { label:"اكتشافات جديدة", n:(dash?.tasksNew ?? 0) + (dash?.alertsOpen ?? 0), go:()=>nav("campaigns","campaigns","tasks"), icon:<Svg><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.8-3.8"/></Svg> },
                { label:"جاهزة للمراجعة", n:dash?.tasksReady ?? 0, go:()=>nav("campaigns","campaigns","tasks"), icon:<Svg><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a3 3 0 0 1 6 0"/><path d="m9.2 14 2 2 3.8-3.8"/></Svg> },
                { label:"قيد التنفيذ", n:dash?.tasksInProgress ?? 0, go:()=>nav("relaunch","relaunch","work"), icon:<Svg><path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z"/></Svg> },
                { label:"مراجعة النتائج", n:outcomeDue.length, go:()=>nav("relaunch","relaunch","work"), icon:<Svg><path d="M4 19V9M9.5 19V5M15 19v-8M20 19V7"/></Svg> },
              ].map(c=>(
                <button key={c.label} onClick={c.go} aria-label={c.label} className="rounded-xl p-3 text-right lift" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
                  <span className="flex items-center gap-2"><span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{background:"var(--teal-soft)",color:"#0E5A52"}}><span className="w-4 h-4 block">{c.icon}</span></span><span className="font-cairo text-xl font-normal"><CountUp value={c.n} /></span></span>
                  <span className="block text-xs font-normal mt-1.5">{c.label}</span>
                </button>
              ))}
            </div>
            <div className="grid gap-1 mt-2">
              {queueTasks.length===0 && queueWork.length===0 && <p className="text-sm py-2" style={{color:"var(--dim)"}}>القائمة فارغة — أول مهمة من «اسأل زيرا» أو عنصر شغل من الريلونش هيظهر هنا بالأولوية.</p>}
              {queueTasks.map((t:any)=>(
                <button key={"t"+t.id} onClick={()=>nav("campaigns","campaigns","tasks")} className="flex items-center gap-3 py-2.5 text-right w-full" style={{borderTop:"1px solid var(--border)"}}>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-normal text-xs" style={{background:"var(--teal-soft)",color:"#0E5A52"}}>{t.type}</span>
                  <span className="flex-1 min-w-0"><span className="block font-normal text-sm truncate">{t.title}</span><span className="block text-xs mt-0.5 truncate" style={{color:"var(--dim)"}}>{t.objective || TASK_TYPES[t.type]}</span></span>
                  <span className={pillFor(t.status)}>{pillLabel(t.status)}</span>
                  <span aria-hidden style={{color:"var(--dim)"}}>‹</span>
                </button>
              ))}
              {queueWork.map((w:any)=>(
                <button key={"w"+w.id} onClick={()=>nav("relaunch","relaunch","work")} className="flex items-center gap-3 py-2.5 text-right w-full" style={{borderTop:"1px solid var(--border)"}}>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{background:"var(--sand)",color:"#0E5A52"}}><span className="w-[18px] h-[18px] block"><Svg><path d="m3 6 2 2 4-4"/><path d="M11 6h10"/><path d="m3 12 2 2 4-4"/><path d="M11 12h10"/><path d="m3 18 2 2 4-4"/><path d="M11 18h10"/></Svg></span></span>
                  <span className="flex-1 min-w-0"><span className="block font-normal text-sm truncate">{w.title}</span><span className="block text-xs mt-0.5 truncate" style={{color:"var(--dim)"}}>{w.nextAction || w.sourceType} · تقدم {w.progress}%</span></span>
                  <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-normal shrink-0" style={{color:"var(--dim)"}}>{priBars(w.priority)}{w.priority==="High"||w.priority==="Critical" ? "أولوية عالية" : w.priority==="Medium" ? "أولوية متوسطة" : "أولوية منخفضة"}</span>
                  <span className={pillFor(w.status)}>{pillLabel(w.status)}</span>
                  <span aria-hidden style={{color:"var(--dim)"}}>‹</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pending executions — inline approve/reject */}
          <div className="rounded-2xl p-4" style={card}>
            <h3 className="font-bold">التنفيذات بانتظار التنفيذ ({pending.length})</h3>
            <div className="grid gap-2 mt-3">
              {pending.length===0 && <p className="text-sm" style={{color:"var(--dim)"}}>لا تنفيذات معلّقة — أي إجراء خارجي مقترح (نشر/ميزانية/سعر/إيقاف) هيظهر هنا بقرارك المباشر.</p>}
              {pending.map((a:any)=>(
                <div key={a.id} className="rounded-xl p-3.5 flex items-center gap-3 flex-wrap" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
                  <div className="flex-1 min-w-[200px]"><p className="font-normal text-sm">{a.title}</p><p className="text-xs mt-0.5" style={{color:"var(--dim)"}}>{a.actionType} · {new Date(a.createdAt).toLocaleDateString("ar-EG")}{a.description ? ` · ${a.description.slice(0,90)}` : ""}</p></div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={()=>decide.mutate({id:a.id,status:"Approved"})} aria-label={`موافقة على ${a.title}`} className="text-xs font-normal px-4 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF6EE"}}>موافقة</button>
                    <button onClick={()=>decide.mutate({id:a.id,status:"Rejected"})} aria-label={`رفض ${a.title}`} className="text-xs font-normal px-4 py-2 rounded-full" style={{border:"1px solid var(--border)",color:"var(--danger)"}}>رفض</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start-here stepper */}
          <div className="rounded-2xl p-4" style={card}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-bold">ابدأ منين؟ — مسار الشغل في 5 خطوات</h3>
              <span className="pill pill-draft">RELAUNCH — Dual Hero: سيلوليت 799 + جلد الوزة 799</span>
            </div>
            <div className="grid md:grid-cols-5 gap-2.5 mt-4">
              {steps.map(s=>(
                <button key={s.n} onClick={s.go} aria-label={`خطوة ${s.n}: ${s.t}`} className="rounded-xl p-3 text-right lift" style={{background:"var(--bg)",border:`1px solid ${s.done ? "var(--success)" : s.active ? "var(--accent)" : "var(--border)"}`}}>
                  <div className="flex items-center gap-2"><span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-normal shrink-0" style={{background: s.done ? "var(--success)" : s.active ? "var(--accent)" : "var(--surface2)", color: s.done || s.active ? "#FFF6EE" : "var(--dim)"}}>{s.done ? "✓" : s.n}</span><span className="text-[11px] font-normal" style={{color:"var(--dim)"}}>{s.done ? "اكتملت" : s.active ? "جارية" : "لم تبدأ"}</span></div>
                  <p className="font-normal text-sm mt-2 leading-snug">{s.t}</p>
                  <div className="progress-track mt-3" style={{height:6}}><div className="progress-fill h-full" style={{width: s.done ? "100%" : s.active ? "50%" : "0%", background: s.done ? "var(--success)" : "var(--accent)"}} /></div>
                </button>
              ))}
            </div>
            <p className="text-xs mt-3" style={{color:"var(--dim)"}}>COGS الهيروين مثبت من المالك (350 جنيه لكل روتين) وBreak-even المحسوب ≈275 جنيه [EST]. الناقص قبل إطلاق فعلي: نسب تأكيد واتساب والتسليم الفعلية + رسوم Bosta الحقيقية — من غيرهم أرقام الـ COD تفضل تقديرية.</p>
            <div className="flex flex-wrap gap-1.5 mt-4 items-center">
              {PIPELINE.map((s,i)=>(<span key={s} className="flex items-center gap-1.5"><span className="text-[11px] font-normal px-2.5 py-1.5 rounded-full" style={{background:"var(--surface2)"}}>{i+1}. {s}</span>{i<PIPELINE.length-1 && <span aria-hidden style={{color:"var(--dim)"}}>←</span>}</span>))}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {STAGES.map((s,i)=>(<span key={s} className="text-[11px] font-normal px-2.5 py-1.5 rounded-full" style={{background:"var(--teal-mist)",border:"1px solid var(--border)"}}>{i+1}. {s}</span>))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {EMERGENCY.map(e=>(
              <article key={e.t} className="rounded-2xl p-4" style={card}>
                <h3 className="font-bold text-sm">🚨 {e.t}</h3>
                <p className="text-sm mt-2 leading-relaxed" style={{color:"var(--dim)"}}>{e.d}</p>
              </article>
            ))}
          </div>
          <div className="rounded-2xl p-4" style={card}>
            <h3 className="font-bold">حراسة التنفيذ — Human Control</h3>
            <p className="text-sm mt-2 leading-relaxed" style={{color:"var(--dim)"}}>ممنوع أي تنفيذ خارجي بدون موافقة المالك الصريحة: لا نشر، لا رسائل عملاء، لا تغيير ميزانيات أو أسعار أو خصومات، لا إيقاف أو إطلاق حملات. كل إجراء خارجي يمر أولاً على <button className="font-normal underline" onClick={()=>nav("campaigns","campaigns","approvals")}>صندوق الاعتمادات</button> ويتسجل في سجل التنفيذ بقيم Before/After.</p>
          </div>
        </div>

        {/* Side rail — own grid column; stacks into 2 columns below xl, never overlaps the main column */}
        <div className="grid grid-cols-1 gap-3 content-start min-w-0 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-2xl p-4" style={card}>
            <h3 className="font-bold text-sm">أداء اليوم مقابل الهدف</h3>
            <div className="flex items-center gap-4 mt-3">
              <ProgressRing pct={donutPct} size={72} color="var(--teal)"><span className="font-cairo" style={{fontSize:15}}>{donutPct}%</span></ProgressRing>
              <div className="text-sm">
                {goal0 ? (<><p><span style={{color:"var(--dim)"}}>الهدف:</span> <b>{goal0.metric}</b></p><p className="mt-1"><span style={{color:"var(--dim)"}}>المستهدف:</span> <b>{goal0.target} {goal0.unit}</b></p><p className="mt-1"><span style={{color:"var(--dim)"}}>المحقق:</span> <b>{goal0.current} {goal0.unit}</b></p></>) : (<><p className="font-normal">اكتمال المدخلات الأساسية</p><p className="mt-1" style={{color:"var(--dim)"}}>لسه مفيش هدف يومي مسجل — أول هدف Relaunch هيتحط هنا تلقائياً.</p><button onClick={()=>nav("relaunch","relaunch","board")} className="text-xs font-normal underline mt-1">حدّد أهداف الريلونش ←</button></>)}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4" style={card}>
            <h3 className="font-bold text-sm">حالة التكاملات</h3>
            <div className="grid gap-1 mt-2">
              {[
                { name:"Shopify — قراءة الويبسايت", st: dash?.lastSyncAt ? `آخر مزامنة ${freshness(dash.lastSyncAt).label}` : "لسه ما اتقراش", ok: !!dash?.lastSyncAt, pill: dash?.lastSyncAt ? <span className="pill pill-live">متصل</span> : <span className="pill pill-draft">بانتظار أول قراءة</span> },
                { name:"Bosta — الشحن", st:"لا يوجد ربط متاح بعد — الرسوم إدخال يدوي أو [EST]", ok:false, pill:<span className="pill pill-locked">غير متصل</span> },
                { name:"Meta — قراءة الإعلانات", st:"بانتظار ربط الحساب الإعلاني بتصريح المالك", ok:false, pill:<span className="pill pill-pending">Pending</span> },
                { name:"Meta — التنفيذ", st:"الكتابة في Meta مقفولة بقرار المالك", ok:false, pill:<span className="pill pill-locked">مقفول عن قصد</span> },
              ].map(r=>(
                <button key={r.name} onClick={()=>nav("system","system","integrations")} className="flex items-center gap-2.5 py-2 text-right w-full" style={{borderTop:"1px solid var(--border)"}}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-normal" style={{background: r.ok ? "var(--success-soft)" : "var(--surface2)", color: r.ok ? "var(--success)" : "var(--dim)"}}>{r.ok ? "✓" : "•"}</span>
                  <span className="flex-1 min-w-0"><span className="block font-normal text-[13px] truncate">{r.name}</span><span className="block text-[11px] truncate" style={{color:"var(--dim)"}}>{r.st}</span></span>
                  {r.pill}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={card}>
            <h3 className="font-bold text-sm">التنفيذات اليوم</h3>
            {executingWork.length + executingTasks.length === 0 ? (
              <p className="text-sm mt-2" style={{color:"var(--dim)"}}>لا تنفيذات جارية الآن — المهام المعتمدة بتظهر هنا أثناء تنفيذها بتقدمها الحقيقي.</p>
            ) : (
              <div className="grid gap-2.5 mt-2">
                {executingWork.slice(0,2).map((w:any)=>(
                  <button key={w.id} onClick={()=>nav("relaunch","relaunch","work")} className="text-right w-full">
                    <p className="text-sm font-normal flex items-center gap-2"><span style={{color:"var(--success)"}}>▶</span> {w.title}</p>
                    <div className="flex items-center gap-2 mt-1.5"><div className="progress-track flex-1" style={{height:8}}><div className="progress-fill h-full" style={{width:w.progress+"%",background:"var(--teal)"}} /></div><span className="text-xs font-normal">{w.progress}%</span></div>
                  </button>
                ))}
                {executingTasks.slice(0,1).map((t:any)=>(<p key={t.id} className="text-sm"><span style={{color:"var(--success)"}}>▶</span> <b>مهمة {t.type}:</b> {t.title} — مرحلة {t.stage}/8</p>))}
              </div>
            )}
          </div>

          <div className="rounded-2xl p-4" style={card}>
            <h3 className="font-bold text-sm">القادم</h3>
            <div className="grid gap-1 mt-1">
              {[
                { label:"عناصر مستحقة مراجعة نتائج", n: outcomeDue.length, go:()=>nav("relaunch","relaunch","work") },
                { label:"خطط مقترحة بانتظار الاعتماد", n: plans.filter((p:any)=>p.status==="Proposed").length, go:()=>nav("ask") },
                { label:"مهام جاهزة للمراجعة", n: dash?.tasksReady ?? 0, go:()=>nav("campaigns","campaigns","tasks") },
              ].map(r=>(
                <button key={r.label} onClick={r.go} className="flex items-center gap-2 py-2 text-right w-full" style={{borderTop:"1px solid var(--border)"}}>
                  <span className="flex-1 text-sm font-normal">{r.label}</span>
                  <span className="text-xs font-normal px-2.5 py-1 rounded-full" style={{background: r.n>0 ? "var(--accent)" : "var(--surface2)", color: r.n>0 ? "#FFFFFF" : "var(--dim)"}}>{r.n}</span>
                  <span aria-hidden style={{color:"var(--dim)"}}>‹</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={card}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-sm">صحة النظام</h3>
              <span className="pill pill-live">يعمل</span>
            </div>
            <div className="grid gap-1.5 mt-3 text-sm">
              <p className="flex justify-between gap-2"><span style={{color:"var(--dim)"}}>آخر فحص مصادر</span><b>{dash?.lastCheckAt ? new Date(dash.lastCheckAt).toLocaleDateString("ar-EG") : "لسه مفيش"}</b></p>
              <p className="flex justify-between gap-2"><span style={{color:"var(--dim)"}}>حداثة بيانات الويبسايت</span><b>{dash?.lastSyncAt ? freshness(dash.lastSyncAt).label : "لا بيانات"}</b></p>
              <p className="flex justify-between gap-2"><span style={{color:"var(--dim)"}}>سقوف/أسعار تحت المراجعة</span><b>أي تعديل يروح الاعتمادات</b></p>
            </div>
            <button onClick={onRefresh} aria-label="تشغيل الفحص اليومي" className="mt-3 w-full px-4 py-2.5 rounded-xl font-normal text-sm" style={{background:"var(--teal)",color:"#FFF6EE"}}>↻ فحص يومي للمصادر</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= Activity log (System host) ================= */
function ActivityPanel({ events }: { events: any[] }) {
  return (
    <section>
      <h3 className="font-bold text-lg">سجل النشاط — Activity Log</h3>
      <p className="text-sm mt-1" style={{color:"var(--dim)"}}>سجل مترابط عبر الأقسام: مين عمل إيه وامتى — قرارات اعتماد، لقطات مالية، أحداث كرييتيف، جولات سوق، وتشغيلات اللوب.</p>
      <div className="grid gap-2.5 mt-4">
        {events.length===0 && <Empty title="سجل النشاط فارغ" hint="أي حدث جوه النظام (اعتماد، لقطة، جولة، تشغيل لوب) بيتسجل هنا تلقائياً." />}
        {events.map((e:any)=>(
          <div key={e.id} className="rounded-xl p-3.5 flex items-start gap-3" style={card}>
            <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{background:"var(--accent)"}} />
            <div className="min-w-0">
              <p className="text-sm"><span className="font-normal">{e.section}</span> · {e.eventType}</p>
              {e.detail && <p className="text-sm mt-0.5" style={{color:"var(--dim)"}}>{e.detail}</p>}
              <p className="text-xs mt-1" style={{color:"var(--dim)"}}>{new Date(e.createdAt).toLocaleString("ar-EG")}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= Organic — social media end-to-end ================= */
const ORG_STATUSES = ["فكرة","كابشن جاهز","معتمد","مجدول","اتنشر"];
const ORG_SLOTS = ["تعليمي","تفاعلي","بيع ناعم"];
const ORG_CAP_STATUSES = ["مسودة","مرشّحة","معتمدة"];
function OrganicTab({ posts, insights, keywords, inv }: any) {
  const [f,setF]=useState({ name:"", driveUrl:"", channel:"انستجرام", topic:"", format:"Static", slideCount:1, designText:"", pillar:"", status:"فكرة", scheduledDate:"", complianceFlag:"", notes:"" });
  const [err,setErr]=useState("");
  const create = useMutation({ mutationFn: async(v:any)=> await api.createOrganicPost(v), onSuccess:()=>{ setF({ name:"", driveUrl:"", channel:"انستجرام", topic:"", format:"Static", slideCount:1, designText:"", pillar:"", status:"فكرة", scheduledDate:"", complianceFlag:"", notes:"" }); inv(); } });
  const upd = useMutation({ mutationFn: async(v:any)=> await api.updateOrganicPost(v), onSuccess: inv });
  const del = useMutation({ mutationFn: async(id:number)=> await api.deleteOrganicPost({id}), onSuccess: inv });
  const [capDraft,setCapDraft]=useState<Record<string,{style:string,text:string,status:string}>>({});
  const saveCap = useMutation({ mutationFn: async(v:any)=> await api.saveOrganicCaption(v), onSuccess: inv });
  const delCap = useMutation({ mutationFn: async(id:number)=> await api.deleteOrganicCaption({id}), onSuccess: inv });
  const [finalDraft,setFinalDraft]=useState<Record<number,string>>({});
  const approveFinal = useMutation({ mutationFn: async(v:{postId:number, capId?:number, slot:number, style:string, text:string})=>{ if (v.capId) await api.saveOrganicCaption({ id: v.capId, postId: v.postId, slot: v.slot, style: v.style, text: v.text, status: "معتمدة" }); await api.updateOrganicPost({ id: v.postId, finalCaption: v.text }); }, onSuccess: inv });
  const capOf = (p:any, slot:number)=> (p.captions ?? []).find((c:any)=>c.slot===slot);
  const draftOf = (p:any, slot:number)=>{ const key = p.id+"-"+slot; const ex = capOf(p, slot); return capDraft[key] ?? { style: ex?.style || ORG_SLOTS[slot-1], text: ex?.text || "", status: ex?.status || "مسودة" }; };
  const setDraft = (p:any, slot:number, patch:any)=>{ const key = p.id+"-"+slot; setCapDraft({ ...capDraft, [key]: { ...draftOf(p, slot), ...patch } }); };
  const approvedCount = posts.reduce((a:number,p:any)=> a + (p.captions ?? []).filter((c:any)=>c.status==="معتمدة").length, 0);
  const scheduled = posts.filter((p:any)=>p.status==="مجدول");
  const published = posts.filter((p:any)=>p.status==="اتنشر");
  const pillars = [...new Set(posts.map((p:any)=>p.pillar).filter(Boolean))] as string[];
  const calendar = [...posts].filter((p:any)=>p.scheduledDate).sort((a:any,b:any)=> a.scheduledDate.localeCompare(b.scheduledDate));
  return (
    <section>
      <h2 className="font-bold text-xl">الأورجانيك — سوشيال ميديا من التصميم للنشر</h2>
      <p className="text-sm mt-1 leading-relaxed" style={{color:"var(--dim)"}}>مكتبة التصميمات العضوية + 3 بدائل كابشن لكل منشور (تعليمي / تفاعلي / بيع ناعم) — تختار بديلاً كنهائي أو تدمج بينهم في كابشن نهائي معتمد بيتحفظ على المنشور. كل الكابشنات بالعامية المصرية، وأي منشور عليه تنبيه امتثال بيظهر بعلم واضح. النشر الفعلي خارجي وباعتمادك — هنا التخطيط والاعتماد بس.</p>
      <div className="flex gap-2 flex-wrap mt-3">
        {[[`تصميمات في المكتبة`, posts.length],[`كابشنات معتمدة`, approvedCount],[`مجدولة`, scheduled.length],[`اتنشرت`, published.length]].map(([l,n])=>(
          <span key={l as string} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--surface)",border:"1px solid var(--border)"}}>{l}: <b>{n as number}</b></span>
        ))}
        {pillars.map(pl=>(<span key={pl} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--surface2)"}}>ركيزة: {pl} ({posts.filter((p:any)=>p.pillar===pl).length})</span>))}
      </div>

      <form className="rounded-2xl p-4 mt-4 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!f.name.trim()){setErr("اسم/ملف التصميم مطلوب");return;} setErr(""); create.mutate(f);}}>
        <h3 className="font-bold">تصميم عضوي جديد</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="og-name" className="text-sm font-normal block mb-1">اسم التصميم / الملف *</label><input id="og-name" {...FIELDS.createOrganicPost.name} value={f.name} onChange={e=>setF({...f,name:e.target.value})} className={inp} style={inpStyle} />{err && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{err}</p>}</div>
          <div><label htmlFor="og-drive" className="text-sm font-normal block mb-1">رابط Drive</label><input id="og-drive" {...FIELDS.createOrganicPost.driveUrl} value={f.driveUrl} onChange={e=>setF({...f,driveUrl:e.target.value})} className={inp} style={inpStyle} placeholder="https://drive.google.com/…" /></div>
          <div><label htmlFor="og-ch" className="text-sm font-normal block mb-1">القناة</label><select id="og-ch" value={f.channel} onChange={e=>setF({...f,channel:e.target.value})} className={inp} style={inpStyle}>{["انستجرام","فيسبوك","الاتنين"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="og-topic" className="text-sm font-normal block mb-1">الموضوع / المنتج</label><input id="og-topic" {...FIELDS.createOrganicPost.topic} value={f.topic} onChange={e=>setF({...f,topic:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="og-fmt" className="text-sm font-normal block mb-1">الفورمات</label><select id="og-fmt" value={f.format} onChange={e=>setF({...f,format:e.target.value})} className={inp} style={inpStyle}>{["Static","Carousel"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="og-slides" className="text-sm font-normal block mb-1">عدد الشرائح (للكاروسيل)</label><input id="og-slides" type="number" {...FIELDS.createOrganicPost.slideCount} value={f.slideCount} onChange={e=>setF({...f,slideCount:Number(e.target.value)})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="og-pillar" className="text-sm font-normal block mb-1">ركيزة المحتوى (Pillar)</label><input id="og-pillar" {...FIELDS.createOrganicPost.pillar} value={f.pillar} onChange={e=>setF({...f,pillar:e.target.value})} className={inp} style={inpStyle} placeholder="تعليمي / إثبات اجتماعي / عرض / تفاعلي" /></div>
          <div><label htmlFor="og-date" className="text-sm font-normal block mb-1">تاريخ النشر المخطط</label><input id="og-date" type="date" value={f.scheduledDate} onChange={e=>setF({...f,scheduledDate:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="og-status" className="text-sm font-normal block mb-1">الحالة</label><select id="og-status" value={f.status} onChange={e=>setF({...f,status:e.target.value})} className={inp} style={inpStyle}>{ORG_STATUSES.map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="og-flag" className="text-sm font-normal block mb-1">تنبيه امتثال (إن وجد)</label><select id="og-flag" value={f.complianceFlag} onChange={e=>setF({...f,complianceFlag:e.target.value})} className={inp} style={inpStyle}>{["","يلزم تنبيه الريتينول","يلزم مراجعة ادعاءات قبل النشر","محتوى قبل/بعد — يلزم فحص AEO"].map(s=>(<option key={s} value={s}>{s || "لا يوجد"}</option>))}</select></div>
        </div>
        <div><label htmlFor="og-text" className="text-sm font-normal block mb-1">النص المكتوب على التصميم نفسه</label><textarea id="og-text" {...FIELDS.createOrganicPost.designText} value={f.designText} onChange={e=>setF({...f,designText:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
        <button type="submit" aria-label="إضافة تصميم عضوي" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ إضافة للمكتبة</button>
      </form>

      <div className="grid gap-4 mt-4">
        {posts.length===0 && <Empty title="مكتبة التصميمات العضوية فارغة" hint="التصميمات الحقيقية وكابشناتها هتتسجل هنا — مفيش أي تصميم أو كابشن مُخترع. ابدأ من النموذج فوق أو من بنك الأفكار تحت." />}
        {posts.map((p:any)=>(
          <article key={p.id} className="rounded-2xl p-4" style={card}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-xs mt-1 flex gap-2 flex-wrap" style={{color:"var(--dim)"}}>
                  <span className="font-normal px-2 py-0.5 rounded-full" style={{background:"var(--surface2)",color:"var(--text)"}}>{p.channel}</span>
                  <span>{p.format}{p.format==="Carousel" ? ` · ${p.slideCount} شريحة` : ""}</span>
                  {p.topic && <span>· {p.topic}</span>}
                  {p.pillar && <span>· ركيزة: {p.pillar}</span>}
                  {p.scheduledDate && <span>· نشر مخطط: {p.scheduledDate}</span>}
                </p>
                {p.complianceFlag && <p className="mt-2"><span className="pill pill-draft">⚠️ {p.complianceFlag}</span></p>}
                {p.designText && <p className="text-sm mt-2 rounded-xl p-3 whitespace-pre-wrap" style={{background:"var(--bg)",border:"1px solid var(--border)"}}><b>نص التصميم:</b> {p.designText}</p>}
                {p.driveUrl && <a href={p.driveUrl} target="_blank" rel="noreferrer" className="inline-block text-xs font-normal underline mt-2">فتح التصميم على Drive ↗</a>}
              </div>
              <div className="flex gap-2 items-center shrink-0">
                <select aria-label={`حالة ${p.name}`} value={p.status} onChange={e=>upd.mutate({id:p.id,status:e.target.value})} className="rounded-xl px-2 py-1.5 border text-xs font-normal" style={inpStyle}>{ORG_STATUSES.map(s=>(<option key={s}>{s}</option>))}</select>
                <DelBtn label={`حذف تصميم ${p.name}`} onClick={()=>del.mutate(p.id)} />
              </div>
            </div>

            <h4 className="font-normal text-sm mt-4">الكابشنات — 3 بدائل لكل منشور</h4>
            <div className="grid md:grid-cols-3 gap-3 mt-2">
              {[1,2,3].map(slot=>{
                const ex = capOf(p, slot);
                const d = draftOf(p, slot);
                return (
                  <div key={slot} className="rounded-xl p-3" style={{background:"var(--bg)",border:`1px solid ${ex?.status==="معتمدة" ? "var(--success)" : "var(--border)"}`}}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-normal text-sm">بديل {slot} — {d.style}</p>
                      {ex?.status==="معتمدة" && <span className="pill pill-live">معتمد</span>}
                    </div>
                    <input aria-label={`أسلوب كابشن ${slot} لـ ${p.name}`} {...FIELDS.saveOrganicCaption.style} value={d.style} onChange={e=>setDraft(p, slot, {style:e.target.value})} className={inp + " mt-2"} style={inpStyle} placeholder="الأسلوب: تعليمي / تفاعلي / بيع ناعم" />
                    <textarea aria-label={`نص كابشن ${slot} لـ ${p.name}`} {...FIELDS.saveOrganicCaption.text} value={d.text} onChange={e=>setDraft(p, slot, {text:e.target.value})} rows={4} className={inp + " mt-2"} style={inpStyle} placeholder={ex ? "" : "لسه مفيش كابشن في البديل ده — البدائل بتتكتب وتتسجل هنا"} />
                    <div className="flex gap-2 items-center mt-2 flex-wrap">
                      <select aria-label={`حالة كابشن ${slot} لـ ${p.name}`} value={d.status} onChange={e=>setDraft(p, slot, {status:e.target.value})} className="rounded-xl px-2 py-1.5 border text-xs" style={inpStyle}>{ORG_CAP_STATUSES.map(s=>(<option key={s}>{s}</option>))}</select>
                      <button onClick={()=>saveCap.mutate({ id: ex?.id, postId: p.id, slot, style: d.style, text: d.text, status: d.status })} aria-label={`حفظ كابشن ${slot} لـ ${p.name}`} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF6EE"}}>حفظ</button>
                      {ex && <DelBtn label={`حذف كابشن ${slot} لـ ${p.name}`} onClick={()=>delCap.mutate(ex.id)} />}
                    </div>
                    <button onClick={()=>{ if(!d.text.trim()) return; approveFinal.mutate({ postId: p.id, capId: ex?.id, slot, style: d.style, text: d.text }); }} disabled={!d.text.trim()} aria-label={`اختيار كابشن ${slot} كنهائي لـ ${p.name}`} className="mt-2 w-full text-xs font-normal px-3 py-2 rounded-full disabled:opacity-40" style={{background:"var(--accent)",color:"#FFFFFF"}}>اختيار البديل ده ككابشن نهائي ✓</button>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl p-3 mt-3" style={{background:"var(--teal-mist)",border:"1px solid var(--border)"}}>
              <p className="font-normal text-sm">الكابشن النهائي المعتمد {p.finalCaption ? "✓ محفوظ على المنشور" : "— لسه مفيش (اختر بديلاً أو ادمج هنا)"}</p>
              <textarea aria-label={`الكابشن النهائي لـ ${p.name}`} {...FIELDS.updateOrganicPost.finalCaption} value={finalDraft[p.id] ?? p.finalCaption} onChange={e=>setFinalDraft({...finalDraft,[p.id]:e.target.value})} rows={3} className={inp + " mt-2"} style={inpStyle} placeholder="ادمج أفضل أجزاء البدائل هنا وعدّل براحتك — ده اللي هيتنشر فعلياً بعد اعتمادك" />
              <button onClick={()=>upd.mutate({ id: p.id, finalCaption: finalDraft[p.id] ?? p.finalCaption })} aria-label={`حفظ الكابشن النهائي لـ ${p.name}`} className="mt-2 text-xs font-normal px-4 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF6EE"}}>حفظ الكابشن النهائي المعتمد</button>
            </div>
          </article>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">تقويم النشر العضوي</h3>
          <div className="grid gap-2 mt-3">
            {calendar.length===0 && <p className="text-sm" style={{color:"var(--dim)"}}>لا منشورات مجدولة بتاريخ — حدّد «تاريخ النشر المخطط» لأي تصميم وهيظهر هنا مرتباً.</p>}
            {calendar.map((p:any)=>(
              <div key={p.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
                <span className="font-cairo font-normal text-sm shrink-0" dir="ltr">{p.scheduledDate}</span>
                <span className="flex-1 min-w-0"><span className="block font-normal text-sm truncate">{p.name}</span><span className="block text-xs" style={{color:"var(--dim)"}}>{p.channel}{p.pillar ? ` · ${p.pillar}` : ""}</span></span>
                <span className={p.status==="اتنشر" ? "pill pill-live" : p.status==="مجدول" ? "pill pill-pending" : p.status==="معتمد" ? "pill pill-live" : "pill pill-draft"}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">بنك الأفكار — من أسئلة العملاء ولغة البحث</h3>
          <p className="text-xs mt-1" style={{color:"var(--dim)"}}>ثيمات العملاء المسجلة وكلمات البحث المتعقبة — حوّل أي واحدة لفكرة تصميم في المكتبة بضغطة.</p>
          <div className="grid gap-2 mt-3 max-h-96 overflow-y-auto">
            {(insights ?? []).length===0 && (keywords ?? []).length===0 && <p className="text-sm" style={{color:"var(--dim)"}}>البنك فارغ — ثيمات العملاء (من السوق والمنافسين) وكلمات البحث (من التشغيل والتعلّم) هتغذي البنك تلقائياً أول ما تتسجل.</p>}
            {(insights ?? []).map((x:any)=>(
              <div key={"ci"+x.id} className="rounded-xl p-3 flex items-start justify-between gap-2" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
                <div className="min-w-0"><p className="font-normal text-sm">💬 {x.theme}</p>{x.summary && <p className="text-xs mt-0.5" style={{color:"var(--dim)"}}>{x.summary}</p>}</div>
                <button onClick={()=>create.mutate({ name: x.theme, driveUrl:"", channel:"انستجرام", topic: x.summary || "", format:"Static", slideCount:1, designText:"", pillar:"", status:"فكرة", scheduledDate:"", complianceFlag:"", notes:"من بنك الأفكار — ثيمة عميل" })} aria-label={`تحويل ثيمة ${x.theme} لفكرة تصميم`} className="text-xs font-normal px-3 py-2 rounded-full shrink-0" style={{background:"var(--teal)",color:"#FFF6EE"}}>أضف كفكرة</button>
              </div>
            ))}
            {(keywords ?? []).map((x:any)=>(
              <div key={"kw"+x.id} className="rounded-xl p-3 flex items-start justify-between gap-2" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
                <div className="min-w-0"><p className="font-normal text-sm">🔍 {x.keyword}</p>{x.suggestions && <p className="text-xs mt-0.5 whitespace-pre-wrap" style={{color:"var(--dim)"}}>{x.suggestions.slice(0,160)}</p>}</div>
                <button onClick={()=>create.mutate({ name: `محتوى عضوي عن: ${x.keyword}`, driveUrl:"", channel:"انستجرام", topic: x.keyword, format:"Static", slideCount:1, designText:"", pillar:"تعليمي", status:"فكرة", scheduledDate:"", complianceFlag:"", notes:"من بنك الأفكار — لغة بحث Google Egypt" })} aria-label={`تحويل كلمة ${x.keyword} لفكرة تصميم`} className="text-xs font-normal px-3 py-2 rounded-full shrink-0" style={{background:"var(--teal)",color:"#FFF6EE"}}>أضف كفكرة</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function App() {
  const [tab, setTab] = useState<Tab>("thinking");
  const [subs, setSubs] = useState<Record<string,string>>({});
  const sub = (host: string, def: string) => subs[host] ?? def;
  const setSub = (host: string, v: string) => setSubs(s=>({ ...s, [host]: v }));
  const [side, setSide] = useState<"open"|"closed">(()=>{ try { return localStorage.getItem("zyra-side")==="closed" ? "closed" : "open"; } catch { return "open"; } });
  const [drawer, setDrawer] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [dashStatusOpen, setDashStatusOpen] = useState(false);
  const toggleSide = () => setSide(s=>{ const n = s==="open" ? "closed" : "open"; try { localStorage.setItem("zyra-side", n); } catch { /* storage unavailable */ } return n; });
  const expanded = side==="open";
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries();
  // Performance: each list loads ONLY when a section that displays it is open
  // (previously all 26 fired at startup). staleTime keeps tab switches instant.
  const STALE = 60_000;
  const on = (...ts: Tab[]) => ts.includes(tab);
  const dash = useQuery({ queryKey:["dashboard"], queryFn:()=>api.getDashboard({}), staleTime: STALE });
  const profileQ = useQuery({ queryKey:["coreProfile"], queryFn:()=>api.getCoreProfile({}), staleTime: STALE });
  const productsQ = useQuery({ queryKey:["products"], queryFn:()=>api.listProducts({limit:100}), staleTime: STALE, enabled: on("command","relaunch","system") });
  const workQ = useQuery({ queryKey:["work"], queryFn:()=>api.listWorkItems({limit:100}), staleTime: STALE, enabled: on("command","relaunch") });
  const tasksQ = useQuery({ queryKey:["tasks"], queryFn:()=>api.listTasks({limit:100}), staleTime: STALE, enabled: on("command","relaunch","campaigns","system") });
  const campQ = useQuery({ queryKey:["campaigns"], queryFn:()=>api.listCampaigns({limit:100}), staleTime: STALE, enabled: on("command","relaunch","campaigns") });
  const creaQ = useQuery({ queryKey:["creatives"], queryFn:()=>api.listCreatives({limit:100}), staleTime: STALE, enabled: on("thinking","command","relaunch","content") });
  const contentQ = useQuery({ queryKey:["content"], queryFn:()=>api.listContent({limit:100}), staleTime: STALE, enabled: on("relaunch","content") });
  const compQ = useQuery({ queryKey:["competitors"], queryFn:()=>api.listCompetitors({limit:100}), staleTime: STALE, enabled: on("command","system","market","ops") });
  const obsQ = useQuery({ queryKey:["observations"], queryFn:()=>api.listObservations({limit:100}), staleTime: STALE, enabled: on("thinking","market") });
  const custQ = useQuery({ queryKey:["custInsights"], queryFn:()=>api.listCustomerInsights({limit:100}), staleTime: STALE, enabled: on("market","organic") });
  const snapQ = useQuery({ queryKey:["snapshots"], queryFn:()=>api.listSnapshots({limit:100}), staleTime: STALE, enabled: on("command","campaigns","finance") });
  const expQ = useQuery({ queryKey:["experiments"], queryFn:()=>api.listExperiments({limit:100}), staleTime: STALE, enabled: on("command","relaunch","ops") });
  const revQ = useQuery({ queryKey:["reviews"], queryFn:()=>api.listReviews({limit:100}), staleTime: STALE, enabled: on("ops","organic") });
  const apprQ = useQuery({ queryKey:["approvals"], queryFn:()=>api.listApprovals({limit:100}), staleTime: STALE, enabled: on("command","campaigns") });
  const learnQ = useQuery({ queryKey:["learnings"], queryFn:()=>api.listLearnings({limit:100}), staleTime: STALE, enabled: on("ops") });
  const execQ = useQuery({ queryKey:["executions"], queryFn:()=>api.listExecutions({limit:100}), staleTime: STALE, enabled: on("campaigns") });
  const roundsQ = useQuery({ queryKey:["rounds"], queryFn:()=>api.listMarketRounds({limit:100}), staleTime: STALE, enabled: on("command","market","relaunch") });
  const alertsQ = useQuery({ queryKey:["alerts"], queryFn:()=>api.listCompetitorAlerts({limit:100}), staleTime: STALE, enabled: on("command","market") });
  const plansQ = useQuery({ queryKey:["plans"], queryFn:()=>api.listAgentPlans({limit:100}), staleTime: STALE, enabled: on("command","relaunch","ask","system") });
  const goalsQ = useQuery({ queryKey:["goals"], queryFn:()=>api.listRelaunchGoals({limit:100}), staleTime: STALE, enabled: on("command","relaunch") });
  const syncsQ = useQuery({ queryKey:["syncs"], queryFn:()=>api.listSyncs({limit:100}), staleTime: STALE, enabled: on("command","market","system") });
  const genQ = useQuery({ queryKey:["genRequests"], queryFn:()=>api.listGenerationRequests({limit:100}), staleTime: STALE, enabled: on("command","content","system") });
  const activityQ = useQuery({ queryKey:["activity"], queryFn:()=>api.listActivity({limit:100}), staleTime: STALE, enabled: on("relaunch","system") });
  const auditQ = useQuery({ queryKey:["audit"], queryFn:()=>api.listAuditState({}), staleTime: STALE, enabled: on("finance") });
  const opsQ = useQuery({ queryKey:["ops"], queryFn:()=>api.getOpsState({}), staleTime: STALE, enabled: on("ops","organic") });
  const organicQ = useQuery({ queryKey:["organicPosts"], queryFn:()=>api.listOrganicPosts({limit:100}), staleTime: STALE, enabled: on("organic") });
  const thinkingQ = useQuery({ queryKey:["thinking"], queryFn:()=>api.listThinking({limit:100}), staleTime: STALE, enabled: on("thinking") });
  const ownerPlansQ = useQuery({ queryKey:["ownerPlans"], queryFn:()=>api.listOwnerPlans({limit:100}), staleTime: STALE, enabled: on("thinking") });
  const creaAnQ = useQuery({ queryKey:["creativeAnalyses"], queryFn:()=>api.listCreativeAnalyses({limit:100}), staleTime: STALE, enabled: on("thinking","content") });
  const compAnQ = useQuery({ queryKey:["competitorAdAnalyses"], queryFn:()=>api.listCompetitorAdAnalyses({limit:100}), staleTime: STALE, enabled: on("thinking","market") });

  const refreshMut = useMutation({ mutationFn: async()=> await api.refreshDaily({}), onSuccess: inv });
  const profile = profileQ.data?.profile ?? null;
  const payday = paydayInfo();
  const todayStr = new Date().toISOString().slice(0,10);
  const completeness = useMemo(()=>{
    const checks: {label:string, ok:boolean}[] = [
      { label:"اسم البراند + لينك الويبسايت", ok: !!(profile?.brandName && profile?.websiteUrl) },
      { label:"منتج واحد على الأقل بسعر وCOGS", ok: (productsQ.data?.products ?? []).some(p=>p.price>0 && p.cogs>0) },
      { label:"اقتصاديات COD (شحن + تغليف + RTO)", ok: !!(profile && profile.shipCost>0 && profile.packCost>=0 && profile.rtoCost>0) },
      { label:"WhatsApp Confirmation % و Delivery %", ok: !!(profile && profile.whatsappConfirmPct>0 && profile.deliveryPct>0) },
      { label:"Hero Offer وسياسات موثقة", ok: !!(profile?.heroOffer && profile?.shippingPolicy) },
      { label:"ICP بصيغة 7Ws", ok: !!profile?.icp7ws },
      { label:"ادعاءات معتمدة وممنوعة + صوت البراند", ok: !!(profile?.approvedClaims && profile?.bannedClaims) },
      { label:"Customer Voice (عبارات واعتراضات حقيقية)", ok: !!profile?.customerVoice },
      { label:"منافس أساسي واحد على الأقل", ok: (compQ.data?.competitors ?? []).length>0 },
      { label:"إعدادات قرار الميديا (Target CPP + قواعد Kill/Scale)", ok: !!(profile && profile.targetCpp>0 && profile.killRule && profile.scaleRule) },
      { label:"أداء إعلانات 30d / 7d مدخل", ok: !!(profile?.adPerf30d || profile?.adPerf7d) },
      { label:"Creative Inventory", ok: !!profile?.creativeInventory },
    ];
    const done = checks.filter(c=>c.ok).length;
    return { checks, pct: Math.round(done/checks.length*100), done, total: checks.length };
  }, [profile, productsQ.data, compQ.data]);
  const netCodRate = profile ? Math.round(profile.whatsappConfirmPct * profile.deliveryPct / 100 * 10)/10 : 0;
  const overdue = (workQ.data?.items ?? []).filter(w=>w.dueDate && w.dueDate < todayStr && !["Completed","Failed"].includes(w.status));
  const outcomeDue = [...(workQ.data?.items ?? []).filter(w=>w.status==="Outcome Review"), ...(tasksQ.data?.tasks ?? []).filter(t=>t.status==="Outcome Review")];
  const egp = (n:number)=> n.toLocaleString("en-US",{maximumFractionDigits:2}) + " EGP";

  // Ask Zyra — planner: classify goal to A–G, build an 8-stage plan, owner approves → work items
  const [askText,setAskText]=useState(""); const [askErr,setAskErr]=useState("");
  const classifyGoal = (t:string): string => {
    const s = t.toLowerCase();
    if (/(kill|scale|pause|إيقاف|قتل|تكبير|حكم على إعلان)/.test(s)) return "D";
    if (/(منافس|سوق|competitor|market|ads library)/.test(s)) return "G";
    if (/(منتج جديد|إطلاق منتج|cold start|روتين جديد)/.test(s)) return "E";
    if (/(امتثال|aeo|تدقيق|compliance|فحص كوبي)/.test(s)) return "F";
    if (/(أسبوع|flywheel|مراجعة أسبوعية)/.test(s)) return "B";
    if (/(استراتيج|شهر|ربع|خطة شاملة|relaunch)/.test(s)) return "C";
    return "A";
  };
  const SECTION_FOR: Record<string,{tab:Tab,label:string}> = { A:{tab:"content",label:"المحتوى والكرييتف"}, B:{tab:"ops",label:"التشغيل والتعلّم"}, C:{tab:"relaunch",label:"الريلونش"}, D:{tab:"campaigns",label:"الحملات والميديا باير"}, E:{tab:"system",label:"النظام — المدخلات الأساسية"}, F:{tab:"content",label:"المحتوى والكرييتف — Validator"}, G:{tab:"market",label:"السوق والمنافسين"} };
  const buildSteps = (goal:string, type:string) => {
    const sec = SECTION_FOR[type] ?? SECTION_FOR["A"]!;
    return [
      { step:`تحديد الهدف التجاري الحقيقي: ${goal}`, stage:"UNDERSTAND", section:"مركز القيادة", detail:"صياغة الهدف بمقياس نجاح واحد واضح قبل أي تنفيذ (No Vagueness)." },
      { step:"جمع الأدلة من المدخلات الأساسية والسوق", stage:"RETRIEVE", section:"المدخلات الأساسية + متابعة السوق", detail:"منتجات وأسعار موثقة من الويبسايت + آخر جولات السوق — أي نقص يُوسم Uncertainty Flag." },
      { step:"بناء خطة التنفيذ بالفريمورك المناسب", stage:"PLAN", section:sec.label, detail:"اختيار الزاوية/الهيكلة/القاعدة الحاكمة مع سلسلة منطق ظاهرة (Chain of Reasoning)." },
      { step:"التنفيذ كمسودات داخل القسم المختص", stage:"EXECUTE", section:sec.label, detail:"إنتاج داخلي فقط — لا نشر ولا ميزانية ولا رسائل خارجية في هذه المرحلة." },
      { step:"نقد ذاتي: أين أضعف حلقة في الخطة؟", stage:"CRITIQUE", section:sec.label, detail:"فحص الافتراضات والعينة والبدائل قبل الاعتماد." },
      { step:"تحقق: COD Math + AEO + Payday", stage:"VALIDATE", section:"الماليات + الكرييتيف", detail:"‏GPT<0 يوقف كل شيء · AEO FAIL = DO NOT SHIP · Payday يحكم توقيت الـ Scale." },
      { step:"مراجعة وتصحيح بناءً على نتائج التحقق", stage:"REVISE", section:sec.label, detail:"تعديل متغير واحد في كل مرة وتوثيق سبب التعديل." },
      { step:"التسليم للمالك + تسجيل التعلم المتوقع", stage:"DELIVER & LEARN", section:"الاعتمادات + التجارب والتعلم", detail:"المخرج يروح Approvals، والنتيجة المتوقعة تتسجل لمراجعة Outcome لاحقاً." },
    ];
  };
  const [planPreview,setPlanPreview]=useState<{goal:string,type:string,steps:ReturnType<typeof buildSteps>}|null>(null);
  const planMut = useMutation({ mutationFn: async()=> await api.createAgentPlan({ goal: planPreview!.goal, taskType: planPreview!.type as "A", steps: planPreview!.steps }), onSuccess:()=>{ inv(); } });
  const approvePlanMut = useMutation({ mutationFn: async(p:any)=>{ await api.updateAgentPlan({ id:p.id, status:"Approved" }); const sec = SECTION_FOR[p.taskType] ?? SECTION_FOR["A"]!; for (const s of p.steps) { await api.createWorkItem({ title: s.step, sourceType: "Plan", ownerRole: p.taskType==="D" ? "Media Buyer" : p.taskType==="G" ? "Analyst" : p.taskType==="A"||p.taskType==="F" ? "Creative" : "Owner", priority:"Medium", dueDate:"", progress:0, blocker:"", nextAction: s.detail, notes: `من خطة معتمدة: ${p.goal} · مرحلة ${s.stage} · القسم: ${sec.label}` }); } await api.createTask({ title: p.goal, type: p.taskType as "A", objective:"", evidenceTag:"UNKNOWN", assumptions:"", confidence:50, freshness:"", notes:"خطة معتمدة من Ask Zyra — عناصرها في متابعة الشغل" }); }, onSuccess:()=>{ inv(); setTab("relaunch"); setSub("relaunch","work"); } });
  const importMut = useMutation({ mutationFn: async()=> await api.importWebsiteData({}), onSuccess: inv });

  // System-status block: lives ONLY inside the dashboard (collapsible card)
  // and in the on-demand status modal — never fixed above other tabs.
  const goStage = (t: Tab) => { setStatusOpen(false); setTab(t); };
  const statusBlock = (
    <div>
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--accent)",color:"#FFFFFF"}}>🚀 وضع التشغيل الحالي: RELAUNCH PHASE — Dual Hero (سيلوليت 799 + جلد الوزة 799)</span>
        <span className="text-xs font-normal px-3 py-2 rounded-full" style={{background: payday.state==="PAYDAY" ? "#D92D20" : payday.state==="CAUTION" ? "#DC6803" : "#067647", color:"#fff"}}>Payday Cycle — يوم {payday.day}: {payday.label}</span>
        <button onClick={()=>{ setStatusOpen(false); setTab("system"); setSub("system","inputs"); }} aria-label="اكتمال المدخلات الأساسية" className="text-xs font-normal ps-1.5 pe-3 py-1.5 rounded-full flex items-center gap-2" style={{background:"var(--surface)",border:"1px solid var(--border)"}}><ProgressRing pct={completeness.pct} size={30} />اكتمال المدخلات الأساسية: {completeness.done}/{completeness.total}</button>
        <span className="text-xs px-3 py-2 rounded-full" style={{background:"var(--surface)",border:"1px solid var(--border)"}}>Net COD Rate: {profile && profile.whatsappConfirmPct>0 && profile.deliveryPct>0 ? netCodRate + "%" : "UNKNOWN — غير مُدخلة"}</span>
        <span className="text-xs px-3 py-2" style={{color:"var(--dim)"}}>{dash.data?.lastCheckAt ? "آخر فحص مصادر: " + new Date(dash.data.lastCheckAt).toLocaleString("ar-EG") : "لسه مفيش فحص مصادر مسجل"}</span>
        <button onClick={()=>importMut.mutate()} aria-label="قراءة ومزامنة بيانات الويبسايت" className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>{importMut.isPending ? "جاري قراءة الويبسايت…" : "⇩ اقرأ/زامن من zyra-care.com"}</button>
        <span className="text-xs px-3 py-2" style={{color:"var(--dim)"}}>{dash.data?.lastSyncAt ? <>🟢 آخر قراءة ويبسايت: {new Date(dash.data.lastSyncAt).toLocaleString("ar-EG")} <span dir="ltr" style={{unicodeBidi:"isolate"}}>({freshness(dash.data.lastSyncAt).label})</span></> : "الويبسايت لسه ما اتقراش من جوه النظام"}</span>
      </div>
      <div className="rounded-2xl px-4 py-3 mt-3 flex flex-wrap items-center gap-2" style={{background:"var(--teal-mist)",border:"1px solid var(--border)"}}>
        <span className="text-xs font-normal">🧭 Master Growth OS يسري هنا وفي كل قسم:</span>
        {GROWTH_STAGES.map(s=>(<button key={s.n} onClick={()=>goStage(s.go)} aria-label={`مرحلة ${s.n} ${s.t}`} className="text-xs font-normal px-2.5 py-1 rounded-full" style={{background:"var(--surface)",border:"1px solid var(--border)"}}>{s.n}. {s.t}</button>))}
        <span className="text-xs" style={{color:"var(--dim)"}}>كل مهمة كحد أدنى: Stage 1 وسوم أدلة + Stage 6 نقد وفحص حتمي. {GOVERNANCE}</span>
      </div>
      <div className="flex gap-2 flex-wrap mt-2">
        {["المدخلات الأساسية: يدخلها المالك","Website: مصدر عام للمنتجات والعروض والسياسات","Meta Ads Library: إعلانات منافسين عامة فقط","TikTok Ads Library: أنماط كرييتيف عامة فقط"].map(s=>(
          <span key={s} className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--surface2)",border:"1px solid var(--border)"}}>{s}</span>
        ))}
        <span className="text-xs px-3 py-1.5 font-normal" style={{color:"var(--warning)"}}>لا يوجد أي اتصال حي بحساب إعلانات خاص — كل قرار Kill/Scale مقترح يروح Approvals</span>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen lg:flex" style={{background:"var(--bg)",color:"var(--text)"}}>
      <SafeAreaTopScrim backgroundColor="var(--bg)" />
      {/* Sidebar backdrop (mobile drawer) */}
      {drawer && <button aria-label="إغلاق القائمة الجانبية" onClick={()=>setDrawer(false)} className="fixed inset-0 z-30 lg:hidden" style={{background:"rgba(43,26,8,0.45)", minHeight:0}} />}
      {/* Sidebar — Deep Teal per the owner's reference, gold leaf corner art;
          fixed ~268px, collapsible to an icons-only rail; content flexes to fill */}
      <aside className={`fixed inset-y-0 right-0 z-40 w-[268px] max-w-[85vw] shrink-0 overflow-y-auto overflow-x-hidden p-3.5 transform transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${drawer ? "translate-x-0" : "translate-x-full"} ${expanded ? "lg:w-[268px]" : "lg:w-[76px]"}`} style={{background:"var(--grad-sidebar)",color:"#FFF6EE",borderLeft:"1px solid rgba(255,255,255,0.10)",boxShadow:"-6px 0 24px rgba(1,38,35,0.25)"}}>
        {/* Brand block — official logo on ivory so its colors read correctly */}
        <div className="flex items-center gap-3 relative z-10">
          <span className="rounded-2xl shrink-0 overflow-hidden flex items-center justify-center" style={{background:"#FFFFFF",width:46,height:46,padding:4,border:"1px solid var(--border)",boxShadow:"0 2px 8px rgba(101,67,33,0.10)"}}><img src={zyraLogo} alt="ZYRA — Seeds of Beauty" className="w-full h-full object-contain" /></span>
          <div className={expanded ? "" : "lg:hidden"}>
            <p className="font-extrabold leading-tight" style={{fontFamily:"'Alexandria',sans-serif",fontSize:17}}>ZYRA <span style={{color:"#D9A05B"}}>OS</span> <span className="text-xs font-bold opacity-80">v3.3</span></p>
            <p className="text-[11px] opacity-80 mt-0.5">قسم الذكاء التسويقي</p>
          </div>
          <button onClick={()=>setDrawer(false)} aria-label="إغلاق القائمة" className="mr-auto lg:hidden px-2.5 py-1.5 rounded-lg text-sm shrink-0" style={{background:"rgba(255,255,255,0.12)",color:"#FFF6EE"}}>✕</button>
        </div>
        <p className={`text-[11px] mt-2.5 opacity-75 relative z-10 ${expanded ? "" : "lg:hidden"}`}>وكيل ذكاء التسويق — AI يفسّر • الكود يحسب • إنت تقرر</p>
        <nav aria-label="أقسام النظام" className="mt-4 relative z-10">
          <div className="flex flex-col gap-1.5">
            {NAV_MAIN.map(id=>{ const t = TABS.find(x=>x.id===id)!; const active = tab===t.id; const badge = t.id==="campaigns" ? (dash.data?.approvalsPending ?? 0) : t.id==="relaunch" ? overdue.length + outcomeDue.length : 0; return (
              <button key={t.id} onClick={()=>{ setTab(t.id); setDrawer(false); }} aria-label={t.en} title={t.label} className={`nav-item ${active ? "active" : ""}`}>
                <span className="nav-chip relative" style={{background: active ? "rgba(1,56,53,0.10)" : "rgba(255,255,255,0.09)", boxShadow:"none", color: active ? "#013835" : "#FFF6EE"}}>{NAV_ICONS[t.id]}{badge>0 && !expanded && <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full hidden lg:block" style={{background:"#D92D20",border:"1.5px solid #FFFFFF"}} />}</span>
                <span className={expanded ? "" : "lg:hidden"}>{t.label}</span>
                {badge>0 && <span className={`mr-auto text-xs px-2 py-0.5 rounded-full ${expanded ? "" : "lg:hidden"}`} style={{background:"#D92D20",color:"#fff"}}>{badge}</span>}
              </button>
            );})}
          </div>
        </nav>
        {/* Pinned bottom: Ask Zyra card + System & Settings + status + utilities */}
        <div className="mt-4 pt-3 relative z-10" style={{borderTop:"1px solid rgba(255,255,255,0.14)"}}>
          <button onClick={()=>{ setTab("ask"); setDrawer(false); }} aria-label="اسأل زيرا الذكية" title="اسأل زيرا الذكية" className="w-full rounded-2xl p-3 text-right transition-all" style={{background: tab==="ask" ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.35)", color:"#FFF6EE"}}>
            <span className="flex items-center gap-2 font-normal text-sm"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 3l1.7 4.6L18.3 9.3l-4.6 1.7L12 15.6l-1.7-4.6L5.7 9.3l4.6-1.7L12 3Z"/><path d="M18.6 15.2l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8.8-2.1Z"/></svg><span className={expanded ? "" : "lg:hidden"}>اسأل زيرا الذكية</span></span>
            <span className={`block text-[11px] mt-1 opacity-85 ${expanded ? "" : "lg:hidden"}`}>حلل، ابحث، اقترح، ونفّذ بعد موافقتك</span>
          </button>
          {(()=>{ const t = TABS.find(x=>x.id==="system")!; const active = tab==="system"; return (
            <button onClick={()=>{ setTab("system"); setDrawer(false); }} aria-label={t.en} title={t.label} className={`nav-item mt-2 ${active ? "active" : ""}`}>
              <span className="nav-chip" style={{background: active ? "rgba(1,56,53,0.10)" : "rgba(255,255,255,0.09)", boxShadow:"none", color: active ? "#013835" : "#FFF6EE"}}>{NAV_ICONS.system}</span>
              <span className={expanded ? "" : "lg:hidden"}>{t.label}</span>
            </button> );})()}
          {/* System status lives here + in the dashboard only — no fixed header bar */}
          <button onClick={()=>setStatusOpen(true)} aria-label="حالة النظام — فتح لوحة حالة النظام" title="حالة النظام" className="nav-item mt-2">
            <span className="nav-chip relative" style={{background:"rgba(255,255,255,0.09)", boxShadow:"none", color:"#FFF6EE"}}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12h4l2.5-6 4 12L16 12h5"/></svg><span className="absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full" style={{background: dash.data?.lastSyncAt ? "#43B581" : "#E0A83E"}} /></span>
            <span className={expanded ? "" : "lg:hidden"}>حالة النظام · {completeness.pct}%</span>
          </button>
          <button onClick={()=>refreshMut.mutate()} aria-label="تشغيل الفحص اليومي" title="فحص يومي للمصادر" className="mt-3 w-full px-4 py-2 rounded-xl font-normal text-sm" style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.20)",color:"#FFF6EE"}}>{expanded ? (refreshMut.isPending ? "جاري الفحص…" : "↻ فحص يومي للمصادر") : "↻"}</button>
          <button onClick={toggleSide} aria-label={expanded ? "طي القائمة الجانبية" : "توسيع القائمة الجانبية"} title={expanded ? "طي القائمة" : "توسيع القائمة"} className="mt-2 w-full px-4 py-2 rounded-xl font-normal text-sm hidden lg:flex items-center justify-center gap-2" style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.20)",color:"#FFF6EE"}}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9.5 4v16"/></svg>
            {expanded && <span>طي القائمة</span>}
          </button>
        </div>
        {/* Botanical gold-leaf corner art (reference) */}
        <svg aria-hidden="true" className={`absolute bottom-0 left-0 w-36 pointer-events-none ${expanded ? "" : "lg:hidden"}`} style={{opacity:0.5}} viewBox="0 0 100 100" fill="none" stroke="#D9A05B" strokeWidth="1.5" strokeLinecap="round"><path d="M8 96C8 58 34 30 72 20c-1 38-24 66-64 76Z"/><path d="M8 96c14-26 34-46 58-60"/><path d="M28 94c3-16 11-30 24-42"/><path d="M48 90c2-10 7-19 14-27"/></svg>
      </aside>

      <div className="flex-1 min-w-0">
        {/* NO fixed/sticky header bar (owner's final order). On mobile only, a
            STATIC row at the very top of the page flow (scrolls away with the
            page): menu button + logo + system-status button. Desktop has no
            bar at all — the sidebar carries everything. */}
        <div className="lg:hidden flex items-center gap-2.5 px-3 pt-3">
          <button onClick={()=>setDrawer(true)} aria-label="فتح القائمة الجانبية" className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-normal text-sm shrink-0" style={{background:"var(--surface)",border:"1px solid var(--border)",color:"#013835"}}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/></svg>
            القائمة
          </button>
          <span className="w-8 h-8 rounded-lg shrink-0 overflow-hidden flex items-center justify-center" style={{background:"#FFFFFF",border:"1px solid var(--border)",padding:2}}><img src={zyraLogo} alt="ZYRA" className="w-full h-full object-contain" /></span>
          <p className="font-normal text-sm leading-tight truncate" style={{color:"#013835"}}>وكيل ذكاء التسويق</p>
          <button onClick={()=>setStatusOpen(true)} aria-label="حالة النظام — فتح لوحة حالة النظام" title="حالة النظام" className="mr-auto flex items-center gap-2 ps-2 pe-3 py-1.5 rounded-full font-normal text-xs shrink-0" style={{background:"var(--teal)",color:"#FFF6EE"}}>
            <span className="relative flex w-5 h-5 items-center justify-center"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12h4l2.5-6 4 12L16 12h5"/></svg><span className="absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full" style={{background: dash.data?.lastSyncAt ? "#43B581" : "#E0A83E"}} /></span>
            حالة النظام · {completeness.pct}%
          </button>
        </div>
        {/* System-status modal — the full status block on demand only */}
        {statusOpen && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3" role="dialog" aria-modal="true" aria-label="حالة النظام">
            <button aria-label="إغلاق حالة النظام" onClick={()=>setStatusOpen(false)} className="absolute inset-0" style={{background:"rgba(43,26,8,0.45)", minHeight:0}} />
            <div className="relative w-full max-w-2xl max-h-[86vh] overflow-y-auto rounded-2xl p-4" style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-lift)"}}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="font-bold">حالة النظام</h2>
                <button onClick={()=>setStatusOpen(false)} aria-label="إغلاق" className="px-2.5 py-1 rounded-lg text-sm shrink-0" style={{background:"var(--surface2)",border:"1px solid var(--border)"}}>✕</button>
              </div>
              {statusBlock}
            </div>
          </div>
        )}
        <main className="px-3 md:px-5 pb-10 pt-3 w-full min-w-0">
        {(dash.isLoading || profileQ.isLoading) && <div className="skeleton-bar mb-4" role="status" aria-label="جاري التحميل" />}
        <div key={tab} className="tab-enter">
        {tab!=="command" && (()=>{ const t = TABS.find(x=>x.id===tab)!; return (
          <div className="sec-band">
            <span className="sec-icon">{NAV_ICONS[t.id]}</span>
            <div><h2>{t.label}</h2><p>{t.en}</p></div>
          </div> );})()}
        {tab==="thinking" && <ThinkingTab entries={thinkingQ.data?.entries ?? []} plans={ownerPlansQ.data?.plans ?? []} creatives={creaQ.data?.creatives ?? []} observations={obsQ.data?.observations ?? []} creaAnalyses={creaAnQ.data?.analyses ?? []} compAnalyses={compAnQ.data?.analyses ?? []} inv={inv} nav={(t:Tab, host?:string, s?:string)=>{ setTab(t); if (host && s) setSub(host, s); }} />}
        {tab==="command" && (<>
          <DashboardHome statusSlot={(
            /* The full system-status block lives ONLY here (dashboard), as a
               collapsible section directly under the greeting header */
            <div className="rounded-2xl mt-4" style={card}>
              <button onClick={()=>setDashStatusOpen(o=>!o)} aria-expanded={dashStatusOpen} aria-label="حالة النظام — طي أو فتح قسم حالة النظام" className="w-full flex items-center gap-2.5 px-4 py-3 text-right">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background: dash.data?.lastSyncAt ? "#12B76A" : "#E0A83E"}} />
                <span className="font-normal text-sm flex-1">حالة النظام</span>
                <span className="text-xs font-normal" style={{color:"var(--dim)"}}>اكتمال المدخلات {completeness.pct}% · {payday.label}</span>
                <span aria-hidden className="text-base shrink-0" style={{color:"var(--dim)", transform: dashStatusOpen ? "rotate(180deg)" : undefined, transition:"transform .2s"}}>⌄</span>
              </button>
              {dashStatusOpen && <div className="px-4 pb-4">{statusBlock}</div>}
            </div>
          )} dash={dash.data} snapshots={snapQ.data?.snapshots ?? []} tasks={tasksQ.data?.tasks ?? []} work={workQ.data?.items ?? []} approvals={apprQ.data?.approvals ?? []} alerts={alertsQ.data?.alerts ?? []} goals={goalsQ.data?.goals ?? []} plans={plansQ.data?.plans ?? []} completeness={completeness} overdue={overdue} outcomeDue={outcomeDue} inv={inv} egp={egp} onRefresh={()=>refreshMut.mutate()} nav={(t:Tab, host?:string, s?:string)=>{ setTab(t); if (host && s) setSub(host, s); }} />
        </>)}
        {tab==="relaunch" && (<>
          <SubTabs host="relaunch" cur={sub("relaunch","board")} setSub={setSub} items={[{id:"board",label:"لوحة الريلونش والأهداف"},{id:"work",label:"متابعة الشغل"}]} />
          {sub("relaunch","board")==="board"
            ? <RelaunchTab work={workQ.data?.items ?? []} goals={goalsQ.data?.goals ?? []} plans={plansQ.data?.plans ?? []} products={productsQ.data?.products ?? []} profile={profile} inv={inv} setTab={(t:any)=>{ if (t==="tracking") setSub("relaunch","work"); else setTab(t); }} egp={egp} />
            : <TrackingTab work={workQ.data?.items ?? []} tasks={tasksQ.data?.tasks ?? []} campaigns={campQ.data?.campaigns ?? []} creatives={creaQ.data?.creatives ?? []} content={contentQ.data?.items ?? []} experiments={expQ.data?.experiments ?? []} rounds={roundsQ.data?.rounds ?? []} activity={activityQ.data?.events ?? []} overdue={overdue} outcomeDue={outcomeDue} inv={inv} setTab={setTab} />}
        </>)}
        {tab==="campaigns" && (<>
          <SubTabs host="campaigns" cur={sub("campaigns","campaigns")} setSub={setSub} items={[{id:"campaigns",label:"الحملات وقرار Task D"},{id:"tasks",label:"مهام A–G"},{id:"approvals",label:"الاعتمادات والتنفيذ"}]} />
          {sub("campaigns","campaigns")==="campaigns" && <MediaTab campaigns={campQ.data?.campaigns ?? []} profile={profile} payday={payday} snapshots={snapQ.data?.snapshots ?? []} inv={inv} egp={egp} />}
          {sub("campaigns","campaigns")==="tasks" && <QueueTab tasks={tasksQ.data?.tasks ?? []} inv={inv} />}
          {sub("campaigns","campaigns")==="approvals" && <ApprovalsTab approvals={apprQ.data?.approvals ?? []} executions={execQ.data?.executions ?? []} inv={inv} />}
        </>)}
        {tab==="content" && (<>
          <SubTabs host="content" cur={sub("content","creative")} setSub={setSub} items={[{id:"creative",label:"استوديو الكرييتيف والتوليد"},{id:"analysis",label:"تحليل الكرييتف"},{id:"calendar",label:"تقويم المحتوى"}]} />
          {sub("content","creative")==="creative" && <CreativeTab creatives={creaQ.data?.creatives ?? []} genRequests={genQ.data?.requests ?? []} inv={inv} />}
          {sub("content","creative")==="analysis" && <CreativeAnalysisTab creatives={creaQ.data?.creatives ?? []} analyses={creaAnQ.data?.analyses ?? []} inv={inv} />}
          {sub("content","creative")==="calendar" && <ContentTab items={contentQ.data?.items ?? []} inv={inv} />}
        </>)}
        {tab==="organic" && <OrganicTab posts={organicQ.data?.posts ?? []} insights={custQ.data?.insights ?? []} keywords={opsQ.data?.keywords ?? []} inv={inv} />}
        {tab==="market" && (<>
          <SubTabs host="market" cur={sub("market","research")} setSub={setSub} items={[{id:"research",label:"المنافسون والعملاء"},{id:"adanalysis",label:"تحليل إعلانات المنافسين"},{id:"watch",label:"متابعة السوق والجولات"}]} />
          {sub("market","research")==="research" && <ResearchTab competitors={compQ.data?.competitors ?? []} observations={obsQ.data?.observations ?? []} insights={custQ.data?.insights ?? []} inv={inv} />}
          {sub("market","research")==="adanalysis" && <CompetitorAdAnalysisTab observations={obsQ.data?.observations ?? []} analyses={compAnQ.data?.analyses ?? []} inv={inv} />}
          {sub("market","research")==="watch" && <MarketTab rounds={roundsQ.data?.rounds ?? []} alerts={alertsQ.data?.alerts ?? []} syncs={syncsQ.data?.syncs ?? []} competitors={compQ.data?.competitors ?? []} inv={inv} importMut={importMut} />}
        </>)}
        {tab==="ops" && (<>
          <SubTabs host="ops" cur={sub("ops","ops")} setSub={setSub} items={[{id:"ops",label:"التشغيل واللوب وصوت العميل"},{id:"learning",label:"التجارب والتعلّمات والمراجعات"}]} />
          {sub("ops","ops")==="ops" && <OpsTab ops={opsQ.data} competitors={compQ.data?.competitors ?? []} inv={inv} setTab={(t:any)=>{ if (t==="integrations") { setTab("system"); setSub("system","integrations"); } else setTab(t); }} />}
          {sub("ops","ops")==="learning" && <ExperimentsTab experiments={expQ.data?.experiments ?? []} learnings={learnQ.data?.learnings ?? []} reviews={revQ.data?.reviews ?? []} inv={inv} />}
        </>)}
        {tab==="finance" && (<>
          <SubTabs host="finance" cur={sub("finance","finance")} setSub={setSub} items={[{id:"finance",label:"حاسبة COD واللقطات المالية"},{id:"audit",label:"الأوديت الشامل — 8 ركائز"}]} />
          {sub("finance","finance")==="finance" && <FinanceTab profile={profile} snapshots={snapQ.data?.snapshots ?? []} inv={inv} egp={egp} />}
          {sub("finance","finance")==="audit" && <AuditTab state={auditQ.data?.items ?? []} inv={inv} />}
        </>)}
        {tab==="system" && (<>
          <SubTabs host="system" cur={sub("system","inputs")} setSub={setSub} items={[{id:"inputs",label:"المدخلات الأساسية"},{id:"rules",label:"القواعد والفريموركس"},{id:"integrations",label:"الربط والمزامنة"},{id:"activity",label:"سجل النشاط"}]} />
          {sub("system","inputs")==="inputs" && <InputsTab profile={profile} completeness={completeness} netCodRate={netCodRate} payday={payday} products={productsQ.data?.products ?? []} inv={inv} egp={egp} setTab={setTab} />}
          {sub("system","inputs")==="rules" && <FrameworksTab dash={dash.data} tasksCount={tasksQ.data?.tasks.length ?? 0} plansCount={plansQ.data?.plans.length ?? 0} genCount={genQ.data?.requests.length ?? 0} />}
          {sub("system","inputs")==="integrations" && <IntegrationsTab syncs={syncsQ.data?.syncs ?? []} dash={dash.data} importMut={importMut} products={productsQ.data?.products ?? []} />}
          {sub("system","inputs")==="activity" && <ActivityPanel events={activityQ.data?.events ?? []} />}
        </>)}
        {tab==="ask" && (
          <section>
            <div className="rounded-2xl p-4" style={{background:"var(--teal)",color:"#FFF2E9"}}>
              <h2 className="font-bold text-lg">اسأل زيرا الذكية 🦁 — شريك التخطيط والقرار</h2>
              <p className="text-sm opacity-85 mt-1">اكتب هدف أو سؤال — هصنّفه لمهمة A–G وأبني لك خطة من 8 خطوات بأقسامها، ماشية على سير النمو الموحد من 7 مراحل (تأسيس ← أوديت ← نفسية وعروض ← إنتاج ← فحص وتستينج ← نقد حتمي ← تدقيق وسكيل وتعلم). ولا خطوة بتتنفذ بره النظام، ولا خطة بتتحول لشغل فعلي إلا باعتمادك. كلامي حازم ومبني على أدلة، واللي مش عارفه هقول إنه مش معروف.</p>
              <form onSubmit={(e)=>{e.preventDefault(); if(!askText.trim()){setAskErr("اكتب الهدف أو السؤال أولاً");return;} setAskErr(""); const type = classifyGoal(askText); setPlanPreview({ goal: askText.trim(), type, steps: buildSteps(askText.trim(), type) });}}>
                <div className="flex gap-2 flex-wrap mt-3">
                  <input aria-label="هدف أو سؤال للتخطيط" {...FIELDS.createAgentPlan.goal} value={askText} onChange={e=>setAskText(e.target.value)} placeholder="مثال: عايز أجهّز إطلاق الهيرو المزدوج وأعرف أول 3 كرييتيف أبدأ بيهم" className="flex-1 min-w-[220px] rounded-xl px-3 py-2.5 text-sm" style={{background:"#FFF8F1",color:"#22312C"}} />
                  <button type="submit" aria-label="بناء خطة" className="px-5 py-2.5 rounded-xl font-normal text-sm" style={{background:"var(--accent)",color:"#FFFFFF"}}>ابنِ الخطة</button>
                </div>
                {askErr && <p className="text-xs mt-2" style={{color:"#FFD9D2"}}>{askErr}</p>}
              </form>
              {planPreview && (
                <div className="rounded-xl p-4 mt-4" style={{background:"rgba(255,242,233,0.08)",border:"1px solid rgba(255,242,233,0.25)"}}>
                  <p className="font-normal">التصنيف: مهمة {planPreview.type} — {TASK_TYPES[planPreview.type]} · القسم الأساسي: {(SECTION_FOR[planPreview.type] ?? SECTION_FOR["A"]!).label}</p>
                  <div className="grid gap-2 mt-3">
                    {planPreview.steps.map((s,i)=>(<p key={i} className="text-sm"><b>{i+1}. [{s.stage}]</b> {s.step} <span className="opacity-70">— {s.detail}</span></p>))}
                  </div>
                  <div className="flex gap-2 flex-wrap mt-3">
                    <button onClick={()=>planMut.mutate()} aria-label="حفظ الخطة كمقترح" className="px-4 py-2 rounded-xl font-normal text-sm" style={{background:"var(--accent)",color:"#FFFFFF"}}>{planMut.isPending?"جاري الحفظ…":"احفظ الخطة كمقترح"}</button>
                    <button onClick={()=>setPlanPreview(null)} aria-label="إلغاء معاينة الخطة" className="px-4 py-2 rounded-xl font-normal text-sm" style={{border:"1px solid rgba(255,242,233,0.4)"}}>إلغاء</button>
                  </div>
                  <p className="text-xs opacity-75 mt-2">الخطط المحفوظة بتظهر تحت وفي لوحة الريلونش — اعتماد أي خطة بيحوّل خطواتها لعناصر متابعة شغل فوراً.</p>
                </div>
              )}
              {(plansQ.data?.plans ?? []).filter(p=>p.status==="Proposed").map(p=>(
                <div key={p.id} className="rounded-xl p-3 mt-3 flex items-center justify-between gap-3 flex-wrap" style={{background:"rgba(255,242,233,0.08)",border:"1px solid rgba(255,242,233,0.25)"}}>
                  <p className="text-sm font-normal flex-1">📋 خطة مقترحة ({p.taskType}): {p.goal}</p>
                  <div className="flex gap-2">
                    <button onClick={()=>approvePlanMut.mutate(p)} aria-label={`اعتماد خطة ${p.goal} وتحويلها لعناصر شغل`} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--accent)",color:"#FFFFFF"}}>اعتماد ← عناصر شغل</button>
                    <button onClick={async()=>{ await api.updateAgentPlan({ id:p.id, status:"Rejected" }); inv(); }} aria-label={`رفض خطة ${p.goal}`} className="text-xs font-normal px-3 py-2 rounded-full" style={{border:"1px solid rgba(255,242,233,0.4)"}}>رفض</button>
                  </div>
                </div>
              ))}
              {(plansQ.data?.plans ?? []).length===0 && <p className="text-sm opacity-75 mt-3">لسه مفيش خطط محفوظة — اكتب أول هدف فوق وابنِ خطته.</p>}
            </div>
          </section>
        )}
        </div>
        </main>
      </div>
    </div>
  );
}

/* ================= Thinking & Planning (تفكير زيرا وقراراتنا + تخطيط) ================= */
function ThinkingTab({ entries, plans, creatives, observations, creaAnalyses, compAnalyses, inv, nav }: any) {
  const [pTitle, setPTitle] = useState("");
  const [pKind, setPKind] = useState("خطة");
  const [pBody, setPBody] = useState("");
  const [pLink, setPLink] = useState(0);
  const [pErr, setPErr] = useState("");
  const [genErr, setGenErr] = useState("");
  const [comments, setComments] = useState<Record<number,string>>({});
  const createPlan = useMutation({ mutationFn: async()=> await api.createOwnerPlan({ title: pTitle.trim(), body: pBody, kind: pKind as "خطة", linkedThinkingId: pLink }), onSuccess: ()=>{ setPTitle(""); setPBody(""); setPLink(0); setPErr(""); inv(); }, onError: (e:any)=> setPErr(e?.message ?? "تعذر الحفظ") });
  const convertPlan = useMutation({ mutationFn: async(id:number)=> await api.convertPlanToWork({ id }), onSuccess: inv });
  const delPlan = useMutation({ mutationFn: async(id:number)=> await api.deleteOwnerPlan({ id }), onSuccess: inv });
  const generate = useMutation({ mutationFn: async()=> await api.generateThinking({}), onSuccess: ()=>{ setGenErr(""); inv(); }, onError: (e:any)=> setGenErr(e?.message ?? "تعذر توليد التفكير دلوقتي") });
  const decide = useMutation({ mutationFn: async(v:any)=> await api.decideThinking(v), onSuccess: inv });
  const comment = useMutation({ mutationFn: async(v:any)=> await api.commentThinking(v), onSuccess: inv });
  const delEntry = useMutation({ mutationFn: async(id:number)=> await api.deleteThinking({ id }), onSuccess: inv });
  const runLoop = useMutation({ mutationFn: async()=> await api.runAnalysisLoop({}), onSuccess: inv });
  const analyzedCrea = new Set(creaAnalyses.map((a:any)=>a.creativeId));
  const analyzedObs = new Set(compAnalyses.map((a:any)=>a.observationId));
  const pendingCrea = creatives.filter((c:any)=>!analyzedCrea.has(c.id)).length;
  const pendingObs = observations.filter((o:any)=>!analyzedObs.has(o.id)).length;
  const statusPill = (s:string)=> s==="معتمد" ? "pill pill-live" : s==="مرفوض" ? "pill pill-danger" : "pill pill-draft";
  return (
    <section className="grid gap-4">
      {/* تخطيط — the owner's own writing, first thing on the page */}
      <div className="rounded-2xl p-4" style={card}>
        <h3 className="font-bold">✍️ تخطيط — اكتب اللي إنت عايزه بخط إيدك</h3>
        <p className="text-xs mt-1" style={{color:"var(--dim)"}}>أهداف، أفكار، توجيهات، خطط — بتتسجل مؤرخة هنا، وتقدر تربط أي عنصر بمدخلة تفكير أو تحوّله لمهمة متابعة.</p>
        <form onSubmit={(e)=>{ e.preventDefault(); if (!pTitle.trim()) { setPErr("اكتب عنوان عنصر التخطيط أولاً"); return; } setPErr(""); createPlan.mutate(); }} className="grid gap-2 mt-3">
          <div className="flex gap-2 flex-wrap">
            <input aria-label="عنوان عنصر التخطيط" {...FIELDS.createOwnerPlan.title} value={pTitle} onChange={e=>setPTitle(e.target.value)} placeholder="العنوان — مثال: أولوية الشهر ده إطلاق الهيروين بس" className="flex-1 min-w-[200px] rounded-xl px-3 py-2 text-sm border" style={inpStyle} />
            <select aria-label="نوع عنصر التخطيط" value={pKind} onChange={e=>setPKind(e.target.value)} className="rounded-xl px-3 py-2 text-sm border" style={inpStyle}>
              {["هدف","فكرة","توجيه","خطة"].map(k=><option key={k} value={k}>{k}</option>)}
            </select>
            <select aria-label="ربط بمدخلة تفكير" value={pLink} onChange={e=>setPLink(Number(e.target.value))} className="rounded-xl px-3 py-2 text-sm border max-w-[220px]" style={inpStyle}>
              <option value={0}>من غير ربط بتفكير</option>
              {entries.map((en:any)=><option key={en.id} value={en.id}>تفكير #{en.id}: {en.title.slice(0,40)}</option>)}
            </select>
          </div>
          <textarea aria-label="نص عنصر التخطيط" {...FIELDS.createOwnerPlan.body} value={pBody} onChange={e=>setPBody(e.target.value)} placeholder="اكتب تفاصيل اللي عايزه هنا بكلامك…" rows={3} className="w-full rounded-xl px-3 py-2 text-sm border" style={inpStyle} />
          {pErr && <p className="text-xs font-normal" style={{color:"var(--danger)"}}>{pErr}</p>}
          <div><button type="submit" aria-label="حفظ عنصر التخطيط" className="px-4 py-2 rounded-xl font-normal text-sm btn-glow" style={{background:"var(--teal)",color:"#FFF6EE"}}>{createPlan.isPending ? "جاري الحفظ…" : "احفظ في التخطيط"}</button></div>
        </form>
        <div className="grid gap-2 mt-3">
          {plans.length===0 && <p className="text-sm" style={{color:"var(--dim)"}}>لسه مفيش عناصر تخطيط مكتوبة — أول سطر تكتبه فوق هيظهر هنا مؤرخاً.</p>}
          {plans.map((p:any)=>(
            <div key={p.id} className="rounded-xl p-3" style={{background:"var(--surface2)",border:"1px solid var(--border)"}}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="pill pill-pending">{p.kind}</span>
                <p className="font-normal text-sm flex-1 min-w-[160px]">{p.title}</p>
                <span className="text-[11px]" style={{color:"var(--dim)"}}>{new Date(p.createdAt).toLocaleString("ar-EG")}</span>
              </div>
              {p.body && <p className="text-sm mt-1.5 leading-relaxed whitespace-pre-wrap">{p.body}</p>}
              <div className="flex items-center gap-2 flex-wrap mt-2">
                {p.linkedThinkingId>0 && <span className="text-[11px] font-normal px-2 py-1 rounded-full" style={{background:"var(--teal-soft)",color:"var(--teal)"}}>مرتبط بمدخلة تفكير #{p.linkedThinkingId}</span>}
                {p.workItemId>0
                  ? <span className="text-[11px] font-normal" style={{color:"var(--success)"}}>✓ اتحول لعنصر متابعة شغل #{p.workItemId}</span>
                  : <button onClick={()=>convertPlan.mutate(p.id)} aria-label={`تحويل «${p.title}» لمهمة متابعة`} className="text-[11px] font-normal px-3 py-1.5 rounded-full" style={{background:"var(--teal)",color:"#FFF6EE"}}>حوّل لمهمة متابعة ←</button>}
                <span className="mr-auto"><DelBtn label={`حذف عنصر التخطيط ${p.title}`} onClick={()=>delPlan.mutate(p.id)} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis-loop signals */}
      <div className="rounded-2xl p-4 flex items-center gap-2 flex-wrap" style={card}>
        <span className="font-normal text-sm">🔁 لوب التحليل:</span>
        <span className="text-xs" style={{color:"var(--dim)"}}>أي كرييتف أو إعلان منافس جديد بيتسجل بيظهر هنا فوراً كمستحق تحليل، وتحاليله بتغذي التفكير اللي تحت.</span>
        <span className="mr-auto flex gap-2 flex-wrap">
          <button onClick={()=>nav("content","content","analysis")} aria-label="فتح تحليل الكرييتف" className="text-xs font-normal px-3 py-2 rounded-full" style={{background: pendingCrea>0 ? "var(--warning-soft)" : "var(--surface2)", color: pendingCrea>0 ? "var(--warning)" : "var(--dim)", border:"1px solid var(--border)"}}>كرييتف بانتظار التحليل: {pendingCrea}</button>
          <button onClick={()=>nav("market","market","adanalysis")} aria-label="فتح تحليل إعلانات المنافسين" className="text-xs font-normal px-3 py-2 rounded-full" style={{background: pendingObs>0 ? "var(--warning-soft)" : "var(--surface2)", color: pendingObs>0 ? "var(--warning)" : "var(--dim)", border:"1px solid var(--border)"}}>إعلانات منافسين بانتظار التحليل: {pendingObs}</button>
          {(pendingCrea>0 || pendingObs>0) && <button onClick={()=>runLoop.mutate()} aria-label="تشغيل لوب التحليل على كل العناصر المنتظرة" className="text-xs font-normal px-3 py-2 rounded-full btn-glow" style={{background:"var(--teal)",color:"#FFF6EE"}}>{runLoop.isPending ? "اللوب شغال…" : "▶ شغّل اللوب: حلّل كل المنتظر"}</button>}
        </span>
      </div>

      {/* تفكير زيرا وقراراتنا */}
      <div className="rounded-2xl p-4" style={card}>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold flex-1">🧠 تفكير زيرا وقراراتنا</h3>
          <button onClick={()=>generate.mutate()} aria-label="توليد تفكير جديد من بيانات النظام الحالية" className="px-4 py-2 rounded-xl font-normal text-sm btn-glow" style={{background:"var(--teal)",color:"#FFF6EE"}}>{generate.isPending ? "زيرا بتفكر…" : "✦ فكّري من البيانات الحالية"}</button>
        </div>
        <p className="text-xs mt-1" style={{color:"var(--dim)"}}>زيرا بتفكر بصوت عالي من المعطيات المسجلة فعلياً بس (منتجات، مالية، منافسون، ريلونش، مدخلات أساسية، تحليلات) — كل فكرة بمعطياتها واستنتاجها وقرار مقترح. إنت تعتمد أو ترفض، والمعتمد بيتحول لمهمة متابعة. مفيش تنفيذ من غير قرارك.</p>
        {genErr && <p className="text-xs font-normal mt-2" style={{color:"var(--danger)"}}>{genErr}</p>}
        <div className="grid gap-3 mt-3">
          {entries.length===0 && <p className="text-sm" style={{color:"var(--dim)"}}>لسه مفيش مدخلات تفكير — دوس «فكّري من البيانات الحالية» وزيرا هتكتب أول تفكيرها من بيانات النظام المسجلة.</p>}
          {entries.map((e:any)=>(
            <article key={e.id} className="rounded-xl p-3.5" style={{background:"var(--surface2)",border:"1px solid var(--border)"}}>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-normal text-sm flex-1 min-w-[180px]">{e.title}</h4>
                <span className="text-[11px]" style={{color:"var(--dim)"}}>{new Date(e.createdAt).toLocaleString("ar-EG")} · ثقة {e.confidence}%</span>
                <span className={statusPill(e.status)}>{e.status}</span>
              </div>
              <div className="grid gap-1.5 mt-2 text-sm leading-relaxed">
                <p><b>المعطيات:</b> <span style={{color:"var(--dim)"}}>{e.basis}</span></p>
                <p><b>التفكير:</b> {e.reasoning}</p>
                <p><b>الاستنتاج:</b> {e.conclusion}</p>
                <p className="rounded-lg px-3 py-2" style={{background:"var(--teal-soft)"}}><b>القرار المقترح:</b> {e.decision}</p>
              </div>
              {e.workItemId>0 && <p className="text-[11px] font-normal mt-2" style={{color:"var(--success)"}}>✓ القرار المعتمد اتحول لعنصر متابعة شغل #{e.workItemId} — تابع تقدمه من «الريلونش ← متابعة الشغل».</p>}
              <div className="flex gap-2 flex-wrap items-center mt-2.5">
                <input aria-label={`ردك أو تعليقك على «${e.title}»`} {...FIELDS.commentThinking.ownerComment} value={comments[e.id] ?? e.ownerComment} onChange={ev=>setComments(s=>({...s,[e.id]:ev.target.value}))} placeholder="ردّك/تعليقك على الفكرة دي…" className="flex-1 min-w-[180px] rounded-xl px-3 py-2 text-sm border" style={inpStyle} />
                <button onClick={()=>comment.mutate({ id: e.id, ownerComment: comments[e.id] ?? e.ownerComment })} aria-label={`حفظ التعليق على «${e.title}»`} className="text-xs font-normal px-3 py-2 rounded-full" style={{border:"1px solid var(--border)"}}>حفظ التعليق</button>
                {e.status==="بانتظار قرارك" && (<>
                  <button onClick={()=>decide.mutate({ id: e.id, decision: "معتمد", ownerComment: comments[e.id] ?? "" })} aria-label={`اعتماد قرار «${e.title}» وتحويله لمهمة`} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF6EE"}}>اعتماد ← مهمة</button>
                  <button onClick={()=>decide.mutate({ id: e.id, decision: "مرفوض", ownerComment: comments[e.id] ?? "" })} aria-label={`رفض قرار «${e.title}»`} className="text-xs font-normal px-3 py-2 rounded-full" style={{border:"1px solid var(--border)",color:"var(--danger)"}}>رفض</button>
                </>)}
                <span className="mr-auto"><DelBtn label={`حذف مدخلة التفكير ${e.title}`} onClick={()=>delEntry.mutate(e.id)} /></span>
              </div>
              {e.ownerComment && e.status!=="بانتظار قرارك" && <p className="text-xs mt-2" style={{color:"var(--dim)"}}>تعليقك: {e.ownerComment}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= Creative Analysis (CIS loop) ================= */
const CLASS_PILL: Record<string,string> = { "Validated":"pill pill-live", "Promising":"pill pill-pending", "Declining":"pill pill-danger", "Insufficient Evidence":"pill pill-locked" };
function CreativeAnalysisTab({ creatives, analyses, inv }: any) {
  const [err, setErr] = useState("");
  const analyze = useMutation({ mutationFn: async(id:number)=> await api.analyzeCreativeDeep({ creativeId: id }), onSuccess: ()=>{ setErr(""); inv(); }, onError: (e:any)=> setErr(e?.message ?? "تعذر التحليل دلوقتي") });
  const del = useMutation({ mutationFn: async(id:number)=> await api.deleteCreativeAnalysis({ id }), onSuccess: inv });
  const byCreative = (cid:number)=> analyses.filter((a:any)=>a.creativeId===cid);
  return (
    <section>
      <p className="text-sm mb-3 leading-relaxed" style={{color:"var(--dim)"}}>تحليل طبقات CIS لكل كرييتف مسجل فعلياً: ليه نجح أو ليه فشل — بالأرقام والملاحظات المسجلة بس، مع حجم العينة والثقة واقتراحات Remix. أي كرييتف جديد أو أرقام أداء جديدة = تحليل جديد يتحفظ هنا، وبيغذي «تفكير زيرا وقراراتنا».</p>
      {err && <p className="text-xs font-normal mb-2" style={{color:"var(--danger)"}}>{err}</p>}
      {creatives.length===0 && <Empty title="لا كرييتف مسجل بعد" hint="سجّل أول كرييتف من «استوديو الكرييتف والتوليد» وهيظهر هنا جاهزاً للتحليل فوراً." />}
      <div className="grid gap-3">
        {creatives.map((c:any)=>{
          const list = byCreative(c.id);
          const latest = list[0];
          const hasMetrics = c.spend>0 || c.ordersDelivered>0 || c.hookRate>0 || c.cpp>0;
          return (
            <article key={c.id} className="rounded-2xl p-4" style={card}>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm flex-1 min-w-[180px]">{c.title}</h3>
                <span className="text-[11px] font-normal px-2 py-1 rounded-full" style={{background:"var(--surface2)",border:"1px solid var(--border)"}} dir="ltr">{c.cisTag}</span>
                <span className={CLASS_PILL[c.perfClass] ?? "pill pill-locked"}>{c.perfClass}</span>
                <button onClick={()=>analyze.mutate(c.id)} aria-label={`تحليل كرييتف ${c.title}`} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF6EE"}}>{analyze.isPending && analyze.variables===c.id ? "جاري التحليل…" : latest ? "إعادة تحليل بالبيانات الحالية" : "حلّل الكرييتف ✦"}</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 text-xs">
                {[["Hook", c.hook || "غير محدد"], ["Format", c.format || "غير محدد"], ["Angle", c.angle || "غير محددة"], ["Lever", c.lever || "غير محددة"], ["Talent", c.talent || "غير محدد"], ["Product", c.product || "غير محدد"]].map(([k,v])=>(
                  <p key={k} className="rounded-lg px-2.5 py-2" style={{background:"var(--surface2)"}}><span style={{color:"var(--dim)"}}>{k}: </span><b>{v}</b></p>
                ))}
              </div>
              <p className="text-xs mt-2" style={{color:"var(--dim)"}}>{hasMetrics ? <>الأرقام المسجلة: Hook {c.hookRate}% · Hold {c.holdRate}% · CTR {c.outboundCtr}% · CVR {c.cvr}% · CPP {c.cpp} ج · إنفاق {c.spend} ج · مُسلّم {c.ordersDelivered}</> : "لا أرقام أداء مسجلة بعد — التحليل هيبقى بنيوياً والتصنيف Insufficient Evidence لحد ما تتسجل أرقام."}</p>
              {!latest && <p className="text-sm mt-2 font-normal" style={{color:"var(--warning)"}}>بانتظار التحليل — الكرييتف ده لسه ما اتحلّلش.</p>}
              {latest && (
                <div className="mt-3 rounded-xl p-3" style={{background:"var(--surface2)",border:"1px solid var(--border)"}}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={CLASS_PILL[latest.classification] ?? "pill pill-locked"}>{latest.classification}</span>
                    <span className="text-[11px]" style={{color:"var(--dim)"}}>آخر تحليل: {new Date(latest.createdAt).toLocaleString("ar-EG")} · ثقة {latest.confidence}% · تحليلات سابقة: {Math.max(0, list.length-1)}</span>
                    <span className="mr-auto"><DelBtn label={`حذف تحليل ${c.title}`} onClick={()=>del.mutate(latest.id)} /></span>
                  </div>
                  <div className="grid gap-1.5 mt-2 text-sm leading-relaxed">
                    <p><b>طبقة الـ Hook:</b> {latest.cisHook}</p>
                    <p><b>طبقة الـ Format:</b> {latest.cisFormat}</p>
                    <p><b>طبقة الـ Angle:</b> {latest.cisAngle}</p>
                    <p><b>طبقة الـ Lever:</b> {latest.cisLever}</p>
                    <p><b>ليه نجح/فشل:</b> {latest.why}</p>
                    <p><b>الأدلة:</b> <span style={{color:"var(--dim)"}}>{latest.evidence}</span></p>
                    <p><b>حجم العينة:</b> <span style={{color:"var(--dim)"}}>{latest.sampleNote}</span></p>
                    {latest.remix && <div><b>اقتراحات Remix:</b>{latest.remix.split("\n").filter(Boolean).map((r:string,i:number)=>(<p key={i} className="mt-1">• {r}</p>))}</div>}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ================= Competitor Ad Analysis loop ================= */
function CompetitorAdAnalysisTab({ observations, analyses, inv }: any) {
  const [err, setErr] = useState("");
  const analyze = useMutation({ mutationFn: async(id:number)=> await api.analyzeCompetitorAd({ observationId: id }), onSuccess: ()=>{ setErr(""); inv(); }, onError: (e:any)=> setErr(e?.message ?? "تعذر التحليل دلوقتي") });
  const del = useMutation({ mutationFn: async(id:number)=> await api.deleteCompetitorAdAnalysis({ id }), onSuccess: inv });
  const byObs = (oid:number)=> analyses.filter((a:any)=>a.observationId===oid);
  return (
    <section>
      <p className="text-sm mb-3 leading-relaxed" style={{color:"var(--dim)"}}>كل إعلان منافس مسجل كملاحظة سوق (من Meta Ads Library أو TikTok Ads Library أو موقع المنافس) بيتحلل هنا: الزاوية، الهوك، الفورمات، العرض، مدة التشغيل، ليه شغال، ضعفه فين، والدروس لزيرا — من التسجيل فقط، من غير أي أرقام مخترعة. إعلان جديد يتسجل = تحليل جديد، وبيغذي «تفكير زيرا وقراراتنا».</p>
      {err && <p className="text-xs font-normal mb-2" style={{color:"var(--danger)"}}>{err}</p>}
      {observations.length===0 && <Empty title="لا إعلانات منافسين مسجلة بعد" hint="سجّل إعلان منافس كملاحظة من «المنافسون والعملاء» (المصدر: Meta/TikTok Ads Library) وهيظهر هنا جاهزاً للتحليل." />}
      <div className="grid gap-3">
        {observations.map((o:any)=>{
          const list = byObs(o.id);
          const latest = list[0];
          return (
            <article key={o.id} className="rounded-2xl p-4" style={card}>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm flex-1 min-w-[180px]">{o.title}</h3>
                <span className="text-[11px]" style={{color:"var(--dim)"}}>{o.source || "مصدر غير مذكور"} · {o.observedDate || ""} · {o.evidenceTag}</span>
                <button onClick={()=>analyze.mutate(o.id)} aria-label={`تحليل إعلان ${o.title}`} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF6EE"}}>{analyze.isPending && analyze.variables===o.id ? "جاري التحليل…" : latest ? "إعادة تحليل" : "حلّل الإعلان ✦"}</button>
              </div>
              {o.notes && <p className="text-sm mt-1.5 leading-relaxed" style={{color:"var(--dim)"}}>{o.notes}</p>}
              {!latest && <p className="text-sm mt-2 font-normal" style={{color:"var(--warning)"}}>بانتظار التحليل — الإعلان ده لسه ما اتحلّلش.</p>}
              {latest && (
                <div className="mt-3 rounded-xl p-3" style={{background:"var(--surface2)",border:"1px solid var(--border)"}}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="pill pill-pending">{latest.competitor || "منافس"}</span>
                    <span className="text-[11px]" style={{color:"var(--dim)"}}>آخر تحليل: {new Date(latest.createdAt).toLocaleString("ar-EG")} · تحليلات سابقة: {Math.max(0, list.length-1)}</span>
                    <span className="mr-auto"><DelBtn label={`حذف تحليل إعلان ${o.title}`} onClick={()=>del.mutate(latest.id)} /></span>
                  </div>
                  <div className="grid gap-1.5 mt-2 text-sm leading-relaxed">
                    <p><b>الزاوية:</b> {latest.angle}</p>
                    <p><b>الهوك:</b> {latest.hook}</p>
                    <p><b>الفورمات:</b> {latest.format}</p>
                    <p><b>العرض:</b> {latest.offer}</p>
                    <p><b>مدة التشغيل:</b> {latest.runtimeNote}</p>
                    <p><b>ليه شغال:</b> {latest.whyWorking}</p>
                    <p><b>نقطة ضعفه:</b> {latest.weakness}</p>
                    {latest.lessons && <div><b>دروس لزيرا:</b>{latest.lessons.split("\n").filter(Boolean).map((r:string,i:number)=>(<p key={i} className="mt-1">• {r}</p>))}</div>}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ================= Relaunch ================= */
const RELAUNCH_PHASES = [
  { n:1, t:"تحضير ما قبل الإطلاق", d:"تثبيت مدخلات، دراسة سوق، Cold Start checklists، أول دفعة كرييتيف" },
  { n:2, t:"أسبوع الإطلاق", d:"حملتان منفصلتان للهيروين + اعتماد المالك + فحص AEO نهائي" },
  { n:3, t:"أول 30 يوم", d:"Funnel يومي، لقطات COD أسبوعية، أول Task D، Cross-Bundle test" },
  { n:4, t:"تقييم واستمرار/تصحيح", d:"Outcome Review على الأهداف + خطة الربع التالي Task C" },
];
function RelaunchTab({ work, goals, plans, products, profile, inv, setTab, egp }: any) {
  const relaunchWork = work.filter((w:any)=>w.sourceType==="Relaunch" || (w.notes ?? "").includes("Relaunch"));
  const [g,setG]=useState({ metric:"", target:0, current:0, unit:"", deadline:"", notes:"" });
  const [gErr,setGErr]=useState("");
  const createG = useMutation({ mutationFn: async()=> await api.createRelaunchGoal(g), onSuccess:()=>{ setG({ metric:"", target:0, current:0, unit:"", deadline:"", notes:"" }); inv(); } });
  const updG = useMutation({ mutationFn: async(v:any)=> await api.updateRelaunchGoal(v), onSuccess: inv });
  const delG = useMutation({ mutationFn: async(id:number)=> await api.deleteRelaunchGoal({id}), onSuccess: inv });
  const heroes = products.filter((p:any)=>["cellulite-smoothing-routine","kp-calm-smooth-routine"].some(h=>p.pageUrl.endsWith(h)));
  const phaseOf = (w:any)=>{ const m = /مرحلة (\d)/.exec(w.notes ?? ""); return m ? Number(m[1]) : 1; };
  const coldStart = [
    "كل GPT للهيروين [EST] لحد 50 طلب أو 14 يوم — ممنوع تقديم التقديري كأنه فعلي",
    "100% Exploration في أول دفعة — ممنوع تطبيق 75/20/5 دلوقتي",
    "هيكلة اختبار 3×2×3 بدل 3:2:2 القياسية في الـ Cold Start",
    "عتبة قتل أرحم: 7 أيام مش 3 — وممنوع قتل قبل 48–72 ساعة أصلاً",
    "بوابة AEO أشد: ادعاءات الإطلاق جديدة = مخاطرة أعلى (تحذير ريتينول إلزامي)",
    "قواعد Payday تسري بلا أي استثناء حتى في الإطلاق",
    "بعد يوم 14 أو 50 طلب: Task D على الكل، أفضل 2 يترقوا Proven، الباقي يُقتل ويُدفن بسبب",
  ];
  return (
    <section>
      <div className="rounded-2xl p-4" style={{background:"var(--teal)",color:"#FFF2E9"}}>
        <h2 className="font-bold text-xl">🚀 خطة الـ Relaunch — وضع التشغيل الحالي</h2>
        <p className="text-sm opacity-90 mt-2 leading-relaxed">قرار المالك: <b>Dual Hero</b> — روتين السيلوليت (799 جنيه) + روتين جلد الوزة/الفراولة (799 جنيه) معاً. حملتان منفصلتان (CBO واحد لكل Hero Offer حسب Domino)، ميزانية اختبار منقسمة بين الهيروين، وتتبع Kill/Scale مستقل لكل روتين. وفرصة Cross-Bundle ‏(799+799 = 1598 جنيه — فوق حد الشحن المجاني 1000) كاختبار Offer/Value مستقل.</p>
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          {heroes.length===0 && <p className="text-sm opacity-85">الهيروين لسه مش ظاهرين في المنتجات — شغّل «اقرأ/زامن من zyra-care.com» من الأعلى أو أضفهم في المدخلات الأساسية.</p>}
          {heroes.map((h:any)=>(
            <div key={h.id} className="rounded-xl p-4" style={{background:"rgba(255,242,233,0.1)",border:"1px solid rgba(255,242,233,0.25)"}}>
              <p className="font-normal">{h.name}</p>
              <p className="text-sm mt-1 opacity-90">السعر {egp(h.price)} · COGS {h.cogs>0 ? egp(h.cogs) + " (من المالك)" : "غير مدخل"}</p>
              {h.warnings && <p className="text-xs mt-1" style={{color:"#FFD9A8"}}>⚠️ {h.warnings.slice(0,140)}</p>}
              <p className="text-xs mt-2 opacity-80">حملة مستقلة · Rule of One: مشكلة واحدة + احتياج عاطفي واحد + اعتراض محسوم واحد + دليل واحد لكل إعلان.</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-4 mt-3 text-sm" style={{background:"rgba(255,242,233,0.08)",border:"1px solid rgba(255,242,233,0.25)"}}>
          <p className="font-normal">اقتصاديات الهيرو المحسوبة [EST — بافتراضات تشغيلية افتراضية]</p>
          <p className="mt-1 leading-relaxed">Break-even Placed CPP ‏≈ <b>275 جنيه</b> · مساهمة قبل الإعلانات ‏≈ <b>381 جنيه/مُسلّم</b> · بوابة Scale تصمد لحد Placed CPP ‏≈180 · الهدف التشغيلي ‏≤150–160. الأساس: إيراد 874 ‏(799+75 شحن)، COGS ‏350 مؤكد من المالك، وتكاليف تشغيل افتراضية من السكربت (تعبئة 20/شحن 70/مرتجع 50/COD ‏2%) عند تسليم صافٍ 72% افتراضي — رسوم Bosta الفعلية ونسب التأكيد الحقيقية لسه غير مؤكدة، فالأرقام تقديرية لحد ما تتأكد.</p>
        </div>
      </div>

      <h3 className="font-bold text-lg mt-6">مراحل الخطة وعناصر الشغل المرتبطة</h3>
      <div className="grid gap-4 mt-3">
        {RELAUNCH_PHASES.map(ph=>{
          const items = relaunchWork.filter((w:any)=>phaseOf(w)===ph.n);
          const doneCount = items.filter((w:any)=>w.status==="Completed").length;
          return (
            <div key={ph.n} className="rounded-2xl p-4" style={card}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-normal">المرحلة {ph.n}: {ph.t}</h4>
                <span className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--surface2)"}}>{items.length ? `${doneCount}/${items.length} اكتمل` : "لا عناصر بعد"}</span>
              </div>
              <p className="text-sm mt-1" style={{color:"var(--dim)"}}>{ph.d}</p>
              <div className="progress-track mt-2" style={{height:10}}><div className="progress-fill h-full" style={{width: (items.length? Math.round(items.reduce((a:number,w:any)=>a+(w.progress||0),0)/items.length):0)+"%", background:"var(--grad-relaunch)"}} /></div>
              {items.map((w:any)=>(
                <div key={w.id} className="flex items-center justify-between gap-3 mt-2.5 text-sm flex-wrap">
                  <p className="flex-1">• {w.title} <span className="text-xs" style={{color:"var(--dim)"}}>({w.ownerRole} · {w.priority})</span></p>
                  <span className="text-xs font-normal px-2.5 py-1 rounded-full shrink-0" style={{background: w.status==="Completed" ? "#067647" : "var(--surface2)", color: w.status==="Completed" ? "#fff" : "var(--text)"}}>{w.status} · {w.progress}%</span>
                </div>
              ))}
              {items.length===0 && <p className="text-xs mt-2" style={{color:"var(--dim)"}}>عناصر المرحلة دي بتتولد من خطة الـ Relaunch المعتمدة أو من قراءة الويبسايت — أو أضفها يدوياً من متابعة الشغل بمصدر Relaunch.</p>}
            </div>
          );
        })}
      </div>
      <button onClick={()=>setTab("tracking")} aria-label="إدارة عناصر الشغل" className="mt-3 px-5 py-2.5 rounded-full font-normal text-sm" style={{background:"var(--accent)",color:"#FFFFFF"}}>إدارة كل عناصر الشغل ← متابعة الشغل</button>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">قائمة فحص Cold Start — للمنتجات المعاد إطلاقها (PART 4)</h3>
          <ul className="text-sm mt-2 space-y-1.5 list-disc list-inside leading-relaxed">{coldStart.map(c=>(<li key={c}>{c}</li>))}</ul>
          <p className="text-xs mt-2" style={{color:"var(--dim)"}}>يسري البروتوكول لأن منتجات الإطلاق &lt;14 يوم و&lt;50 طلب في دورة الإطلاق الجديدة — لغة عدم اليقين إلزامية في أي توصية.</p>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">خطط الوكيل المحفوظة</h3>
          {plans.length===0 && <p className="text-sm mt-2" style={{color:"var(--dim)"}}>لا خطط محفوظة بعد — ابنِ أول خطة من تبويب «اسأل زيرا».</p>}
          {plans.map((p:any)=>(
            <div key={p.id} className="mt-3 rounded-xl p-3" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
              <p className="font-normal text-sm">({p.taskType}) {p.goal} <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"var(--surface2)"}}>{p.status}</span></p>
              <p className="text-xs mt-1" style={{color:"var(--dim)"}}>{p.steps.length} خطوة عبر مراحل الـ 8 — الاعتماد من مركز القيادة بيحوّلها لعناصر شغل.</p>
            </div>
          ))}
          {profile?.uncertaintyFlags && <p className="text-xs mt-3 leading-relaxed" style={{color:"var(--warning)"}}>⚠️ Uncertainty Flags الحالية: {profile.uncertaintyFlags}</p>}
        </div>
      </div>

      <h3 className="font-bold text-lg mt-6">أهداف وقياسات نجاح الـ Relaunch</h3>
      <form className="rounded-2xl p-4 mt-3 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!g.metric.trim()){setGErr("اسم المقياس مطلوب");return;} setGErr(""); createG.mutate();}}>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="g-metric" className="text-sm font-normal block mb-1">المقياس *</label><input id="g-metric" {...FIELDS.createRelaunchGoal.metric} value={g.metric} onChange={e=>setG({...g,metric:e.target.value})} className={inp} style={inpStyle} placeholder="مثال: طلبات مُسلّمة أول 30 يوم" />{gErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{gErr}</p>}</div>
          <div><label htmlFor="g-target" className="text-sm font-normal block mb-1">الهدف</label><input id="g-target" type="number" step="any" {...FIELDS.createRelaunchGoal.target} value={g.target} onChange={e=>setG({...g,target:Number(e.target.value)})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="g-unit" className="text-sm font-normal block mb-1">الوحدة</label><input id="g-unit" {...FIELDS.createRelaunchGoal.unit} value={g.unit} onChange={e=>setG({...g,unit:e.target.value})} className={inp} style={inpStyle} placeholder="طلب / EGP / %" /></div>
          <div><label htmlFor="g-cur" className="text-sm font-normal block mb-1">الحالي</label><input id="g-cur" type="number" step="any" {...FIELDS.createRelaunchGoal.current} value={g.current} onChange={e=>setG({...g,current:Number(e.target.value)})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="g-dead" className="text-sm font-normal block mb-1">الموعد المستهدف</label><input id="g-dead" type="date" value={g.deadline} onChange={e=>setG({...g,deadline:e.target.value})} className={inp} style={inpStyle} /></div>
        </div>
        <div className="flex gap-2 flex-wrap">{["طلبات مُسلّمة أول 30 يوم","Placed CPP ≤ 160 EGP","Net COD Rate %","كرييتيف Validated","أول Proven Wrapper"].map(s=>(<button key={s} type="button" onClick={()=>setG({...g,metric:s})} aria-label={`اقتراح مقياس ${s}`} className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--surface2)",border:"1px solid var(--border)"}}>{s}</button>))}</div>
        <button type="submit" aria-label="إضافة هدف Relaunch" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ إضافة هدف</button>
      </form>
      <div className="grid gap-3 mt-3">
        {goals.length===0 && <Empty title="لسه مفيش أهداف Relaunch محددة" hint="الأهداف بيحددها المالك — الاقتراحات فوق نقطة بداية، والأرقام المستهدفة قرارك إنت مش قرار النظام." />}
        {goals.map((x:any)=>(
          <article key={x.id} className="rounded-2xl p-4 lift" style={card}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <ProgressRing pct={x.target>0 ? Math.min(100, Math.round(x.current/x.target*100)) : 0} size={52} color="var(--sec-relaunch)" />
                <div><h4 className="font-normal">{x.metric}</h4><p className="text-xs mt-1" style={{color:"var(--dim)"}}>الحالي {x.current} من هدف {x.target} {x.unit}{x.deadline?` · لحد ${x.deadline}`:""}</p></div>
              </div>
              <DelBtn label={`حذف هدف ${x.metric}`} onClick={()=>delG.mutate(x.id)} />
            </div>
            <div className="progress-track mt-3" style={{height:10}}><div className="progress-fill h-full" style={{width: (x.target>0? Math.min(100, Math.round(x.current/x.target*100)):0)+"%", background:"var(--grad-relaunch)"}} /></div>
            <div className="flex gap-2 items-center mt-3">
              <label className="text-xs font-normal" htmlFor={`gc-${x.id}`}>تحديث الحالي</label>
              <input id={`gc-${x.id}`} aria-label={`القيمة الحالية لـ ${x.metric}`} type="number" step="any" defaultValue={x.current} className="w-28 rounded-xl px-2 py-1.5 border text-sm" style={inpStyle} />
              <button aria-label={`حفظ قيمة ${x.metric}`} onClick={()=>{ const el = document.getElementById(`gc-${x.id}`) as HTMLInputElement | null; if (el) updG.mutate({ id:x.id, current:Number(el.value) }); }} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>حفظ</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================= Market Watch ================= */
function MarketTab({ rounds, alerts, syncs, competitors, inv, importMut }: any) {
  const [r,setR]=useState({ source:"Website", scope:"", findings:"", roundDate: new Date().toISOString().slice(0,10) });
  const [rErr,setRErr]=useState("");
  const createR = useMutation({ mutationFn: async()=> await api.createMarketRound(r), onSuccess:()=>{ setR({ source:"Website", scope:"", findings:"", roundDate: new Date().toISOString().slice(0,10) }); inv(); } });
  const delR = useMutation({ mutationFn: async(id:number)=> await api.deleteMarketRound({id}), onSuccess: inv });
  const [a,setA]=useState({ competitor:"", changeType:"زاوية جديدة", detail:"", source:"" });
  const [aErr,setAErr]=useState("");
  const createA = useMutation({ mutationFn: async()=> await api.createCompetitorAlert(a), onSuccess:()=>{ setA({ competitor:"", changeType:"زاوية جديدة", detail:"", source:"" }); inv(); } });
  const updA = useMutation({ mutationFn: async(v:any)=> await api.updateCompetitorAlert(v), onSuccess: inv });
  const delA = useMutation({ mutationFn: async(id:number)=> await api.deleteCompetitorAlert({id}), onSuccess: inv });
  const sources = [
    { t:"🌐 موقع البراند — zyra-care.com", d:"يُقرأ فعلياً من جوه النظام (زر المزامنة) — كتالوج وسياسات. آخر قراءة: " + (syncs[0] ? new Date(syncs[0].createdAt).toLocaleString("ar-EG") + " · " + syncs[0].status : "لسه ما اتقراش") },
    { t:"🌐 مواقع المنافسين", d: competitors.length ? `${competitors.length} منافس موثق بروابط صفحات منتجات حقيقية في قسم السوق والعملاء.` : "لسه مفيش منافسين موثقين — أضفهم من قسم السوق والعملاء." },
    { t:"📘 Meta Ads Library", d:"الجلب الآلي المباشر من المكتبة بيرجع 403 — فالمعتمد: روابط جاهزة لكل منافس من قسم «التشغيل والتعلّم الآلي» + تسجيل/لصق المالك يتحلّل مجمّعاً، وأي رصد بيتسجل كجولة هنا بمصدره وتاريخه. مفيش ادعاء سحب آلي حي." },
    { t:"🎵 TikTok Ads Library / Creative Center", d:"نفس القاعدة: أنماط وهوكات تُرصد وتُسجل كجولات وملاحظات مؤرخة، للتمييز لا للنسخ." },
  ];
  return (
    <section>
      <h2 className="font-bold text-xl">متابعة السوق — Market Watch 📡</h2>
      <p className="text-sm mt-1" style={{color:"var(--dim)"}}>متابعة تشغيلية مستمرة بأربعة مصادر. الصدق أولاً: القراءة الآلية المؤكدة هي موقع البراند العام؛ مكتبات الإعلانات تُرصد بجولات موثقة المصدر والتاريخ — مفيش ادعاء مراقبة حية غير موجودة.</p>
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        {sources.map(s=>(<div key={s.t} className="rounded-2xl p-4" style={card}><h3 className="font-bold">{s.t}</h3><p className="text-sm mt-2 leading-relaxed">{s.d}</p></div>))}
      </div>
      <button onClick={()=>importMut.mutate()} aria-label="تشغيل جولة قراءة الويبسايت الآن" className="mt-4 px-5 py-2.5 rounded-full font-normal text-sm" style={{background:"var(--teal)",color:"#FFF2E9"}}>{importMut.isPending ? "جاري القراءة…" : "⇩ شغّل جولة قراءة الويبسايت دلوقتي"}</button>

      <BarChart title="مقارنة أسعار منتجات اليوريا — مسح السوق 18 نوفمبر 2026" unit=" EGP" grad="var(--grad-market)" items={[
        { label:"Skinova Urea 20% — صيدلي", value:199 },
        { label:"Melano Uremel 20% — صيدلي", value:350 },
        { label:"ZYRA Urea 25% — الأعلى تركيزاً", value:360, highlight:true },
        { label:"Alejon Urea 10% — صيدلي", value:380 },
        { label:"Hayah Urepar 10% — صيدلي", value:439 },
      ]} />
      <p className="text-xs mt-2" style={{color:"var(--dim)"}}>أسعار موثقة بصفحات منتجات حقيقية في مسح 18/11/2026 (مصادرها في قسم السوق والعملاء) — منتجات مفردة صيدلية مقابل منتج زيرا المفرد؛ روتينات الهيرو (799) فئة مختلفة ومش داخلة في المقارنة دي.</p>

      <h3 className="font-bold text-lg mt-6">تنبيهات تغيّرات المنافسين</h3>
      <form className="rounded-2xl p-4 mt-3 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!a.competitor.trim()){setAErr("اسم المنافس مطلوب");return;} setAErr(""); createA.mutate();}}>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="al-comp" className="text-sm font-normal block mb-1">المنافس *</label><input id="al-comp" {...FIELDS.createCompetitorAlert.competitor} value={a.competitor} onChange={e=>setA({...a,competitor:e.target.value})} className={inp} style={inpStyle} />{aErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{aErr}</p>}</div>
          <div><label htmlFor="al-type" className="text-sm font-normal block mb-1">نوع التغيّر</label><select id="al-type" value={a.changeType} onChange={e=>setA({...a,changeType:e.target.value})} className={inp} style={inpStyle}>{["منتج جديد","عرض جديد","زاوية جديدة","تغيّر سعر","حملة جديدة"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="al-src" className="text-sm font-normal block mb-1">المصدر (لينك/وصف)</label><input id="al-src" {...FIELDS.createCompetitorAlert.source} value={a.source} onChange={e=>setA({...a,source:e.target.value})} className={inp} style={inpStyle} /></div>
        </div>
        <div><label htmlFor="al-det" className="text-sm font-normal block mb-1">التفاصيل المرصودة</label><textarea id="al-det" {...FIELDS.createCompetitorAlert.detail} value={a.detail} onChange={e=>setA({...a,detail:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
        <button type="submit" aria-label="تسجيل تنبيه منافس" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ تسجيل تنبيه</button>
      </form>
      <div className="grid gap-3 mt-3">
        {alerts.length===0 && <Empty title="لا تنبيهات منافسين" hint="أي منتج/عرض/زاوية جديدة عند منافس بتتسجل هنا وبتظهر في تنبيهات مركز القيادة." />}
        {alerts.map((x:any)=>(
          <article key={x.id} className="rounded-2xl p-4 flex items-start justify-between gap-3 flex-wrap" style={{...card, borderColor: x.status==="New" ? "var(--warning)" : "var(--border)"}}>
            <div><h4 className="font-normal">{x.competitor} — {x.changeType} <span className="text-xs px-2 py-0.5 rounded-full" style={{background: x.status==="New" ? "#DC6803" : "var(--surface2)", color: x.status==="New" ? "#fff" : "var(--text)"}}>{x.status}</span></h4>{x.detail && <p className="text-sm mt-1">{x.detail}</p>}<p className="text-xs mt-1" style={{color:"var(--dim)"}}>{new Date(x.createdAt).toLocaleDateString("ar-EG")}{x.source?` · ${x.source}`:""}</p></div>
            <div className="flex gap-2">
              {x.status==="New" && <button aria-label={`تعليم تنبيه ${x.competitor} كمُراجَع`} onClick={()=>updA.mutate({id:x.id,status:"Reviewed"})} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>تمت المراجعة</button>}
              <DelBtn label={`حذف تنبيه ${x.competitor}`} onClick={()=>delA.mutate(x.id)} />
            </div>
          </article>
        ))}
      </div>

      <h3 className="font-bold text-lg mt-6">سجل جولات المتابعة</h3>
      <form className="rounded-2xl p-4 mt-3 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!r.scope.trim() && !r.findings.trim()){setRErr("اكتب نطاق الجولة أو ما تم رصده");return;} setRErr(""); createR.mutate();}}>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="rd-src" className="text-sm font-normal block mb-1">المصدر</label><select id="rd-src" value={r.source} onChange={e=>setR({...r,source:e.target.value})} className={inp} style={inpStyle}>{["Website","موقع منافس","Meta Ads Library","TikTok Ads Library","TikTok Creative Center"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="rd-date" className="text-sm font-normal block mb-1">تاريخ الجولة</label><input id="rd-date" type="date" value={r.roundDate} onChange={e=>setR({...r,roundDate:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="rd-scope" className="text-sm font-normal block mb-1">النطاق</label><input id="rd-scope" {...FIELDS.createMarketRound.scope} value={r.scope} onChange={e=>setR({...r,scope:e.target.value})} className={inp} style={inpStyle} placeholder="مثال: إعلانات منافسي اليوريا آخر 30 يوم" />{rErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{rErr}</p>}</div>
        </div>
        <div><label htmlFor="rd-find" className="text-sm font-normal block mb-1">ما تم رصده (Findings)</label><textarea id="rd-find" {...FIELDS.createMarketRound.findings} value={r.findings} onChange={e=>setR({...r,findings:e.target.value})} rows={3} className={inp} style={inpStyle} /></div>
        <button type="submit" aria-label="تسجيل جولة متابعة" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ تسجيل الجولة</button>
      </form>
      <div className="grid gap-3 mt-3">
        {rounds.length===0 && <Empty title="لا جولات متابعة مسجلة" hint="أول جولة بتتولد تلقائياً من قراءة الويبسايت — وباقي المصادر بتتسجل هنا بجولاتها الموثقة." />}
        {rounds.map((x:any)=>(
          <article key={x.id} className="rounded-2xl p-4 ps-5 flex items-start justify-between gap-3 flex-wrap lift" style={{...card, borderInlineStart:"4px solid var(--sec-market)"}}>
            <div><h4 className="font-normal"><span className="text-[11px] font-normal px-2.5 py-1 rounded-full" style={{background:"var(--grad-market)",color:"#FFF6EE",marginInlineEnd:6}}>{x.source}</span><span className="text-xs" style={{color:"var(--dim)"}}>{x.roundDate}</span> <span className="text-xs font-normal">{freshness(x.createdAt).icon} {freshness(x.createdAt).label}</span></h4>{x.scope && <p className="text-sm mt-1"><b>النطاق:</b> {x.scope}</p>}{x.findings && <p className="text-sm mt-1 whitespace-pre-wrap">{x.findings}</p>}</div>
            <DelBtn label={`حذف جولة ${x.source}`} onClick={()=>delR.mutate(x.id)} />
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================= Comprehensive Audit ================= */
function AuditTab({ state, inv }: any) {
  const byKey: Record<string, any> = {};
  for (const s of state ?? []) byKey[s.itemKey] = s;
  const [drafts,setDrafts]=useState<Record<string,{status:string,notes:string,evidence:string}>>({});
  const save = useMutation({ mutationFn: async(v:any)=> await api.setAuditState(v), onSuccess: inv });
  const totalItems = AUDIT_PILLARS.reduce((a,p)=>a+p.items.length,0);
  const scoreOf = (items: string[], pillar: number)=> items.reduce((a,_,i)=>{ const st = byKey[`p${pillar}i${i}`]?.status ?? "لم يبدأ"; return a + (st==="مكتمل" ? 1 : st==="جارٍ" ? 0.5 : 0); }, 0);
  const totalScore = AUDIT_PILLARS.reduce((a,p)=>a+scoreOf(p.items, p.n), 0);
  const pct = Math.round(totalScore/totalItems*100);
  return (
    <section>
      <h2 className="font-bold text-xl">الأوديت الشامل — Business & Account Audit 🧭</h2>
      <p className="text-sm mt-1 leading-relaxed" style={{color:"var(--dim)"}}>ثماني ركائز بمنهجية كورس إطلاق الإعلانات (مرجع استشاري) — وقاعدة زيرا الحاكمة فوقها: عند أي تعارض تتغلب أطر المالك (COD Math ← AEO ← هوية البراند). الأوديت بيبدأ فارغاً: كل بند «لم يبدأ» لحد ما يتوثق بدليل. مرحلة النمو 2: مفيش صرف جديد قبل ما الأوديت يتقفل أو تتعلم فجواته صراحة.</p>
      <div className="rounded-2xl p-4 mt-4" style={{background:"var(--teal)",color:"#FFF2E9"}}>
        <div className="flex items-center gap-4 flex-wrap">
          <ProgressRing pct={pct} size={74} color="#E2915A" track="rgba(255,242,233,0.25)"><span style={{fontSize:15}}>{pct}%</span></ProgressRing>
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center justify-between flex-wrap gap-2"><h3 className="font-bold">درجة الأوديت الإجمالية — Audit Score</h3></div>
            <div className="progress-track mt-2" style={{background:"rgba(255,242,233,0.25)",height:12}}><div className="progress-fill h-full" style={{width: pct+"%", background:"var(--grad-accent)"}} /></div>
            <p className="text-xs opacity-85 mt-2">محسوبة من حالات البنود ({totalItems} بند): مكتمل = 1 · جارٍ = 0.5 · لم يبدأ = 0. الدرجة وصف لحالة التوثيق مش حكم جودة على البيزنس.</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 mt-4">
        {AUDIT_PILLARS.map(p=>{
          const ps = Math.round(scoreOf(p.items, p.n)/p.items.length*100);
          return (
          <div key={p.n} className="rounded-2xl p-4" style={card}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold">الركيزة {p.n}: {p.t}</h3>
              <span className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--surface2)"}}>{ps}%</span>
            </div>
            <div className="grid gap-3 mt-3">
              {p.items.map((item,i)=>{
                const key = `p${p.n}i${i}`;
                const saved = byKey[key];
                const d = drafts[key] ?? { status: saved?.status ?? "لم يبدأ", notes: saved?.notes ?? "", evidence: saved?.evidence ?? "" };
                const setD = (patch:any)=> setDrafts({ ...drafts, [key]: { ...d, ...patch } });
                return (
                <div key={key} className="rounded-xl p-3" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <p className="font-normal text-sm flex-1">{item}</p>
                    <select aria-label={`حالة بند ${item}`} value={d.status} onChange={e=>setD({status:e.target.value})} className="rounded-xl px-2 py-1.5 border text-xs font-normal" style={{...inpStyle, background: d.status==="مكتمل" ? "var(--success-soft)" : d.status==="جارٍ" ? "var(--warning-soft)" : "var(--surface)"}}>{["لم يبدأ","جارٍ","مكتمل"].map(s=>(<option key={s}>{s}</option>))}</select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 mt-2">
                    <input aria-label={`ملاحظات ${item}`} {...FIELDS.setAuditState.notes} placeholder="ملاحظات الفحص…" value={d.notes} onChange={e=>setD({notes:e.target.value})} className={inp} style={inpStyle} />
                    <input aria-label={`دليل ${item}`} {...FIELDS.setAuditState.evidence} placeholder="الدليل/المصدر (لينك أو وصف)…" value={d.evidence} onChange={e=>setD({evidence:e.target.value})} className={inp} style={inpStyle} />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={()=>save.mutate({ itemKey:key, pillar:p.n, title:item, status:d.status as "لم يبدأ", notes:d.notes, evidence:d.evidence })} aria-label={`حفظ بند ${item}`} className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>حفظ الحالة</button>
                    {saved && <span className="text-xs" style={{color:"var(--dim)"}}>آخر حفظ: {new Date(saved.updatedAt).toLocaleString("ar-EG")}</span>}
                  </div>
                </div> );
              })}
            </div>
          </div> );
        })}
      </div>
    </section>
  );
}

/* ================= Integrations Hub ================= */
function IntegrationsTab({ syncs, dash, importMut, products }: any) {
  const cards = [
    { t:"🛍️ Shopify — متجر Zyra Care", feeds:"منتجات وأسعار وطلبات ومخزون", status:"متصل بـ Muse (اتحقق 2026-11-18)", tone:"var(--success)", detail:"المتجر zyra-care.com على Shopify Basic والأسعار من الأدمن مطابقة للموقع العام. جوه النظام ده، البيانات دخلت فعلياً عبر قراءة الويبسايت العام (كتالوج 23 منتج + سياسات). المخزون في Shopify ظاهر صفر/غير مُتتبع — جاهزية مخزون الإطلاق غير مؤكدة ولازم تتحقق قبل الإطلاق.", next:"الخطوة التالية: تأكيد المخزون الفعلي للهيروين داخل Shopify، وبعدها أي تحديث سعر/منتج يتعكس هنا بجولة قراءة جديدة." },
    { t:"📘 Meta — إعلانات فيسبوك/إنستجرام", feeds:"حملات وإعلانات وأداء الحساب + Ads Library العامة للمنافسين", status:"حساب الإعلانات: Pending — يحتاج تصريح المالك", tone:"var(--warning)", detail:"المتاح فعلياً دلوقتي: Meta Ads Library العامة (إعلانات المنافسين) وتتسجل جولاتها في متابعة السوق. لا يوجد أي سحب حي من حساب إعلانات خاص — أرقام الحملات هنا إدخال يدوي موثق بفترته.", next:"الخطوة التالية: ربط حساب Meta الإعلاني بتصريح المالك عشان الأداء يدخل تلقائياً بدل الإدخال اليدوي." },
    { t:"📜 سياسة البيانات عند ربط Meta — قرار مالك موثق", feeds:"خط أساس أداء جديد من أيام الـ Relaunch + بيانات تاريخية كبيانات عملاء فقط", status:"قاعدة سارية من لحظة الربط", tone:"var(--info)", detail:"عند ربط حساب Meta الإعلاني الحقيقي: سحب بيانات الأداء يبدأ من أيام الـ Relaunch الحالية فصاعداً كخط أساس (Baseline) جديد. بيانات أداء ما قبل الـ Relaunch لا تُستخدم كمرجع أداء نهائياً. بيانات الطلبات والعملاء التاريخية تُعامل كبيانات عملاء فقط: احتفاظ وLTV وجماهير — مش أداء إعلاني.", next:"تُطبق تلقائياً على أي استيراد أداء مستقبلي، وتُذكر في أي مقارنة أداء." },
    { t:"🚚 Bosta — الشحن والتوصيل", feeds:"شحنات ومعدلات تسليم وRTO ورسوم فعلية", status:"غير متصل — لا يوجد ربط متاح بعد", tone:"var(--danger)", detail:"لا توجد بيانات Bosta داخل النظام. نسب التسليم والـ RTO والرسوم الحالية إما إدخال يدوي في المدخلات الأساسية أو افتراضات سكربت موسومة [EST] — وأرقام الـ Break-even الحالية مبنية على الافتراضات دي.", next:"الخطوة التالية: إدخال رسوم Bosta الفعلية ونسب التسليم من تقارير المالك في المدخلات الأساسية لحين توفر ربط مباشر." },
  ];
  return (
    <section>
      <h2 className="font-bold text-xl">الربط والمزامنة — Integrations Hub</h2>
      <p className="text-sm mt-1" style={{color:"var(--dim)"}}>ثلاثة مصادر بيانات خارجية (مش أي نظام داخلي آخر). القاعدة: ممنوع إظهار أي ربط كأنه حي وهو مش حي — الحالة تحت هي الحقيقة اليوم.</p>
      <div className="grid gap-4 mt-4">
        {cards.map(c=>(
          <article key={c.t} className="rounded-2xl p-4" style={card}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h3 className="font-bold">{c.t}</h3>
              <span className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:c.tone,color:"#fff"}}>{c.status}</span>
            </div>
            <p className="text-sm mt-2"><b>بيغذي النظام بـ:</b> {c.feeds}</p>
            <p className="text-sm mt-1.5 leading-relaxed">{c.detail}</p>
            <p className="text-sm mt-1.5" style={{color:"var(--dim)"}}>{c.next}</p>
          </article>
        ))}
      </div>
      <div className="rounded-2xl p-4 mt-4" style={card}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-bold">مصدر الموقع العام — zyra-care.com (شغال فعلياً)</h3>
          <button onClick={()=>importMut.mutate()} aria-label="إعادة قراءة الويبسايت" className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>{importMut.isPending ? "جاري القراءة…" : "⇩ أعد القراءة دلوقتي"}</button>
        </div>
        <p className="text-sm mt-2">دخل فعلياً: {products.length} منتج في المدخلات الأساسية · آخر مزامنة: {dash?.lastSyncAt ? new Date(dash.lastSyncAt).toLocaleString("ar-EG") : "لسه مفيش"} {dash?.lastSyncSummary ? "· " + dash.lastSyncSummary : ""}</p>
      </div>
      <h3 className="font-bold text-lg mt-6">سجل المزامنة والأحداث — Sync Log</h3>
      <div className="grid gap-2.5 mt-3">
        {syncs.length===0 && <Empty title="سجل المزامنة فارغ" hint="أي قراءة ويبسايت أو إدخال بيانات هيتسجل هنا بحالته وملخصه." />}
        {syncs.map((s:any)=>(
          <div key={s.id} className="rounded-xl p-3.5 flex items-start justify-between gap-3 flex-wrap" style={card}>
            <div><p className="font-normal text-sm">{s.source}</p><p className="text-sm mt-0.5">{s.summary}</p></div>
            <div className="text-left shrink-0"><span className="text-xs font-normal px-2.5 py-1 rounded-full" style={{background:"var(--surface2)"}}>{s.status}</span><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{new Date(s.createdAt).toLocaleString("ar-EG")}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= Inputs ================= */
function InputsTab({ profile, completeness, netCodRate, payday, products, inv, egp, setTab }: { profile: any; completeness: any; netCodRate: number; payday: any; products: any[]; inv: ()=>void; egp:(n:number)=>string; setTab:(t:Tab)=>void }) {
  const [f,setF]=useState<any>(null);
  const cur = f ?? (profile ? { ...profile } : { brandName:"Zyra Care", websiteUrl:"", market:"Egypt", currency:"EGP", customerLanguage:"Egyptian Arabic", metaPage:"", instagramHandle:"", tiktokHandle:"", heroOffer:"", shippingPolicy:"", returnPolicy:"", guarantee:"", icp7ws:"", approvedClaims:"", bannedClaims:"", brandVoice:"", shipCost:0, packCost:0, codFeePct:2, rtoCost:0, baseDeliveryRate:0, discountNote:"", testBudget:0, minTestDays:3, targetCpp:0, killRule:"", scaleRule:"", whatsappConfirmPct:0, deliveryPct:0, adPerf30d:"", adPerf7d:"", customerVoice:"", creativeInventory:"", uncertaintyFlags:"" });
  const set=(k:string,v:any)=>setF({ ...cur, [k]:v });
  const save = useMutation({ mutationFn: async()=> await api.saveCoreProfile(cur), onSuccess: inv });
  const [err,setErr]=useState("");
  const [p,setP]=useState({ name:"", pageUrl:"", price:0, cogs:0, status:"Active", ingredients:"", warnings:"", notes:"" });
  const [pErr,setPErr]=useState("");
  const createProduct = useMutation({ mutationFn: async()=> await api.createProduct(p), onSuccess:()=>{ setP({ name:"", pageUrl:"", price:0, cogs:0, status:"Active", ingredients:"", warnings:"", notes:"" }); inv(); } });
  const delProduct = useMutation({ mutationFn: async(id:number)=> await api.deleteProduct({id}), onSuccess: inv });
  const updProduct = useMutation({ mutationFn: async(v:{id:number,status:string})=> await api.updateProduct({ id:v.id, status:v.status }), onSuccess: inv });
  const txt = (k:string,label:string,ph="") => (<div><label htmlFor={"in-"+k} className="text-sm font-normal block mb-1">{label}</label><input id={"in-"+k} value={cur[k] ?? ""} onChange={e=>set(k,e.target.value)} className={inp} style={inpStyle} placeholder={ph} /></div>);
  const area = (k:string,label:string,ph="") => (<div><label htmlFor={"in-"+k} className="text-sm font-normal block mb-1">{label}</label><textarea id={"in-"+k} value={cur[k] ?? ""} onChange={e=>set(k,e.target.value)} rows={2} className={inp} style={inpStyle} placeholder={ph} /></div>);
  const num = (k:string,label:string) => (<div><label htmlFor={"in-"+k} className="text-sm font-normal block mb-1">{label}</label><input id={"in-"+k} type="number" min={0} step="any" value={cur[k] ?? 0} onChange={e=>set(k,Number(e.target.value))} className={inp} style={inpStyle} /></div>);
  return (
    <section>
      <h2 className="font-bold text-xl">المدخلات الأساسية — Core Inputs Hub (PART 2)</h2>
      <p className="text-sm mt-1" style={{color:"var(--dim)"}}>دي الأساس اللي كل الحسابات والقرارات تعتمد عليه. القيم التوضيحية في أي مستند (زي سعر 799 EGP) أمثلة فقط — هنا بتدخل قيم ZYRA الحقيقية الموثقة من الويبسايت.</p>
      <div className="rounded-2xl p-4 mt-3" style={{...card, borderColor:"var(--info)"}}>
        <h3 className="font-bold">📜 قاعدة بيانات موثقة — خط الأساس والبيانات التاريخية (قرار مالك)</h3>
        <p className="text-sm mt-1.5 leading-relaxed">عند ربط حساب Meta الحقيقي: أداء الإعلانات يُقاس من أيام الـ <b>Relaunch</b> فصاعداً كخط أساس جديد — أي أداء قبل الـ Relaunch <b>ليس مرجعاً</b> لأي مقارنة أو عتبة. الطلبات والعملاء التاريخيون يدخلون هنا كبيانات عملاء فقط (احتفاظ/LTV/جماهير). وحقول «أداء 30d/7d» تحت تُملأ من فترة الـ Relaunch فقط.</p>
      </div>
      <div className="rounded-2xl p-4 mt-4" style={card}>
        <div className="flex items-center justify-between flex-wrap gap-2"><h3 className="font-bold">مؤشر الاكتمال: {completeness.pct}%</h3><span className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background: payday.state==="PAYDAY"?"#D92D20":payday.state==="CAUTION"?"#DC6803":"#067647", color:"#fff"}}>Payday: {payday.label}</span></div>
        <div className="h-3 rounded-full mt-2" style={{background:"var(--border)"}}><div className="h-3 rounded-full" style={{width: completeness.pct+"%", background:"var(--accent)"}} /></div>
        <div className="grid md:grid-cols-2 gap-1.5 mt-3 text-sm">
          {completeness.checks.map((c:any)=>(<p key={c.label}>{c.ok?"✅":"⬜"} {c.label}</p>))}
        </div>
        <p className="text-xs mt-2" style={{color:"var(--dim)"}}>قاعدة: قبل اكتمال المدخلات، أي تحليل أو قرار Kill/Scale يفضل موسوم Provisional / Insufficient Evidence.</p>
      </div>

      <form className="rounded-2xl p-4 mt-4 grid gap-4" style={card} onSubmit={(e)=>{e.preventDefault(); if(!cur.brandName.trim()){setErr("اسم البراند مطلوب");return;} setErr(""); save.mutate();}}>
        <h3 className="font-bold">بيانات البراند والقنوات (مرجع — مش اتصالات حية)</h3>
        <div className="grid md:grid-cols-3 gap-3">{txt("brandName","اسم البراند *")}{txt("websiteUrl","لينك الويبسايت","https://…")}{txt("market","السوق")}{txt("currency","العملة")}{txt("customerLanguage","لغة العملاء")}{txt("metaPage","Meta Page (مرجع)")}{txt("instagramHandle","Instagram Handle")}{txt("tiktokHandle","TikTok Handle")}</div>
        <h3 className="font-bold">العروض والسياسات الموثقة فقط (من الويبسايت)</h3>
        <div className="grid md:grid-cols-2 gap-3">{area("heroOffer","الـ Hero Offer")}{area("guarantee","أي ضمان موثق بمصدره")}{area("shippingPolicy","سياسة الشحن")}{area("returnPolicy","سياسة الاسترجاع")}</div>
        <h3 className="font-bold">COD & Delivery — PART 2</h3>
        <div className="grid md:grid-cols-3 gap-3">{num("shipCost","تكلفة الشحن لكل مشحون EGP")}{num("packCost","تكلفة التغليف EGP")}{num("codFeePct","رسوم COD %")}{num("rtoCost","تكلفة الـ RTO / المرتجع EGP")}{num("whatsappConfirmPct","WhatsApp Confirmation %")}{num("deliveryPct","Delivery % (من المشحون)")}</div>
        <p className="text-sm font-normal rounded-xl p-3" style={{background:"var(--surface2)"}}>Net COD Rate = {cur.whatsappConfirmPct || 0}% × {cur.deliveryPct || 0}% = {Math.round((cur.whatsappConfirmPct||0)*(cur.deliveryPct||0)/100*10)/10}% {profile && <span style={{color:"var(--dim)"}}>· المحفوظ حالياً: {netCodRate}%</span>}</p>
        <div className="grid md:grid-cols-2 gap-3">{area("discountNote","الخصومات الحالية")}{area("uncertaintyFlags","Uncertainty Flags — إيه مش متأكدين منه؟")}</div>
        <h3 className="font-bold">أداء الإعلانات + صوت العميل + المخزون الإبداعي</h3>
        <div className="grid md:grid-cols-2 gap-3">{area("adPerf30d","Ad Performance — آخر 30 يوم (أرقام يدوية من حسابك)")}{area("adPerf7d","Ad Performance — آخر 7 أيام")}{area("customerVoice","Customer Voice — عبارات العملاء واعتراضاتهم الحقيقية (بدون بيانات شخصية)")}{area("creativeInventory","Creative Inventory — إيه الكرييتيف الموجود وحالته؟")}</div>
        <h3 className="font-bold">الجمهور والادعاءات وصوت البراند</h3>
        <div className="grid md:grid-cols-2 gap-3">{area("icp7ws","الـ ICP بصيغة 7Ws: Who/Where/What/Why/When/Objections/Dream Outcome")}{area("brandVoice","صوت البراند")}{area("approvedClaims","الادعاءات المعتمدة")}{area("bannedClaims","الادعاءات الممنوعة")}</div>
        <h3 className="font-bold">إعدادات قرارات الميديا باير (المالك يحددها — لا حدود مخترعة)</h3>
        <div className="grid md:grid-cols-3 gap-3">{num("testBudget","ميزانية الاختبار EGP")}{num("minTestDays","مدة الاختبار الدنيا (أيام)")}{num("targetCpp","Target CPP (EGP)")}</div>
        <div className="grid md:grid-cols-2 gap-3">{area("killRule","قاعدة Kill المعتمدة من المالك")}{area("scaleRule","قاعدة Scale المعتمدة من المالك")}</div>
        {err && <p className="text-xs" style={{color:"var(--danger)"}}>{err}</p>}
        <div className="flex gap-2 flex-wrap">
          <button type="submit" aria-label="حفظ المدخلات الأساسية" className="px-5 py-2.5 rounded-full font-normal" style={{background:"var(--accent)",color:"#FFFFFF"}}>{save.isPending?"جاري الحفظ…":"حفظ المدخلات الأساسية"}</button>
          <button type="button" onClick={()=>setTab("finance")} aria-label="الذهاب لحاسبة COD" className="px-5 py-2.5 rounded-full font-normal" style={{border:"1px solid var(--border)"}}>القيم دي بتغذي حاسبة COD ←</button>
        </div>
        {profile && <p className="text-xs" style={{color:"var(--dim)"}}>آخر حفظ: {new Date(profile.updatedAt).toLocaleString("ar-EG")} — كل حفظ بيخزن نسخة جديدة والتحليلات بتستخدم الأحدث.</p>}
      </form>

      <h3 className="font-bold text-lg mt-6">المنتجات / الروتينات</h3>
      <form className="rounded-2xl p-4 mt-3 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!p.name.trim()){setPErr("اسم المنتج مطلوب");return;} setPErr(""); createProduct.mutate();}}>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="p-name" className="text-sm font-normal block mb-1">اسم المنتج *</label><input id="p-name" {...FIELDS.createProduct.name} value={p.name} onChange={e=>setP({...p,name:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="p-url" className="text-sm font-normal block mb-1">لينك صفحة المنتج على الويبسايت</label><input id="p-url" {...FIELDS.createProduct.pageUrl} value={p.pageUrl} onChange={e=>setP({...p,pageUrl:e.target.value})} className={inp} style={inpStyle} placeholder="https://…" /></div>
          <div><label htmlFor="p-status" className="text-sm font-normal block mb-1">الحالة</label><select id="p-status" value={p.status} onChange={e=>setP({...p,status:e.target.value})} className={inp} style={inpStyle}>{["Active","Out of Stock","Draft","Discontinued"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="p-price" className="text-sm font-normal block mb-1">السعر EGP</label><input id="p-price" type="number" step="any" {...FIELDS.createProduct.price} value={p.price} onChange={e=>setP({...p,price:Number(e.target.value)})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="p-cogs" className="text-sm font-normal block mb-1">COGS EGP</label><input id="p-cogs" type="number" step="any" {...FIELDS.createProduct.cogs} value={p.cogs} onChange={e=>setP({...p,cogs:Number(e.target.value)})} className={inp} style={inpStyle} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label htmlFor="p-ing" className="text-sm font-normal block mb-1">المكونات</label><textarea id="p-ing" {...FIELDS.createProduct.ingredients} value={p.ingredients} onChange={e=>setP({...p,ingredients:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="p-warn" className="text-sm font-normal block mb-1">التحذيرات (خصوصاً الريتينول)</label><textarea id="p-warn" {...FIELDS.createProduct.warnings} value={p.warnings} onChange={e=>setP({...p,warnings:e.target.value})} rows={2} className={inp} style={inpStyle} placeholder="مثال: فيه ريتينول — ممنوع أثناء الحمل" /></div>
        </div>
        {pErr && <p className="text-xs" style={{color:"var(--danger)"}}>{pErr}</p>}
        <button type="submit" aria-label="إضافة منتج" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ إضافة منتج</button>
      </form>
      <div className="grid gap-3 mt-3">
        {products.length===0 && <Empty title="لسه مفيش منتجات مدخلة" hint="أضف أول منتج بسعره وCOGS الحقيقيين من الويبسايت — من غيره حاسبة COD وقرارات Kill/Scale ناقصة." />}
        {products.map((pr:any)=>(
          <article key={pr.id} className="rounded-2xl p-4 flex items-start justify-between gap-3 flex-wrap" style={card}>
            <div>
              <h4 className="font-normal">{pr.name} <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"var(--surface2)"}}>{pr.status}</span></h4>
              <p className="text-xs mt-1" style={{color:"var(--dim)"}}>السعر {egp(pr.price)} · COGS {egp(pr.cogs)} · هامش وحدة قبل التشغيل {egp(pr.price-pr.cogs)}</p>
              {pr.pageUrl && <a href={pr.pageUrl} target="_blank" rel="noreferrer" className="text-xs font-normal underline">صفحة المنتج على الويبسايت ↗</a>}
              {pr.ingredients && <p className="text-sm mt-1">المكونات: {pr.ingredients}</p>}
              {pr.warnings && <p className="text-sm mt-1" style={{color:"var(--warning)"}}>⚠️ {pr.warnings}</p>}
            </div>
            <div className="flex gap-2 items-center">
              <select aria-label={`حالة ${pr.name}`} value={pr.status} onChange={e=>updProduct.mutate({id:pr.id,status:e.target.value})} className="rounded-xl px-2 py-1.5 border text-xs" style={inpStyle}>{["Active","Out of Stock","Draft","Discontinued"].map(s=>(<option key={s}>{s}</option>))}</select>
              <DelBtn label={`حذف منتج ${pr.name}`} onClick={()=>delProduct.mutate(pr.id)} />
            </div>
          </article>
        ))}
      </div>
      <div className="rounded-2xl p-4 mt-6" style={card}>
        <h3 className="font-bold">قواعد سوق مصر — Appendix D (مرجع تشغيلي)</h3>
        <ul className="text-sm mt-2 space-y-1.5 list-disc list-inside leading-relaxed">
          <li><b>Payday Culture:</b> ذروة شراء 25–5 وحذر 15–24 — لا تقتل حملة مثبتة بسبب هبوط منتصف الشهر بدون فحص Payday.</li>
          <li><b>COD Culture:</b> الدفع عند الاستلام هو الافتراضي — Net COD Rate = تأكيد واتساب × تسليم، والـ RTO جزء من الاقتصاديات مش مفاجأة.</li>
          <li><b>WhatsApp Culture:</b> التأكيد والمتابعة على واتساب — الردود حوارية وشخصية، ممنوع «تم خاص».</li>
          <li><b>التسعير:</b> العميل المصري حساس للسعر وبيقارن — العرض لازم يبرر القيمة (Rule of One: Proof واحد واضح).</li>
          <li><b>التسليم:</b> أزمنة التوصيل الفعلية بتتقاس من بياناتك المدخلة، مش أرقام عامة مخترعة.</li>
        </ul>
      </div>
    </section>
  );
}

/* ================= Tracking ================= */
function TrackingTab({ work, tasks, campaigns, creatives, content, experiments, rounds, activity, overdue, outcomeDue, inv, setTab }: any) {
  const [f,setF]=useState({ title:"", sourceType:"Manual", ownerRole:"Owner", priority:"Medium", dueDate:"", progress:0, blocker:"", nextAction:"", notes:"" });
  const [err,setErr]=useState("");
  const create = useMutation({ mutationFn: async()=> await api.createWorkItem({ ...f, priority: f.priority as "Medium" }), onSuccess:()=>{ setF({ title:"", sourceType:"Manual", ownerRole:"Owner", priority:"Medium", dueDate:"", progress:0, blocker:"", nextAction:"", notes:"" }); inv(); } });
  const upd = useMutation({ mutationFn: async(v:any)=> await api.updateWorkItem(v), onSuccess: inv });
  const del = useMutation({ mutationFn: async(id:number)=> await api.deleteWorkItem({id}), onSuccess: inv });
  const todayStr = new Date().toISOString().slice(0,10);
  const agg = [
    { label:"مهام A–G", n: tasks.length, go:"campaigns" }, { label:"حملات", n: campaigns.length, go:"campaigns" }, { label:"كرييتيف", n: creatives.length, go:"content" }, { label:"محتوى", n: content.length, go:"content" }, { label:"تجارب", n: experiments.length, go:"ops" },
  ];
  const [tlFilter,setTlFilter]=useState("الكل");
  const timeline = [
    ...work.map((w:any)=>({ kind:"شغل", label:w.title, meta:`${w.status} · ${w.progress}%`, at:w.createdAt })),
    ...campaigns.map((c:any)=>({ kind:"حملة", label:c.name, meta:c.status, at:c.createdAt })),
    ...creatives.map((c:any)=>({ kind:"كرييتيف", label:c.title, meta:`${c.status} · ${c.perfClass}`, at:c.createdAt })),
    ...content.map((c:any)=>({ kind:"محتوى", label:c.title, meta:c.status, at:c.createdAt })),
    ...(rounds ?? []).map((r:any)=>({ kind:"جولة سوق", label:`${r.source}: ${r.scope}`, meta:r.roundDate, at:r.createdAt })),
    ...experiments.map((e:any)=>({ kind:"تجربة", label:e.hypothesis, meta:e.verdict, at:e.createdAt })),
  ].sort((a,b)=>String(b.at).localeCompare(String(a.at)));
  const relaunchItems = work.filter((w:any)=>w.sourceType==="Relaunch");
  const relaunchPct = relaunchItems.length ? Math.round(relaunchItems.reduce((a:number,w:any)=>a+(w.progress||0),0)/relaunchItems.length) : 0;
  return (
    <section>
      <h2 className="font-bold text-xl">متابعة الشغل — Work Tracking</h2>
      <p className="text-sm mt-1" style={{color:"var(--dim)"}}>لوحة واحدة لكل الشغل: الحالة، المرحلة في دورة الـ 8، المسؤول، الأولوية، الاستحقاق، التقدم، الـ Blocker والـ Next Action.</p>
      <div className="rounded-2xl p-4 mt-4" style={{...card, borderColor:"var(--accent)"}}>
        <div className="flex items-center justify-between flex-wrap gap-2"><h3 className="font-bold">🚀 تقدم الـ Relaunch الموحد</h3><span className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--surface2)"}}>{relaunchItems.length} عنصر · متوسط تقدم {relaunchPct}%</span></div>
        <div className="h-3 rounded-full mt-2" style={{background:"var(--border)"}}><div className="h-3 rounded-full" style={{width: relaunchPct+"%", background:"var(--accent)"}} /></div>
      </div>
      <div className="rounded-2xl p-4 mt-4" style={card}>
        <h3 className="font-bold">Timeline موحد — كل الأقسام في خط زمني واحد</h3>
        <div className="flex gap-2 flex-wrap mt-3">
          {["الكل","شغل","حملة","كرييتيف","محتوى","جولة سوق","تجربة"].map(f=>(<button key={f} onClick={()=>setTlFilter(f)} aria-label={`فلتر ${f}`} className="text-xs font-normal px-3 py-1.5 rounded-full" style={tlFilter===f?{background:"var(--teal)",color:"#FFF2E9"}:{background:"var(--surface2)",border:"1px solid var(--border)"}}>{f}</button>))}
        </div>
        <div className="grid gap-1.5 mt-3 max-h-80 overflow-y-auto">
          {timeline.filter(t=>tlFilter==="الكل" || t.kind===tlFilter).slice(0,40).map((t,i)=>(
            <p key={i} className="text-sm flex gap-2 flex-wrap items-baseline"><span className="text-xs font-normal px-2 py-0.5 rounded-full shrink-0" style={{background:"var(--surface2)"}}>{t.kind}</span><span className="font-normal">{t.label}</span><span style={{color:"var(--dim)"}}>{t.meta}</span><span className="text-xs" style={{color:"var(--dim)"}}>{t.at ? new Date(t.at).toLocaleDateString("ar-EG") : ""}</span></p>
          ))}
          {timeline.length===0 && <p className="text-sm" style={{color:"var(--dim)"}}>الـ Timeline فاضي — أول عنصر في أي قسم هيظهر هنا.</p>}
        </div>
        {(activity ?? []).length>0 && <>
          <h4 className="font-normal text-sm mt-4">سجل أحداث وتواصل الأقسام (مين عمل إيه وامتى)</h4>
          <div className="grid gap-1.5 mt-2">
            {(activity ?? []).slice(0,10).map((e:any)=>(<p key={e.id} className="text-sm"><span className="font-normal">{e.section}</span> · {e.eventType} — {e.detail} <span className="text-xs" style={{color:"var(--dim)"}}>{new Date(e.createdAt).toLocaleString("ar-EG")}</span></p>))}
          </div>
        </>}
      </div>
      <div className="flex gap-2 flex-wrap mt-3">
        {agg.map(a=>(<button key={a.label} onClick={()=>setTab(a.go)} aria-label={a.label} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--surface)",border:"1px solid var(--border)"}}>{a.label}: {a.n} عنصر ↗</button>))}
        <span className="text-xs font-normal px-3 py-2 rounded-full" style={{background: overdue.length?"#D92D20":"var(--surface2)", color: overdue.length?"#fff":"var(--text)"}}>متأخر: {overdue.length}</span>
        <span className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--surface2)"}}>مستحق Outcome Review: {outcomeDue.length}</span>
      </div>
      <div className="rounded-2xl p-4 mt-4" style={card}>
        <h3 className="font-bold mb-2">حالة خط الشغل (Pipeline)</h3>
        <div className="flex flex-col gap-1.5">
          {PIPELINE.map((s,i)=>(<div key={s} className="flex items-center gap-2 text-sm"><span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-normal shrink-0" style={{background:"var(--teal)",color:"#FFF2E9"}}>{i+1}</span><span>{s}</span></div>))}
        </div>
      </div>
      <form className="rounded-2xl p-4 mt-4 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!f.title.trim()){setErr("اكتب عنوان عنصر الشغل");return;} setErr(""); create.mutate();}}>
        <h3 className="font-bold">عنصر متابعة جديد</h3>
        <div><label htmlFor="w-title" className="text-sm font-normal block mb-1">العنوان *</label><input id="w-title" {...FIELDS.createWorkItem.title} value={f.title} onChange={e=>setF({...f,title:e.target.value})} className={inp} style={inpStyle} />{err && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{err}</p>}</div>
        <div className="grid md:grid-cols-4 gap-3">
          <div><label htmlFor="w-src" className="text-sm font-normal block mb-1">المصدر</label><select id="w-src" value={f.sourceType} onChange={e=>setF({...f,sourceType:e.target.value})} className={inp} style={inpStyle}>{["Manual","Task","Campaign","Creative","Content","Experiment"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="w-role" className="text-sm font-normal block mb-1">المسؤول / الدور</label><select id="w-role" value={f.ownerRole} onChange={e=>setF({...f,ownerRole:e.target.value})} className={inp} style={inpStyle}>{ROLES.map(r=>(<option key={r}>{r}</option>))}</select></div>
          <div><label htmlFor="w-pri" className="text-sm font-normal block mb-1">الأولوية</label><select id="w-pri" value={f.priority} onChange={e=>setF({...f,priority:e.target.value})} className={inp} style={inpStyle}>{["Low","Medium","High","Critical"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="w-due" className="text-sm font-normal block mb-1">تاريخ الاستحقاق</label><input id="w-due" type="date" value={f.dueDate} onChange={e=>setF({...f,dueDate:e.target.value})} className={inp} style={inpStyle} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label htmlFor="w-next" className="text-sm font-normal block mb-1">Next Action</label><input id="w-next" {...FIELDS.createWorkItem.nextAction} value={f.nextAction} onChange={e=>setF({...f,nextAction:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="w-block" className="text-sm font-normal block mb-1">Blocker</label><input id="w-block" {...FIELDS.createWorkItem.blocker} value={f.blocker} onChange={e=>setF({...f,blocker:e.target.value})} className={inp} style={inpStyle} /></div>
        </div>
        <button type="submit" aria-label="إضافة عنصر متابعة" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ إضافة للمتابعة</button>
      </form>
      <div className="grid gap-3 mt-4">
        {work.length===0 && <Empty title="لوحة المتابعة فارغة" hint="أي مهمة من Ask Zyra أو من النموذج ده بتظهر هنا وتتقدم عبر المراحل الثمانية لحد Outcome Review." />}
        {work.map((w:any)=>{
          const od = w.dueDate && w.dueDate < todayStr && !["Completed","Failed"].includes(w.status);
          return (
          <article key={w.id} className="rounded-2xl p-4" style={{...card, borderColor: od ? "var(--danger)" : "var(--border)"}}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-bold">{w.title} {od && <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"#D92D20",color:"#fff"}}>OVERDUE</span>}</h3>
                <p className="text-xs mt-1" style={{color:"var(--dim)"}}>{w.sourceType} · {w.ownerRole} · أولوية {w.priority}{w.dueDate?` · استحقاق ${w.dueDate}`:""}</p>
                {w.nextAction && <p className="text-sm mt-1"><b>Next:</b> {w.nextAction}</p>}
                {w.blocker && <p className="text-sm mt-1" style={{color:"var(--danger)"}}><b>Blocker:</b> {w.blocker}</p>}
              </div>
              <span className="text-xs font-normal px-3 py-1.5 rounded-full shrink-0" style={{background:"var(--teal)",color:"#FFF2E9"}}>{w.status}</span>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-normal whitespace-nowrap">التقدم {w.progress}% · مرحلة {w.stage}/8 {STAGES[w.stage-1]}</span>
                <input aria-label={`تقدم ${w.title}`} type="range" min={0} max={100} value={w.progress} onChange={e=>upd.mutate({id:w.id, progress:Number(e.target.value)})} className="flex-1" />
              </div>
              <div className="flex gap-1 mt-2">{STAGES.map((s,i)=>(<button key={s} aria-label={`مرحلة ${i+1} ${s} لـ ${w.title}`} onClick={()=>upd.mutate({id:w.id,stage:i+1})} className="h-2.5 flex-1 rounded-full" style={{background: i < w.stage ? "var(--accent)" : "var(--border)"}} />))}</div>
            </div>
            <div className="flex gap-2 flex-wrap mt-3 items-center">
              <label className="text-xs font-normal" htmlFor={`ws-${w.id}`}>الحالة</label>
              <select id={`ws-${w.id}`} value={w.status} onChange={e=>upd.mutate({id:w.id,status:e.target.value})} className="rounded-xl px-3 py-1.5 border text-sm" style={inpStyle}>{STATUSES.map(s=>(<option key={s}>{s}</option>))}</select>
              <DelBtn label={`حذف ${w.title}`} onClick={()=>del.mutate(w.id)} />
            </div>
          </article>);})}
      </div>
    </section>
  );
}

/* ================= Queue (Tasks A-G) ================= */
function QueueTab({ tasks, inv }: any) {
  const [f,setF]=useState({ title:"", type:"A", objective:"", evidenceTag:"UNKNOWN", assumptions:"", confidence:50, freshness:"" });
  const [err,setErr]=useState("");
  const create = useMutation({ mutationFn: async()=> await api.createTask({ title:f.title, type:f.type as "A", objective:f.objective, evidenceTag:f.evidenceTag as "UNKNOWN", assumptions:f.assumptions, confidence:f.confidence, freshness:f.freshness, notes:"" }), onSuccess:()=>{ setF({ title:"", type:"A", objective:"", evidenceTag:"UNKNOWN", assumptions:"", confidence:50, freshness:"" }); inv(); } });
  const upd = useMutation({ mutationFn: async(v:any)=> await api.updateTask({ id:v.id, status:v.status as never, stage:v.stage }), onSuccess: inv });
  const del = useMutation({ mutationFn: async(id:number)=> await api.deleteTask({id}), onSuccess: inv });
  return (
    <section>
      <h2 className="font-bold text-xl">مهام الذكاء A–G — PART 3</h2>
      <p className="text-sm mt-1" style={{color:"var(--dim)"}}>كل مهمة بتعدي دورة الـ 8 مراحل ومخرجاتها بصيغة PART 6: ‏Naming + CIS Tag + Framework Tag + AEO Gate + COD Check + Payday Check + Uncertainty Flag.</p>
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        {Object.entries(TASK_TYPES).map(([k,v])=>(
          <div key={k} className="rounded-2xl p-3 text-sm" style={card}><b>{v}</b><p className="mt-1" style={{color:"var(--dim)"}}>{k==="A"?"إنتاج ستاتيك يومي من الزوايا المعتمدة وفحصه بالـ Validator قبل أي اعتماد.":k==="B"?"مراجعة أسبوعية للـ Flywheel: Research → Learning → Dual Scaling.":k==="C"?"مراجعة استراتيجية شهرية/ربع سنوية — تتسجل في Performance Reviews.":k==="D"?"قرار Kill/Pause/Scale من محرك القرار في الميديا باير بالترتيب الإلزامي.":k==="E"?"بروتوكول Cold Start لمنتج أقل من 14 يوم أو 50 طلب — لغة عدم يقين خاصة.":k==="F"?"تدقيق AEO/امتثال كامل على كرييتيف قبل الشحن.":"موجز ذكاء تنافسي من الويبسايت وMeta/TikTok Ads Library بمصادر مؤرخة."}</p></div>
        ))}
      </div>
      <form className="rounded-2xl p-4 mt-4 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!f.title.trim()){setErr("اكتب عنوان المهمة");return;} setErr(""); create.mutate();}}>
        <h3 className="font-bold">مهمة جديدة</h3>
        <div><label htmlFor="t-title" className="text-sm font-normal block mb-1">العنوان *</label><input id="t-title" {...FIELDS.createTask.title} value={f.title} onChange={e=>setF({...f,title:e.target.value})} className={inp} style={inpStyle} />{err && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{err}</p>}</div>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="t-type" className="text-sm font-normal block mb-1">النوع</label><select id="t-type" value={f.type} onChange={e=>setF({...f,type:e.target.value})} className={inp} style={inpStyle}>{Object.entries(TASK_TYPES).map(([k,v])=>(<option key={k} value={k}>{v}</option>))}</select></div>
          <div><label htmlFor="t-ev" className="text-sm font-normal block mb-1">Evidence Tag</label><select id="t-ev" value={f.evidenceTag} onChange={e=>setF({...f,evidenceTag:e.target.value})} className={inp} style={inpStyle}>{EVIDENCE.map(e=>(<option key={e}>{e}</option>))}</select></div>
          <div><label htmlFor="t-conf" className="text-sm font-normal block mb-1">Confidence: {f.confidence}%</label><input id="t-conf" type="range" min={0} max={100} value={f.confidence} onChange={e=>setF({...f,confidence:Number(e.target.value)})} className="w-full" aria-label="Confidence" /></div>
        </div>
        <div><label htmlFor="t-obj" className="text-sm font-normal block mb-1">الهدف التجاري الحقيقي</label><textarea id="t-obj" {...FIELDS.createTask.objective} value={f.objective} onChange={e=>setF({...f,objective:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label htmlFor="t-as" className="text-sm font-normal block mb-1">Assumptions</label><input id="t-as" {...FIELDS.createTask.assumptions} value={f.assumptions} onChange={e=>setF({...f,assumptions:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="t-fr" className="text-sm font-normal block mb-1">Freshness</label><input id="t-fr" {...FIELDS.createTask.freshness} value={f.freshness} onChange={e=>setF({...f,freshness:e.target.value})} className={inp} style={inpStyle} placeholder="مثال: بيانات آخر 7 أيام" /></div>
        </div>
        <button type="submit" aria-label="إضافة مهمة" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ إضافة مهمة</button>
      </form>
      <div className="grid gap-3 mt-4">
        {tasks.length===0 && <Empty title="لا توجد مهام" hint="وجّه أول مهمة من تبويب «اسأل زيرا» أو من النموذج ده." />}
        {tasks.map((t:any)=>(
          <article key={t.id} className="rounded-2xl p-4" style={card}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div><h3 className="font-bold">{t.title}</h3><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{TASK_TYPES[t.type]} · {t.evidenceTag} · Confidence {t.confidence}%{t.freshness?` · ${t.freshness}`:""}</p>{t.objective && <p className="text-sm mt-2">{t.objective}</p>}</div>
              <span className="text-xs font-normal px-3 py-1.5 rounded-full shrink-0" style={{background:"var(--teal)",color:"#FFF2E9"}}>{t.status}</span>
            </div>
            <p className="text-xs font-normal mt-3 mb-1.5">المرحلة: {t.stage} — {STAGES[t.stage-1]}</p>
            <div className="flex gap-1">{STAGES.map((s,i)=>(<button key={s} aria-label={`مرحلة ${i+1} ${s}`} onClick={()=>upd.mutate({id:t.id,stage:i+1})} className="h-2.5 flex-1 rounded-full" style={{background: i < t.stage ? "var(--accent)" : "var(--border)"}} />))}</div>
            <div className="flex gap-2 flex-wrap mt-3 items-center">
              <label className="text-xs font-normal" htmlFor={`ts-${t.id}`}>الحالة</label>
              <select id={`ts-${t.id}`} value={t.status} onChange={e=>upd.mutate({id:t.id,status:e.target.value})} className="rounded-xl px-3 py-1.5 border text-sm" style={inpStyle}>{STATUSES.map(s=>(<option key={s}>{s}</option>))}</select>
              <DelBtn label={`حذف مهمة ${t.title}`} onClick={()=>del.mutate(t.id)} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================= Media Buyer ================= */
function MediaTab({ campaigns, profile, payday, snapshots, inv, egp }: any) {
  const [f,setF]=useState({ name:"", platform:"Meta", objective:"", status:"Draft", budget:0, spent:0, results:"", period:"", attribution:"7-day click", weeklyOrders:0, notes:"" });
  const [err,setErr]=useState("");
  const create = useMutation({ mutationFn: async()=> await api.createCampaign(f), onSuccess:()=>{ setF({ name:"", platform:"Meta", objective:"", status:"Draft", budget:0, spent:0, results:"", period:"", attribution:"7-day click", weeklyOrders:0, notes:"" }); inv(); } });
  const upd = useMutation({ mutationFn: async(v:any)=> await api.updateCampaign(v), onSuccess: inv });
  const del = useMutation({ mutationFn: async(id:number)=> await api.deleteCampaign({id}), onSuccess: inv });
  const [wo,setWo]=useState(20);
  const struct = useMutation({ mutationFn: async()=> await api.campaignStructure({ weeklyOrders: wo }) });
  const [fn,setFn]=useState({ hookRate:0, holdRate:0, ctr:0, cpm:0, cpp:0, outboundClicks:0, lpv:0, atc:0, ic:0, placed:0, confirmed:0, delivered:0, spend:0, adAgeHours:999 });
  const diag = useMutation({ mutationFn: async()=> await api.diagnoseFunnel(fn) });
  const [d,setD]=useState({ gpt:0, aov:0, ctr:0, accountAvgCtr:0, daysRunning:0, hookRate:0, holdRate:0, convRate:0, creativeAgeDays:0, tier:1, coldStart:false });
  const decide = useMutation({ mutationFn: async()=> await api.decideTaskD({ ...d, paydayState: payday.state }) });
  const toApproval = useMutation({ mutationFn: async(v:{title:string,desc:string})=> await api.createApproval({ title:v.title, actionType: decide.data?.verdict==="SCALE" ? "Budget Change" : "Pause Campaign", description:v.desc }), onSuccess: inv });
  const toGrave = useMutation({ mutationFn: async()=> await api.createExperiment({ hypothesis:"Dead Angle — Task D KILL: " + (decide.data?.reason ?? ""), creativeId:"", audience:"", product:"", hook:"", angle:"", format:"", offer:"", budget:0, startDate:"", endDate:"", actuals:"", sampleSize:"", attribution:"", profitability:"GPT " + d.gpt, verdict:"Dead Angle" }), onSuccess: inv });
  const numField = (obj:any,setObj:any,k:string,label:string)=> (<div><label htmlFor={"m-"+k} className="text-xs font-normal block mb-1">{label}</label><input id={"m-"+k} type="number" step="any" value={obj[k]} onChange={e=>setObj({...obj,[k]:Number(e.target.value)})} className={inp} style={inpStyle} /></div>);
  return (
    <section>
      <h2 className="font-bold text-xl">الميديا باير — Campaign Intelligence</h2>
      <p className="text-sm mt-1" style={{color:"var(--dim)"}}>سجل حملات يدوي (لا اتصال حي بحساب إعلانات) + باني هيكلة + محرك قرار Task D + تشخيص Funnel. أي تغيير ميزانية أو إيقاف = مقترح في Approvals فقط.</p>
      {(()=>{ const latest = (snapshots ?? [])[0]; const f = freshness(latest?.createdAt); return (
        <div className="rounded-2xl p-4 mt-3" style={{...card, borderColor: latest ? "var(--border)" : "var(--danger)"}}>
          <p className="font-normal text-sm">🧮 بوابة المحرك المالي أولاً: {latest ? <>آخر لقطة مالية «{latest.label}» — حداثة البيانات {f.icon} {f.label}. قرارات الكرييتيف والحملات وKill/Scale تُبنى عليها.</> : <>مفيش أي لقطة مالية مسجلة — ممنوع أي قرار Kill/Scale نهائي قبل حساب Cohort وحفظ لقطة في قسم الماليات. أي حكم دلوقتي يبقى Provisional.</>}</p>
          <p className="text-xs mt-1" style={{color:"var(--dim)"}}>قاعدة استشارية إضافية (كورس ai.html): إنفاق كرييتيف ≥ 2× Target CPP بلا تحويل = إشارة قتل/مراجعة — خاضعة لبوابات GPT وTask D دائماً.</p>
        </div> ); })()}
      <div className="flex gap-2 flex-wrap mt-3">
        <span className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--surface2)"}}>⚠️ Day Trade Trap: ممنوع قتل إعلان جديد قبل 48–72 ساعة</span>
        <span className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--surface2)"}}>⚠️ Creative Similarity Penalty: نوّع الزوايا فعلاً، مش تنويعات متطابقة</span>
        {profile?.targetCpp>0 && <span className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--surface2)"}}>Target CPP من المدخلات: {egp(profile.targetCpp)}</span>}
      </div>

      <form className="rounded-2xl p-4 mt-4 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!f.name.trim()){setErr("اسم الحملة مطلوب");return;} setErr(""); create.mutate();}}>
        <h3 className="font-bold">تسجيل حملة</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="c-name" className="text-sm font-normal block mb-1">اسم الحملة *</label><input id="c-name" {...FIELDS.createCampaign.name} value={f.name} onChange={e=>setF({...f,name:e.target.value})} className={inp} style={inpStyle} />{err && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{err}</p>}</div>
          <div><label htmlFor="c-plat" className="text-sm font-normal block mb-1">المنصة</label><select id="c-plat" value={f.platform} onChange={e=>setF({...f,platform:e.target.value})} className={inp} style={inpStyle}>{["Meta","TikTok","Google","Other"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="c-status" className="text-sm font-normal block mb-1">الحالة</label><select id="c-status" value={f.status} onChange={e=>setF({...f,status:e.target.value})} className={inp} style={inpStyle}>{["Draft","Ready for Review","Active","Paused","Ended"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="c-obj" className="text-sm font-normal block mb-1">الهدف</label><input id="c-obj" {...FIELDS.createCampaign.objective} value={f.objective} onChange={e=>setF({...f,objective:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="c-period" className="text-sm font-normal block mb-1">فترة التقرير</label><input id="c-period" {...FIELDS.createCampaign.period} value={f.period} onChange={e=>setF({...f,period:e.target.value})} className={inp} style={inpStyle} placeholder="مثال: 12–18 نوفمبر" /></div>
          <div><label htmlFor="c-attr" className="text-sm font-normal block mb-1">نافذة الإسناد</label><input id="c-attr" {...FIELDS.createCampaign.attribution} value={f.attribution} onChange={e=>setF({...f,attribution:e.target.value})} className={inp} style={inpStyle} /></div>
          {numField(f,setF,"budget","الميزانية EGP")}{numField(f,setF,"spent","المنصرف EGP")}{numField(f,setF,"weeklyOrders","طلبات أسبوعية")}
        </div>
        <div><label htmlFor="c-res" className="text-sm font-normal block mb-1">النتائج (طلبات/مبيعات/ملخص)</label><input id="c-res" {...FIELDS.createCampaign.results} value={f.results} onChange={e=>setF({...f,results:e.target.value})} className={inp} style={inpStyle} /></div>
        <button type="submit" aria-label="حفظ حملة" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ حفظ الحملة</button>
      </form>
      <div className="grid gap-3 mt-3">
        {campaigns.length===0 && <Empty title="لا توجد حملات مسجلة" hint="سجّل أول حملة بأرقامها اليدوية من حسابك الإعلاني — النظام لا يدّعي أي سحب حي للبيانات." />}
        {campaigns.map((c:any)=>(
          <article key={c.id} className="rounded-2xl p-4 flex items-start justify-between gap-3 flex-wrap" style={card}>
            <div><h3 className="font-bold">{c.name}</h3><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{c.platform} · {c.objective || "—"} · {c.period || "بدون فترة"} · إسناد {c.attribution}</p><p className="text-sm mt-1">ميزانية {egp(c.budget)} · منصرف {egp(c.spent)} ({c.budget>0?Math.round(c.spent/c.budget*100):0}%){c.results?` · نتائج: ${c.results}`:""}</p></div>
            <div className="flex gap-2 items-center">
              <select aria-label={`حالة حملة ${c.name}`} value={c.status} onChange={e=>upd.mutate({id:c.id,status:e.target.value})} className="rounded-xl px-2 py-1.5 border text-xs" style={inpStyle}>{["Draft","Ready for Review","Active","Paused","Ended"].map(s=>(<option key={s}>{s}</option>))}</select>
              <DelBtn label={`حذف حملة ${c.name}`} onClick={()=>del.mutate(c.id)} />
            </div>
          </article>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">Campaign Structure Builder — Domino Tiers + 3:2:2</h3>
          <div className="flex gap-2 mt-3 items-end">
            <div className="flex-1"><label htmlFor="wo" className="text-sm font-normal block mb-1">طلبات أسبوعية</label><input id="wo" type="number" {...FIELDS.campaignStructure.weeklyOrders} value={wo} onChange={e=>setWo(Number(e.target.value))} className={inp} style={inpStyle} /></div>
            <button onClick={()=>struct.mutate()} aria-label="ابنِ الهيكلة" className="px-4 py-2.5 rounded-full font-normal text-sm" style={{background:"var(--accent)",color:"#FFFFFF"}}>ابنِ الهيكلة</button>
          </div>
          {struct.data && <div className="mt-3 text-sm space-y-1"><p><b>{struct.data.tierLabel}:</b> {struct.data.adSetPlan}</p><p>تركيبات 3:2:2 = <b>{struct.data.combos322}</b> · سقف Olympic Rings = <b>{struct.data.ringsCombos}</b></p><p style={{color:"var(--dim)"}}>{struct.data.guidance}</p></div>}
          <p className="text-xs mt-3" style={{color:"var(--dim)"}}>معادلات الميزانية (Appendix G): الميزانية اليومية للاختبار = Target CPP × طلبات الاختبار المستهدفة ÷ مدة الاختبار — استخدم Target CPP وميزانية الاختبار من المدخلات الأساسية، ولا تستخدم أرقاماً عامة.</p>
        </div>

        <div className="rounded-2xl p-4" style={{...card, borderColor:"var(--accent)"}}>
          <h3 className="font-bold">محرك قرار Task D — Kill / Pause / Scale</h3>
          <p className="text-xs mt-1" style={{color:"var(--dim)"}}>الترتيب الإلزامي: COD Math ← Thresholds ← CIS ← Payday ← Freshness. حالة Payday الحالية: <b>{payday.label}</b></p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {numField(d,setD,"gpt","GPT (EGP)")}{numField(d,setD,"aov","AOV (EGP)")}{numField(d,setD,"ctr","CTR %")}{numField(d,setD,"accountAvgCtr","متوسط CTR الحساب %")}{numField(d,setD,"daysRunning","أيام التشغيل")}{numField(d,setD,"hookRate","Hook Rate %")}{numField(d,setD,"holdRate","Hold Rate %")}{numField(d,setD,"convRate","Conversion Rate %")}{numField(d,setD,"creativeAgeDays","عمر الكرييتيف (يوم)")}
            <div><label htmlFor="d-tier" className="text-xs font-normal block mb-1">Freshness Tier</label><select id="d-tier" value={d.tier} onChange={e=>setD({...d,tier:Number(e.target.value)})} className={inp} style={inpStyle}><option value={1}>Tier 1 (حد 14 يوم)</option><option value={2}>Tier 2 (حد 21 يوم)</option><option value={3}>Tier 3 (حد 7 أيام)</option></select></div>
          </div>
          <label className="flex items-center gap-2 text-sm font-normal mt-3 cursor-pointer"><input type="checkbox" checked={d.coldStart} onChange={e=>setD({...d,coldStart:e.target.checked})} className="w-5 h-5" /> وضع Cold Start (منتج &lt;14 يوم أو &lt;50 طلب) — PART 4</label>
          <button onClick={()=>decide.mutate()} aria-label="احسب قرار Task D" className="mt-3 px-5 py-2.5 rounded-full font-normal" style={{background:"var(--teal)",color:"#FFF2E9"}}>{decide.isPending?"جاري التحليل…":"احسب الحكم"}</button>
          {decide.data && (
            <div className="mt-3 rounded-xl p-3" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
              <p className="font-normal text-lg">{decide.data.verdict} <span className="text-xs px-2 py-1 rounded-full" style={{background:"var(--surface2)"}}>Confidence: {decide.data.confidence}</span></p>
              {decide.data.steps.map((s:any)=>(<p key={s.step} className="text-sm mt-2"><b>{s.step}:</b> {s.result} — {s.detail}</p>))}
              <p className="text-sm mt-2"><b>Reason:</b> {decide.data.reason}</p>
              <p className="text-xs mt-1" style={{color:"var(--dim)"}}>{decide.data.frameworkRef}</p>
              <p className="text-xs mt-1" style={{color:"var(--dim)"}}>معيار الإثبات قبل التوصية: الحكم ده لازم يتراجع مع مصادره + نافذته الزمنية + حداثة بياناته + افتراضاته + أثره المتوقع قبل الاعتماد — أي عنصر ناقص يخلي الحكم Provisional.</p>
              {decide.data.scaleBudgetPct>0 && <p className="text-sm mt-1 font-normal">زيادة ميزانية مقترحة: +{decide.data.scaleBudgetPct}% (تروح Approvals)</p>}
              <div className="flex gap-2 flex-wrap mt-3">
                {(decide.data.verdict==="KILL"||decide.data.verdict==="SCALE") && <button onClick={()=>toApproval.mutate({ title:`Task D: ${decide.data!.verdict} — مقترح ميديا باير`, desc: decide.data!.reason + " | Framework: " + decide.data!.frameworkRef })} aria-label="إرسال الحكم للاعتمادات" className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--accent)",color:"#FFFFFF"}}>إرسال الحكم للاعتمادات</button>}
                {decide.data.verdict==="KILL" && <button onClick={()=>toGrave.mutate()} aria-label="تسجيل في Dead Angle Graveyard" className="text-xs font-normal px-3 py-2 rounded-full" style={{border:"1px solid var(--border)"}}>⚰️ تسجيل السبب في Dead Angle Graveyard</button>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl p-4 mt-4" style={card}>
        <h3 className="font-bold">Sequential Funnel Diagnosis — حكم الـ 7 حقول</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
          {numField(fn,setFn,"hookRate","Hook Rate %")}{numField(fn,setFn,"holdRate","Hold Rate %")}{numField(fn,setFn,"ctr","CTR %")}{numField(fn,setFn,"cpm","CPM")}{numField(fn,setFn,"cpp","CPP")}{numField(fn,setFn,"outboundClicks","Outbound Clicks")}{numField(fn,setFn,"lpv","LPV")}{numField(fn,setFn,"atc","ATC")}{numField(fn,setFn,"ic","IC")}{numField(fn,setFn,"placed","Placed")}{numField(fn,setFn,"confirmed","Confirmed")}{numField(fn,setFn,"delivered","Delivered")}{numField(fn,setFn,"spend","Spend EGP")}{numField(fn,setFn,"adAgeHours","عمر الإعلان (ساعة)")}
        </div>
        <button onClick={()=>diag.mutate()} aria-label="شخّص الـ Funnel" className="mt-3 px-5 py-2.5 rounded-full font-normal" style={{background:"var(--accent)",color:"#FFFFFF"}}>{diag.isPending?"جاري التشخيص…":"شخّص"}</button>
        {diag.data && (
          <div className="mt-3 rounded-xl p-3 text-sm space-y-1.5" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
            <p className="font-normal text-base">الحكم: {diag.data.verdict} · Confidence {diag.data.confidence}%</p>
            <p><b>1. What Happened:</b> {diag.data.whatHappened}</p><p><b>2. Why:</b> {diag.data.why}</p><p><b>3. Evidence:</b> {diag.data.evidence}</p><p><b>5. Recommended Action:</b> {diag.data.recommendedAction}</p><p><b>6. Expected Impact:</b> {diag.data.expectedImpact}</p><p><b>7. Measure Next:</b> {diag.data.measureNext}</p>
            {diag.data.warnings.map((w:string)=>(<p key={w} style={{color:"var(--warning)"}}>⚠️ {w}</p>))}
          </div>
        )}
        <div className="mt-4">
          <h4 className="font-normal text-sm">مصفوفة Troubleshooting — Appendix I (مختصرة)</h4>
          <ul className="text-sm mt-1.5 space-y-1 list-disc list-inside" style={{color:"var(--dim)"}}>
            <li>Hook عالي + LPV منخفض → Scent Mismatch أو بطء صفحة.</li>
            <li>LPV كويس + ATC ضعيف → عرض/ثقة صفحة المنتج.</li>
            <li>Placed كويس + Delivered ضعيف → تأكيد واتساب / توصيل / RTO — مش إعلان.</li>
            <li>كل حاجة كويسة + GPT سالب → اقتصاديات وحدة — ارجع للمدخلات الأساسية وحاسبة COD.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ================= Creative ================= */
function CreativeTab({ creatives, genRequests, inv }: any) {
  const [f,setF]=useState({ title:"", product:"", angle:"Problem-Based", hook:"", format:"Native IG Story", talent:"", lever:"", version:1, status:"Concept Draft", perfClass:"Insufficient Evidence", notes:"" });
  const [err,setErr]=useState("");
  const cis = `ZYRA_${(f.product||"Product").replace(/\s+/g,"_")}_${f.angle.replace(/\s+/g,"_")}_${(f.hook||"Hook").replace(/\s+/g,"_")}_${f.format.replace(/\s+/g,"_")}_${(f.talent||"Talent").replace(/\s+/g,"_")}_${(f.lever||"Lever").replace(/\s+/g,"_")}_V${f.version}`;
  const create = useMutation({ mutationFn: async()=> await api.createCreative(f), onSuccess:()=>{ setF({ title:"", product:"", angle:"Problem-Based", hook:"", format:"Native IG Story", talent:"", lever:"", version:1, status:"Concept Draft", perfClass:"Insufficient Evidence", notes:"" }); inv(); } });
  const upd = useMutation({ mutationFn: async(v:any)=> await api.updateCreative(v), onSuccess: inv });
  const del = useMutation({ mutationFn: async(id:number)=> await api.deleteCreative({id}), onSuccess: inv });
  const [gen,setGen]=useState({ title:"", product:"", angle:"Problem-Based", format:"Native IG Story", hook:"", primaryText:"", cta:"", size:"1080x1920", prompt:"", notes:"" });
  const [genErr,setGenErr]=useState("");
  const genCis = `ZYRA_${(gen.product||"Product").replace(/\s+/g,"_")}_${gen.angle.replace(/\s+/g,"_")}_${(gen.hook||"Hook").replace(/\s+/g,"_")}_${gen.format.replace(/\s+/g,"_")}_GEN_V1`;
  const genSpec = `مسار الإنتاج: بحث منافسين ← هندسة برومبتات ← صور ثابتة ← صفحة هبوط ← فيديو/UGC ← كوبي ← تستينج · قاعدة زيرا الحاكمة: ممنوع وجوه بشرية مولّدة بالـ AI وممنوع UGC مزيف — UGC/FGC حقيقي وسلطة خبير فقط؛ البصريات على المنتج والمشهد والملمس · برومبت التصميم: «${gen.prompt}» · 3-Tier Hierarchy — Tier 1 Hook: «${gen.hook}» · Tier 2: المنتج الحقيقي معزولاً في Safe Zone وسط ${gen.size} + سياق قيمة مختصر · Tier 3 CTA: «${gen.cta}» · Primary Text: ${gen.primaryText} · AEO: يمر على الـ Validator قبل الاعتماد · RTL كامل`;
  const createGen = useMutation({ mutationFn: async()=> await api.createGenerationRequest({ title: gen.title, product: gen.product, angle: gen.angle, format: gen.format, hook: gen.hook, primaryText: gen.primaryText, cta: gen.cta, size: gen.size, notes: gen.notes, spec: genSpec, cisTag: genCis }), onSuccess:()=>{ setGen({ title:"", product:"", angle:"Problem-Based", format:"Native IG Story", hook:"", primaryText:"", cta:"", size:"1080x1920", prompt:"", notes:"" }); inv(); } });
  const updGen = useMutation({ mutationFn: async(v:any)=> await api.updateGenerationRequest(v), onSuccess: inv });
  const delGen = useMutation({ mutationFn: async(id:number)=> await api.deleteGenerationRequest({id}), onSuccess: inv });
  const [perf,setPerf]=useState<Record<number,any>>({});
  const savePerf = useMutation({ mutationFn: async(v:any)=> await api.updateCreative(v), onSuccess: inv });
  const [analysis,setAnalysis]=useState<Record<number,any>>({});
  const analyze = useMutation({ mutationFn: async(id:number)=> await api.analyzeCreative({ id }), onSuccess:(d, id)=>{ setAnalysis({ ...analysis, [id]: d }); inv(); } });
  const [sim,setSim]=useState([false,false,false,false]);
  const simQs = ["هل الزاوية مختلفة فعلاً عن آخر 3 كرييتيف (مش مجرد Hook جديد على نفس السكربت)؟","هل الـ Hook بيخاطب Life Moment مختلف؟","هل الفورمات أو الـ Talent مختلف؟","هل الـ Lever/العرض مختلف؟"];
  const [spec,setSpec]=useState({ hook:"", cta:"" });
  const hookWords = spec.hook.trim() ? spec.hook.trim().split(/\s+/).length : 0;
  const ctaWords = spec.cta.trim() ? spec.cta.trim().split(/\s+/).length : 0;
  const [lego,setLego]=useState({ h1:"", h2:"", h3:"", b1:"", b2:"", cta:"" });
  const legoCombos = [lego.h1,lego.h2,lego.h3].filter(Boolean).length * [lego.b1,lego.b2].filter(Boolean).length * (lego.cta?1:0);
  const [vText,setVText]=useState(""); const [vRetinol,setVRetinol]=useState(false); const [vVerified,setVVerified]=useState(false); const [vErr,setVErr]=useState("");
  const [vResult,setVResult]=useState<any>(null);
  const vMut = useMutation({ mutationFn: async()=> await api.validateCreative({ text:vText, isRetinol:vRetinol, shopifyVerified:vVerified }), onSuccess:(d)=>setVResult(d) });
  return (
    <section>
      <h2 className="font-bold text-xl">استوديو الكرييتيف — Creative Studio & Library</h2>
      <p className="text-sm mt-1" style={{color:"var(--dim)"}}>أصول بـ Creative ID وCIS Tag ثابت وإصدارات. فرّق دايماً بين Creative Concept (Draft) وReady-to-Publish Asset — والنشر نفسه ممنوع بدون اعتماد.</p>
      <form className="rounded-2xl p-4 mt-4 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!f.title.trim()){setErr("عنوان الكرييتيف مطلوب");return;} setErr(""); create.mutate();}}>
        <h3 className="font-bold">أصل كرييتيف جديد + CIS Tag Generator</h3>
        <div><label htmlFor="cr-title" className="text-sm font-normal block mb-1">العنوان *</label><input id="cr-title" {...FIELDS.createCreative.title} value={f.title} onChange={e=>setF({...f,title:e.target.value})} className={inp} style={inpStyle} />{err && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{err}</p>}</div>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="cr-prod" className="text-sm font-normal block mb-1">المنتج (باسمه — مش SKU)</label><input id="cr-prod" {...FIELDS.createCreative.product} value={f.product} onChange={e=>setF({...f,product:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="cr-angle" className="text-sm font-normal block mb-1">الزاوية (6 Master Angles)</label><select id="cr-angle" value={f.angle} onChange={e=>setF({...f,angle:e.target.value})} className={inp} style={inpStyle}>{ANGLES.map(a=>(<option key={a}>{a}</option>))}</select></div>
          <div><label htmlFor="cr-hook" className="text-sm font-normal block mb-1">Hook</label><input id="cr-hook" {...FIELDS.createCreative.hook} value={f.hook} onChange={e=>setF({...f,hook:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="cr-format" className="text-sm font-normal block mb-1">الفورمات (14 Static + 8 Video)</label><select id="cr-format" value={f.format} onChange={e=>setF({...f,format:e.target.value})} className={inp} style={inpStyle}>{[...STATIC_FORMATS,...VIDEO_FORMATS].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="cr-talent" className="text-sm font-normal block mb-1">Talent / Creator</label><input id="cr-talent" {...FIELDS.createCreative.talent} value={f.talent} onChange={e=>setF({...f,talent:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="cr-lever" className="text-sm font-normal block mb-1">Lever (العرض/الدافع)</label><input id="cr-lever" {...FIELDS.createCreative.lever} value={f.lever} onChange={e=>setF({...f,lever:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="cr-ver" className="text-sm font-normal block mb-1">الإصدار V#</label><input id="cr-ver" type="number" {...FIELDS.createCreative.version} value={f.version} onChange={e=>setF({...f,version:Number(e.target.value)})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="cr-status" className="text-sm font-normal block mb-1">الحالة</label><select id="cr-status" value={f.status} onChange={e=>setF({...f,status:e.target.value})} className={inp} style={inpStyle}>{["Concept Draft","In Production","Ready for Review","Ready to Publish","Archived"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="cr-perf" className="text-sm font-normal block mb-1">تصنيف الأداء</label><select id="cr-perf" value={f.perfClass} onChange={e=>setF({...f,perfClass:e.target.value})} className={inp} style={inpStyle}>{["Insufficient Evidence","Promising","Validated for this scope","Declining-Fatigued"].map(s=>(<option key={s}>{s}</option>))}</select></div>
        </div>
        <p className="text-sm font-normal rounded-xl p-3" dir="ltr" style={{background:"var(--surface2)",textAlign:"left"}}>CIS Tag: {cis}</p>
        <button type="submit" aria-label="حفظ كرييتيف" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ حفظ في المكتبة</button>
      </form>
      <div className="grid gap-3 mt-3">
        {creatives.length===0 && <Empty title="مكتبة الكرييتيف فارغة" hint="أول أصل يتسجل هنا بياخد CIS Tag ثابت يربطه بالأداء والتجارب." />}
        {creatives.map((c:any)=>(
          <article key={c.id} className="rounded-2xl p-4" style={card}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div><h3 className="font-bold">{c.title}</h3><p className="text-xs mt-1" dir="ltr" style={{textAlign:"right",color:"var(--dim)"}}>{c.cisTag}</p><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{c.format} · {c.angle} · {c.perfClass}</p></div>
              <span className="text-xs font-normal px-3 py-1.5 rounded-full shrink-0" style={{background: c.status==="Ready to Publish" ? "#067647" : "var(--surface2)", color: c.status==="Ready to Publish" ? "#fff" : "var(--text)"}}>{c.status}</span>
            </div>
            <div className="flex gap-2 flex-wrap mt-3 items-center">
              <select aria-label={`حالة ${c.title}`} value={c.status} onChange={e=>upd.mutate({id:c.id,status:e.target.value})} className="rounded-xl px-2 py-1.5 border text-xs" style={inpStyle}>{["Concept Draft","In Production","Ready for Review","Ready to Publish","Archived"].map(s=>(<option key={s}>{s}</option>))}</select>
              <select aria-label={`أداء ${c.title}`} value={c.perfClass} onChange={e=>upd.mutate({id:c.id,perfClass:e.target.value})} className="rounded-xl px-2 py-1.5 border text-xs" style={inpStyle}>{["Insufficient Evidence","Promising","Validated for this scope","Declining-Fatigued"].map(s=>(<option key={s}>{s}</option>))}</select>
              <DelBtn label={`حذف كرييتيف ${c.title}`} onClick={()=>del.mutate(c.id)} />
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-2xl p-4 mt-6" style={{...card, borderColor:"var(--accent)"}}>
        <h3 className="font-bold">🎨 Creative Generation Studio — توليد من جوه النظام عبر Muse</h3>
        <p className="text-sm mt-1 leading-relaxed" style={{color:"var(--dim)"}}>بصراحة كاملة: الاستوديو ده بيبني الـ Spec الكامل (3-Tier + CIS Tag + فحص AEO) وبيسجل «طلب توليد» في قائمة. <b>التوليد الفعلي للتصميم/الصورة بيتم بواسطة Muse — الوكيل المرتبط بيك — من القائمة دي</b>، والناتج بيتسجل كأصل كرييتيف مسودة مرتبط بالطلب. حالة كل طلب بتتابع هنا وفي متابعة الشغل.</p>
        <div className="flex flex-wrap gap-1.5 mt-3 items-center text-xs font-normal">
          {["بحث منافسين","هندسة برومبتات","صور ثابتة","صفحة هبوط","فيديو / UGC","كوبي","تستينج"].map((s,i,arr)=>(<span key={s} className="flex items-center gap-1.5"><span className="px-2.5 py-1.5 rounded-full" style={{background: i===1 ? "var(--accent)" : "var(--surface2)", color: i===1 ? "var(--teal)" : "var(--text)"}}>{i+1}. {s}</span>{i<arr.length-1 && <span aria-hidden style={{color:"var(--dim)"}}>←</span>}</span>))}
        </div>
        <p className="text-xs mt-1.5" style={{color:"var(--dim)"}}>مرحلة «هندسة البرومبتات» إلزامية قبل أي توليد صورة: البرومبت بيتبني من بحث المنافسين والزاوية والهوك — مش ارتجال.</p>
        <form className="grid gap-3 mt-3" onSubmit={(e)=>{e.preventDefault(); if(!gen.title.trim()){setGenErr("عنوان الطلب مطلوب");return;} if(!gen.hook.trim()){setGenErr("الـ Hook مطلوب لبناء الـ Spec");return;} setGenErr(""); createGen.mutate();}}>
          <div className="grid md:grid-cols-3 gap-3">
            <div><label htmlFor="gn-title" className="text-sm font-normal block mb-1">عنوان الطلب *</label><input id="gn-title" {...FIELDS.createGenerationRequest.title} value={gen.title} onChange={e=>setGen({...gen,title:e.target.value})} className={inp} style={inpStyle} />{genErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{genErr}</p>}</div>
            <div><label htmlFor="gn-prod" className="text-sm font-normal block mb-1">المنتج/الروتين</label><input id="gn-prod" {...FIELDS.createGenerationRequest.product} value={gen.product} onChange={e=>setGen({...gen,product:e.target.value})} className={inp} style={inpStyle} placeholder="مثال: روتين السيلوليت" /></div>
            <div><label htmlFor="gn-size" className="text-sm font-normal block mb-1">المقاس</label><select id="gn-size" value={gen.size} onChange={e=>setGen({...gen,size:e.target.value})} className={inp} style={inpStyle}>{["1080x1920","1080x1080","1080x1350"].map(s=>(<option key={s}>{s}</option>))}</select></div>
            <div><label htmlFor="gn-angle" className="text-sm font-normal block mb-1">الزاوية (من الـ 6)</label><select id="gn-angle" value={gen.angle} onChange={e=>setGen({...gen,angle:e.target.value})} className={inp} style={inpStyle}>{ANGLES.map(a=>(<option key={a}>{a}</option>))}</select></div>
            <div><label htmlFor="gn-format" className="text-sm font-normal block mb-1">الفورمات</label><select id="gn-format" value={gen.format} onChange={e=>setGen({...gen,format:e.target.value})} className={inp} style={inpStyle}>{[...STATIC_FORMATS,...VIDEO_FORMATS].map(s=>(<option key={s}>{s}</option>))}</select></div>
            <div><label htmlFor="gn-cta" className="text-sm font-normal block mb-1">CTA (3–4 كلمات)</label><input id="gn-cta" {...FIELDS.createGenerationRequest.cta} value={gen.cta} onChange={e=>setGen({...gen,cta:e.target.value})} className={inp} style={inpStyle} placeholder="اطلبي وادفعي عند الاستلام" /></div>
          </div>
          <div><label htmlFor="gn-hook" className="text-sm font-normal block mb-1">Tier 1 — Hook بصري (4–7 كلمات) *</label><input id="gn-hook" {...FIELDS.createGenerationRequest.hook} value={gen.hook} onChange={e=>setGen({...gen,hook:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="gn-prompt" className="text-sm font-normal block mb-1">برومبت التصميم (هندسة البرومبتات — مبني من بحث المنافسين)</label><textarea id="gn-prompt" value={gen.prompt} onChange={e=>setGen({...gen,prompt:e.target.value})} rows={2} className={inp} style={inpStyle} placeholder="وصف بصري دقيق: المنتج الحقيقي، الخلفية، الإضاءة، موضع الهوك، ما يجب تجنبه…" /></div>
          <div><label htmlFor="gn-pt" className="text-sm font-normal block mb-1">النص الأساسي (Primary Text)</label><textarea id="gn-pt" {...FIELDS.createGenerationRequest.primaryText} value={gen.primaryText} onChange={e=>setGen({...gen,primaryText:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
          <p className="text-xs font-normal rounded-xl p-3" dir="ltr" style={{background:"var(--surface2)",textAlign:"left"}}>CIS: {genCis}</p>
          <p className="text-xs" style={{color:"var(--dim)"}}>Spec: {genSpec}</p>
          <button type="submit" aria-label="إنشاء طلب توليد" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--teal)",color:"#FFF2E9"}}>＋ أنشئ طلب التوليد لـ Muse</button>
        </form>
        <div className="grid gap-3 mt-4">
          {(genRequests ?? []).length===0 && <Empty title="قائمة طلبات التوليد فارغة" hint="أول طلب فوق هيظهر هنا بحالة «جديد» وبيتنقل لعنصر متابعة شغل تلقائياً." />}
          {(genRequests ?? []).map((r:any)=>(
            <article key={r.id} className="rounded-2xl p-4" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div><h4 className="font-normal">{r.title}</h4><p className="text-xs mt-1" dir="ltr" style={{textAlign:"right",color:"var(--dim)"}}>{r.cisTag}</p><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{r.format} · {r.angle} · {r.size} · Hook: {r.hook}</p></div>
                <span className="text-xs font-normal px-3 py-1.5 rounded-full shrink-0" style={{background: r.status==="Delivered" ? "#067647" : r.status==="Generating" ? "#DC6803" : "var(--surface2)", color: r.status==="New" ? "var(--text)" : "#fff"}}>{{New:"جديد — في انتظار Muse",Generating:"جارٍ التوليد بواسطة Muse",Delivered:"تم التسليم (مسودة)",Approved:"معتمد",Rejected:"مرفوض"}[r.status as string] ?? r.status}</span>
              </div>
              <div className="flex gap-2 flex-wrap mt-3 items-center">
                <select aria-label={`حالة طلب ${r.title}`} value={r.status} onChange={e=>updGen.mutate({id:r.id,status:e.target.value as "New"})} className="rounded-xl px-2 py-1.5 border text-xs" style={inpStyle}>{["New","Generating","Delivered","Approved","Rejected"].map(s=>(<option key={s} value={s}>{s}</option>))}</select>
                <DelBtn label={`حذف طلب توليد ${r.title}`} onClick={()=>delGen.mutate(r.id)} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4 mt-4" style={card}>
        <h3 className="font-bold">🏆 Winner / Performance Analysis — ليه كسب؟ وليه خسر؟</h3>
        <p className="text-sm mt-1" style={{color:"var(--dim)"}}>أدخل أرقام الأداء الحقيقية لكل كرييتيف، والتحليل بيقارن طبقات CIS بمتوسط الحساب وبيطلع تصنيف + تفسير إلزامي + تنبيه إجهاد + Modular Remix. بلا أرقام = Insufficient Evidence، ومفيش اختراع.</p>
        <div className="grid gap-3 mt-3">
          {creatives.length===0 && <Empty title="لا كرييتيف لتحليله" hint="سجّل أصولاً في المكتبة فوق الأول، وبعد تشغيلها أدخل أرقامها هنا." />}
          {creatives.map((c:any)=>{
            const pv = perf[c.id] ?? { hookRate:c.hookRate, holdRate:c.holdRate, outboundCtr:c.outboundCtr, cvr:c.cvr, cpp:c.cpp, spend:c.spend, ordersDelivered:c.ordersDelivered, whyNote:c.whyNote };
            const setPv = (k:string,v:any)=> setPerf({ ...perf, [c.id]: { ...pv, [k]:v } });
            const an = analysis[c.id];
            return (
            <article key={c.id} className="rounded-2xl p-4" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div><h4 className="font-normal">{c.title}</h4><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{c.angle} · {c.format} · التصنيف الحالي: <b>{c.perfClass}</b></p></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                {([["hookRate","Hook Rate %"],["holdRate","Hold Rate %"],["outboundCtr","Outbound CTR %"],["cvr","CVR %"],["cpp","CPP EGP"],["spend","Spend EGP"],["ordersDelivered","طلبات مُسلّمة"]] as const).map(([k,l])=>(
                  <div key={k}><label htmlFor={`pf-${c.id}-${k}`} className="text-xs font-normal block mb-1">{l}</label><input id={`pf-${c.id}-${k}`} type="number" step="any" min={0} value={pv[k]} onChange={e=>setPv(k,Number(e.target.value))} className={inp} style={inpStyle} /></div>
                ))}
                <div><label htmlFor={`pf-${c.id}-why`} className="text-xs font-normal block mb-1">تفسير يدوي: ليه كسب/خسر؟</label><input id={`pf-${c.id}-why`} {...FIELDS.updateCreative.whyNote} value={pv.whyNote} onChange={e=>setPv("whyNote",e.target.value)} className={inp} style={inpStyle} /></div>
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                <button onClick={()=>savePerf.mutate({ id:c.id, ...pv })} aria-label={`حفظ أداء ${c.title}`} className="text-xs font-normal px-3 py-2 rounded-full" style={{border:"1px solid var(--border)"}}>حفظ الأرقام</button>
                <button onClick={()=>analyze.mutate(c.id)} aria-label={`تحليل ${c.title}`} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>{analyze.isPending ? "جاري التحليل…" : "حلّل الطبقات — ليه كسب/خسر؟"}</button>
              </div>
              {an && (
                <div className="mt-3 rounded-xl p-3 text-sm space-y-1.5" style={{background:"var(--surface)",border:"1px solid var(--border)"}}>
                  <p className="font-normal">التصنيف: {an.classification} · Confidence: {an.confidence}</p>
                  <p style={{color:"var(--dim)"}}>{an.sampleNote}</p>
                  {an.layers.map((l:any)=>(<p key={l.layer}><b>{l.layer}:</b> {l.value} مقابل متوسط {l.avg} — <b>{l.verdict}</b></p>))}
                  <p><b>ليه كسب/خسر:</b> {an.why}</p>
                  <p>{an.fatigue}</p>
                  <p><b>Remix:</b> {an.remix}</p>
                  {pv.whyNote && <p><b>تفسير مسجل:</b> {pv.whyNote}</p>}
                </div>
              )}
            </article>);})}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">4-Question Similarity Audit</h3>
          {simQs.map((q,i)=>(<label key={q} className="flex items-start gap-2 text-sm mt-2.5 cursor-pointer"><input type="checkbox" checked={sim[i]} onChange={e=>{ const n=[...sim]; n[i]=e.target.checked; setSim(n); }} className="w-5 h-5 mt-0.5" /> {q}</label>))}
          <p className="text-sm font-normal mt-3">{sim.every(Boolean) ? "✅ تنويع حقيقي — عدّى تدقيق التشابه." : sim.some(Boolean) ? "⚠️ تنويع جزئي — راجع الأسئلة غير المؤكدة قبل الإطلاق (Similarity Penalty)." : "⬜ أكمل التدقيق قبل إطلاق أي كرييتيف جديد."}</p>
          <h3 className="font-bold mt-5">Static Ad Spec Builder — هيراركي 3 طبقات</h3>
          <div className="grid gap-2 mt-2">
            <div><label htmlFor="sp-hook" className="text-sm font-normal block mb-1">Tier 1 — Hook بصري (4–7 كلمات) · الآن: {hookWords}</label><input id="sp-hook" value={spec.hook} onChange={e=>setSpec({...spec,hook:e.target.value})} className={inp} style={inpStyle} placeholder="مثال: سيلوليت بيخفي ثقتك بنفسك؟" />{hookWords>0 && (hookWords<4||hookWords>7) && <p className="text-xs mt-1" style={{color:"var(--warning)"}}>الهوك لازم 4–7 كلمات وتجنب إسناد صفات شخصية لجسم المشاهد.</p>}</div>
            <p className="text-sm rounded-xl p-2.5" style={{background:"var(--surface2)"}}>Tier 2 — المنتج الحقيقي معزولاً في Safe Zone ‏1080×1080 وسط تصميم 1080×1920 ‏(9:16) + سياق قيمة/عرض مختصر.</p>
            <div><label htmlFor="sp-cta" className="text-sm font-normal block mb-1">Tier 3 — CTA (3–4 كلمات) · الآن: {ctaWords}</label><input id="sp-cta" value={spec.cta} onChange={e=>setSpec({...spec,cta:e.target.value})} className={inp} style={inpStyle} placeholder="مثال: اطلبي وادفعي عند الاستلام" />{ctaWords>0 && (ctaWords<3||ctaWords>4) && <p className="text-xs mt-1" style={{color:"var(--warning)"}}>الـ CTA لازم 3–4 كلمات.</p>}</div>
          </div>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">Video / UGC Script Builder — Lego ‏(3 Hooks × 2 Bodies × 1 CTA)</h3>
          <div className="grid gap-2 mt-2">
            {(["h1","h2","h3","b1","b2","cta"] as const).map((k,i)=>(<div key={k}><label htmlFor={"lg-"+k} className="text-xs font-normal block mb-1">{i<3?`Hook ${i+1}`:i<5?`Body ${i-2}`:"CTA"}</label><input id={"lg-"+k} value={lego[k]} onChange={e=>setLego({...lego,[k]:e.target.value})} className={inp} style={inpStyle} /></div>))}
          </div>
          <p className="text-sm font-normal mt-2">التركيبات الجاهزة: {legoCombos} من 6 كحد أقصى — كل تركيبة بتاخد CIS Tag وإصدار مستقل عند الحفظ في المكتبة.</p>
          <h3 className="font-bold mt-5">Brief Generator — 7-Stage Flywheel</h3>
          <ol className="text-sm mt-2 space-y-1 list-decimal list-inside"><li>Research (منافسون + Customer Voice)</li><li>Strategy (زاوية + Rule of One)</li><li>Written Brief</li><li>Production</li><li>5-Question Creative Q&A</li><li>Testing & Analysis</li><li>Learning & Dual Scaling</li></ol>
          <h3 className="font-bold mt-5">إدارة UGC Creators — Appendix F</h3>
          <p className="text-sm mt-1" style={{color:"var(--dim)"}}>سجّل اسم الـ Creator في حقل Talent عند حفظ الكرييتيف، وتابع أداءه عبر CIS: ‏Format & Talent → Hold Rate & Outbound CTR. الـ Creators الفائزة بتتعلم في Experiments كـ Proven Wrappers.</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 mt-4" style={card}>
        <h3 className="font-bold">Creative Validator — بوابة AEO/الامتثال (Stage 6: VALIDATE)</h3>
        <p className="text-xs mt-1" style={{color:"var(--dim)"}}>نفس قواعد سكربت التحقق الحتمي: كلمات طبية ممنوعة، ادعاءات غير موثقة، سمات شخصية، تحذير الريتينول، وبوابة «Ready to Publish».</p>
        <label htmlFor="v-text" className="text-sm font-normal block mt-3 mb-1">نص الكوبي (عامية مصرية)</label>
        <textarea id="v-text" {...FIELDS.validateCreative.text} value={vText} onChange={e=>setVText(e.target.value)} rows={4} className={inp} style={inpStyle} placeholder="الصق نص الكوبي هنا…" />
        <div className="flex gap-4 flex-wrap mt-3">
          <label className="flex items-center gap-2 text-sm font-normal cursor-pointer"><input type="checkbox" checked={vRetinol} onChange={e=>setVRetinol(e.target.checked)} className="w-5 h-5" /> منتج ريتينول / سيلوليت</label>
          <label className="flex items-center gap-2 text-sm font-normal cursor-pointer"><input type="checkbox" checked={vVerified} onChange={e=>setVVerified(e.target.checked)} className="w-5 h-5" /> بيانات المنتج موثقة من الويبسايت / المدخلات الأساسية</label>
        </div>
        {vRetinol && <p className="text-xs mt-2 rounded-xl p-3" style={{background:"var(--surface2)"}}>التحذير الإلزامي داخل النص نفسه: «الكريم فيه ريتينول: ممنوع أثناء الحمل، وفي الرضاعة بعد استشارة الدكتور»</p>}
        {vErr && <p className="text-xs mt-2" style={{color:"var(--danger)"}}>{vErr}</p>}
        <button onClick={()=>{ if(!vText.trim()){ setVErr("الصق نص الكوبي أولاً"); return; } setVErr(""); vMut.mutate(); }} aria-label="فحص النص" className="mt-3 px-5 py-2.5 rounded-full font-normal" style={{background:"var(--accent)",color:"#FFFFFF"}}>{vMut.isPending?"جاري الفحص…":"افحص النص"}</button>
        {vResult && (
          <div className="mt-4 rounded-xl p-4" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
            <span className="font-normal px-3 py-1 rounded-full inline-block" style={{background: vResult.status==="PASS"?"#067647":vResult.status==="FAIL"?"#D92D20":"#DC6803", color:"#fff"}}>{vResult.status} {vResult.status==="FAIL"?"⇒ DO NOT SHIP":""}</span>
            {vResult.errors.map((e:string,i:number)=>(<p key={i} className="text-sm mt-2" dir="ltr" style={{textAlign:"right",color:"var(--danger)"}}>⛔ {e}</p>))}
            {vResult.warnings.map((w:string,i:number)=>(<p key={i} className="text-sm mt-2" dir="ltr" style={{textAlign:"right",color:"var(--warning)"}}>⚠️ {w}</p>))}
            {vResult.errors.length===0 && vResult.warnings.length===0 && <p className="text-sm mt-2">عدّى كل الفحوصات الحتمية.</p>}
            <p className="text-xs mt-2" style={{color:"var(--dim)"}}>Passed: {vResult.passedChecks.join(" · ")}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================= Content ================= */
function ContentTab({ items, inv }: any) {
  const [f,setF]=useState({ title:"", channel:"Instagram", pillar:"", format:"Reel", status:"Idea", scheduledDate:"", captionDraft:"", innovationBucket:"70% Proven", depthBucket:"75% Deep Problem-Solving", sourceIdea:"", notes:"" });
  const [err,setErr]=useState("");
  const create = useMutation({ mutationFn: async()=> await api.createContent(f), onSuccess:()=>{ setF({ title:"", channel:"Instagram", pillar:"", format:"Reel", status:"Idea", scheduledDate:"", captionDraft:"", innovationBucket:"70% Proven", depthBucket:"75% Deep Problem-Solving", sourceIdea:"", notes:"" }); inv(); } });
  const upd = useMutation({ mutationFn: async(v:any)=> await api.updateContent(v), onSuccess: inv });
  const del = useMutation({ mutationFn: async(id:number)=> await api.deleteContent({id}), onSuccess: inv });
  const [c4,setC4]=useState({ callOut:"", cred:"", compass:"", core:"", ttv:90 });
  const c4ok = c4.callOut && c4.cred && c4.compass && c4.core && c4.ttv<60;
  const innov = { "70% Proven": items.filter((i:any)=>i.innovationBucket==="70% Proven").length, "20% Iteration": items.filter((i:any)=>i.innovationBucket==="20% Iteration").length, "10% Bold": items.filter((i:any)=>i.innovationBucket==="10% Bold").length };
  const depth = { "75%": items.filter((i:any)=>i.depthBucket.startsWith("75%")).length, "20%": items.filter((i:any)=>i.depthBucket.startsWith("20%")).length, "5%": items.filter((i:any)=>i.depthBucket.startsWith("5%")).length };
  return (
    <section>
      <h2 className="font-bold text-xl">ذكاء المحتوى — Content Intelligence / Organic</h2>
      <p className="text-sm mt-1" style={{color:"var(--dim)"}}>Trust Over Virality: ‏(Painful Problem + Unique Solution) × Contextual Credibility × Proven Wrapper. التقويم هنا للتخطيط والمسودات فقط — النشر الخارجي بموافقة المالك.</p>
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">متتبع 70/20/10 — Innovation & Risk</h3>
          <div className="flex h-4 rounded-full overflow-hidden mt-3" dir="ltr" role="img" aria-label="توزيع سلال الابتكار">
            {items.length===0 ? <span className="flex-1" style={{background:"var(--border)"}} /> : (<>
              <span style={{width:`${innov["70% Proven"]/items.length*100}%`,background:"var(--grad-content)"}} title={`Proven: ${innov["70% Proven"]}`} />
              <span style={{width:`${innov["20% Iteration"]/items.length*100}%`,background:"#E2915A"}} title={`Iteration: ${innov["20% Iteration"]}`} />
              <span style={{width:`${innov["10% Bold"]/items.length*100}%`,background:"var(--danger)"}} title={`Bold: ${innov["10% Bold"]}`} />
            </>)}
          </div>
          <p className="text-sm mt-2">Proven: {innov["70% Proven"]} · Iteration: {innov["20% Iteration"]} · Bold: {innov["10% Bold"]} — من {items.length} عنصر. دي نسب ابتكار محتوى، مش ميزانية إعلانات.</p>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">متتبع 75/20/5 — Topic Depth</h3>
          <div className="flex h-4 rounded-full overflow-hidden mt-3" dir="ltr" role="img" aria-label="توزيع عمق المواضيع">
            {items.length===0 ? <span className="flex-1" style={{background:"var(--border)"}} /> : (<>
              <span style={{width:`${depth["75%"]/items.length*100}%`,background:"var(--grad-inputs)"}} title={`Deep: ${depth["75%"]}`} />
              <span style={{width:`${depth["20%"]/items.length*100}%`,background:"#0E5A52"}} title={`Adjacent: ${depth["20%"]}`} />
              <span style={{width:`${depth["5%"]/items.length*100}%`,background:"var(--sec-research)"}} title={`Human: ${depth["5%"]}`} />
            </>)}
          </div>
          <p className="text-sm mt-2">Deep ‏75%: {depth["75%"]} · Adjacent ‏20%: {depth["20%"]} · Human ‏5%: {depth["5%"]} — متتبع منفصل تماماً عن 70/20/10 (يوجد تعريف بديل Creative Mix في Master Prompt — موسوم في التعارضات).</p>
        </div>
      </div>
      <form className="rounded-2xl p-4 mt-4 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!f.title.trim()){setErr("عنوان المحتوى مطلوب");return;} setErr(""); create.mutate();}}>
        <h3 className="font-bold">عنصر تقويم / فكرة جديدة</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="ct-title" className="text-sm font-normal block mb-1">العنوان *</label><input id="ct-title" {...FIELDS.createContent.title} value={f.title} onChange={e=>setF({...f,title:e.target.value})} className={inp} style={inpStyle} />{err && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{err}</p>}</div>
          <div><label htmlFor="ct-ch" className="text-sm font-normal block mb-1">القناة</label><select id="ct-ch" value={f.channel} onChange={e=>setF({...f,channel:e.target.value})} className={inp} style={inpStyle}>{["Instagram","TikTok","Facebook","YouTube"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="ct-fmt" className="text-sm font-normal block mb-1">الفورمات</label><select id="ct-fmt" value={f.format} onChange={e=>setF({...f,format:e.target.value})} className={inp} style={inpStyle}>{["Reel","Carousel","Static","Story","Long Video"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="ct-pillar" className="text-sm font-normal block mb-1">Pillar</label><input id="ct-pillar" {...FIELDS.createContent.pillar} value={f.pillar} onChange={e=>setF({...f,pillar:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="ct-date" className="text-sm font-normal block mb-1">التاريخ المخطط</label><input id="ct-date" type="date" value={f.scheduledDate} onChange={e=>setF({...f,scheduledDate:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="ct-status" className="text-sm font-normal block mb-1">الحالة</label><select id="ct-status" value={f.status} onChange={e=>setF({...f,status:e.target.value})} className={inp} style={inpStyle}>{["Idea","Draft","Ready for Review","Approved","Deferred"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="ct-innov" className="text-sm font-normal block mb-1">سلة 70/20/10</label><select id="ct-innov" value={f.innovationBucket} onChange={e=>setF({...f,innovationBucket:e.target.value})} className={inp} style={inpStyle}>{["70% Proven","20% Iteration","10% Bold"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="ct-depth" className="text-sm font-normal block mb-1">سلة 75/20/5</label><select id="ct-depth" value={f.depthBucket} onChange={e=>setF({...f,depthBucket:e.target.value})} className={inp} style={inpStyle}>{["75% Deep Problem-Solving","20% Adjacent Topics","5% Human Element"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="ct-src" className="text-sm font-normal block mb-1">مصدر الفكرة (سؤال عميل؟)</label><input id="ct-src" {...FIELDS.createContent.sourceIdea} value={f.sourceIdea} onChange={e=>setF({...f,sourceIdea:e.target.value})} className={inp} style={inpStyle} placeholder="Idea Bank: سؤال متكرر في الرسائل" /></div>
        </div>
        <div><label htmlFor="ct-cap" className="text-sm font-normal block mb-1">مسودة كابشن / سكربت (عامية مصرية)</label><textarea id="ct-cap" {...FIELDS.createContent.captionDraft} value={f.captionDraft} onChange={e=>setF({...f,captionDraft:e.target.value})} rows={3} className={inp} style={inpStyle} /></div>
        <button type="submit" aria-label="حفظ عنصر محتوى" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ حفظ في التقويم</button>
      </form>
      <div className="grid gap-3 mt-3">
        {items.length===0 && <Empty title="تقويم المحتوى فارغ" hint="ابدأ من Idea Bank: أسئلة العملاء الحقيقية من المدخلات الأساسية (Customer Voice) هي أفضل مصدر أفكار." />}
        {items.map((c:any)=>(
          <article key={c.id} className="rounded-2xl p-4" style={card}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div><h3 className="font-bold">{c.title}</h3><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{c.channel} · {c.format} · {c.pillar || "—"}{c.scheduledDate?` · ${c.scheduledDate}`:""} · {c.innovationBucket} · {c.depthBucket}</p>{c.captionDraft && <p className="text-sm mt-2 whitespace-pre-wrap">{c.captionDraft}</p>}{c.sourceIdea && <p className="text-xs mt-1" style={{color:"var(--dim)"}}>مصدر الفكرة: {c.sourceIdea}</p>}</div>
              <span className="text-xs font-normal px-3 py-1.5 rounded-full shrink-0" style={{background:"var(--surface2)"}}>{c.status}</span>
            </div>
            <div className="flex gap-2 flex-wrap mt-3 items-center">
              <select aria-label={`حالة ${c.title}`} value={c.status} onChange={e=>upd.mutate({id:c.id,status:e.target.value})} className="rounded-xl px-2 py-1.5 border text-xs" style={inpStyle}>{["Idea","Draft","Ready for Review","Approved","Deferred"].map(s=>(<option key={s}>{s}</option>))}</select>
              <DelBtn label={`حذف محتوى ${c.title}`} onClick={()=>del.mutate(c.id)} />
            </div>
          </article>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">مدقق 4 C's Intro — Time-to-Value &lt; 60s</h3>
          <div className="grid gap-2 mt-2">
            <input aria-label="Call Out" value={c4.callOut} onChange={e=>setC4({...c4,callOut:e.target.value})} placeholder="1. Call Out — نادي على صاحبة المشكلة" className={inp} style={inpStyle} />
            <input aria-label="Contextual Credibility" value={c4.cred} onChange={e=>setC4({...c4,cred:e.target.value})} placeholder="2. Contextual Credibility — ليه تسمعك إنت؟" className={inp} style={inpStyle} />
            <input aria-label="Compass" value={c4.compass} onChange={e=>setC4({...c4,compass:e.target.value})} placeholder="3. Compass — هتاخدها لفين في الفيديو؟" className={inp} style={inpStyle} />
            <input aria-label="Core Learning" value={c4.core} onChange={e=>setC4({...c4,core:e.target.value})} placeholder="4. Core Learning — القيمة الأساسية" className={inp} style={inpStyle} />
            <div><label htmlFor="ttv" className="text-xs font-normal block mb-1">وقت الوصول للقيمة (ثانية): {c4.ttv}</label><input id="ttv" type="range" min={10} max={180} value={c4.ttv} onChange={e=>setC4({...c4,ttv:Number(e.target.value)})} className="w-full" /></div>
          </div>
          <p className="text-sm font-normal mt-2">{c4ok ? "✅ المقدمة عدّت الـ 4 C's والقيمة قبل 60 ثانية." : "⬜ أكمل العناصر الأربعة وخلي القيمة قبل 60 ثانية."}</p>
          <p className="text-xs mt-1" style={{color:"var(--dim)"}}>بعد المقدمة: Context → Principle → Story → Actionable Tactic → Right vs Wrong → Next Step</p>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">Waterfall Repurposing + تقويم موسمية مصر (Appendix J)</h3>
          <p className="text-sm mt-2">من محتوى طويل واحد: استخرج لحظات ذهبية قائمة بذاتها ← Reels قصيرة ← Carousels ← Statics. كل مشتق يتسجل كعنصر مستقل في التقويم بمصدر فكرته = المحتوى الأصلي (Accordion: وسّع عشان تلاقي الجودة، بعدين ضاعف على الفائز).</p>
          <ul className="text-sm mt-3 space-y-1.5 list-disc list-inside">{SEASONALITY.map(s=>(<li key={s}>{s}</li>))}</ul>
        </div>
      </div>
    </section>
  );
}

/* ================= Finance ================= */
function FinanceTab({ profile, snapshots, inv, egp }: any) {
  const [cod,setCod]=useState({ placed:100, cancelled:10, rto:18, adSpend:16000, rev:850, cogs:240, pack:20, ship:70, rtoFee:50, codPct:2 });
  const [codResult,setCodResult]=useState<any>(null);
  const codMut = useMutation({ mutationFn: async()=> await api.calculateCOD({ placed:cod.placed, cancelled:cod.cancelled, rto:cod.rto, adSpend:cod.adSpend, revPerDelivered:cod.rev, cogsPerDelivered:cod.cogs, packPerShipped:cod.pack, shipPerShipped:cod.ship, rtoFee:cod.rtoFee, codPct: cod.codPct/100 }), onSuccess:(d)=>setCodResult(d) });
  const fromProfile = () => { if (profile) setCod({ ...cod, pack: profile.packCost || cod.pack, ship: profile.shipCost || cod.ship, rtoFee: profile.rtoCost || cod.rtoFee, codPct: profile.codFeePct || cod.codPct }); };
  const [s,setS]=useState({ label:"", period:"", product:"", placed:0, delivered:0, contributionPlaced:0, contributionDelivered:0, breakevenRoas:0, rtoRate:0, shipCost:0, notes:"" });
  const [sErr,setSErr]=useState("");
  const createS = useMutation({ mutationFn: async()=> await api.createSnapshot(s), onSuccess:()=>{ setS({ label:"", period:"", product:"", placed:0, delivered:0, contributionPlaced:0, contributionDelivered:0, breakevenRoas:0, rtoRate:0, shipCost:0, notes:"" }); inv(); } });
  const delS = useMutation({ mutationFn: async(id:number)=> await api.deleteSnapshot({id}), onSuccess: inv });
  const saveFromCod = () => { if (codResult?.ok) setS({ ...s, placed: cod.placed, delivered: codResult.delivered, contributionPlaced: codResult.contribPerPlaced, contributionDelivered: codResult.cohortContribPerDelivered, rtoRate: cod.placed>0 ? Math.round(cod.rto/cod.placed*1000)/10 : 0, shipCost: cod.ship }); };
  return (
    <section>
      <h2 className="font-bold text-xl">الذكاء المالي — Financial Intelligence</h2>
      <p className="text-sm mt-1 leading-relaxed" style={{color:"var(--dim)"}}>Priority 1: ‏COD Math & True Unit Economics. قاعدة حديدية: ممنوع طرح Placed CPP وDelivered CPP معاً — الإنفاق بيتحسب مرة واحدة. GPT&lt;0 ⇒ DO NOT LAUNCH.</p>
      <div className="rounded-2xl p-4 mt-4" style={card}>
        <div className="flex items-center justify-between flex-wrap gap-2"><h3 className="font-bold">حاسبة COD Cohort</h3>{profile && <button onClick={fromProfile} aria-label="استيراد قيم المدخلات الأساسية" className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--surface2)",border:"1px solid var(--border)"}}>⇩ املأ الشحن/التغليف/RTO/‏COD% من المدخلات الأساسية</button>}</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {([["placed","Placed Orders","طلبات موضوعة"],["cancelled","Cancelled","ملغاة قبل الشحن"],["rto","RTO","مرتجعات"],["adSpend","Ad Spend EGP","إنفاق إعلاني"],["rev","Rev/Delivered","محصّل لكل مُسلّم"],["cogs","COGS/Delivered","تكلفة لكل مُسلّم"],["pack","Pack/Shipped","تغليف"],["ship","Ship/Shipped","شحن"],["rtoFee","RTO Fee","رسوم مرتجع"],["codPct","COD Fee %","رسوم COD"]] as const).map(([key,en,ar])=>(
            <div key={key}><label htmlFor={`cod-${key}`} className="text-xs font-normal block mb-1">{ar} · {en}</label><input id={`cod-${key}`} aria-label={en} type="number" min={0} step="any" value={cod[key]} onChange={e=>setCod({...cod,[key]:Number(e.target.value)})} className={inp} style={inpStyle} /></div>
          ))}
        </div>
        <button onClick={()=>codMut.mutate()} aria-label="احسب Cohort" className="mt-4 px-5 py-2.5 rounded-full font-normal" style={{background:"var(--accent)",color:"#FFFFFF"}}>{codMut.isPending?"جاري الحساب…":"احسب الـ Cohort"}</button>
        {codResult && !codResult.ok && <p className="mt-3 text-sm font-normal" style={{color:"var(--danger)"}}>{codResult.error}</p>}
        {codResult && codResult.ok && (
          <div className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[["Shipped",String(codResult.shipped)],["Delivered",String(codResult.delivered)],["Net Delivery Rate",codResult.netDeliveryRatePct+"%"],["Placed CPP",egp(codResult.placedCPP)],["Delivered CPP",egp(codResult.deliveredCPP)],["Net Collected Revenue",egp(codResult.netCollectedRevenue)],["Gross Profit",egp(codResult.grossProfit)],["Contribution Before Ads",egp(codResult.contribBeforeAds)],["Cohort Contribution (GPT الكلي)",egp(codResult.cohortContribProfit)],["Contribution / Placed",egp(codResult.contribPerPlaced)],["Cohort Contribution / Delivered",egp(codResult.cohortContribPerDelivered)],["Individual Delivered Contribution",egp(codResult.individualDeliveredContrib)],["Break-even Placed CPP",egp(codResult.breakevenPlacedCPP)],["Break-even Delivered CPP",egp(codResult.breakevenDeliveredCPP)]].map(([k,v])=>(
                <div key={k} className="rounded-xl p-3" style={{background:"var(--bg)",border:"1px solid var(--border)"}}><div className="text-xs" style={{color:"var(--dim)"}}>{k}</div><div className="font-normal mt-0.5" dir="ltr" style={{textAlign:"right"}}>{v}</div></div>
              ))}
            </div>
            <p className="text-sm font-normal mt-3" style={{color: codResult.cohortContribProfit<0 ? "var(--danger)" : "var(--success)"}}>{codResult.cohortContribProfit<0 ? "⛔ مساهمة سالبة — DO NOT LAUNCH / DO NOT SCALE قبل إصلاح الاقتصاديات." : "✅ مساهمة موجبة على مستوى الـ Cohort — قارن Delivered CPP بالـ Break-even وTarget CPP قبل أي SCALE."}</p>
            <p className="text-xs mt-2" style={{color:"var(--dim)"}}>حساسية RTO/Shipping: أي زيادة في RTO بتاكل من Contribution Before Ads مباشرة — جرّب تغيير RTO والشحن فوق وشوف أثرهم على الـ Break-even قبل ما تلمس الإعلانات.</p>
            <button onClick={saveFromCod} aria-label="نقل النتيجة لنموذج اللقطة" className="mt-2 text-xs font-normal px-3 py-2 rounded-full" style={{border:"1px solid var(--border)"}}>⇩ انقل النتيجة لنموذج اللقطة المالية تحت</button>
          </div>
        )}
      </div>

      <CppGauge />

      <h3 className="font-bold text-lg mt-6">لقطات مالية — Financial Snapshots (منتج/روتين × فترة)</h3>
      <form className="rounded-2xl p-4 mt-3 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!s.label.trim()){setSErr("اسم اللقطة مطلوب");return;} setSErr(""); createS.mutate();}}>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="sn-label" className="text-sm font-normal block mb-1">اسم اللقطة *</label><input id="sn-label" {...FIELDS.createSnapshot.label} value={s.label} onChange={e=>setS({...s,label:e.target.value})} className={inp} style={inpStyle} />{sErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{sErr}</p>}</div>
          <div><label htmlFor="sn-period" className="text-sm font-normal block mb-1">الفترة</label><input id="sn-period" {...FIELDS.createSnapshot.period} value={s.period} onChange={e=>setS({...s,period:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="sn-prod" className="text-sm font-normal block mb-1">المنتج/الروتين</label><input id="sn-prod" {...FIELDS.createSnapshot.product} value={s.product} onChange={e=>setS({...s,product:e.target.value})} className={inp} style={inpStyle} /></div>
          {([["placed","Placed"],["delivered","Delivered"],["contributionPlaced","Contribution/Placed EGP"],["contributionDelivered","Contribution/Delivered EGP"],["breakevenRoas","Break-even ROAS"],["rtoRate","RTO Rate %"],["shipCost","Ship Cost EGP"]] as const).map(([k,l])=>(<div key={k}><label htmlFor={"sn-"+k} className="text-xs font-normal block mb-1">{l}</label><input id={"sn-"+k} type="number" step="any" value={s[k]} onChange={e=>setS({...s,[k]:Number(e.target.value)})} className={inp} style={inpStyle} /></div>))}
        </div>
        <button type="submit" aria-label="حفظ لقطة مالية" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ حفظ اللقطة</button>
      </form>
      <div className="grid gap-3 mt-3">
        {snapshots.length===0 && <Empty title="لا توجد لقطات مالية" hint="احسب Cohort فوق واحفظ نتيجته كلقطة عشان تقارن المنتجات والفترات ببعض." />}
        {snapshots.map((x:any)=>(
          <article key={x.id} className="rounded-2xl p-4 flex items-start justify-between gap-3 flex-wrap" style={card}>
            <div><h4 className="font-normal">{x.label} <span className="text-xs font-normal">{freshness(x.createdAt).icon} {freshness(x.createdAt).label}</span></h4><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{x.product || "—"} · {x.period || "—"} · Placed {x.placed} · Delivered {x.delivered} · RTO {x.rtoRate}% · شحن {egp(x.shipCost)}</p><p className="text-sm mt-1">Contribution/Placed {egp(x.contributionPlaced)} · /Delivered {egp(x.contributionDelivered)}{x.breakevenRoas>0 ? ` · Break-even ROAS ${x.breakevenRoas}` : ""}</p>{x.notes && <p className="text-xs mt-1 leading-relaxed" style={{color:"var(--dim)"}}>{x.notes}</p>}</div>
            <DelBtn label={`حذف لقطة ${x.label}`} onClick={()=>delS.mutate(x.id)} />
          </article>
        ))}
      </div>
      <BarChart title="مقارنة اللقطات — المساهمة لكل طلب مُسلّم (EGP)" unit=" EGP" grad="var(--grad-finance)" items={snapshots.map((x:any)=>({ label: x.label, value: x.contributionDelivered }))} />
    </section>
  );
}

/* ================= Research & Customer ================= */
function ResearchTab({ competitors, observations, insights, inv }: any) {
  const [c,setC]=useState({ name:"", category:"", positioning:"", offer:"", priceNote:"", sourceUrl:"", websiteUrl:"", metaPage:"", tiktokHandle:"", notes:"" });
  const [cErr,setCErr]=useState("");
  const createC = useMutation({ mutationFn: async()=> await api.createCompetitor(c), onSuccess:()=>{ setC({ name:"", category:"", positioning:"", offer:"", priceNote:"", sourceUrl:"", websiteUrl:"", metaPage:"", tiktokHandle:"", notes:"" }); inv(); } });
  const delC = useMutation({ mutationFn: async(id:number)=> await api.deleteCompetitor({id}), onSuccess: inv });
  const [o,setO]=useState({ title:"", source:"", observedDate:"", evidenceTag:"UNKNOWN", notes:"" });
  const [oErr,setOErr]=useState("");
  const createO = useMutation({ mutationFn: async()=> await api.createObservation(o), onSuccess:()=>{ setO({ title:"", source:"", observedDate:"", evidenceTag:"UNKNOWN", notes:"" }); inv(); } });
  const delO = useMutation({ mutationFn: async(id:number)=> await api.deleteObservation({id}), onSuccess: inv });
  const [ci,setCi]=useState({ theme:"", insightType:"Objection", summary:"", frequency:"", notes:"" });
  const [ciErr,setCiErr]=useState("");
  const createCi = useMutation({ mutationFn: async()=> await api.createCustomerInsight(ci), onSuccess:()=>{ setCi({ theme:"", insightType:"Objection", summary:"", frequency:"", notes:"" }); inv(); } });
  const delCi = useMutation({ mutationFn: async(id:number)=> await api.deleteCustomerInsight({id}), onSuccess: inv });
  const [triad,setTriad]=useState([false,false,false]);
  return (
    <section>
      <h2 className="font-bold text-xl">ذكاء السوق والمنافسين + العملاء</h2>
      <div className="grid md:grid-cols-3 gap-3 mt-4">
        {[{t:"🌐 الويبسايت",d:"صفحات منتجات وعروض وأسعار وسياسات البراند والمنافسين — المصدر الأول للتوثيق."},{t:"📘 Meta Ads Library",d:"إعلانات المنافسين العامة: تاريخ البدء والمدة والفورمات والزوايا. مدة الإعلان إشارة داعمة مش إثبات ربحية، ولا تكشف أي أداء خاص."},{t:"🎵 TikTok Ads Library / Creative Center",d:"أنماط كرييتيف وهوكات وفورمات المنافسين العامة — للأنماط والتمييز، مش للنسخ."}].map(s=>(
          <div key={s.t} className="rounded-2xl p-4" style={card}><h3 className="font-bold">{s.t}</h3><p className="text-sm mt-2 leading-relaxed">{s.d}</p></div>
        ))}
      </div>
      <div className="rounded-2xl p-4 mt-4" style={card}>
        <h3 className="font-bold">3-Step Market Validation Triad</h3>
        {[["بحث الطلب: Google Keyword Planner / Trends — هل فيه طلب حقيقي؟"],["إشارات المنافسين: Meta Ad Library / TikTok Creative Center — مين بيعلن وبقاله قد إيه؟ (إشارة داعمة فقط)"],["تعدين الريفيوهات: Amazon / Noon / Jumia — شكاوى 1–3 نجوم = زوايا واعتراضات حقيقية"]].map((q,i)=>(
          <label key={q[0]} className="flex items-start gap-2 text-sm mt-2.5 cursor-pointer"><input type="checkbox" checked={triad[i]} onChange={e=>{ const n=[...triad]; n[i]=e.target.checked; setTriad(n); }} className="w-5 h-5 mt-0.5" /> {i+1}. {q[0]}</label>
        ))}
        <p className="text-sm font-normal mt-2">{triad.every(Boolean) ? "✅ التحقق الثلاثي اكتمل — صنّف المنتج: Trendy / Seasonal (إطلاق −30 يوم) / Evergreen وسجّله في المدخلات الأساسية." : "⬜ أكمل الخطوات الثلاث قبل أي قرار إطلاق منتج (Task E)."}</p>
      </div>

      <form className="rounded-2xl p-4 mt-4 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!c.name.trim()){setCErr("اسم المنافس مطلوب");return;} setCErr(""); createC.mutate();}}>
        <h3 className="font-bold">بروفايل منافس (قائمة التغذية من المدخلات الأساسية)</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="cp-name" className="text-sm font-normal block mb-1">اسم المنافس *</label><input id="cp-name" {...FIELDS.createCompetitor.name} value={c.name} onChange={e=>setC({...c,name:e.target.value})} className={inp} style={inpStyle} />{cErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{cErr}</p>}</div>
          <div><label htmlFor="cp-web" className="text-sm font-normal block mb-1">لينك ويبسايته</label><input id="cp-web" {...FIELDS.createCompetitor.websiteUrl} value={c.websiteUrl} onChange={e=>setC({...c,websiteUrl:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="cp-meta" className="text-sm font-normal block mb-1">صفحته على Meta</label><input id="cp-meta" {...FIELDS.createCompetitor.metaPage} value={c.metaPage} onChange={e=>setC({...c,metaPage:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="cp-tt" className="text-sm font-normal block mb-1">حسابه على TikTok</label><input id="cp-tt" {...FIELDS.createCompetitor.tiktokHandle} value={c.tiktokHandle} onChange={e=>setC({...c,tiktokHandle:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="cp-cat" className="text-sm font-normal block mb-1">الفئة</label><input id="cp-cat" {...FIELDS.createCompetitor.category} value={c.category} onChange={e=>setC({...c,category:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="cp-price" className="text-sm font-normal block mb-1">ملاحظة سعر</label><input id="cp-price" {...FIELDS.createCompetitor.priceNote} value={c.priceNote} onChange={e=>setC({...c,priceNote:e.target.value})} className={inp} style={inpStyle} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label htmlFor="cp-pos" className="text-sm font-normal block mb-1">التموضع Positioning</label><textarea id="cp-pos" {...FIELDS.createCompetitor.positioning} value={c.positioning} onChange={e=>setC({...c,positioning:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="cp-offer" className="text-sm font-normal block mb-1">العرض المرصود</label><textarea id="cp-offer" {...FIELDS.createCompetitor.offer} value={c.offer} onChange={e=>setC({...c,offer:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
        </div>
        <button type="submit" aria-label="حفظ منافس" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ حفظ المنافس</button>
      </form>
      <div className="grid gap-3 mt-3">
        {competitors.length===0 && <Empty title="لا توجد بروفايلات منافسين" hint="أضف المنافسين الأساسيين بروابطهم — دول قائمة دراسة Ads Library." />}
        {competitors.map((x:any)=>(
          <article key={x.id} className="rounded-2xl p-4 flex items-start justify-between gap-3 flex-wrap" style={card}>
            <div><h4 className="font-normal">{x.name}</h4><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{x.category}{x.priceNote?` · ${x.priceNote}`:""}</p>{x.positioning && <p className="text-sm mt-1">{x.positioning}</p>}{x.offer && <p className="text-sm mt-1">العرض: {x.offer}</p>}
            <p className="text-xs mt-1.5 flex gap-3 flex-wrap">{x.websiteUrl && <a href={x.websiteUrl} target="_blank" rel="noreferrer" className="font-normal underline">الويبسايت ↗</a>}{x.metaPage && <span>Meta: {x.metaPage}</span>}{x.tiktokHandle && <span>TikTok: {x.tiktokHandle}</span>}</p></div>
            <DelBtn label={`حذف منافس ${x.name}`} onClick={()=>delC.mutate(x.id)} />
          </article>
        ))}
      </div>

      <h3 className="font-bold text-lg mt-6">ملاحظات سوق مؤرخة بمصدر — Market Observations</h3>
      <form className="rounded-2xl p-4 mt-3 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!o.title.trim()){setOErr("عنوان الملاحظة مطلوب");return;} setOErr(""); createO.mutate();}}>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="ob-title" className="text-sm font-normal block mb-1">الملاحظة *</label><input id="ob-title" {...FIELDS.createObservation.title} value={o.title} onChange={e=>setO({...o,title:e.target.value})} className={inp} style={inpStyle} />{oErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{oErr}</p>}</div>
          <div><label htmlFor="ob-src" className="text-sm font-normal block mb-1">المصدر (لينك/وصف)</label><input id="ob-src" {...FIELDS.createObservation.source} value={o.source} onChange={e=>setO({...o,source:e.target.value})} className={inp} style={inpStyle} placeholder="Meta Ads Library / Website…" /></div>
          <div><label htmlFor="ob-date" className="text-sm font-normal block mb-1">تاريخ الرصد</label><input id="ob-date" type="date" value={o.observedDate} onChange={e=>setO({...o,observedDate:e.target.value})} className={inp} style={inpStyle} /></div>
        </div>
        <button type="submit" aria-label="حفظ ملاحظة" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ حفظ الملاحظة</button>
      </form>
      <div className="grid gap-3 mt-3">
        {observations.map((x:any)=>(
          <article key={x.id} className="rounded-2xl p-4 flex items-start justify-between gap-3 flex-wrap" style={card}>
            <div><h4 className="font-normal">{x.title}</h4><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{x.observedDate || "بدون تاريخ"} · {x.evidenceTag}{x.source?` · ${x.source}`:""}</p>{x.notes && <p className="text-sm mt-1">{x.notes}</p>}</div>
            <DelBtn label={`حذف ملاحظة ${x.title}`} onClick={()=>delO.mutate(x.id)} />
          </article>
        ))}
      </div>

      <h3 className="font-bold text-lg mt-6">ذكاء العميل — ثيمات مجمعة فقط (بدون أي بيانات شخصية)</h3>
      <form className="rounded-2xl p-4 mt-3 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!ci.theme.trim()){setCiErr("الثيم مطلوب");return;} setCiErr(""); createCi.mutate();}}>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="ci-theme" className="text-sm font-normal block mb-1">الثيم *</label><input id="ci-theme" {...FIELDS.createCustomerInsight.theme} value={ci.theme} onChange={e=>setCi({...ci,theme:e.target.value})} className={inp} style={inpStyle} placeholder="مثال: الخوف من الريتينول أثناء الحمل" />{ciErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{ciErr}</p>}</div>
          <div><label htmlFor="ci-type" className="text-sm font-normal block mb-1">النوع</label><select id="ci-type" value={ci.insightType} onChange={e=>setCi({...ci,insightType:e.target.value})} className={inp} style={inpStyle}>{["Objection","Feedback","Cohort Note","Question"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="ci-freq" className="text-sm font-normal block mb-1">التكرار</label><input id="ci-freq" {...FIELDS.createCustomerInsight.frequency} value={ci.frequency} onChange={e=>setCi({...ci,frequency:e.target.value})} className={inp} style={inpStyle} placeholder="مثال: 23 مرة هذا الشهر" /></div>
        </div>
        <div><label htmlFor="ci-sum" className="text-sm font-normal block mb-1">الملخص (صياغة العميل نفسه — بدون أسماء/أرقام)</label><textarea id="ci-sum" {...FIELDS.createCustomerInsight.summary} value={ci.summary} onChange={e=>setCi({...ci,summary:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
        <button type="submit" aria-label="حفظ ثيم عميل" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ حفظ الثيم</button>
      </form>
      <div className="grid gap-3 mt-3">
        {insights.length===0 && <Empty title="لا توجد ثيمات عملاء" hint="جمّع الاعتراضات والأسئلة المتكررة هنا — دي وقود الزوايا Objection-Smashing وأفكار المحتوى." />}
        {insights.map((x:any)=>(
          <article key={x.id} className="rounded-2xl p-4 flex items-start justify-between gap-3 flex-wrap" style={card}>
            <div><h4 className="font-normal">{x.theme} <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"var(--surface2)"}}>{x.insightType}</span></h4>{x.frequency && <p className="text-xs mt-1" style={{color:"var(--dim)"}}>التكرار: {x.frequency}</p>}{x.summary && <p className="text-sm mt-1">{x.summary}</p>}</div>
            <DelBtn label={`حذف ثيم ${x.theme}`} onClick={()=>delCi.mutate(x.id)} />
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================= Experiments & Learning ================= */
function ExperimentsTab({ experiments, learnings, reviews, inv }: any) {
  const [f,setF]=useState({ hypothesis:"", creativeId:"", audience:"", product:"", hook:"", angle:"", format:"", offer:"", budget:0, startDate:"", endDate:"", actuals:"", sampleSize:"", attribution:"", profitability:"", verdict:"Running" });
  const [err,setErr]=useState("");
  const create = useMutation({ mutationFn: async()=> await api.createExperiment(f), onSuccess:()=>{ setF({ hypothesis:"", creativeId:"", audience:"", product:"", hook:"", angle:"", format:"", offer:"", budget:0, startDate:"", endDate:"", actuals:"", sampleSize:"", attribution:"", profitability:"", verdict:"Running" }); inv(); } });
  const upd = useMutation({ mutationFn: async(v:any)=> await api.updateExperiment(v), onSuccess: inv });
  const del = useMutation({ mutationFn: async(id:number)=> await api.deleteExperiment({id}), onSuccess: inv });
  const [l,setL]=useState({ hypothesis:"", decision:"", expectedOutcome:"" });
  const [lErr,setLErr]=useState("");
  const createL = useMutation({ mutationFn: async()=> await api.createLearning({ hypothesis:l.hypothesis, decision:l.decision, expectedOutcome:l.expectedOutcome, actualOutcome:"" }), onSuccess:()=>{ setL({ hypothesis:"", decision:"", expectedOutcome:"" }); inv(); } });
  const [actualMap,setActualMap]=useState<Record<number,string>>({});
  const updL = useMutation({ mutationFn: async(v:any)=> await api.updateLearning({ id:v.id, actualOutcome:v.actual, verdict:v.verdict as "Validated" }), onSuccess: inv });
  const [r,setR]=useState({ title:"", reviewType:"Weekly" as "Weekly"|"Monthly", period:"", summary:"", findings:"", decisions:"", notes:"" });
  const [rErr,setRErr]=useState("");
  const createR = useMutation({ mutationFn: async()=> await api.createReview(r), onSuccess:()=>{ setR({ title:"", reviewType:"Weekly", period:"", summary:"", findings:"", decisions:"", notes:"" }); inv(); } });
  const delR = useMutation({ mutationFn: async(id:number)=> await api.deleteReview({id}), onSuccess: inv });
  const proven = experiments.filter((e:any)=>e.verdict==="Proven Wrapper");
  const dead = experiments.filter((e:any)=>e.verdict==="Dead Angle");
  return (
    <section>
      <h2 className="font-bold text-xl">التجارب والتعلم + مراجعات الأداء</h2>
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        <div className="rounded-2xl p-4" style={{...card, borderColor:"#067647"}}><h3 className="font-bold">🏆 Proven Wrapper Library ({proven.length})</h3>{proven.length===0 ? <p className="text-sm mt-1" style={{color:"var(--dim)"}}>لسه مفيش Wrappers مثبتة — التجربة بتتترقى هنا بس بعد عينة كافية وربحية موثقة، مش انطباع.</p> : proven.map((e:any)=>(<p key={e.id} className="text-sm mt-1.5">• {e.hypothesis}</p>))}</div>
        <div className="rounded-2xl p-4" style={{...card, borderColor:"var(--danger)"}}><h3 className="font-bold">⚰️ Dead Angle Graveyard ({dead.length})</h3>{dead.length===0 ? <p className="text-sm mt-1" style={{color:"var(--dim)"}}>فارغة — كل KILL من Task D لازم يسيب سبب هنا (No Creative Death Without Funeral).</p> : dead.map((e:any)=>(<p key={e.id} className="text-sm mt-1.5">• {e.hypothesis}</p>))}</div>
      </div>
      <form className="rounded-2xl p-4 mt-4 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!f.hypothesis.trim()){setErr("الفرضية مطلوبة");return;} setErr(""); create.mutate();}}>
        <h3 className="font-bold">سجل تجربة كامل</h3>
        <div><label htmlFor="ex-hyp" className="text-sm font-normal block mb-1">Hypothesis *</label><input id="ex-hyp" {...FIELDS.createExperiment.hypothesis} value={f.hypothesis} onChange={e=>setF({...f,hypothesis:e.target.value})} className={inp} style={inpStyle} />{err && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{err}</p>}</div>
        <div className="grid md:grid-cols-3 gap-3">
          {([["creativeId","Creative ID / CIS Tag"],["audience","Audience"],["product","Product"],["hook","Hook"],["angle","Angle"],["format","Format"],["offer","Offer"],["sampleSize","Sample Size"],["attribution","Attribution"]] as const).map(([k,l])=>(<div key={k}><label htmlFor={"ex-"+k} className="text-xs font-normal block mb-1">{l}</label><input id={"ex-"+k} value={(f as any)[k]} onChange={e=>setF({...f,[k]:e.target.value})} className={inp} style={inpStyle} /></div>))}
          <div><label htmlFor="ex-budget" className="text-xs font-normal block mb-1">Budget EGP</label><input id="ex-budget" type="number" step="any" {...FIELDS.createExperiment.budget} value={f.budget} onChange={e=>setF({...f,budget:Number(e.target.value)})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="ex-start" className="text-xs font-normal block mb-1">Start</label><input id="ex-start" type="date" value={f.startDate} onChange={e=>setF({...f,startDate:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="ex-end" className="text-xs font-normal block mb-1">End</label><input id="ex-end" type="date" value={f.endDate} onChange={e=>setF({...f,endDate:e.target.value})} className={inp} style={inpStyle} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label htmlFor="ex-act" className="text-sm font-normal block mb-1">Actuals</label><input id="ex-act" {...FIELDS.createExperiment.actuals} value={f.actuals} onChange={e=>setF({...f,actuals:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="ex-prof" className="text-sm font-normal block mb-1">Profitability</label><input id="ex-prof" {...FIELDS.createExperiment.profitability} value={f.profitability} onChange={e=>setF({...f,profitability:e.target.value})} className={inp} style={inpStyle} /></div>
        </div>
        <button type="submit" aria-label="حفظ تجربة" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ حفظ التجربة</button>
      </form>
      <div className="grid gap-3 mt-3">
        {experiments.length===0 && <Empty title="لا توجد تجارب" hint="أول تجربة كاملة الحقول هي بداية التعلم الحقيقي بدل الانطباعات." />}
        {experiments.map((x:any)=>(
          <article key={x.id} className="rounded-2xl p-4" style={card}>
            <div className="flex items-start justify-between gap-3 flex-wrap"><h3 className="font-bold flex-1">{x.hypothesis}</h3><span className="text-xs font-normal px-3 py-1.5 rounded-full shrink-0" style={{background:"var(--surface2)"}}>{x.verdict}</span></div>
            <p className="text-xs mt-1" style={{color:"var(--dim)"}}>{x.product} · {x.angle} · {x.format} · {x.creativeId}{x.budget?` · ${x.budget} EGP`:""}{x.sampleSize?` · عينة ${x.sampleSize}`:""}</p>
            {x.actuals && <p className="text-sm mt-1"><b>Actuals:</b> {x.actuals}</p>}{x.profitability && <p className="text-sm mt-1"><b>Profitability:</b> {x.profitability}</p>}
            <div className="flex gap-2 flex-wrap mt-3 items-center">
              <select aria-label={`حكم تجربة ${x.hypothesis}`} value={x.verdict} onChange={e=>upd.mutate({id:x.id,verdict:e.target.value})} className="rounded-xl px-2 py-1.5 border text-xs" style={inpStyle}>{["Running","Pending","Proven Wrapper","Dead Angle","Inconclusive"].map(s=>(<option key={s}>{s}</option>))}</select>
              <DelBtn label={`حذف تجربة ${x.hypothesis}`} onClick={()=>del.mutate(x.id)} />
            </div>
          </article>
        ))}
      </div>

      <h3 className="font-bold text-lg mt-8">Performance Reviews — Weekly / Monthly (Task B/C/G)</h3>
      <form className="rounded-2xl p-4 mt-3 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!r.title.trim()){setRErr("عنوان المراجعة مطلوب");return;} setRErr(""); createR.mutate();}}>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="rv-title" className="text-sm font-normal block mb-1">العنوان *</label><input id="rv-title" {...FIELDS.createReview.title} value={r.title} onChange={e=>setR({...r,title:e.target.value})} className={inp} style={inpStyle} />{rErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{rErr}</p>}</div>
          <div><label htmlFor="rv-type" className="text-sm font-normal block mb-1">النوع</label><select id="rv-type" value={r.reviewType} onChange={e=>setR({...r,reviewType:e.target.value as "Weekly"})} className={inp} style={inpStyle}><option>Weekly</option><option>Monthly</option></select></div>
          <div><label htmlFor="rv-period" className="text-sm font-normal block mb-1">الفترة</label><input id="rv-period" {...FIELDS.createReview.period} value={r.period} onChange={e=>setR({...r,period:e.target.value})} className={inp} style={inpStyle} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label htmlFor="rv-sum" className="text-sm font-normal block mb-1">الملخص التنفيذي</label><textarea id="rv-sum" {...FIELDS.createReview.summary} value={r.summary} onChange={e=>setR({...r,summary:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="rv-find" className="text-sm font-normal block mb-1">أهم النتائج بالأدلة</label><textarea id="rv-find" {...FIELDS.createReview.findings} value={r.findings} onChange={e=>setR({...r,findings:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="rv-dec" className="text-sm font-normal block mb-1">القرارات</label><textarea id="rv-dec" {...FIELDS.createReview.decisions} value={r.decisions} onChange={e=>setR({...r,decisions:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
        </div>
        <button type="submit" aria-label="حفظ مراجعة" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ حفظ المراجعة</button>
      </form>
      <div className="grid gap-3 mt-3">
        {reviews.map((x:any)=>(
          <article key={x.id} className="rounded-2xl p-4 flex items-start justify-between gap-3 flex-wrap" style={card}>
            <div><h4 className="font-normal">{x.title} <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"var(--surface2)"}}>{x.reviewType}</span></h4><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{x.period}</p>{x.summary && <p className="text-sm mt-1">{x.summary}</p>}{x.decisions && <p className="text-sm mt-1"><b>قرارات:</b> {x.decisions}</p>}</div>
            <DelBtn label={`حذف مراجعة ${x.title}`} onClick={()=>delR.mutate(x.id)} />
          </article>
        ))}
      </div>

      <h3 className="font-bold text-lg mt-8">Learning Log — فرضيات وقرارات</h3>
      <form className="rounded-2xl p-4 mt-3 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!l.hypothesis.trim()){setLErr("اكتب الفرضية");return;} setLErr(""); createL.mutate();}}>
        <div><label htmlFor="ln-hyp" className="text-sm font-normal block mb-1">Hypothesis *</label><input id="ln-hyp" {...FIELDS.createLearning.hypothesis} value={l.hypothesis} onChange={e=>setL({...l,hypothesis:e.target.value})} className={inp} style={inpStyle} />{lErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{lErr}</p>}</div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label htmlFor="ln-dec" className="text-sm font-normal block mb-1">Decision</label><input id="ln-dec" {...FIELDS.createLearning.decision} value={l.decision} onChange={e=>setL({...l,decision:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="ln-exp" className="text-sm font-normal block mb-1">Expected Outcome</label><input id="ln-exp" {...FIELDS.createLearning.expectedOutcome} value={l.expectedOutcome} onChange={e=>setL({...l,expectedOutcome:e.target.value})} className={inp} style={inpStyle} /></div>
        </div>
        <button type="submit" aria-label="تسجيل فرضية" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>تسجيل</button>
      </form>
      <div className="grid gap-3 mt-3">
        {learnings.map((x:any)=>(
          <article key={x.id} className="rounded-2xl p-4" style={card}>
            <div className="flex items-start justify-between gap-3 flex-wrap"><h4 className="font-normal flex-1">{x.hypothesis}</h4><span className="text-xs font-normal px-3 py-1.5 rounded-full shrink-0" style={{background:"var(--surface2)"}}>{x.verdict}</span></div>
            {x.decision && <p className="text-sm mt-1"><b>Decision:</b> {x.decision}</p>}{x.expectedOutcome && <p className="text-sm mt-1"><b>Expected:</b> {x.expectedOutcome}</p>}{x.actualOutcome && <p className="text-sm mt-1"><b>Actual:</b> {x.actualOutcome}</p>}
            <div className="flex gap-2 flex-wrap mt-3 items-center">
              <input aria-label={`النتيجة الفعلية لـ ${x.hypothesis}`} {...FIELDS.updateLearning.actualOutcome} placeholder="Actual Outcome…" value={actualMap[x.id] ?? x.actualOutcome} onChange={e=>setActualMap({...actualMap,[x.id]:e.target.value})} className="flex-1 min-w-[160px] rounded-xl px-3 py-2 border text-sm" style={inpStyle} />
              {(["Validated","Invalidated","Inconclusive"] as const).map(v=>(<button key={v} aria-label={`حكم ${v}`} onClick={()=>updL.mutate({id:x.id, actual: actualMap[x.id] ?? x.actualOutcome, verdict:v})} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>{v}</button>))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================= Approvals & Execution ================= */
function ApprovalsTab({ approvals, executions, inv }: any) {
  const [f,setF]=useState({ title:"", actionType:"Publish", description:"" });
  const [err,setErr]=useState("");
  const create = useMutation({ mutationFn: async()=> await api.createApproval({ title:f.title, actionType:f.actionType as "Publish", description:f.description }), onSuccess:()=>{ setF({ title:"", actionType:"Publish", description:"" }); inv(); } });
  const decide = useMutation({ mutationFn: async(v:any)=> await api.decideApproval({ id:v.id, status:v.status as "Approved" }), onSuccess: inv });
  const [x,setX]=useState({ title:"", actionType:"Other", target:"", beforeValue:"", afterValue:"", result:"Completed", notes:"" });
  const [xErr,setXErr]=useState("");
  const createX = useMutation({ mutationFn: async()=> await api.createExecution(x), onSuccess:()=>{ setX({ title:"", actionType:"Other", target:"", beforeValue:"", afterValue:"", result:"Completed", notes:"" }); inv(); } });
  const delX = useMutation({ mutationFn: async(id:number)=> await api.deleteExecution({id}), onSuccess: inv });
  return (
    <section>
      <h2 className="font-bold text-xl">الاعتمادات وسجل التنفيذ</h2>
      <p className="text-sm mt-1" style={{color:"var(--dim)"}}>أي إجراء خارجي (نشر، ميزانية، سعر، خصم، إيقاف/إطلاق، رسائل) يقف هنا. الاعتماد على إجراء محدد مش تصريح مفتوح، وأي تغيير جوهري في الهدف أو المبلغ يحتاج اعتماداً جديداً.</p>
      <form className="rounded-2xl p-4 mt-4 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!f.title.trim()){setErr("عنوان الطلب مطلوب");return;} setErr(""); create.mutate();}}>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label htmlFor="a-title" className="text-sm font-normal block mb-1">عنوان الطلب *</label><input id="a-title" {...FIELDS.createApproval.title} value={f.title} onChange={e=>setF({...f,title:e.target.value})} className={inp} style={inpStyle} />{err && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{err}</p>}</div>
          <div><label htmlFor="a-type" className="text-sm font-normal block mb-1">نوع الإجراء</label><select id="a-type" value={f.actionType} onChange={e=>setF({...f,actionType:e.target.value})} className={inp} style={inpStyle}>{["Publish","Budget Change","Price Change","Discount","Pause Campaign","Launch Campaign","Message Customers","Other"].map(s=>(<option key={s}>{s}</option>))}</select></div>
        </div>
        <div><label htmlFor="a-desc" className="text-sm font-normal block mb-1">التفاصيل: الهدف الدقيق + Before/After + الأدلة + المخاطر + خطة التراجع</label><textarea id="a-desc" {...FIELDS.createApproval.description} value={f.description} onChange={e=>setF({...f,description:e.target.value})} rows={2} className={inp} style={inpStyle} /></div>
        <button type="submit" aria-label="إرسال طلب اعتماد" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>إرسال للاعتماد</button>
      </form>
      <div className="grid gap-3 mt-3">
        {approvals.length===0 && <Empty title="صندوق الاعتمادات فارغ" hint="أحكام Task D (KILL/SCALE) وأي إجراء خارجي بيوصلوا هنا قبل أي تنفيذ." />}
        {approvals.map((a:any)=>(
          <article key={a.id} className="rounded-2xl p-4 flex items-start justify-between gap-3 flex-wrap" style={card}>
            <div><h3 className="font-bold">{a.title}</h3><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{a.actionType} · {new Date(a.createdAt).toLocaleDateString("ar-EG")}</p>{a.description && <p className="text-sm mt-2 whitespace-pre-wrap">{a.description}</p>}</div>
            <div className="flex gap-2 items-center shrink-0">
              <span className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background: a.status==="Approved"?"#067647":a.status==="Rejected"?"#D92D20":a.status==="Deferred"?"#DC6803":"var(--surface2)", color: a.status==="Pending"?"var(--text)":"#fff"}}>{a.status}</span>
              {a.status==="Pending" && (<><button aria-label={`اعتماد ${a.title}`} onClick={()=>decide.mutate({id:a.id,status:"Approved"})} className="text-xs font-normal px-3 py-2 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>اعتماد</button><button aria-label={`رفض ${a.title}`} onClick={()=>decide.mutate({id:a.id,status:"Rejected"})} className="text-xs font-normal px-3 py-2 rounded-full" style={{border:"1px solid var(--border)",color:"var(--danger)"}}>رفض</button><button aria-label={`تأجيل ${a.title}`} onClick={()=>decide.mutate({id:a.id,status:"Deferred"})} className="text-xs font-normal px-3 py-2 rounded-full" style={{border:"1px solid var(--border)"}}>تأجيل</button></>)}
            </div>
          </article>
        ))}
      </div>

      <h3 className="font-bold text-lg mt-8">سجل التنفيذ — Execution Log (Before / After)</h3>
      <form className="rounded-2xl p-4 mt-3 grid gap-3" style={card} onSubmit={(e)=>{e.preventDefault(); if(!x.title.trim()){setXErr("عنوان التنفيذ مطلوب");return;} setXErr(""); createX.mutate();}}>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label htmlFor="x-title" className="text-sm font-normal block mb-1">ما تم تنفيذه *</label><input id="x-title" {...FIELDS.createExecution.title} value={x.title} onChange={e=>setX({...x,title:e.target.value})} className={inp} style={inpStyle} />{xErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{xErr}</p>}</div>
          <div><label htmlFor="x-target" className="text-sm font-normal block mb-1">الهدف الدقيق</label><input id="x-target" {...FIELDS.createExecution.target} value={x.target} onChange={e=>setX({...x,target:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="x-result" className="text-sm font-normal block mb-1">النتيجة</label><select id="x-result" value={x.result} onChange={e=>setX({...x,result:e.target.value})} className={inp} style={inpStyle}>{["Completed","Failed","Verified","Rolled Back"].map(s=>(<option key={s}>{s}</option>))}</select></div>
          <div><label htmlFor="x-before" className="text-sm font-normal block mb-1">Before</label><input id="x-before" {...FIELDS.createExecution.beforeValue} value={x.beforeValue} onChange={e=>setX({...x,beforeValue:e.target.value})} className={inp} style={inpStyle} /></div>
          <div><label htmlFor="x-after" className="text-sm font-normal block mb-1">After</label><input id="x-after" {...FIELDS.createExecution.afterValue} value={x.afterValue} onChange={e=>setX({...x,afterValue:e.target.value})} className={inp} style={inpStyle} /></div>
        </div>
        <button type="submit" aria-label="تسجيل تنفيذ" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ تسجيل التنفيذ</button>
      </form>
      <div className="grid gap-3 mt-3">
        {executions.length===0 && <Empty title="سجل التنفيذ فارغ" hint="أي إجراء معتمد اتنفذ فعلاً بيتسجل هنا بقيم Before/After ونتيجة التحقق." />}
        {executions.map((e:any)=>(
          <article key={e.id} className="rounded-2xl p-4 flex items-start justify-between gap-3 flex-wrap" style={card}>
            <div><h4 className="font-normal">{e.title} <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"var(--surface2)"}}>{e.result}</span></h4><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{e.target} · {new Date(e.createdAt).toLocaleString("ar-EG")}</p><p className="text-sm mt-1" dir="ltr" style={{textAlign:"right"}}>{e.beforeValue} → {e.afterValue}</p></div>
            <DelBtn label={`حذف سجل ${e.title}`} onClick={()=>delX.mutate(e.id)} />
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================= Frameworks & Rules ================= */
function FrameworksTab({ dash, tasksCount, plansCount, genCount }: any) {
  return (
    <section>
      <h2 className="font-bold text-xl">القواعد وسياسات التشغيل + الفريموركس</h2>
      <div className="rounded-2xl p-4 mt-4" style={{background:"var(--teal)",color:"#FFF2E9"}}>
        <h3 className="font-bold">مبدأ الحوكمة الحاكم</h3>
        <p className="text-lg font-normal mt-1" style={{color:"var(--accent)"}}>{GOVERNANCE}</p>
        <p className="text-sm mt-2 leading-relaxed">Priority Hierarchy عند أي تعارض: ‏1) COD Math & True Unit Economics ← ‏2) AEO Compliance ← ‏3) Brand Rules ← ‏4) Creative Frameworks. وطبقة Master Growth OS (7 مراحل) تسري على النظام كله: كل مهمة في أي قسم تمر كحد أدنى بمرحلة التأسيس (وسوم أدلة) ومرحلة النقد والفحص الحتمي.</p>
      </div>

      <h3 className="font-bold text-lg mt-6">قواعد الأسبقية والتحكم البشري — Master Growth OS</h3>
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        {PRECEDENCE_RULES.map(r=>(
          <article key={r.t} className="rounded-2xl p-4" style={card}><h4 className="font-normal">⚖️ {r.t}</h4><p className="text-sm mt-2 leading-relaxed">{r.d}</p></article>
        ))}
      </div>
      <div className="rounded-2xl p-4 mt-3" style={card}>
        <h4 className="font-normal">سير النمو الموحد — 7 مراحل</h4>
        <div className="grid gap-2 mt-3">
          {GROWTH_STAGES.map(s=>(<p key={s.n} className="text-sm"><b>{s.n}. {s.t}:</b> {s.d}</p>))}
        </div>
      </div>

      <h3 className="font-bold text-lg mt-6">قواعد سلوك النظام العشرة — PART 5 Meta Rules <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{background:"var(--surface2)"}}>Master Prompt v2.0 · Active</span></h3>
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        {META_RULES.map(r=>(
          <article key={r.t} className="rounded-2xl p-4" style={card}><h4 className="font-normal" dir="ltr" style={{textAlign:"right"}}>{r.t}</h4><p className="text-sm mt-2 leading-relaxed">{r.d}</p></article>
        ))}
      </div>

      <h3 className="font-bold text-lg mt-6">بوابة AEO — النقاط الست <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{background:"var(--surface2)"}}>Master Prompt v2.0 F8 · FAIL ⇒ DO NOT SHIP</span></h3>
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        {AEO_POINTS.map(p=>(
          <article key={p.n} className="rounded-2xl p-4" style={card}><h4 className="font-normal">{p.n}. <span dir="ltr">{p.t}</span></h4><p className="text-sm mt-2 leading-relaxed">{p.d}</p></article>
        ))}
      </div>
      <p className="text-xs mt-2" style={{color:"var(--dim)"}}>ملحوظة مصادر: توجد صياغة موسعة للبوابة (10 نقاط) في أحد الملاحق مقابل 6 في متن Master Prompt — موسومة كتعارض في الأسفل، والـ Validator الحتمي يطبق فحوصات السكربت الموثقة.</p>

      <h3 className="font-bold text-lg mt-6">قواعد سوق مصر — Appendix D</h3>
      <div className="grid gap-3 mt-3">
        {EGYPT_RULES.map(r=>(
          <article key={r.t} className="rounded-2xl p-4" style={card}><h4 className="font-normal">{r.t}</h4><p className="text-sm mt-2 leading-relaxed">{r.d}</p></article>
        ))}
      </div>

      <h3 className="font-bold text-lg mt-6">قواعد القرار: Kill/Scale · Freshness · Cold Start · Testing</h3>
      <div className="grid gap-3 mt-3">
        {DECISION_RULES.map(r=>(
          <article key={r.t} className="rounded-2xl p-4" style={card}>
            <div className="flex items-start justify-between gap-3 flex-wrap"><h4 className="font-normal">{r.t}</h4><span className="text-xs font-normal px-2.5 py-1 rounded-full shrink-0" style={{background:"var(--surface2)"}}>{r.st}</span></div>
            <p className="text-xs mt-1" style={{color:"var(--dim)"}}>المصدر: {r.src}</p>
            <p className="text-sm mt-2 leading-relaxed">{r.d}</p>
          </article>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">قواعد البراند البصرية والصوتية</h3>
          <div className="grid gap-2.5 mt-2">{BRAND_RULES.map(r=>(<p key={r.t} className="text-sm"><b>{r.t}:</b> {r.d}</p>))}</div>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">الادعاءات — ممنوع / معتمد</h3>
          <p className="text-sm font-normal mt-2" style={{color:"var(--danger)"}}>⛔ ممنوع دائماً:</p>
          <ul className="text-sm mt-1 space-y-1 list-disc list-inside">{CLAIMS.banned.map(c=>(<li key={c}>{c}</li>))}</ul>
          <p className="text-sm font-normal mt-3" style={{color:"var(--success)"}}>✅ معتمد (بصياغته الحذرة):</p>
          <ul className="text-sm mt-1 space-y-1 list-disc list-inside">{CLAIMS.approved.map(c=>(<li key={c}>{c}</li>))}</ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="rounded-2xl p-4" style={{...card, borderColor:"var(--warning)"}}>
          <h3 className="font-bold">بروتوكول البيانات المفقودة والبداية الباردة</h3>
          <ul className="text-sm mt-2 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>عند غياب بيانات (لا مراجعات، لا تاريخ أداء، مكتبة إعلانات غير متاحة): استخدم بدائل موثقة — مراجعات/أداء منتج مشابه لنفس نوع الجلد والمشكلة — ووسمها HYPOTHESIS أو ESTIMATED صراحة.</li>
            <li>اخفض درجة الثقة درجة على الأقل مع كل بديل مستخدم، واذكر أثر الانخفاض في المخرج.</li>
            <li>كل مخرج ناقص البيانات يختم بقائمة صريحة: «ما يجب جمعه قبل القرار التالي» — بيانات محددة بمصدرها المتوقع.</li>
            <li>ممنوع تحويل البديل إلى حكم Kill/Scale نهائي: أقصى حكم ممكن Provisional لحد اكتمال البيانات.</li>
          </ul>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">معيار الإثبات قبل التوصية</h3>
          <p className="text-sm mt-2 leading-relaxed">كل توصية جوهرية تعرض ستة عناصر، ونقص أي عنصر يُعلن ولا يُخفى:</p>
          <div className="flex flex-wrap gap-2 mt-2">{["مصادر البيانات","النافذة الزمنية","حداثة البيانات (Freshness)","الافتراضات","درجة الثقة","الأثر المتوقع"].map(x=>(<span key={x} className="text-xs font-normal px-2.5 py-1.5 rounded-full" style={{background:"var(--surface2)"}}>{x}</span>))}</div>
          <p className="text-sm mt-3"><b>مؤشر الحداثة:</b> 🟢 أقل من ساعة · 🟡 من ساعة لـ 6 ساعات · 🔴 أكثر من 6 ساعات · وتنبيه صريح عند تجاوز 24 ساعة — يظهر على اللقطات المالية وملخصات السوق ولوحة القيادة.</p>
          <p className="text-sm mt-2"><b>أولوية المحرك المالي:</b> لا قرار كرييتيف أو حملة أو Kill/Scale دون لقطة مالية حديثة — المالية أولاً، وباقي الأقسام تبني عليها.</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 mt-4" style={card}>
        <h3 className="font-bold">نقاط نقدية من مراجعات v3.0/v3.1 — وكيف غطاها النظام</h3>
        <ul className="text-sm mt-2 space-y-1.5 list-disc list-inside leading-relaxed">
          <li><b>المحرك المالي أولاً:</b> بوابة لقطة مالية حديثة قبل أي قرار (قسم الميديا باير) + حاسبة COD حتمية بلا ازدواج حساب.</li>
          <li><b>فجوة تكامل Meta:</b> معروضة بصدق في مركز الربط — Ads Library العامة شغالة كجولات موثقة، وربط الحساب الخاص Pending بتصريح المالك.</li>
          <li><b>حداثة البيانات:</b> مؤشر Freshness (🟢/🟡/🔴 + تنبيه 24 ساعة) على المزامنة واللقطات والجولات.</li>
          <li><b>تواصل الموديولات:</b> سجل أحداث مترابط — مثال: creative_approved بيولّد مهمة حملة، واللقطة المالية بتحدّث بوابة القرار، وقرار الاعتماد بيتسجل حدثاً.</li>
          <li><b>تكلفة الـ AI:</b> النظام لا يعرف تكلفة توكنز حقيقية، فلا يدّعيها — اللي بيتقاس فعلياً هو حجم نشاط الوكيل الداخلي تحت.</li>
          <li><b>تصميم Ask Zyra:</b> واجهة تخطيط ومحادثة بتصنيف A–G وخطة 8 خطوات واعتماد صريح قبل تحويلها لشغل.</li>
        </ul>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--surface2)"}}>نشاط الوكيل الداخلي: مهام {tasksCount} · خطط {plansCount} · طلبات توليد {genCount}</span>
          <span className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--surface2)"}}>عناصر شغل {dash?.workTotal ?? 0} · جولات سوق {dash?.marketRoundsTotal ?? 0}</span>
          <span className="text-xs px-3 py-1.5" style={{color:"var(--dim)"}}>عدّادات تشغيل داخلية فقط — ليست تكلفة مالية ولا استهلاك توكنز.</span>
        </div>
      </div>

      <h3 className="font-bold text-lg mt-6">⚠️ تعارضات المصادر — Conflict / Owner Decision (لا تُحسم بصمت)</h3>
      <div className="grid gap-3 mt-3">
        {CONFLICTS.map(c=>(
          <article key={c.t} className="rounded-2xl p-4" style={{background:"var(--warning-soft)",border:"1px solid var(--border)"}}>
            <h4 className="font-normal">{c.t} <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"#DC6803",color:"#fff"}}>CONFLICT — قرار مالك</span></h4>
            <p className="text-sm mt-2"><b>أ:</b> {c.a}</p><p className="text-sm mt-1"><b>ب:</b> {c.b}</p><p className="text-sm mt-2" style={{color:"var(--dim)"}}>{c.note}</p>
          </article>
        ))}
      </div>
      <h3 className="font-bold text-lg mt-6">مكتبة الفريموركس</h3>
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        {FRAMEWORKS.map(f=>(
          <article key={f.title} className="rounded-2xl p-4" style={card}><h4 className="font-normal" dir="ltr" style={{textAlign:"right"}}>{f.title}</h4><p className="text-sm mt-2 leading-relaxed">{f.body}</p></article>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">Quick Reference Card — PART 7</h3>
          <ul className="text-sm mt-2 space-y-1.5 list-disc list-inside leading-relaxed">
            <li><b>COD:</b> ‏Placed CPP = Spend ÷ Placed · ‏Delivered CPP = Spend ÷ Delivered · ‏NDR = Delivered ÷ Placed · ‏Net COD Rate = WhatsApp% × Delivery%</li>
            <li><b>Kill Thresholds (Task D):</b> ‏GPT&lt;0 ⇒ KILL · ‏GPT&lt;15% AOV ⇒ DO NOT SCALE · ‏CTR &lt;50% من المتوسط بعد 3 أيام ⇒ KILL · ‏&lt;70% بعد 7 ⇒ ITERATE · ‏&gt;120% بعد 7 ⇒ SCALE candidate</li>
            <li><b>AEO Gate:</b> ‏FAIL ⇒ DO NOT SHIP — كلمات طبية، ادعاءات غير موثقة، سمات شخصية، تحذير ريتينول</li>
            <li><b>Payday:</b> ‏25–5 ذروة وSCALE BLOCKED · ‏15–24 CAUTION · غير كده SCALE OK</li>
            <li><b>Freshness:</b> ‏Tier1 &gt;14 يوم · Tier2 &gt;21 · Tier3 &gt;7 = كرييتيف قديم</li>
            <li><b>Output Format (PART 6):</b> ‏Naming + CIS Tag + Framework Tag + AEO Gate + COD Check + Payday Check + Uncertainty Flag + ما يجب جمعه قبل القرار التالي</li>
          </ul>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">تعريفات المقاييس — Appendix H</h3>
          <div className="grid gap-1.5 mt-2 text-sm">{METRICS_GLOSSARY.map(([k,v])=>(<p key={k}><b dir="ltr">{k}:</b> {v}</p>))}</div>
          <h3 className="font-bold mt-5">سير عمل الفريق والتصعيد — Appendix K</h3>
          <ul className="text-sm mt-2 space-y-1.5 list-disc list-inside">
            <li>Media Buyer بيجهّز المقترحات والأرقام — لا ينفذ خارجياً.</li>
            <li>Creative بينتج مسودات وبيعديها على الـ Validator.</li>
            <li>Content بيخطط وبيكتب مسودات — النشر باعتماد.</li>
            <li>Analyst بيشخّص وبيوثق الأدلة والـ Confidence.</li>
            <li>Owner هو صاحب قرار الاعتماد والتنفيذ الوحيد — التصعيد إليه عند أي تعارض مصادر أو GPT سالب أو أزمة PART 12.</li>
          </ul>
          <h3 className="font-bold mt-5">مصادر النظام</h3>
          <p className="text-sm mt-1">المدخلات الأساسية (يدخلها المالك) + Website + Meta Ads Library + TikTok Ads Library كمصادر عامة للبحث. لا يوجد قسم أو تكامل مع أي نظام داخلي آخر، ولا اتصال حي بحساب إعلانات خاص.</p>
        </div>
      </div>
    </section>
  );
}

/* ================= Ops & Learning System ================= */
const MODULE_STATUS = [
  { t:"بحث المنافسين والسوق", st:"Live", tone:"var(--success)", d:"شغّال: جولات متابعة موثقة + تنبيهات تغيّرات + بروفايلات منافسين بمصادر عامة (Website + Meta Ads Library + TikTok). المسح الدوري: منافس واحد دور بدور، كل منافس مرة في اليوم." },
  { t:"حلقة التعلّم", st:"Live", tone:"var(--success)", d:"شغّالة: ملاحظات متعقبة بدورة حياة (مرشّحة بعد 3 أيام ← ثابتة بعد 7 أيام) + ملخص تعلّم يومي + سجل تعلّم التجارب. تعليمات المالك تتغلب على أي استنتاج آلي." },
  { t:"بريفات الجمهور وتقويم المحتوى", st:"Draft-only", tone:"var(--warning)", d:"مسودات فقط: البريفات والتقويم بيتبنوا ويتحدّثوا كل 6 ساعات كمسودات داخلية. النشر مش جزء من الحالة دي نهائياً." },
  { t:"الإعلانات المرتبطة بأداء Meta", st:"Pending connection", tone:"var(--warning)", d:"إعلاناتك بتفاصيلها مستنية توكن Meta وربط الحساب الإعلاني. لحد ما يتربط: مفيش سحب أداء حي، وأي أرقام أداء هنا إدخال يدوي موثق بفترته. خط الأساس يبدأ من أيام الـ Relaunch." },
  { t:"الكتابة في Meta / Shopify / رسايل العملاء", st:"Not implemented — مقفول عن قصد", tone:"var(--danger)", d:"ده مش ناقص ومش عطل: مقفول بقرار المالك. النظام يقترح ويوثق فقط، والتنفيذ الخارجي يمر باعتماد صريح ويتسجل Before/After." },
  { t:"أتمتة جروبات فيسبوك الخاصة وكومنتات حسابات تانية", st:"ممنوعة آلياً", tone:"var(--danger)", d:"ممنوع أي سحب أو أتمتة. المعتمد: المالك يلصق بنفسه نصاً من جروب هو عضو فيه، فيتحلّل مجمّعاً ومجهول الهوية من صندوق التحليل تحت." },
  { t:"جلب مكتبة Meta Ads للمنافسين", st:"Fetch بيرجع 403", tone:"var(--warning)", d:"الجلب الآلي المباشر من المكتبة بيرجع 403. البديل الشغّال: روابط جاهزة لكل منافس + تسجيل/لصق من المالك يتحلّل هنا." },
  { t:"محرك التعلّم الآلي (Learner)", st:"مكتوب — مش موصّل ومتجربش", tone:"var(--warning)", d:"حالة صريحة: كود التعلّم الآلي اتكتب لكنه مش موصّل لا بالسيرفر ولا باللوب ولا بالواجهة، ومتجربش — وملف اختباره اتمسح لأنه اتكتب بشكل خاطئ. اللي شغّال فعلياً هنا هو التعلّم الموثق اليدوي/المجدول في القسم ده، وممنوع تقديم الـ Learner كأنه حي." },
];
const LIBRARY_HOME = "https://www.facebook.com/ads/library";
function OpsTab({ ops, competitors, inv, setTab }: any) {
  const tick = useMutation({ mutationFn: async(rt: "Tick"|"Advisor Review"|"Daily Summary"|"Weekly Review")=> await api.runLoopTick({ runType: rt }), onSuccess: inv });
  const setSettings = useMutation({ mutationFn: async(v:any)=> await api.setOpsSettings(v), onSuccess: inv });
  const [ins,setIns]=useState({ title:"", instruction:"", scope:"عام" }); const [insErr,setInsErr]=useState("");
  const createIns = useMutation({ mutationFn: async()=> await api.createInstruction(ins), onSuccess:()=>{ setIns({ title:"", instruction:"", scope:"عام" }); inv(); } });
  const updIns = useMutation({ mutationFn: async(v:any)=> await api.updateInstruction(v), onSuccess: inv });
  const delIns = useMutation({ mutationFn: async(id:number)=> await api.deleteInstruction({id}), onSuccess: inv });
  const [paste,setPaste]=useState({ sourceType:"واتساب مجمّع" as "واتساب مجمّع", text:"" }); const [pasteErr,setPasteErr]=useState("");
  const analyze = useMutation({ mutationFn: async()=> await api.analyzePastedText(paste), onSuccess:()=>{ setPaste({ ...paste, text:"" }); inv(); } });
  const delIntake = useMutation({ mutationFn: async(id:number)=> await api.deleteIntake({id}), onSuccess: inv });
  const [ob,setOb]=useState({ title:"", source:"صوت العميل", detail:"", occurrences:1, firstSeenDate: new Date().toISOString().slice(0,10) }); const [obErr,setObErr]=useState("");
  const createOb = useMutation({ mutationFn: async()=> await api.createObservation2(ob), onSuccess:()=>{ setOb({ title:"", source:"صوت العميل", detail:"", occurrences:1, firstSeenDate: new Date().toISOString().slice(0,10) }); inv(); } });
  const bumpOb = useMutation({ mutationFn: async(id:number)=> await api.bumpObservation({id}), onSuccess: inv });
  const delOb = useMutation({ mutationFn: async(id:number)=> await api.deleteObservation2({id}), onSuccess: inv });
  const [kw,setKw]=useState({ keyword:"", notes:"" }); const [kwErr,setKwErr]=useState(""); const [kwScanErr,setKwScanErr]=useState("");
  const createKw = useMutation({ mutationFn: async()=> await api.createKeyword(kw), onSuccess:()=>{ setKw({ keyword:"", notes:"" }); inv(); } });
  const scanKw = useMutation({ mutationFn: async(v:any)=> await api.recordKeywordScan(v), onSuccess: inv });
  const delKw = useMutation({ mutationFn: async(id:number)=> await api.deleteKeyword({id}), onSuccess: inv });
  const [opp,setOpp]=useState({ title:"", sourceType:"طلبات عملاء" as "طلبات عملاء", evidence:"", notes:"" }); const [oppErr,setOppErr]=useState("");
  const createOpp = useMutation({ mutationFn: async()=> await api.createOpportunity(opp), onSuccess:()=>{ setOpp({ title:"", sourceType:"طلبات عملاء", evidence:"", notes:"" }); inv(); } });
  const updOpp = useMutation({ mutationFn: async(v:any)=> await api.updateOpportunity(v), onSuccess: inv });
  const delOpp = useMutation({ mutationFn: async(id:number)=> await api.deleteOpportunity({id}), onSuccess: inv });
  const lifeTone = (l:string)=> l==="ثابتة" ? "var(--success)" : l==="مرشّحة" ? "var(--warning)" : "var(--dim)";
  if (!ops) return <section><Empty title="جاري تحميل حالة التشغيل…" hint="لحظة واحدة." /></section>;
  return (
    <section>
      <h2 className="font-bold text-xl">التشغيل والتعلّم الآلي — Operating Model & Learning Loop ⚙️</h2>
      <p className="text-sm mt-1 leading-relaxed" style={{color:"var(--dim)"}}>لوحة الحالة التشغيلية زي ما المالك حددها بالظبط — منفذة جوه النظام ده: إيه Live، وإيه Draft-only، وإيه Pending، وإيه مقفول عن قصد (مش ناقص). اللوب المستمر 24/7 بيتيك كل 10 دقايق وينفذ المهام المستحقة بحد أقصى 3 في التيك.</p>

      <h3 className="font-bold text-lg mt-5">حالة الوحدات — Module Status</h3>
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        {MODULE_STATUS.map(m=>(
          <article key={m.t} className="rounded-2xl p-4" style={card}>
            <div className="flex items-start justify-between gap-2 flex-wrap"><h4 className="font-normal">{m.t}</h4><span className={m.st==="Live" ? "pill pill-live" : m.st==="Draft-only" ? "pill pill-draft" : m.st.startsWith("Pending") ? "pill pill-pending" : (m.st.startsWith("Not implemented") || m.st.startsWith("ممنوعة")) ? "pill pill-danger" : "pill pill-locked"}>{m.st}</span></div>
            <p className="text-sm mt-2 leading-relaxed">{m.d}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl p-4 mt-5" style={{background:"var(--teal)",color:"#FFF2E9"}}>
        <h3 className="font-bold text-lg">اللوب المستمر — إيقاع التشغيل 24/7</h3>
        <div className="grid md:grid-cols-3 gap-2.5 mt-3 text-sm">
          {[
            ["⏱️ تيك اللوب","كل 10 دقايق — بينفذ المهام اللي حان ميعادها، بحد أقصى 3 إجراءات في التيك الواحد"],
            ["🧭 مراجعة المستشار","كل ساعة — اعتمادات معلّقة + متأخرات + توصيات اقتراحية فقط"],
            ["📡 مسح المنافسين","منافس واحد دور بدور في كل جولة — كل منافس مرة واحدة في اليوم"],
            ["👥 بريفات الجمهور","تتحدّث كل 6 ساعات — Draft-only، مفيش نشر"],
            ["⌛ انتهاء الاقتراحات القديمة","اقتراحات الخطط اللي عدى عليها " + ops.suggestionTtlDays + " يوم بتتقفل كمنتهية في التيك"],
            ["📚 ملخص التعلّم اليومي","يومياً — ملاحظات اليوم وحالتها (مرشّحة/ثابتة)"],
            ["🔒 المراجعة الأسبوعية بالموديل", ops.weeklyReviewEnabled ? "مفعّلة من المالك — بتمر على السقوف والأسعار، وأي تعديل يروح Approvals" : "مقفولة لحد ما المالك يفعّلها — وبتمر على السقوف والأسعار"],
            ["🔍 لغة البحث (Google Egypt)","مسح اقتراحات جوجل مصر لكلماتك كل 20 دقيقة في نموذج التشغيل — النتائج بتتسجل في تتبع الكلمات تحت"],
            ["🎯 المنافس التالي في الدور", ops.nextCompetitor ? "«" + ops.nextCompetitor + "» — لسه دوره النهارده" : "لسه مفيش منافسين مسجلين"],
          ].map(([t,d])=>(<div key={t} className="rounded-xl p-3" style={{background:"rgba(255,242,233,0.1)",border:"1px solid rgba(255,242,233,0.25)"}}><p className="font-normal">{t}</p><p className="text-xs mt-1 opacity-90 leading-relaxed">{d}</p></div>))}
        </div>
        <div className="flex gap-2 flex-wrap mt-4">
          <button onClick={()=>tick.mutate("Tick")} aria-label="تشغيل تيك اللوب الآن" className="px-4 py-2.5 rounded-xl font-normal text-sm" style={{background:"var(--accent)",color:"#FFFFFF"}}>{tick.isPending?"جاري التنفيذ…":"▶ شغّل تيك اللوب دلوقتي"}</button>
          <button onClick={()=>tick.mutate("Advisor Review")} aria-label="تشغيل مراجعة المستشار" className="px-4 py-2.5 rounded-xl font-normal text-sm" style={{border:"1px solid rgba(255,242,233,0.4)"}}>مراجعة المستشار (ساعية)</button>
          <button onClick={()=>tick.mutate("Daily Summary")} aria-label="ملخص التعلم اليومي" className="px-4 py-2.5 rounded-xl font-normal text-sm" style={{border:"1px solid rgba(255,242,233,0.4)"}}>ملخص التعلّم اليومي</button>
          <button onClick={()=>tick.mutate("Weekly Review")} aria-label="المراجعة الأسبوعية بالموديل" className="px-4 py-2.5 rounded-xl font-normal text-sm" style={{border:"1px solid rgba(255,242,233,0.4)"}}>المراجعة الأسبوعية {ops.weeklyReviewEnabled?"":"🔒"}</button>
        </div>
        {tick.data && <p className="text-sm mt-3 rounded-xl p-3" style={{background:"rgba(255,242,233,0.1)"}}>{tick.data.blocked ? "🔒 " + tick.data.blocked : tick.data.summary}</p>}
        <div className="flex gap-4 flex-wrap items-center mt-4 text-sm">
          <label className="flex items-center gap-2 font-normal cursor-pointer"><input type="checkbox" checked={ops.weeklyReviewEnabled} onChange={e=>setSettings.mutate({ weeklyReviewEnabled: e.target.checked })} className="w-5 h-5" aria-label="تفعيل المراجعة الأسبوعية بالموديل" /> تفعيل المراجعة الأسبوعية بالموديل (قرار مالك)</label>
          <label className="flex items-center gap-2 font-normal">صلاحية الاقتراحات (يوم)<input aria-label="أيام صلاحية الاقتراحات" type="number" {...FIELDS.setOpsSettings.suggestionTtlDays} defaultValue={ops.suggestionTtlDays} className="w-20 rounded-xl px-2 py-1.5 text-sm" style={{background:"#FFF8F1",color:"#22312C"}} onBlur={e=>setSettings.mutate({ suggestionTtlDays: Number(e.target.value) || 14 })} /></label>
        </div>
      </div>
      {(ops.loopRuns ?? []).length>0 && (
        <div className="rounded-2xl p-4 mt-4" style={card}>
          <h3 className="font-bold">سجل تشغيل اللوب</h3>
          <div className="grid gap-2 mt-2 max-h-64 overflow-y-auto">
            {ops.loopRuns.map((r:any)=>(
              <div key={r.id} className="flex items-start gap-2.5 text-sm rounded-xl px-3 py-2" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
                <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{background: r.runType==="Weekly Review" ? "var(--warning)" : "var(--success)", boxShadow:"0 0 0 3px var(--success-soft)"}} />
                <p className="flex-1"><span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{background:"var(--surface2)"}}>{r.runType}</span> {r.summary} <span className="text-xs block mt-0.5" style={{color:"var(--dim)"}}>{new Date(r.createdAt).toLocaleString("ar-EG")}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl p-4 mt-5" style={{...card, borderColor:"var(--accent)"}}>
        <h3 className="font-bold">👑 تعليمات المالك — أقوى من أي استنتاج آلي</h3>
        <p className="text-sm mt-1" style={{color:"var(--dim)"}}>ملاحظات بتضيفها وبتعدّلها إنت، وبتتغلب على أي تعلّم آلي أو اقتراح نظام عند أي تعارض.</p>
        <form className="grid gap-3 mt-3" onSubmit={(e)=>{e.preventDefault(); if(!ins.title.trim()){setInsErr("عنوان التعليمة مطلوب");return;} setInsErr(""); createIns.mutate();}}>
          <div className="grid md:grid-cols-3 gap-3">
            <div><label htmlFor="ins-title" className="text-sm font-normal block mb-1">عنوان التعليمة *</label><input id="ins-title" {...FIELDS.createInstruction.title} value={ins.title} onChange={e=>setIns({...ins,title:e.target.value})} className={inp} style={inpStyle} />{insErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{insErr}</p>}</div>
            <div><label htmlFor="ins-scope" className="text-sm font-normal block mb-1">النطاق</label><select id="ins-scope" value={ins.scope} onChange={e=>setIns({...ins,scope:e.target.value})} className={inp} style={inpStyle}>{["عام","منتجات","إعلانات","أسعار وسقوف","محتوى","عملاء"].map(s=>(<option key={s}>{s}</option>))}</select></div>
            <div><label htmlFor="ins-body" className="text-sm font-normal block mb-1">نص التعليمة</label><input id="ins-body" {...FIELDS.createInstruction.instruction} value={ins.instruction} onChange={e=>setIns({...ins,instruction:e.target.value})} className={inp} style={inpStyle} /></div>
          </div>
          <button type="submit" aria-label="إضافة تعليمة مالك" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ إضافة تعليمة</button>
        </form>
        <div className="grid gap-2.5 mt-3">
          {(ops.instructions ?? []).length===0 && <Empty title="لا تعليمات مالك مسجلة" hint="أول تعليمة بتكتبها هنا بتبقى مرجع ملزم فوق أي استنتاج آلي." />}
          {(ops.instructions ?? []).map((x:any)=>(
            <article key={x.id} className="rounded-xl p-3 flex items-start justify-between gap-3 flex-wrap" style={{background:"var(--bg)",border:"1px solid var(--border)", opacity: x.active?1:0.55}}>
              <div><p className="font-normal text-sm">{x.title} <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"var(--surface2)"}}>{x.scope}</span> {!x.active && <span className="text-xs">(موقوفة)</span>}</p>{x.instruction && <p className="text-sm mt-1">{x.instruction}</p>}</div>
              <div className="flex gap-2">
                <button aria-label={`تعليمة ${x.title} تفعيل أو إيقاف`} onClick={()=>updIns.mutate({id:x.id, active: !x.active})} className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>{x.active?"إيقاف":"تفعيل"}</button>
                <DelBtn label={`حذف تعليمة ${x.title}`} onClick={()=>delIns.mutate(x.id)} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-5">
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">🗣️ صوت العميل — تعدين مجمّع ومجهول الهوية</h3>
          <p className="text-sm mt-1.5 leading-relaxed" style={{color:"var(--dim)"}}>رسايل واتساب والتذاكر بتتعدّن <b>مجمّعة ومن غير أسماء ولا أرقام</b> لاستخراج المواضيع وطلبات المنتجات اللي مش عندك. الزق النص المجمّع هنا — <b>النص الخام مش بيتحفظ</b>، بيتحفظ التحليل المجمّع بس.</p>
          <form className="grid gap-3 mt-3" onSubmit={(e)=>{e.preventDefault(); if(paste.text.trim().length<20){setPasteErr("الزق نصاً مجمّعاً أطول (20 حرف على الأقل) — واتأكد إنه من غير أسماء أو أرقام تليفونات");return;} setPasteErr(""); analyze.mutate();}}>
            <div><label htmlFor="pv-src" className="text-sm font-normal block mb-1">مصدر النص</label><select id="pv-src" value={paste.sourceType} onChange={e=>setPaste({...paste, sourceType: e.target.value as "واتساب مجمّع"})} className={inp} style={inpStyle}>{["واتساب مجمّع","تذاكر دعم مجمّعة","نص جروب فيسبوك (لصق المالك)","نص/تفريغ إعلان منافس (لصق المالك)","أخرى"].map(s=>(<option key={s}>{s}</option>))}</select></div>
            <div><label htmlFor="pv-text" className="text-sm font-normal block mb-1">النص المجمّع (مجهول الهوية) *</label><textarea id="pv-text" {...FIELDS.analyzePastedText.text} value={paste.text} onChange={e=>setPaste({...paste,text:e.target.value})} rows={5} className={inp} style={inpStyle} placeholder="الزق هنا: رسايل/تذاكر مجمّعة، أو نص من جروب إنت عضو فيه، أو تفريغ إعلان منافس سجلته من المكتبة…" />{pasteErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{pasteErr}</p>}</div>
            <button type="submit" aria-label="تحليل النص الملصوق" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>{analyze.isPending?"جاري التحليل المجمّع…":"حلّل مجمّعاً"}</button>
          </form>
          {analyze.data && <div className="rounded-xl p-3 mt-3 text-sm" style={{background:"var(--bg)",border:"1px solid var(--border)"}}><p className="font-normal">نتيجة آخر تحليل:</p><p className="mt-1">{analyze.data.summary}</p>{analyze.data.productRequests.length>0 && <p className="mt-1"><b>طلبات منتجات:</b> {analyze.data.productRequests.join(" · ")}</p>}</div>}
          <div className="grid gap-2.5 mt-3 max-h-80 overflow-y-auto">
            {(ops.intakes ?? []).map((x:any)=>(
              <article key={x.id} className="rounded-xl p-3" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
                <div className="flex items-start justify-between gap-2"><p className="font-normal text-sm">{x.sourceType} <span className="text-xs font-normal" style={{color:"var(--dim)"}}>{new Date(x.createdAt).toLocaleString("ar-EG")}</span></p><DelBtn label={`حذف تحليل ${x.sourceType}`} onClick={()=>delIntake.mutate(x.id)} /></div>
                <p className="text-sm mt-1">{x.summary}</p>
                {x.themes.length>0 && <p className="text-sm mt-1"><b>مواضيع:</b> {x.themes.map((t:any)=>`${t.theme} (${t.mentions})`).join(" · ")}</p>}
                {x.productRequests.length>0 && <p className="text-sm mt-1"><b>طلبات منتجات مش عندك:</b> {x.productRequests.join(" · ")}</p>}
                {x.searchPhrases.length>0 && <p className="text-sm mt-1"><b>لغة العملاء:</b> {x.searchPhrases.join(" · ")}</p>}
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">📘 إعلانات المنافسين — روابط جاهزة + لصق المالك</h3>
          <p className="text-sm mt-1.5 leading-relaxed" style={{color:"var(--dim)"}}>الجلب الآلي من مكتبة Meta بيرجع <b>403</b> — فالمعتمد: رابط جاهز لكل منافس، تسجّل/تلصق إنت نص الإعلان، ويتحلّل فوق في صندوق صوت العميل كمصدر «نص/تفريغ إعلان منافس».</p>
          <a href={LIBRARY_HOME} target="_blank" rel="noreferrer" className="inline-block mt-2 text-sm font-normal underline">افتح Meta Ads Library ↗</a>
          <div className="grid gap-2 mt-3">
            {competitors.length===0 && <p className="text-sm" style={{color:"var(--dim)"}}>لسه مفيش منافسين — أضفهم من قسم السوق والعملاء وهتظهر روابطهم الجاهزة هنا.</p>}
            {competitors.map((c:any)=>{
              const q = encodeURIComponent(c.name);
              return (
              <div key={c.id} className="rounded-xl p-3 flex items-center justify-between gap-2 flex-wrap" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
                <p className="font-normal text-sm">{c.name}</p>
                <div className="flex gap-2 flex-wrap">
                  <a href={`${LIBRARY_HOME}?q=${q}`} target="_blank" rel="noreferrer" className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>إعلاناته في المكتبة ↗</a>
                  {c.websiteUrl && <a href={c.websiteUrl} target="_blank" rel="noreferrer" className="text-xs font-normal px-3 py-1.5 rounded-full" style={{border:"1px solid var(--border)"}}>موقعه ↗</a>}
                </div>
              </div> );
            })}
          </div>
          <div className="rounded-xl p-3 mt-3 text-sm" style={{background:"var(--warning-soft)",border:"1px solid var(--border)"}}>
            <p className="font-normal">📘 إعلاناتك إنت بتفاصيلها: Pending — مستنية توكن Meta</p>
            <p className="mt-1">لحد ما الحساب الإعلاني يتربط بالتوكن، تفاصيل إعلاناتك مش متاحة للنظام — وده معروض كحالة Pending مش كبيانات ناقصة متخفية.</p>
            <button onClick={()=>setTab("integrations")} aria-label="فتح حالة الربط" className="mt-2 text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>حالة الربط والمزامنة ←</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 mt-5" style={card}>
        <h3 className="font-bold">🧠 حلقة التعلّم — ملاحظات ← مرشّحة (3 أيام) ← ثابتة (7 أيام)</h3>
        <p className="text-sm mt-1" style={{color:"var(--dim)"}}>الملاحظة المتكررة بتترقى تلقائياً حسب عمر تتبعها: أقل من 3 أيام «ملاحظة»، من 3 لـ 7 «مرشّحة»، وبعد 7 «ثابتة». التحليلات الملصوقة بتولّد ملاحظات وفرص منتجات تلقائياً.</p>
        <div className="flex items-stretch gap-2 mt-4 flex-wrap" role="img" aria-label="قمع دورة حياة التعلّمات">
          {[{ l:"ملاحظة", d:"أقل من 3 أيام", g:"var(--grad-tracking)" }, { l:"مرشّحة", d:"3 – 7 أيام", g:"var(--grad-content)" }, { l:"ثابتة", d:"أكثر من 7 أيام", g:"var(--grad-approvals)" }].map((s, i, arr)=>{
            const count = (ops.observations ?? []).filter((x:any)=>x.lifecycle===s.l).length;
            return (
              <div key={s.l} className="flex items-center gap-2 flex-1 min-w-[150px]">
                <div className="rounded-2xl p-3.5 flex-1 text-center" style={{background:s.g,color:"#FFF6EE",boxShadow:"var(--shadow-card)"}}>
                  <div className="text-2xl font-bold"><CountUp value={count} /></div>
                  <div className="font-normal text-sm mt-0.5">{s.l}</div>
                  <div className="text-[11px] opacity-85">{s.d}</div>
                </div>
                {i<arr.length-1 && <span aria-hidden className="font-normal" style={{color:"var(--dim)"}}>←</span>}
              </div>
            );
          })}
        </div>
        <form className="grid gap-3 mt-3" onSubmit={(e)=>{e.preventDefault(); if(!ob.title.trim()){setObErr("عنوان الملاحظة مطلوب");return;} setObErr(""); createOb.mutate();}}>
          <div className="grid md:grid-cols-4 gap-3">
            <div><label htmlFor="ob-title" className="text-sm font-normal block mb-1">الملاحظة *</label><input id="ob-title" {...FIELDS.createObservation2.title} value={ob.title} onChange={e=>setOb({...ob,title:e.target.value})} className={inp} style={inpStyle} />{obErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{obErr}</p>}</div>
            <div><label htmlFor="ob-src" className="text-sm font-normal block mb-1">المصدر</label><select id="ob-src" value={ob.source} onChange={e=>setOb({...ob,source:e.target.value})} className={inp} style={inpStyle}>{["صوت العميل","السوق","لغة البحث","إعلانات منافسين","الأوردرات","يدوي"].map(s=>(<option key={s}>{s}</option>))}</select></div>
            <div><label htmlFor="ob-occ" className="text-sm font-normal block mb-1">مرات التكرار</label><input id="ob-occ" type="number" {...FIELDS.createObservation2.occurrences} value={ob.occurrences} onChange={e=>setOb({...ob,occurrences:Number(e.target.value)})} className={inp} style={inpStyle} /></div>
            <div><label htmlFor="ob-first" className="text-sm font-normal block mb-1">أول مرة اتشافت</label><input id="ob-first" type="date" value={ob.firstSeenDate} onChange={e=>setOb({...ob,firstSeenDate:e.target.value})} className={inp} style={inpStyle} /></div>
          </div>
          <div><label htmlFor="ob-det" className="text-sm font-normal block mb-1">التفاصيل</label><input id="ob-det" {...FIELDS.createObservation2.detail} value={ob.detail} onChange={e=>setOb({...ob,detail:e.target.value})} className={inp} style={inpStyle} /></div>
          <button type="submit" aria-label="إضافة ملاحظة تعلم" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ إضافة ملاحظة</button>
        </form>
        <div className="grid gap-2.5 mt-3">
          {(ops.observations ?? []).length===0 && <Empty title="لا ملاحظات تعلّم متعقبة" hint="حلّل نصاً ملصوقاً أو أضف ملاحظة يدوياً — الترقي لمرشّحة/ثابتة بيحصل مع الزمن والتكرار." />}
          {(ops.observations ?? []).map((x:any)=>(
            <article key={x.id} className="rounded-xl p-3 flex items-start justify-between gap-3 flex-wrap" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
              <div><p className="font-normal text-sm">{x.title} <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{background:lifeTone(x.lifecycle),color:"#fff"}}>{x.lifecycle}</span></p><p className="text-xs mt-1" style={{color:"var(--dim)"}}>{x.source} · تكررت {x.occurrences} مرة · متعقبة من {x.daysTracked} يوم (من {x.firstSeenDate})</p>{x.detail && <p className="text-sm mt-1">{x.detail}</p>}</div>
              <div className="flex gap-2">
                <button aria-label={`تسجيل تكرار آخر لـ ${x.title}`} onClick={()=>bumpOb.mutate(x.id)} className="text-xs font-normal px-3 py-1.5 rounded-full" style={{background:"var(--teal)",color:"#FFF2E9"}}>＋ تكرار</button>
                <DelBtn label={`حذف ملاحظة ${x.title}`} onClick={()=>delOb.mutate(x.id)} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-5">
        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">🔍 لغة البحث — اقتراحات Google Egypt</h3>
          <p className="text-sm mt-1" style={{color:"var(--dim)"}}>كلماتك المتعقبة بتتفحص في نموذج التشغيل كل 20 دقيقة. سجّل الكلمات هنا والاقتراحات المرصودة لكل مسح.</p>
          <form className="grid gap-3 mt-3" onSubmit={(e)=>{e.preventDefault(); if(!kw.keyword.trim()){setKwErr("اكتب الكلمة");return;} setKwErr(""); createKw.mutate();}}>
            <div className="grid grid-cols-2 gap-3">
              <div><label htmlFor="kw-word" className="text-sm font-normal block mb-1">الكلمة *</label><input id="kw-word" {...FIELDS.createKeyword.keyword} value={kw.keyword} onChange={e=>setKw({...kw,keyword:e.target.value})} className={inp} style={inpStyle} placeholder="مثال: جلد الوزة" />{kwErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{kwErr}</p>}</div>
              <div><label htmlFor="kw-notes" className="text-sm font-normal block mb-1">ملاحظات</label><input id="kw-notes" {...FIELDS.createKeyword.notes} value={kw.notes} onChange={e=>setKw({...kw,notes:e.target.value})} className={inp} style={inpStyle} /></div>
            </div>
            <button type="submit" aria-label="إضافة كلمة بحث" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ تعقّب كلمة</button>
          </form>
          <div className="grid gap-2.5 mt-3">
            {(ops.keywords ?? []).length===0 && <Empty title="لا كلمات بحث متعقبة" hint="أضف أول كلمة (زي «جلد الوزة» أو «كريم يوريا») وسجّل اقتراحات كل مسح." />}
            {(ops.keywords ?? []).map((x:any)=>(
              <article key={x.id} className="rounded-xl p-3" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
                <div className="flex items-start justify-between gap-2"><p className="font-normal text-sm">{x.keyword}</p><DelBtn label={`حذف كلمة ${x.keyword}`} onClick={()=>delKw.mutate(x.id)} /></div>
                <p className="text-xs mt-1" style={{color:"var(--dim)"}}>آخر مسح: {x.lastScanAt ? new Date(x.lastScanAt).toLocaleString("ar-EG") : "لسه مفيش مسح مسجل"}</p>
                {x.suggestions && <p className="text-sm mt-1 whitespace-pre-wrap"><b>الاقتراحات:</b> {x.suggestions}</p>}
                <div className="flex gap-2 mt-2">
                  <input aria-label={`اقتراحات مسح ${x.keyword}`} id={`kws-${x.id}`} placeholder="الزق اقتراحات المسح الجديد…" className="flex-1 rounded-xl px-2 py-1.5 border text-sm" style={inpStyle} />
                  <button aria-label={`حفظ مسح ${x.keyword}`} onClick={()=>{ const el = document.getElementById(`kws-${x.id}`) as HTMLInputElement | null; if (!el || !el.value.trim()) { setKwScanErr("الزق اقتراحات المسح أولاً قبل التسجيل"); return; } setKwScanErr(""); scanKw.mutate({ id:x.id, suggestions: el.value }); }} className="text-xs font-normal px-3 py-2 rounded-full shrink-0" style={{background:"var(--teal)",color:"#FFF2E9"}}>تسجيل مسح</button>
                </div>
                {kwScanErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{kwScanErr}</p>}
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4" style={card}>
          <h3 className="font-bold">💡 فرص منتجات جديدة</h3>
          <p className="text-sm mt-1" style={{color:"var(--dim)"}}>أربعة مصادر: طلبات عملاء · منتجات جديدة عند المنافسين · باقات من الأوردرات · موسم قريب. طلبات العملاء المستخرجة من التحليلات بتوصل هنا تلقائياً.</p>
          <form className="grid gap-3 mt-3" onSubmit={(e)=>{e.preventDefault(); if(!opp.title.trim()){setOppErr("عنوان الفرصة مطلوب");return;} setOppErr(""); createOpp.mutate();}}>
            <div className="grid grid-cols-2 gap-3">
              <div><label htmlFor="opp-title" className="text-sm font-normal block mb-1">الفرصة *</label><input id="opp-title" {...FIELDS.createOpportunity.title} value={opp.title} onChange={e=>setOpp({...opp,title:e.target.value})} className={inp} style={inpStyle} />{oppErr && <p className="text-xs mt-1" style={{color:"var(--danger)"}}>{oppErr}</p>}</div>
              <div><label htmlFor="opp-src" className="text-sm font-normal block mb-1">المصدر</label><select id="opp-src" value={opp.sourceType} onChange={e=>setOpp({...opp, sourceType: e.target.value as "طلبات عملاء"})} className={inp} style={inpStyle}>{["طلبات عملاء","منتجات جديدة عند المنافسين","باقات من الأوردرات","موسم قريب"].map(s=>(<option key={s}>{s}</option>))}</select></div>
            </div>
            <div><label htmlFor="opp-ev" className="text-sm font-normal block mb-1">الدليل</label><input id="opp-ev" {...FIELDS.createOpportunity.evidence} value={opp.evidence} onChange={e=>setOpp({...opp,evidence:e.target.value})} className={inp} style={inpStyle} /></div>
            <button type="submit" aria-label="إضافة فرصة منتج" className="px-5 py-2.5 rounded-full font-normal justify-self-start" style={{background:"var(--accent)",color:"#FFFFFF"}}>＋ إضافة فرصة</button>
          </form>
          <div className="grid gap-2.5 mt-3">
            {(ops.opportunities ?? []).length===0 && <Empty title="لا فرص منتجات مسجلة" hint="أول فرصة ممكن تيجي تلقائياً من تحليل صوت العميل، أو أضفها يدوياً بمصدرها ودليلها." />}
            {(ops.opportunities ?? []).map((x:any)=>(
              <article key={x.id} className="rounded-xl p-3" style={{background:"var(--bg)",border:"1px solid var(--border)"}}>
                <div className="flex items-start justify-between gap-2 flex-wrap"><p className="font-normal text-sm">{x.title}</p><DelBtn label={`حذف فرصة ${x.title}`} onClick={()=>delOpp.mutate(x.id)} /></div>
                <p className="text-xs mt-1" style={{color:"var(--dim)"}}>{x.sourceType} · {new Date(x.createdAt).toLocaleDateString("ar-EG")}</p>
                {x.evidence && <p className="text-sm mt-1">{x.evidence}</p>}
                <select aria-label={`حالة فرصة ${x.title}`} value={x.status} onChange={e=>updOpp.mutate({id:x.id, status:e.target.value})} className="rounded-xl px-2 py-1.5 border text-xs mt-2" style={inpStyle}>{["قيد الدراسة","مرشّحة","معتمدة للتطوير","مرفوضة"].map(s=>(<option key={s}>{s}</option>))}</select>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
