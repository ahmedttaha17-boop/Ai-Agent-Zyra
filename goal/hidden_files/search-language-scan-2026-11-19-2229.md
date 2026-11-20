# Search Language Scan — 2026-11-19 22:30 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 22:09 EET run JSON (hidden_files/search-language/scan-2026-11-19-2209.json: keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 20:11:32–50Z = 22:09 run). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T20:31:57–20:32:16Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity. No items left any set.
- Firefox top-10 sets identical to 22:09 for all 12 keywords (diff empty).
- Chrome 15-sets: only order flips in 2 keywords (rotation noise, not signal):
  - «علاج جلد الوزة»: «بالليزر» 6→5، «تحت الابط» 7→6، «في المناطق الحساسة» 8→7، «من الصيدلية» 5→8 (firefox position of «من الصيدلية» unchanged at 6).
  - «زبدة الشيا»: «امتنان» 4→3، «الخام في الصيدليات» 5→4، «للوجه» 6→5، «الخام» 3→6، «للبشرة» 10→7، «افريكانا» 7→8، «الاصلية» 8→10 — «للبشرة» still out of the firefox top 10, already a known item; no action.

## Extended-list check (chrome, 15 results)
Chrome 15-sets identical to 22:09 for 10 of 12 keywords; the only changes are the two order flips above. All 11–15 items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «علاج جلد الوزة في منطقة البكيني» (observation — body-area pattern)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما»، «سيلوليت الارداف»، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك»، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام»، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T22-30-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-2229.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T203033.json; 10-result file hidden_files/search-scans/scan-2026-11-19-2230.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_2229.py (adapted from scan_now_2209.py; prev firefox + chrome both from the 2209 file, keys "keywords"/"chrome_keywords" — diffs computed and verified against the JSON; sed lineage checked before running).
- Recording: all 12 recordkeywordscan calls returned ok in two parallel batches of 6 (no retries needed this run, unlike 22:09). Verification via getopsstate confirmed all 12 ids updated to 20:31:57–20:32:16Z with matching stored suggestions.
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: علاج جلد الوزة | بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: كريم جلد الوزة | من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: سيلوليت | الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: كريم سيلوليت | بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: علاج السيلوليت | في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج صن بلوك | يورياج سيكا | يوريا الدم
- كريم يوريا للجسم: كريم يوريا للجسم | النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: سكراب جسم | وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: زبدة الشيا | للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: مخمرية العود الملكي | مخمرية | للجسم | رجالي | فيونكة | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
