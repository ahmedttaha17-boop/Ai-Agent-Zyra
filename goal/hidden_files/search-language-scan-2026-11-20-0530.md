# Search Language Scan — 2026-11-20 05:30 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (extended check).
Previous snapshot: 05:10 EET scan JSON (hidden_files/search-language/scan-2026-11-20-0510.json) for firefox and chrome. Recorded via recordkeywordscan for all 12 keyword ids; verified via getopsstate: lastScanAt now 2026-11-20T03:31:50Z for all 12, stored suggestions match this run's firefox snapshot exactly.

## Change vs previous snapshot (firefox)
No brand-new suggestion in the record — no new observation created, no new product opportunity.
- «زبدة الشيا»: «للبشرة» back in (position 8), «الاصلية» out of the firefox top 10. «افريكانا» 8→9. «للبشرة» was in the top 10 at 04:49 and in chrome at 05:10; «الاصلية» was in at 05:10 (position 9) and is still present in chrome's 15-item list this run (position 8) — a top-10 cutoff rotation, not demand vanishing.
- «علاج جلد الوزة»: order-only rotation («من الصيدلية» 6→9, «بالليزر» 7→6, «تحت الابط» 8→7, «في المناطق الحساسة» 9→8). No new/gone.
- The other 10 keywords: identical top-10 sets to 05:10.

## Observation #76 confirmation — FAILED
Observation #76 («زبدة الشيا الاصلية», first seen 04:29) required the suggestion to appear in the next TWO scans before any step. It returned at 05:10 (1 of 2 confirmation scans) but dropped out of the firefox top 10 at 05:30 — so the two-consecutive-scan confirmation did NOT hold. It remains visible in chrome's longer list, i.e. still a rotation signal, not a confirmed one. NOT bumped (a bump would falsely record a recurrence); the failed confirmation is recorded here and in the space activity log (id 718). Watch the next scans: if «الاصلية» re-enters the firefox top 10 and holds for two consecutive scans, the confirmation restarts from that re-entry.

## Rotation lesson recurrence
Bumped learning observation #21 (تدوير اقتراحات البحث; occurrences now 4): this run is another clean recurrence — the «الاصلية»/«للبشرة» swap reversed within one scan, and the 02:49 signals («عند النساء»/«بالاعشاب» under «علاج السيلوليت») stay out of the firefox top 10 while remaining in chrome's 14-item list. Single-scan signals remain unreliable; the firefox top-10 cutoff is the main mover.

## Chrome check
Only order changes vs 05:10 chrome: «سيلوليت» (بالانجليزي 4→3, الافخاذ 3→4), «يوريا» (يورياج سيكا 8→7, يورياج صن بلوك 7→8), «مخمرية» (بودي 7→6, للجسم للنساء 6→7, العروسة 15→13, body 13→14, بلوب 14→15). No new/gone in chrome.

## Bookkeeping notes
- Run files: hidden_files/search-language/scan-2026-11-20-0530.json (run JSON incl. diffs), scan_now_0529.py (script; prev paths updated to scan-2026-11-20-0510.json for both clients — note the stale scan_now_0529.py from the Nov 19 05:29 run pointed at the nonexistent scan-2026-11-19-0510.json; overwritten).
- Space activity log entry id 718. Observation bumped: #21 only (#76 deliberately not bumped — see above).
- No tracking timeline entry: routine rotation-only scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: علاج جلد الوزة | بالفازلين | في المؤخرة | بزيت جونسون | في البيت | بالليزر | تحت الابط | في المناطق الحساسة | من الصيدلية | في الوجه
- كريم جلد الوزة: كريم جلد الوزة | من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: سيلوليت | الرجل | رول | الافخاذ | بالانجليزي | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: كريم سيلوليت | بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: علاج السيلوليت | في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج سيكا | يورياج صن بلوك | يوريا الدم
- كريم يوريا للجسم: كريم يوريا للجسم | للجسم النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: سكراب جسم | وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: زبدة الشيا | للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | للبشرة | افريكانا | الحواج
- مخمرية: مخمرية العود الملكي | مخمرية | للجسم | رجالي | فيونكة | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
