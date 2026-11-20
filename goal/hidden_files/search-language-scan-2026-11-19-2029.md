# Search Language Scan — 2026-11-19 20:30 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 20:09 EET run JSON (hidden_files/search-language/scan-2026-11-19-2009.json: keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 18:11:33–34Z = 20:11 EET run). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T18:31:20Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- Firefox top-10 sets identical to 20:09 for 9 of 12 keywords. Order-only flips in 3 keywords (rotation noise, not signal):
  - «علاج جلد الوزة»: «بالليزر» 7→6، «تحت الابط» 8→7، «في المناطق الحساسة» 9→8، «من الصيدلية» 6→9.
  - «يوريا»: «صن بلوك» 9→8، «سيكا» 8→9 (same two-state oscillation documented in the 19:29/19:49/20:09 runs).
  - «مخمرية»: unchanged this run (no flip; the 20:09 flips did not reverse).
- «زبدة الشيا»: «زبدة الشيا الاصلية» back in the firefox top 10 (position 9), «زبدة الشيا للبشرة» out; «افريكانا» 9→8.
  - «زبدة الشيا الاصلية» is NOT new: verified known rotator — present in the 20:09 chrome 15-set (position 8) and in the 2026-11-18 baseline, as documented in the 20:09 run log. No observation.
  - «زبدة الشيا للبشرة» leaving the firefox top 10 is rotation; it stays in this run's chrome 15-set (position 10). No action.

## Extended-list check (chrome, 15 results)
Chrome 15-set unchanged vs the 20:09 chrome set except order-only flips in 3 keywords (rotation noise):
- «سيلوليت»: «الافخاذ» 4→3، «بالانجليزي» 3→4.
- «يوريا»: «سيكا» 8→7، «صن بلوك» 7→8.
- «مخمرية»: «للجسم للنساء» 7→6، «بودي» 6→7، «body» 14→13، «بلوب» 15→14، «العروسة» 13→15.
- All other chrome 11–15 items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (thinking 18 carousel, obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18)، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T20-30-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-2029.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T183033.json; 10-result file hidden_files/search-scans/scan-2026-11-19-2030.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_2029.py (written fresh for this run; prev path = 2009 file, no sed bug — diffs computed in-script and verified against the JSON).
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | بالليزر | تحت الابط | في المناطق الحساسة | من الصيدلية | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | صن بلوك | سيكا | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: العود الملكي | مخمرية | للجسم | رجالي | فيونكة | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
