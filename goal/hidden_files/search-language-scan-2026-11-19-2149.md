# Search Language Scan — 2026-11-19 21:50 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 21:29 EET run JSON (hidden_files/search-language/scan-2026-11-19-2129.json: keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 19:32:12–55Z = 21:32 EET run). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T19:51:41Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- Firefox top-10 sets identical to 21:29 for 7 of 12 keywords. Order-only flips in 4 keywords (rotation noise, not signal):
  - «علاج جلد الوزة»: «من الصيدلية» 6→9، «بالليزر» 7→6، «تحت الابط» 8→7، «في المناطق الحساسة» 9→8.
  - «سيلوليت»: «الافخاذ» 5→4، «بالانجليزي» 4→5 (same oscillation documented in the 21:11/21:29 runs).
  - «يوريا»: «سيكا» 9→8، «صن بلوك» 8→9 (same two-state oscillation documented in the 19:29/19:49/20:09/20:29/21:11/21:29 runs).
  - «مخمرية»: «العود الملكي» 2→1، «مخمرية» 1→2، «بودي» 8→7، «للجسم للنساء» 7→8.
- «زبدة الشيا»: «زبدة الشيا الاصلية» back in the firefox top 10 (position 9)، «زبدة الشيا للبشرة» out; «افريكانا» 9→8.
  - «زبدة الشيا الاصلية» is NOT new: verified known rotator — present in the chrome 15-set at 21:29 (position 8) and in the firefox top 10 in earlier runs; it simply rotated back in. No observation.
  - «زبدة الشيا للبشرة» leaving is rotation; still present in the chrome 15-set (position 10). No action.

## Extended-list check (chrome, 15 results)
- Chrome 15-sets identical to 21:29 for 11 of 12 keywords; the only change is the «يوريا» order flip («صن بلوك» 8→7، «سيكا» 7→8 — same oscillation, reversed direction vs firefox). All 11–15 items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18)، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T21-50-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-2149.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T195017.json; 10-result file hidden_files/search-scans/scan-2026-11-19-2150.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_2149.py (written fresh for this run; prev firefox + chrome both from the 2129 file, keys "keywords"/"chrome_keywords" — diffs computed in-script and verified against the JSON).
- Recording: parallel recordkeywordscan batch returned ok for all 12; verification via getopsstate confirmed all 12 ids updated to 19:51:41Z with matching stored suggestions — no re-record needed this run.
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: علاج جلد الوزة | بالفازلين | في المؤخرة | بزيت جونسون | في البيت | بالليزر | تحت الابط | في المناطق الحساسة | من الصيدلية | في الوجه
- كريم جلد الوزة: كريم جلد الوزة | من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: سيلوليت | الرجل | رول | الافخاذ | بالانجليزي | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: كريم سيلوليت | بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: علاج السيلوليت | في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج سيكا | يورياج صن بلوك | يوريا الدم
- كريم يوريا للجسم: كريم يوريا للجسم | النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: سكراب جسم | وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: زبدة الشيا | للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: مخمرية العود الملكي | مخمرية | للجسم | رجالي | فيونكة | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
