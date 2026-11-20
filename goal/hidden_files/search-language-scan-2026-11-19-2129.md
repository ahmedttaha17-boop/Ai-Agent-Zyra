# Search Language Scan — 2026-11-19 21:30 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 21:11 EET run JSON (hidden_files/search-language/scan-2026-11-19-2109.json: keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 19:13:17Z = 21:13 EET run). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T19:32:12–55Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- Firefox top-10 sets identical to 21:11 for 9 of 12 keywords. Order-only flips in 2 keywords (rotation noise, not signal):
  - «سيلوليت»: «بالانجليزي» 5→4، «الافخاذ» 4→5 (reverse of the 21:11 flip — same oscillation).
  - «يوريا»: «صن بلوك» 9→8، «سيكا» 8→9 (same two-state oscillation documented in the 19:29/19:49/20:09/20:29/21:11 runs).
- «زبدة الشيا»: «زبدة الشيا الخام» back in the firefox top 10 (position 7)، «زبدة الشيا الاصلية» out; «للبشرة» 10→8، «افريكانا» 7→9، «الحواج» 9→10.
  - «زبدة الشيا الخام» is NOT new: verified known rotator — present in the firefox top 10 at 20:29 and 20:49 (position 7), absent 21:11, back now. No observation.
  - «زبدة الشيا الاصلية» leaving is rotation; still present in the chrome 15-set (position 8). No action.

## Extended-list check (chrome, 15 results)
- «زبدة الشيا»: «زبدة الشيا الخام» back in the chrome 15-set (position 7)، «زبدة الشيا للشفايف» out; everything else shifted down one slot.
  - «زبدة الشيا للشفايف» is NOT new/lost: verified known rotator — present in the 19:29 and 19:49 runs, absent 20:09/20:29, back 21:11, out again now. No observation, no opportunity.
- «مخمرية»: order-only flips («بودي» 7→6، «للجسم للنساء» 6→7; «العروسة» 15→13، «body» 13→14، «بلوب» 14→15). No new.
- All other chrome 11–15 items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18)، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T21-30-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-2129.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T193049.json; 10-result file hidden_files/search-scans/scan-2026-11-19-2130.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_2129.py (written fresh for this run; prev firefox + chrome both from the 2109 file, keys "keywords"/"chrome_keywords" — diffs computed in-script and verified against the JSON).
- Recording hiccup: the first parallel recordkeywordscan batch returned ok for all 12, but verification showed id 7 (ملح سيوة) still on the old lastScanAt (19:13:17Z) — re-recorded individually and verified updated to 19:32:55Z. Ids 2 and 6 hit transient «space worker overloaded» in the batch and were retried successfully. Lesson for later runs: verify lastScanAt for every id after the batch, don't trust the batch ok alone.
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج صن بلوك | يورياج سيكا | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | للبشرة | افريكانا | الحواج
- مخمرية: مخمرية | مخمرية العود الملكي | مخمرية للجسم | مخمرية رجالي | مخمرية فيونكة | مخمرية رنة خلخال | مخمرية للجسم للنساء | مخمرية بودي | مخمرية يارا | مخمرية مايت سينما
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
