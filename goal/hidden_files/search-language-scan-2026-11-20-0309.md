# Search Language Scan — 2026-11-20 03:12 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 02:49 EET firefox-only run JSON (hidden_files/search-language-scans/scan-2026-11-20-0249.json, key keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 00:52:31Z = 02:52 EET run, matching the 02:49 firefox snapshot). Chrome previous: 02:32 EET run JSON (hidden_files/search-language/scan-2026-11-20-0229.json, key chrome_keywords). Recorded via recordkeywordscan for all 12 keyword ids (corrected mapping: 1=جلد الوزة, 2=علاج جلد الوزة, 3=كريم جلد الوزة, 4=كريم سيلوليت, 5=علاج السيلوليت, 6=سيلوليت, 7=ملح سيوة, 8=يوريا, 9=مخمرية, 10=كريم يوريا للجسم, 11=سكراب جسم, 12=زبدة الشيا); verified via getopsstate: lastScanAt now 2026-11-20T01:14:12–01:14:30Z (03:14 EET), stored suggestions match this run's firefox snapshot per keyword id for all 12, corrected 4/5 mapping intact. Space activity logged (see logactivity, section «لغة البحث»).

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- Firefox top-10 sets identical to 02:49 for 9 of 12 keywords. Changes in 3 keywords — all exact reversals of the 02:49 changes (rotation noise, not signal):
  - «علاج جلد الوزة»: «علاج جلد الوزة في الوجه» back in (position 10)، «علاج جلد الوزة في منطقة البكيني» out of the firefox top 10; «في المناطق الحساسة» 3→8 with the rest shifting up.
    - «في الوجه» is NOT new: opportunity 4 (recorded 2026-11-19 03:11 EET); it was in the 02:32 snapshot, out at 02:49, back now. No observation.
    - «في منطقة البكيني» leaving is rotation; recorded as market observations 52/55 (Nov 19) and 71 (02:49 run). No action.
  - «علاج السيلوليت»: «علاج السيلوليت في الجسم» and «علاج السيلوليت في الفخذين» back in (positions 3, 5)، «علاج السيلوليت عند النساء» and «علاج السيلوليت بالاعشاب» out of the firefox top 10; «في المؤخرة» 3→4، «بالقهوة» 4→6، «في المؤخرة طبيعيا» 5→7، «بالرياضة» 6→8، «بالليزر» 7→9، «الاحمر» 8→10.
    - «في الجسم» / «في الفخذين» are NOT new: long-standing items, in the 02:32 snapshot, out at 02:49, back now. No observation.
    - «عند النساء» leaving is rotation; recorded as market observation 61 (20:50 EET) and 72 (02:49 run). «بالاعشاب» leaving is rotation; recorded as market observation 73 (02:49 run) — it also appeared in the firefox top 10 only once before (00:50 EET one-off scan), otherwise lives in the chrome 15-set (position 11 this run, unchanged). No action.
  - «سيلوليت»: order-only flip («بالانجليزي» 5→4، «الافخاذ» 4→5 — same swap as 02:49, reversed direction).
- Chrome 15-sets identical to 02:32 for 10 of 12 keywords; order-only flips in 2 («سيلوليت»: «الافخاذ» 4→3، «بالانجليزي» 3→4; «يوريا»: «يورياج سيكا» 8→7، «يورياج صن بلوك» 7→8). No new or gone items in any keyword. All extended items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما»، «سيلوليت الارداف»، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك»، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (observation 17)، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15 (observation 13/16), «مخمرية خمرة» (angle 71), «جلد الوزة في الاندر ارم» / «عند البنات» / «في الرقبة» / «في الجسم» (area language, observation 2). Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-20T03-12-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-20-0309.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-20T011213.json; 10-result file hidden_files/search-scans/scan-2026-11-20-0312.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_0309.py (adapted from scan_now_0229.py; prev firefox = 0249 file, prev chrome = 0229 file — diffs computed in-script and verified against the JSON).
- Recording: all 12 recordkeywordscan calls returned ok in two parallel batches of 6; verification via getopsstate confirmed all 12 ids updated to 01:14:12–01:14:30Z with matching stored suggestions and the corrected 4/5 mapping intact.
- Note: the 02:49 EET run left its record as activity id 642 + market observations 71–73 (no md run log); this run's md log restores the per-run record from 03:09 onward.
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: علاج جلد الوزة | بالفازلين | في المؤخرة | بزيت جونسون | في البيت | بالليزر | تحت الابط | في المناطق الحساسة | من الصيدلية | في الوجه
- كريم جلد الوزة: كريم جلد الوزة | من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: سيلوليت | الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: كريم سيلوليت | بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: علاج السيلوليت | في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج صن بلوك | يورياج سيكا | يوريا الدم
- كريم يوريا للجسم: كريم يوريا للجسم | النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: سكراب جسم | وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: زبدة الشيا | للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | للبشرة | افريكانا | الحواج
- مخمرية: مخمرية العود الملكي | مخمرية | للجسم | رجالي | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما | لمسة حرير
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
