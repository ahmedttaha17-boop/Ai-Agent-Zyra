# Search Language Scan — 2026-11-19 21:11 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 20:49 EET run JSON (hidden_files/search-language/scan-2026-11-19-2049.json: firefox results) + space-stored suggestions (getopsstate at run start; lastScanAt 18:50:34Z = 20:50 EET run). Chrome compared vs the 20:29 run's chrome_keywords (last chrome snapshot). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T19:13:17Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- Firefox top-10 sets identical to 20:49 for 6 of 12 keywords. Order-only flips in 5 keywords (rotation noise, not signal):
  - «علاج جلد الوزة»: «من الصيدلية» 9→6، «بالليزر» 6→7، «تحت الابط» 7→8، «في المناطق الحساسة» 8→9 (same oscillation documented in the 20:09/20:29 runs).
  - «سيلوليت»: «الافخاذ» 5→4، «بالانجليزي» 4→5.
  - «يوريا»: «سيكا» 9→8، «صن بلوك» 8→9 (same two-state oscillation documented in the 19:29/19:49/20:09/20:29 runs).
  - «مخمرية»: bare keyword 2→1، «العود الملكي» 1→2، «للجسم للنساء» 8→7، «بودي» 7→8.
  - «علاج السيلوليت»: bare keyword back at #1 (it is the query itself, not a new suggestion); «عند النساء» out of the firefox top 10 — verified known rotator, present in the 13:30–19:10 snapshots, absent 20:29, present 20:49, absent again now. No action.
- «زبدة الشيا»: «زبدة الشيا للبشرة» back in the firefox top 10 (position 10), «زبدة الشيا الخام» out.
  - «زبدة الشيا للبشرة» is NOT new: verified known rotator — present in the 2026-11-18 baseline and in the 20:09/20:29 chrome 15-sets, as documented in the 20:29 run log. No observation.
  - «زبدة الشيا الخام» leaving is rotation; it was in the firefox top 10 since the 20:29 run and is a long-known rotator. No action.

## Extended-list check (chrome, 15 results)
Chrome 15-set unchanged vs the 20:29 chrome set except «زبدة الشيا» (rotation, see below):
- «زبدة الشيا»: «زبدة الشيا للشفايف» back in the chrome 15-set (position 15), «زبدة الشيا الخام» out; everything else shifted up one slot.
  - «زبدة الشيا للشفايف» is NOT new: verified present in the 19:29 and 19:49 runs (firefox baselines scan-2026-11-19T19-31/T19-50-EET.json + chrome scan_2026-11-19T173137.json). Known rotator that dropped out of the 20:09/20:29 sets and is back. No observation, no opportunity.
- All other chrome 11–15 items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (thinking 18 carousel, obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18)، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T21-11-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-2109.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T191112.json; 10-result file hidden_files/search-scans/scan-2026-11-19-2111.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_2109.py (written fresh for this run; prev firefox = 2049 file key "results", prev chrome = 2029 file chrome_keywords — diffs computed in-script and verified against the JSON).
- Note: the 20:49 run recorded its snapshot in the space (lastScanAt 18:50:34Z) but left no md run report; its JSON (scan-2026-11-19-2049.json) was used as this run's previous snapshot.
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | الافخاذ | بالانجليزي | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج سيكا | يورياج صن بلوك | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | افريكانا | الاصلية | الحواج | للبشرة
- مخمرية: مخمرية | مخمرية العود الملكي | مخمرية للجسم | مخمرية رجالي | مخمرية فيونكة | مخمرية رنة خلخال | مخمرية للجسم للنساء | مخمرية بودي | مخمرية يارا | مخمرية مايت سينما
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
