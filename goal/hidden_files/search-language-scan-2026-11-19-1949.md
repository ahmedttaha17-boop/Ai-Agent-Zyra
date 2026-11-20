# Search Language Scan — 2026-11-19 19:50 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 19:29 EET run JSON (hidden_files/search-language/scan-2026-11-19-1929.json: keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 17:30:28–17:32:35Z = 19:30–19:32 EET run). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T17:51:31Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- Firefox top-10 sets identical to 19:29 for all 12 keywords (no new, no gone). Order-only flips in 3 keywords, each flipping back to the 19:09 order — the same two-state oscillation documented in the 19:29 run (rotation noise, not signal):
  - «سيلوليت»: «بالانجليزي» 5→4، «الافخاذ» 4→5.
  - «يوريا»: «صن بلوك» 9→8، «سيكا» 8→9.
  - «مخمرية»: «مخمرية» 2→1، «العود الملكي» 1→2، «للجسم للنساء» 8→7، «بودي» 7→8.

## Extended-list check (chrome, 15 results)
Chrome 15-set unchanged vs the 19:29 chrome set except «زبدة الشيا»: «زبدة الشيا الخام» back in (position 6), «زبدة الشيا للشفايف» out.
- «زبدة الشيا الخام» is NOT new: verified known rotator — 128 occurrences across today's scan JSONs, in the 19:09 chrome set, and in the firefox top 10 in both the 19:29 and 19:50 runs. No observation.
- «زبدة الشيا للشفايف» leaving the chrome 15-set is rotation; it was already recorded as observation 59 in the 19:29 run (first appearance ever). No action.
- All other chrome 11–15 items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (thinking 18 carousel, obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18)، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T19-50-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-1949.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T175028.json; 10-result file hidden_files/search-scans/scan-2026-11-19-1950.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_1949.py.
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | صن بلوك | سيكا | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: مخمرية | العود الملكي | للجسم | رجالي | فيونكة | رنة خلخال | للجسم للنساء | بودي | يارا | مايت سينما
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
