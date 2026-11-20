# Search Language Scan — 2026-11-19 20:10 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 19:49 EET run JSON (hidden_files/search-language/scan-2026-11-19-1949.json: keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 17:51:31Z = 19:51 EET run). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T18:11:33–34Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- Firefox top-10 sets identical to 19:49 for 9 of 12 keywords. Order-only flips in 2 keywords, the same two-state oscillation documented in the 19:29/19:49 runs (rotation noise, not signal):
  - «يوريا»: «سيكا» 9→8، «صن بلوك» 8→9.
  - «مخمرية»: «العود الملكي» 2→1، «مخمرية» 1→2، «بودي» 8→7، «للجسم للنساء» 7→8.
- «زبدة الشيا»: «زبدة الشيا للبشرة» back in the firefox top 10 (position 8), «زبدة الشيا الاصلية» out; «افريكانا» 8→9.
  - «زبدة الشيا للبشرة» is NOT new: verified known rotator — 106 occurrences across today's scan JSONs, present in the 19:49 chrome 15-set (position 7) and in the 2026-11-18 baseline. No observation.
  - «زبدة الشيا الاصلية» leaving the firefox top 10 is rotation; it stays in the chrome 15-set (position 8). No action.

## Extended-list check (chrome, 15 results)
Chrome 15-set unchanged vs the 19:49 chrome set except order-only flips in 3 keywords (rotation noise):
- «يوريا»: «صن بلوك» 8→7، «سيكا» 7→8.
- «زبدة الشيا»: «الخام» 6→3، «امتنان» 3→4، «الخام في الصيدليات» 4→5، «للوجه» 5→6، «افريكانا» 8→7، «الاصلية» 10→8، «للبشرة» 7→10.
- «مخمرية»: «بودي» 7→6، «للجسم للنساء» 6→7، «العروسة» 15→13، «body» 13→14، «بلوب» 14→15.
- All other chrome 11–15 items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (thinking 18 carousel, obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18)، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T20-09-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-2009.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T180959.json; 10-result file hidden_files/search-scans/scan-2026-11-19-2009.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_2009.py. NOTE — the script's first printed DIFF_FX/DIFF_CH were empty because a sed slip rewrote the previous-snapshot path to the not-yet-existing 2009 file, so the prev load failed silently; the diffs were recomputed independently from the 1949 vs 2009 JSONs and written into the run JSON with a note. The script file itself was fixed (prev path = 1949) — the next run's copy/sed must only swap the run-log filename and the prev filename in their own places, not globally.
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | سيكا | صن بلوك | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | للبشرة | افريكانا | الحواج
- مخمرية: العود الملكي | مخمرية | للجسم | رجالي | فيونكة | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
