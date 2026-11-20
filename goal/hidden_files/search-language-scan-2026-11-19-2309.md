# Search Language Scan — 2026-11-19 23:10 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (extended check).
Previous snapshot: 22:29 EET run JSON (hidden_files/search-language/scan-2026-11-19-2229.json: keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 20:31:57–20:32:16Z = 22:29 run). Recorded via recordkeywordscan for all 12 keyword ids; verified via getopsstate: lastScanAt now 2026-11-19T21:10:46–21:11:42Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity. No items left any set.
- Firefox top-10 sets identical to 22:29 for 11 of 12 keywords; only «مخمرية» order flips (rotation noise, not signal): «مخمرية» 2→1, «مخمرية العود الملكي» 1→2, «مخمرية للجسم للنساء» 8→7, «مخمرية بودي» 7→8.
- Chrome 15-sets: only order flips in 2 keywords (rotation noise, not signal):
  - «علاج جلد الوزة»: «من الصيدلية» 8→5, «بالليزر» 5→6, «تحت الابط» 6→7, «في المناطق الحساسة» 7→8.
  - «مخمرية»: «للجسم للنساء» 7→6, «بودي» 6→7, «مخمرية body» 14→13, «مخمرية بلوب» 15→14, «مخمرية العروسة» 13→15.

## Extended-list check (chrome, 13–15 results)
Chrome sets identical to 22:29 for 10 of 12 keywords; the only changes are the two order flips above. All 11–15 items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «علاج جلد الوزة في منطقة البكيني» (observation — body-area pattern)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما»، «سيلوليت الارداف»، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك»، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام»، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## ⚠️ DATA FIX — keyword-id mapping corrected this run
Verification via getopsstate caught that the space's keyword ids do NOT follow the seed-list order assumed by this run (and by the 22:29 run, whose "stored suggestions match" check was only set-membership, not per-keyword). The first recordkeywordscan batch (ids 1–12 in seed order) stored the wrong suggestions under ids 4–12. Correct mapping (from createdAt order in the space) — **use this for every future scan**:
- 1=جلد الوزة, 2=علاج جلد الوزة, 3=كريم جلد الوزة, 4=كريم سيلوليت, 5=علاج السيلوليت, 6=سيلوليت, 7=ملح سيوة, 8=يوريا, 9=مخمرية, 10=كريم يوريا للجسم, 11=سكراب جسم, 12=زبدة الشيا.
All 9 mismatched ids (4–12) were re-recorded with the correct suggestions in this run and re-verified via getopsstate (all 12 now correct, lastScanAt 21:10:46–21:11:42Z). The diff analysis was computed on the JSON files (keyed by keyword text, not id), so the "no new suggestions" conclusion is unaffected. Caveat: stored suggestions in the space for ids 4–12 were scrambled by earlier scans that used the seed-order assumption — any per-keyword reading of space-stored suggestions from before this fix (22:29 run and possibly earlier runs today) is unreliable; the JSON snapshots in hidden_files/search-language/ and ~/workspace/zyra-marketing-intelligence-agent/search-language/ are the authoritative record. Logged to the space activity log as well.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T23-09-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-2309.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T210958.json; 10-result file hidden_files/search-scans/scan-2026-11-19-2309.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_2309.py (adapted from scan_now_2229.py; prev firefox + chrome both from the 2229 file, keys "keywords"/"chrome_keywords" — diffs computed and verified against the JSON; one label bug fixed after the run: the "previous_snapshot" string initially named the 2309 file, corrected to 2229 in both JSONs and in the script).
- Recording: all 12 recordkeywordscan calls returned ok in two parallel batches of 6, plus 9 corrective re-records (ids 4–12) after the mapping was caught; verification via getopsstate confirmed all 12 ids updated to 21:10:46–21:11:42Z with matching stored suggestions.
- No tracking timeline entry: routine no-change scan, nothing user-facing (the id-mapping fix is internal bookkeeping; flagged here and in the daily memory log).

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
- مخمرية: مخمرية | مخمرية العود الملكي | مخمرية للجسم | مخمرية رجالي | مخمرية فيونكة | مخمرية رنة خلخال | مخمرية للجسم للنساء | مخمرية بودي | مخمرية يارا | مخمرية مايت سينما
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
