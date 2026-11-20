# Search Language Scan — 2026-11-19 15:10 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched, 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 14:31 EET firefox file (search-language/scan-2026-11-19T14-31-EET.json) + space-stored suggestions (getopsstate at run start; lastScanAt 12:51:21Z = 14:51 EET run, content = hidden_files/search-scans/scan-2026-11-19-1450.json). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T13:12:55Z for all 12, stored suggestions match this run's firefox snapshot.

## Change vs space-stored snapshot (3 swaps — all known flip-flops, NOT brand-new)
- «علاج جلد الوزة»: «علاج جلد الوزة في الوجه» is back in the firefox top 10 (position 10), pushing «علاج جلد الوزة في منطقة البكيني» out.
- «كريم جلد الوزة»: «كريم ضد جلد الوزة» is back in the firefox top 10 (position 10), pushing «كريم علاج جلد الوزة» out.
- «يوريا»: «يوريا الدم» is back in the firefox top 10 (position 10), pushing «يوريا ٣٠٪» out.
- NOT new observations: «في الوجه» was already in the firefox top 10 at 14:31 and is already covered by opportunity 4; «في منطقة البكيني» appeared only at 14:50 and is the same body-area theme as «في المناطق الحساسة»; «كريم ضد جلد الوزة» and «يوريا الدم» were both in the 14:31 top 10; «كريم علاج جلد الوزة» appeared only at 14:50 and is a generic phrasing; «يوريا ٣٠٪» is opportunity 1 and stays visible in the chrome extended list (positions 11–15). No duplicate observation created. No new product opportunity.

## Order-only changes (no set change)
- Firefox: «سيلوليت» (الافخاذ 5→4، بالانجليزي 4→5). «مخمرية» (مخمرية 2→1، العود الملكي 1→2، للجسم للنساء 7→6، بودي 6→7).
- Chrome: «علاج جلد الوزة» (من الصيدلية 8→5، بالليزر 5→6، تحت الابط 6→7، في المناطق الحساسة 7→8 — same ordering rotation seen at 13:30/13:50/14:31).

## Extended-list check (chrome, 15 results)
Chrome diff vs prev.json: 0 new / 0 gone on all 12 keywords. Items in positions 11–15 all already known/covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (thinking 18 carousel, obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18). Verified against the 14:31 chrome file that «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، and the Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15 were already in the extended list at 14:31 (the 14:31 note just didn't enumerate them) — not new. Nothing new to record.

## Bookkeeping notes
- This run's script initially pointed PREV_SPACE at the wrong directory (zyra-marketing-intelligence-agent/search-scans instead of hidden_files/search-scans), so the first space-diff computation errored; the path was fixed in scan_now_1509.py and the scan JSON patched with the correct space diff. The firefox-file and chrome diffs were unaffected.
- The 14:50 run recorded into the space (lastScanAt 12:51:21Z) and left a 10-result file in hidden_files/search-scans, but no firefox baseline file in search-language/ and no md note — same class of bookkeeping gap as the 14:10 run noted at 14:31. Also: a 14:10 chrome file (search-scans/scan-2026-11-19-1410-eet.json) now exists although the 14:31 note said no 14:10 files existed — possibly written retroactively or missed by the earlier check. Minor, no data impact.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | الافخاذ | بالانجليزي | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج سيكا | يورياج صن بلوك | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: مخمرية | العود الملكي | للجسم | رجالي | رنة خلخال | للجسم للنساء | بودي | يارا | مايت سينما | لمسة حرير
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة

Files: scan JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-1510.json; canonical firefox baseline for next run ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T15-10-EET.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T131050.json; prev.json refreshed to the chrome results.
