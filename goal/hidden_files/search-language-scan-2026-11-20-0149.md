# Search Language Scan — 2026-11-20 01:50 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 01:29 EET run JSON (hidden_files/search-language/scan-2026-11-20-0129.json, keys keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 23:31:48–23:32:05Z = 01:31–01:32 EET run). Recorded via recordkeywordscan for all 12 keyword ids (corrected mapping: 1=جلد الوزة, 2=علاج جلد الوزة, 3=كريم جلد الوزة, 4=كريم سيلوليت, 5=علاج السيلوليت, 6=سيلوليت, 7=ملح سيوة, 8=يوريا, 9=مخمرية, 10=كريم يوريا للجسم, 11=سكراب جسم, 12=زبدة الشيا); verified via getopsstate: lastScanAt now 2026-11-19T23:52:53Z (ids 1–6) and 2026-11-19T23:53:10Z (ids 7–12), stored suggestions match this run's firefox snapshot per keyword id, corrected 4/5 mapping intact.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- Firefox top-10 sets identical to 01:29 for 9 of 12 keywords. Changes in 3 keywords (rotation noise, not signal):
  - «علاج جلد الوزة»: «من الصيدلية» 6→9، «بالليزر» 7→6، «تحت الابط» 8→7، «في المناطق الحساسة» 9→8 (same 4-item oscillation documented in the 21:49/22:51/01:09/01:29 runs).
  - «مخمرية»: «العود الملكي» 2→1، «مخمرية» 1→2، «بودي» 8→7، «للجسم للنساء» 7→8 (same oscillation documented in the 21:49 run).
  - «زبدة الشيا»: «زبدة الشيا للبشرة» back in the firefox top 10 (position 8)، «زبدة الشيا الاصلية» out; «افريكانا» 8→9.
    - «زبدة الشيا للبشرة» is NOT new: verified known rotator — present in the chrome 15-set at 01:29 (position 10) and in the firefox top 10 in earlier runs; it simply rotated back in. No observation.
    - «زبدة الشيا الاصلية» leaving is rotation; still present in this run's chrome 15-set (position 8, unchanged vs 01:29). No action.
- Chrome 15-sets identical to 01:29 for 11 of 12 keywords; the only change is «مخمرية» order flips («للجسم للنساء» 7→6، «بودي» 6→7، «body» 14→13، «بلوب» 15→14، «العروسة» 13→15 — order-only, items unchanged). No new or gone items in any keyword. All extended items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «علاج جلد الوزة في منطقة البكيني» (observation — body-area pattern)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما»، «سيلوليت الارداف»، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك»، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام»، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15 (observation 13). Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-20T01-50-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-20-0149.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T235055.json; 10-result file hidden_files/search-scans/scan-2026-11-20-0150.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_0149.py (adapted from scan_now_0129.py; prev firefox + chrome both from the 0129 file, keys "keywords"/"chrome_keywords" — diffs computed in-script and verified against the JSON).
- Recording: all 12 recordkeywordscan calls returned ok in two parallel batches of 6; verification via getopsstate confirmed all 12 ids updated to 23:52:53–23:53:10Z with matching stored suggestions and the corrected 4/5 mapping intact.
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
- زبدة الشيا: زبدة الشيا | للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | للبشرة | افريكانا | الحواج
- مخمرية: مخمرية العود الملكي | مخمرية | للجسم | رجالي | فيونكة | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
