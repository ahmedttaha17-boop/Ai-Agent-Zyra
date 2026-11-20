# Search Language Scan — 2026-11-19 19:10 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 18:49 EET run JSON (hidden_files/search-language/scan-2026-11-19-1849.json: firefox_results + results) + space-stored suggestions (getopsstate at run start; lastScanAt 16:51:31–57Z = 18:51 EET run, content = 18:49 firefox snapshot). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T17:11:57Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs previous snapshot
No brand-new suggestions today. No observation created. No new product opportunity.
Firefox top-10 changes are all returns of items seen earlier today (rotation, not new):
- «سيلوليت»: «الافخاذ» and «الجسم» back in (both in the 18:30 top 10 and in many earlier scans today); «جورجينا» and «رول امازون» out of the top 10. «رول امازون» still present at chrome #11 (opportunity 2 unaffected); «جورجينا» exited the chrome 15-set entirely.
- «زبدة الشيا»: «الخام» back in (seen in early scans today, e.g. 02:09), «للبشرة» out. «الخام» / «للبشرة» / «الاصلية» keep rotating in the last slots — normal rotation.
- Order-only: «سيلوليت»: «رول نون» 5→6, «رولر» 6→7, «البطن» 7→9, «الذراعين» 9→10. «زبدة الشيا»: «الاصلية» 10→9, «الحواج» 9→10.
- Chrome: 1 change only — «سكراب جسم»: «بالبيت» out, «ازرق» back in (both known; obs 58 covered «بالبيت»'s arrival at 18:49 and noted «ازرق»'s exit as normal rotation — the flip reversed this run, no new signal).

## Extended-list check (chrome, 15 results)
Chrome 15-set otherwise unchanged vs the 18:49 chrome file. Items in positions 11–15 all already known/covered (verified in the 18:11/18:30 runs): «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (thinking 18 carousel, obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18)، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T19-10-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-1909.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T171040.json; 10-result file hidden_files/search-scans/scan-2026-11-19-1910.json.
- Script: hidden_files/search-language/scan_now_1909.py. Note: search-scans/prev.json was STALE (18:30 chrome set — the 18:49 run did not refresh it); this run diffed chrome vs the 18:49 file's "results" instead and refreshed prev.json to this run's chrome results, restoring the convention.
- MEMORY.md changed mid-run (PDP v4 designer delivery rejected ~19:15, plain-language rule) — unrelated to this scan; no impact on keywords or findings.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | بالليزر | تحت الابط | في المناطق الحساسة | من الصيدلية | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج صن بلوك | يورياج سيكا | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: العود الملكي | مخمرية | للجسم | رجالي | فيونكة | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
