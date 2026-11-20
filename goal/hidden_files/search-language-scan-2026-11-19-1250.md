# Search Language Scan — 2026-11-19 12:50 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched, 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 12:10 EET firefox file (search-language/scan-2026-11-19T12-10-EET.json) + space-stored suggestions recorded 12:30 EET (lastScanAt 10:30:33Z). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T10:51:43–44Z for all 12, stored suggestions match this run's firefox snapshot.

## Ops note — 12:30 run left no local trace
At run start, the space showed lastScanAt 10:30:33Z with suggestion orders differing from the 12:10 file («علاج جلد الوزة»: من الصيدلية 6th / بالليزر 7th; «سيلوليت»: الافخاذ 4th / بالانجليزي 5th — same sets, different order), i.e. the 12:29 cron run recorded scans in the space but left NO local scan JSON or run md (find for files newer than 10:12 UTC returned nothing). This run's diff was therefore computed against BOTH the 12:10 file and the space-stored 12:30 suggestions. No data was lost (the space holds the 12:30 snapshot), but the missing 12:30 run log is a gap in the local audit trail.

## Change vs previous snapshot (1, re-entry — NOT brand-new)
- «زبدة الشيا»: «زبدة الشيا للبشرة» is back in the top 10 (position 8), replacing «زبدة الشيا الاصلية» which dropped out.
- NOT a new observation: «للبشرة» was present at 11:50, dropped out at 12:10, and is back at 12:50 — the «الاصلية» ↔ «للبشرة» pair keeps swapping in/out of the top 10 under «زبدة الشيا» (known flip-flop; «الاصلية» already covered by obs 3/13/27). No duplicate observation created. NOT a product opportunity: shea butter is already a Zyra component (KP routine); «للبشرة» is a use qualifier, not a new product/problem.

## Order-only changes (no set change)
- Firefox vs space 12:30: «علاج جلد الوزة» (بالليزر 7→6، تحت الابط 8→7، في المناطق الحساسة 9→8، من الصيدلية 6→9)، «سيلوليت» (بالانجليزي 5→4، الافخاذ 4→5). Vs the 12:10 file there is NO order change for these two — the 12:50 order reverted to the 12:10 order; the 12:30 space order had matched the 11:50 order. Google appears to rotate between two orderings for these keywords.
- Chrome: «سيلوليت» (الافخاذ 4→3، بالانجليزي 3→4)، «يوريا» (يورياج صن بلوك 8→7، يورياج سيكا 7→8)، «زبدة الشيا» (امتنان 4→3، الخام في الصيدليات 5→4، للوجه 6→5، الخام 3→6، للبشرة 10→7، افريكانا 7→8، الاصلية 8→10)، «مخمرية» (للجسم للنساء 6→5، بودي 5→6، body 13→12، بلوب 14→13، العروسة 12→14).

## Extended-list check (chrome, 15 results)
Chrome diff vs prev.json (refreshed 12:10): 0 new / 0 gone on all 12 keywords. Items in positions 11–15 all already known/covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (thinking 18 carousel, obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18). Nothing new to record.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | بالليزر | تحت الابط | في المناطق الحساسة | من الصيدلية | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج صن بلوك | يورياج سيكا | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | للبشرة | افريكانا | الحواج
- مخمرية: العود الملكي | للجسم | رجالي | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما | لمسة حرير
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة

Files: scan JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-1250.json; canonical firefox baseline for next run ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T12-50-EET.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T105036.json; prev.json refreshed to the chrome results.
