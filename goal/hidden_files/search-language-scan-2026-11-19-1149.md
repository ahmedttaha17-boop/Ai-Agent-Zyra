# Search Language Scan — 2026-11-19 11:49 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched, 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 2026-11-19 11:29 EET (space-stored suggestions). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T09:52:20Z for all 12.

## New suggestions (0)
No brand-new suggestions vs the 11:29 snapshot — set-wise identical across all 12 keywords. Only ordering changes («مخمرية» order; «يوريا كريم» now first under «يوريا», duplicate «يوريا» collapsed). No new observation, no new product opportunity this run.

## Caveat — prev.json was stale
`search-scans/prev.json` was last written 2026-11-18 23:50 UTC (01:50 EET), not at 11:29. A naive diff vs prev.json falsely flags «علاج جلد الوزة في الوجه» as new (it was already in the space's 11:29 stored snapshot) and «علاج جلد الوزة في منطقة البكيني» as gone. The correct baseline is the space's stored suggestions. prev.json has now been refreshed to the 11:49 chrome results. Also: `run_scan.py` hardcodes PREV to scan-2026-11-19T00-49-EET.json — do not use it for diffing; the firefox scan JSON (scan-2026-11-19T11-50-EET.json) is the canonical baseline file for the next run.

## Extended-list check (chrome, 15 results)
The chrome fetch is identical to the 01:50 EET chrome fetch (scan_2026-11-18T235059.json): 0 new / 0 gone on all 12 keywords. Items in positions 11–15 that the 10-result snapshot never shows — «سيلوليت و ليبوديما» (corroborates thinking 18's «سيلوليت ولا ليبوديما» carousel, already in the thinking pipeline), «كريم اليجون يوريا للجسم» (Alejon urea cream in search language — competitor signal, no observation created since not new this run), «يوريا 30» / «يوريا ٣٠٪» / «كريم يوريا ٣٠ للجسم» (already opportunity id 1), «علاج جلد الوزة والشعر تحت الجلد» (already opportunity id 3), «سيلوليت رول امازون» (already opportunity id 2) — all already known/covered; nothing new to record.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | بالليزر | تحت الابط | في المناطق الحساسة | من الصيدلية | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | الافخاذ | بالانجليزي | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج سيكا | يورياج صن بلوك | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | للبشرة | افريكانا | الحواج
- مخمرية: العود الملكي | للجسم | رجالي | رنة خلخال | للجسم للنساء | بودي | يارا | مايت سينما | لمسة حرير
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة

Files: firefox snapshot ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T11-50-EET.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T094957.json; prev.json refreshed to the chrome results.
