# Search Language Scan — 2026-11-19 23:50 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (extended check).
Previous snapshot: 23:09 EET run JSON (hidden_files/search-language/scan-2026-11-19-2309.json: keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 21:10:46–21:11:42Z = 23:09 run). Recorded via recordkeywordscan for all 12 keyword ids using the corrected id mapping (1=جلد الوزة, 2=علاج جلد الوزة, 3=كريم جلد الوزة, 4=كريم سيلوليت, 5=علاج السيلوليت, 6=سيلوليت, 7=ملح سيوة, 8=يوريا, 9=مخمرية, 10=كريم يوريا للجسم, 11=سكراب جسم, 12=زبدة الشيا); verified via getopsstate: lastScanAt now 2026-11-19T21:50:59–21:51:15Z for all 12, stored suggestions match this run's firefox snapshot per keyword.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity. No items left any set.
- Firefox top-10 sets identical to 23:09 for 10 of 12 keywords; only order flips (rotation noise, not signal):
  - «سيلوليت»: «الافخاذ» 5→4, «بالانجليزي» 4→5.
  - «مخمرية»: «مخمرية العود الملكي» 2→1, «مخمرية» 1→2, «مخمرية بودي» 8→7, «مخمرية للجسم للنساء» 7→8 (same flip pair as 23:09 run, still just rotation).
- Chrome 15-sets: only order flips in 3 keywords (rotation noise, not signal):
  - «علاج جلد الوزة»: «من الصيدلية» 5→8, «بالليزر» 6→5, «تحت الابط» 7→6, «في المناطق الحساسة» 8→7.
  - «زبدة الشيا»: «الخام» 6→3, «امتنان» 3→4, «الخام في الصيدليات» 4→5, «للوجه» 5→6, «افريكانا» 8→7, «الاصلية» 10→8, «للبشرة» 7→10.
  - «مخمرية»: «بودي» 7→6, «للجسم للنساء» 6→7, «العروسة» 15→13, «body» 13→14, «بلوب» 14→15.

## Extended-list check (chrome, 13–15 results)
Chrome sets identical to 23:09 for 9 of 12 keywords; the only changes are the three order flips above. All 11–15 items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «علاج جلد الوزة في منطقة البكيني» (observation — body-area pattern)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما»، «سيلوليت الارداف»، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك»، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام»، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T23-50-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-2349.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T215012.json; 10-result file hidden_files/search-scans/scan-2026-11-19-2350.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_2349.py (adapted from scan_now_2309.py; prev firefox + chrome both from the 2309 file, keys "keywords"/"chrome_keywords" — diffs computed and verified against the JSON; the sed adaptation initially mis-pointed the prev path and previous_snapshot label at the 2349 file — fixed before running, same class of bug the 2309 run had noted).
- Recording: all 12 recordkeywordscan calls returned ok in two parallel batches of 6; verification via getopsstate confirmed all 12 ids updated to 21:50:59–21:51:15Z with matching stored suggestions (per-keyword, using the corrected mapping).
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: علاج جلد الوزة | بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: كريم جلد الوزة | من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: سيلوليت | الرجل | رول | الافخاذ | بالانجليزي | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: كريم سيلوليت | بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: علاج السيلوليت | في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج صن بلوك | يورياج سيكا | يوريا الدم
- كريم يوريا للجسم: كريم يوريا للجسم | النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: سكراب جسم | وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: زبدة الشيا | للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: مخمرية العود الملكي | مخمرية | مخمرية للجسم | مخمرية رجالي | مخمرية فيونكة | مخمرية رنة خلخال | مخمرية بودي | مخمرية للجسم للنساء | مخمرية يارا | مخمرية مايت سينما
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
