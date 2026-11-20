# Search Language Scan — 2026-11-20 00:10 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (extended check).
Previous snapshot: 23:49 EET run JSON (hidden_files/search-language/scan-2026-11-19-2349.json: keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 21:50:59–21:51:15Z = 23:49 run). Recorded via recordkeywordscan for all 12 keyword ids (corrected mapping: 1=جلد الوزة, 2=علاج جلد الوزة, 3=كريم جلد الوزة, 4=كريم سيلوليت, 5=علاج السيلوليت, 6=سيلوليت, 7=ملح سيوة, 8=يوريا, 9=مخمرية, 10=كريم يوريا للجسم, 11=سكراب جسم, 12=زبدة الشيا); verified via getopsstate: lastScanAt now 2026-11-19T22:11:20–22:11:36Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- The only firefox set change is in «زبدة الشيا»: «زبدة الشيا للبشرة» entered the top-10 at #10, «زبدة الشيا الخام» dropped out. This is rotation, not new signal: «زبدة الشيا للبشرة» was already in the chrome extended set in prior runs (23:49 chrome #10) and «زبدة الشيا الخام» is still in this run's chrome extended set (#6). It is also a use-area of an ingredient Zyra already carries (shea butter), not a product Zyra doesn't carry.
- All other firefox changes are order flips only (rotation noise, not signal):
  - «سيلوليت»: «بالانجليزي» 5→4, «الافخاذ» 4→5.
  - «يوريا»: «يورياج سيكا» 9→8, «يورياج صن بلوك» 8→9.
  - «زبدة الشيا»: «افريكانا» 8→7, «الاصلية» 9→8, «الحواج» 10→9.
  - «مخمرية»: «مخمرية» 2→1, «مخمرية العود الملكي» 1→2, «للجسم للنساء» 8→7, «بودي» 7→8.
- Chrome 13–15 sets: no new or gone items in any keyword; only order flips (rotation noise, not signal):
  - «علاج جلد الوزة»: «من الصيدلية» 8→5, «بالليزر» 5→6, «تحت الابط» 6→7, «في المناطق الحساسة» 7→8.
  - «زبدة الشيا»: «امتنان» 4→3, «الخام في الصيدليات» 5→4, «للوجه» 6→5, «الخام» 3→6, «للبشرة» 10→7, «افريكانا» 7→8, «الاصلية» 8→10.
  - «مخمرية»: «للجسم للنساء» 7→6, «بودي» 6→7, «body» 14→13, «بلوب» 15→14, «العروسة» 13→15.
- All previously tracked extended items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «علاج جلد الوزة في منطقة البكيني» (observation — body-area pattern)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما»، «سيلوليت الارداف»، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك»، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام»، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-20T00-10-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-20-0009.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T221027.json; 10-result file hidden_files/search-scans/scan-2026-11-20-0010.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_0009.py (adapted from scan_now_2349.py; prev firefox + chrome both from the 2349 file, keys "keywords"/"chrome_keywords" — diffs computed and verified against the JSON).
- Recording: all 12 recordkeywordscan calls returned ok in two parallel batches of 6; verification via getopsstate confirmed all 12 ids updated to 22:11:20–22:11:36Z with matching stored suggestions.
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: علاج جلد الوزة | بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: كريم جلد الوزة | من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: سيلوليت | الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: كريم سيلوليت | بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: علاج السيلوليت | في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج سيكا | يورياج صن بلوك | يوريا الدم
- كريم يوريا للجسم: كريم يوريا للجسم | النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: سكراب جسم | وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: زبدة الشيا | للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | افريكانا | الاصلية | الحواج | للبشرة
- مخمرية: مخمرية | مخمرية العود الملكي | مخمرية للجسم | مخمرية رجالي | مخمرية فيونكة | مخمرية رنة خلخال | مخمرية للجسم للنساء | مخمرية بودي | مخمرية يارا | مخمرية مايت سينما
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
