# Search Language Scan — 2026-11-20 01:13 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: firefox 00:29 EET run JSON (hidden_files/search-language/scan-2026-11-20-0029.json, key keywords) + chrome 00:50 EET snapshot (hidden_files/search-language/scan-2026-11-19T22-50-12Z.json, key keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 22:53:43Z = 00:53 EET run). Recorded via recordkeywordscan for all 12 keyword ids (corrected mapping: 1=جلد الوزة, 2=علاج جلد الوزة, 3=كريم جلد الوزة, 4=كريم سيلوليت, 5=علاج السيلوليت, 6=سيلوليت, 7=ملح سيوة, 8=يوريا, 9=مخمرية, 10=كريم يوريا للجسم, 11=سكراب جسم, 12=زبدة الشيا); verified via getopsstate: lastScanAt now 2026-11-19T23:14:31–47Z for all 12, stored suggestions match this run's firefox snapshot per keyword id.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- Firefox top-10 sets identical to 00:29 for 10 of 12 keywords. The only changes:
  - «علاج جلد الوزة»: order flips only — «بالليزر» 7→6، «تحت الابط» 8→7، «في المناطق الحساسة» 9→8، «من الصيدلية» 6→9 (same 4-item oscillation documented in the 21:49/22:51 runs). Rotation noise, not signal.
  - «زبدة الشيا»: «زبدة الشيا الاصلية» re-entered the top 10 at #9, «زبدة الشيا للبشرة» dropped out; «افريكانا» 9→8.
    - «زبدة الشيا الاصلية» is NOT new: verified known rotator — present in the firefox top 10 in the 21:49 run (#9), in the chrome 15-set at 00:29 (#8) and 00:50 (#8), and in this run's chrome set (#8); it simply rotated back in. No observation.
    - «زبدة الشيا للبشرة» leaving is rotation; still present in the chrome 15-set (position 10). No action.
- Chrome 15-sets identical to 00:50 for 11 of 12 keywords; the only change is the «زبدة الشيا» order flip (same oscillation as the 00:29 run: «الخام» 6→3, «امتنان» 3→4, «الخام في الصيدليات» 4→5, «للوجه» 5→6, «افريكانا» 8→7, «الاصلية» 10→8, «للبشرة» 7→10). No new or gone items in any keyword. All extended items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «علاج جلد الوزة في منطقة البكيني» (observation — body-area pattern)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما»، «سيلوليت الارداف»، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك»، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام»، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-20T01-13-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-20-0109.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T231321.json; 10-result file hidden_files/search-scans/scan-2026-11-20-0113.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_0109.py (adapted from scan_now_0029.py; prev firefox from the 0029 file, prev chrome from the 00:50 snapshot scan-2026-11-19T22-50-12Z.json — diffs computed in-script and verified against the JSON).
- Recording: all 12 recordkeywordscan calls returned ok in two parallel batches of 6; verification via getopsstate confirmed all 12 ids updated to 23:14:31–47Z with matching stored suggestions.
- SPACE FIX: the 00:50/00:53 run had stored the chrome 15-lists with keyword ids 4/5 swapped (id 4 «كريم سيلوليت» held the «علاج السيلوليت» list and vice versa). This run's recording restores the correct per-id mapping (firefox snapshot, corrected mapping) — verified in getopsstate after recording.
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
- زبدة الشيا: زبدة الشيا | للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: مخمرية | مخمرية العود الملكي | مخمرية للجسم | مخمرية رجالي | فيونكة | رنة خلخال | للجسم للنساء | بودي | يارا | مايت سينما
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
