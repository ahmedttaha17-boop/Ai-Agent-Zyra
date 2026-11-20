# Search Language Scan — 2026-11-19 19:31 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 19:09 EET run JSON (hidden_files/search-language/scan-2026-11-19-1909.json: keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 17:11:57Z = 19:11 EET run). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T17:30:28–17:32:35Z for all 12, stored suggestions match this run's firefox snapshot (19:31 re-fetch; see correction note below).

## Change vs previous snapshot
One brand-new suggestion — observation 59 created. No new product opportunity.
- «زبدة الشيا للشفايف» (chrome extended list, position 15, keyword «زبدة الشيا»): first appearance ever in any scan file (grep across all of today's scan JSONs + the whole workspace history: only this run's files contain it). Observation 59 (SEARCH_LANGUAGE): باحثون بيدوّروا على زبدة الشيا للشفايف. زيرا تحمل الشيا أصلاً لكن لا تحمل منتج شفاه مخصصاً — زاوية محتوى/استخدام محتملة لمنتج الشيا الحالي، لا فرصة منتج جديدة ما لم يقرر المالك منتج شفاه. Chrome: «زبدة الشيا الخام» out of the 15-set (still in the firefox top 10) — normal rotation.

Firefox top-10 changes are order-only (no new, no gone) in 4 keywords:
- «علاج جلد الوزة»: «من الصيدلية» 9→6، «بالليزر» 6→7، «تحت الابط» 7→8، «في المناطق الحساسة» 8→9.
- «سيلوليت»: «الافخاذ» 5→4، «بالانجليزي» 4→5.
- «يوريا»: «يورياج سيكا» 9→8، «يورياج صن بلوك» 8→9.
- «مخمرية»: «العود الملكي» 2→1، «مخمرية» 1→2، «بودي» 8→7، «للجسم للنساء» 7→8.

## Correction note — intra-run rotation (honesty)
The first firefox fetch (19:29) and the script re-fetch (19:31) disagreed on 3 keywords — Google rotates the tail slots even within minutes:
- «زبدة الشيا»: 19:29 had «للبشرة» in / «الاصلية» out; 19:31 had the 19:09 set back («الاصلية» in / «للبشرة» out). «للبشرة» is a known rotator (seen in many earlier scans today, e.g. 02:09–07:09), NOT a new signal — no observation for it.
- «سيلوليت»: 19:29 had «بالانجليزي» 4 / «الافخاذ» 5; 19:31 flipped them.
- «يوريا»: 19:29 had «صن بلوك» 8 / «سيكا» 9; 19:31 flipped them.
The space was first recorded from the 19:29 fetch, then ids 6, 8, 12 were re-recorded to the canonical 19:31 snapshot so the space matches the run JSON exactly. Lesson: a single fetch is one rotation sample; "new" is judged against the full-day history, not just the previous fetch.

## Extended-list check (chrome, 15 results)
Chrome 15-set otherwise unchanged vs the 19:09 chrome set. Items in positions 11–15 all already known/covered (verified in the 19:09 run): «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (thinking 18 carousel, obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18)، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record beyond observation 59.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T19-31-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-1929.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T173137.json; 10-result file hidden_files/search-scans/scan-2026-11-19-1931.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_1929.py.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | الافخاذ | بالانجليزي | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج سيكا | يورياج صن بلوك | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: العود الملكي | مخمرية | للجسم | رجالي | فيونكة | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
