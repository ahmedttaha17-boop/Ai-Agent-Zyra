# Search Language Scan — 2026-11-19 13:30 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched, 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 12:50 EET firefox file (search-language/scan-2026-11-19T12-50-EET.json) + space-stored suggestions recorded 13:10 EET (lastScanAt 11:10:06Z). Recorded via recordkeywordscan for all 12 keyword ids (1–12); verified: lastScanAt now 2026-11-19T11:31:59Z for all 12, stored suggestions match this run's firefox snapshot.

## Ops note — 13:09 run left no local trace
At run start, the space showed lastScanAt 11:10:06Z with suggestion orders differing from the 12:50 file («سيلوليت»: الافخاذ 4th / بالانجليزي 5th; «زبدة الشيا»: no «الخام», «الاصلية» 8th / «للبشرة» 10th — same sets as 12:50 except the shea trio), i.e. the 13:09 cron run recorded scans in the space but left NO local scan JSON or run md (find for files newer than 12:50 returned nothing). Same gap as the 12:30 run. This run's diff was therefore computed against BOTH the 12:50 file and the space-stored 13:10 suggestions. No data was lost (the space holds the 13:10 snapshot), but the missing 13:09 run log is a gap in the local audit trail.

## Change vs previous snapshot (2 re-entries — NOT brand-new)
- «علاج السيلوليت»: «علاج السيلوليت عند النساء» is back in the firefox top 10 (position 10), pushing the bare keyword «علاج السيلوليت» itself out of the top 10.
- NOT a new observation: «عند النساء» was already in the firefox top 10 at 05:10 and 09:50 today, then sat in the chrome extended list at 12:10/12:50 — a known flip-flop, not a first appearance. NOT a product opportunity: it is a qualifier («عند النساء») on a problem Zyra already covers (the Cellulite routine is for women); no new product/problem named.
- «زبدة الشيا»: «زبدة الشيا الاصلية» is back in the top 10 (position 9), replacing «زبدة الشيا للبشرة» which dropped out; «زبدة الشيا الخام» (7th) is also back vs the 13:10 space snapshot (it was present in the 12:50 file).
- NOT a new observation: the «الاصلية» ↔ «للبشرة» ↔ «الخام» trio keeps rotating in/out of the top 10 under «زبدة الشيا» (known flip-flop; «الاصلية» already covered by obs 3/13/27). No duplicate observation created. NOT a product opportunity: shea butter is already a Zyra component (KP routine); these are use/quality qualifiers, not a new product/problem.

## Order-only changes (no set change)
- Firefox vs both previous snapshots: «علاج جلد الوزة» (من الصيدلية 9→6، بالليزر 6→7، تحت الابط 7→8، في المناطق الحساسة 8→9) — reverted to the 11:50/12:30 ordering; Google keeps rotating between two orderings for this keyword. «سيلوليت» (بالانجليزي 5→4، الافخاذ 4→5 vs space 13:10; same rotation). «مخمرية» (bare «مخمرية» 2→1, «العود الملكي» 1→2, «للجسم للنساء» 7→6, «بودي» 6→7).
- Chrome: «يوريا» (يورياج سيكا 8→7، يورياج صن بلوك 7→8).

## Extended-list check (chrome, 15 results)
Chrome diff vs prev.json (refreshed 12:50): 0 new / 0 gone on all 12 keywords. Items in positions 11–15 all already known/covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما» (thinking 18 carousel, obs 38)، «سيلوليت الارداف» (obs 34)، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك» (obs 39)، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام» (obs 33/18). Nothing new to record.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر | عند النساء
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج صن بلوك | يورياج سيكا | يوريا الدم
- كريم يوريا للجسم: النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: مخمرية | العود الملكي | للجسم | رجالي | رنة خلخال | للجسم للنساء | بودي | يارا | مايت سينما | لمسة حرير
- ملح سيوة: الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة

Files: scan JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-19-1330.json; canonical firefox baseline for next run ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T13-30-EET.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-19T113031.json; prev.json refreshed to the chrome results.
