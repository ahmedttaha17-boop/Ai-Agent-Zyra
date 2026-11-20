# Search Language Scan — 2026-11-19 17:50 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 17:29 EET firefox file (hidden_files/search-language/scan-2026-11-19-1729.json) + space-stored suggestions (getopsstate at run start; lastScanAt 15:33:05Z = 17:33 EET run, content verified = 17:29 firefox snapshot). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T15:52:45–46Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs previous snapshot
One swap, a known/promoted item — NOT brand-new. No observation created. No new product opportunity.
- «زبدة الشيا»: «زبدة الشيا الاصلية» back in the firefox top 10 (position 9), pushing «زبدة الشيا للبشرة» out; «زبدة الشيا افريكانا» 9→8. NOT new: «الاصلية» was in the firefox top 10 at the 17:09 run and stayed in the chrome extended list (position 10 at 17:30). This is the same flip-flop: «للبشرة» in at 16:09, out at 16:30/16:49/17:09, back in at 17:29, out again at 17:49 — while «الاصلية» does the opposite. Both are known generic shea variants, no new product/problem.

## Order-only changes (no set change)
- Firefox «مخمرية»: bare «مخمرية» 2→1, «مخمرية العود الملكي» 1→2, «مخمرية للجسم للنساء» 8→7, «مخمرية بودي» 7→8. No new/gone.
- Chrome: 0 new / 0 gone on all 12 keywords (diff vs the 17:30 chrome file).

## Extended-list check (chrome, 15 results)
Chrome 15-set unchanged vs the 17:30 chrome file — prev.json now equals this run's chrome snapshot. Items in positions 11–15 all already known/covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (thinking 18 carousel, obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18)، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T17-50-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-1749.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T155006.json; 10-result file hidden_files/search-scans/scan-2026-11-19-1750.json; prev.json refreshed to this run's chrome results.
- Script-defect note: the sed-derived scan_now_1749.py initially pointed the firefox prev path at the not-yet-written 1749 file, so the in-script diff came back empty and was wrong. The diff was recomputed by hand against the 17:29 run JSON (firefox) and the 17:30 chrome file, and the run JSON's diff fields + previous_snapshot were patched with the true values. scan_now_1749.py was fixed in place (prev path → 1729, run-log path kept at 1749) so the next run's sed chain diffs against the right file.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج سيكا | يورياج صن بلوك | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: مخمرية | العود الملكي | للجسم | رجالي | فيونكة | رنة خلخال | للجسم للنساء | بودي | يارا | مايت سينما
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
