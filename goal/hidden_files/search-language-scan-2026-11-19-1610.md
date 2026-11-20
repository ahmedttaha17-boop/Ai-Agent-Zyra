# Search Language Scan — 2026-11-19 16:10 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 15:49 EET firefox file (hidden_files/search-scans/scan-2026-11-19-1549.json) + space-stored suggestions (getopsstate at run start; lastScanAt 13:51:10Z = 15:51 EET run, content verified = 15:49 firefox snapshot). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T14:15:24Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs space-stored snapshot (3 swaps — all known/promoted items, NOT brand-new)
- «يوريا»: «يوريا الدم» back in the firefox top 10 (position 10), pushing «يوريا ٣٠٪» out. NOT new: «يوريا الدم» was in the firefox top 10 at 15:10 and 15:30 — same flip-flop seen at 15:10. «يوريا ٣٠٪» stays visible in the chrome extended list (position 12) and is already opportunity 1.
- «زبدة الشيا»: «زبدة الشيا للبشرة» entered the firefox top 10 (position 8), pushing «زبدة الشيا الاصلية» out. NOT new: «للبشرة» was already in the chrome extended list at 15:10 and 15:30 (position 10) — it only crossed into the firefox top 10 now. Generic shea variant of «للوجه»; «الاصلية» stays in the chrome extended list (position 10). No new product/problem.
- «مخمرية»: «مخمرية فيونكة» entered the firefox top 10 (position 5), pushing «مخمرية لمسة حرير» out. NOT a new observation: this run's chrome diff vs prev.json was 0 new / 0 gone, i.e. «فيونكة» was already in the extended list at run start — a top-10 promotion, same convention as the 15:30 «عند النساء» call. It is a مخمرية brand/scent variant inside an already-tracked generic keyword, not a new product or problem Zyra doesn't carry; «لمسة حرير» stays in the chrome extended list (position 10). No duplicate observation created. No new product opportunity.

## Order-only changes (no set change)
- Firefox: «علاج جلد الوزة» (من الصيدلية 9→6، بالليزر 6→7، تحت الابط 7→8، في المناطق الحساسة 8→9 — same rotation seen at 13:30/13:50/14:31/15:10). «سيلوليت» (الافخاذ 5→4، بالانجليزي 4→5 — reverses the 15:10 move). «يوريا» (صن بلوك 9→8، سيكا 10→9). «مخمرية» (مخمرية 2→1، العود الملكي 1→2، رنة خلخال 5→6، بودي 6→8، يارا 8→9، مايت سينما 9→10).
- Chrome: 0 new / 0 gone on all 12 keywords (diff vs prev.json at run start).

## Extended-list check (chrome, 15 results)
Chrome 15-set unchanged vs the previous chrome snapshot. Items in positions 11–15 all already known/covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (thinking 18 carousel, obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18)، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15. Nothing new to record.

## Bookkeeping notes
- Provenance flag for the next run: this run's chrome diff vs prev.json printed empty, but a direct re-diff of this run's chrome results against the surviving 15:30 chrome file (search-scans/scan_2026-11-19T133051.json) shows exactly one change — «مخمرية فيونكة» new, «مخمرية خمرة» gone. The diff code itself was verified correct by that re-diff, so prev.json at 16:09 already contained «فيونكة»: the 15:49 run (curl-based, firefox-only file) must have refreshed prev.json from a chrome fetch without leaving a chrome snapshot file. No chrome file survives from 15:49, so that inference is not independently checkable — the «فيونكة» call above rests on the runtime-read prev.json, not on a surviving file. Next run: if prev.json and the last chrome snapshot file disagree again, note it the same way.
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T16-10-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-1609.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T141051.json; 10-result file hidden_files/search-scans/scan-2026-11-19-1610.json; prev.json refreshed to this run's chrome results.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | الافخاذ | بالانجليزي | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج صن بلوك | يورياج سيكا | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | للبشرة | افريكانا | الحواج
- مخمرية: مخمرية | العود الملكي | للجسم | رجالي | فيونكة | رنة خلخال | للجسم للنساء | بودي | يارا | مايت سينما
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
