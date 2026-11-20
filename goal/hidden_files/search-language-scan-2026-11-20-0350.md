# Search Language Scan — 2026-11-20 03:50 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (extended check).
Previous snapshot: 03:29 EET snapshot JSON (hidden_files/search-language/snapshot-2026-11-20-0329.json) for firefox; 03:09 EET run JSON (hidden_files/search-language/scan-2026-11-20-0309.json, key "chrome_keywords") for chrome. Recorded via recordkeywordscan for all 12 keyword ids; verified via getopsstate: lastScanAt now 2026-11-20T01:51:32–01:52:08Z for all 12, stored suggestions match this run's firefox snapshot exactly.

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- Firefox top-10 sets identical to 03:29 for all 12 keywords; only minor order swaps (rotation noise, not signal):
  - «سيلوليت»: «الافخاذ» 5→4, «بالانجليزي» 4→5.
  - «يوريا»: «صن بلوك» 9→8, «سيكا» 8→9.
  - «مخمرية»: «مخمرية» 2→1, «العود الملكي» 1→2, «للجسم للنساء» 7→6, «بودي» 6→7.
- Chrome 13–15 sets: identical to 03:09 for all 12 keywords — zero new, zero gone, zero order changes.
- Note: a naive chrome-vs-firefox-snapshot diff would have shown many "new" items; that is a client artifact (chrome returns 13–15 results vs firefox 10, different ordering), not real change. Chrome must always be diffed against the previous chrome run, firefox against the previous firefox snapshot.

## Recording correction this run
The first recordkeywordscan batch had the order wrong for 2 keywords (typed from the previous snapshot instead of the fresh fetch): «يوريا» (id 8) and «مخمرية» (id 9). Both were re-recorded with the exact fetched order and re-verified via getopsstate (all 12 match). Lesson: always record from the run JSON, never retype from the previous snapshot.

## Bookkeeping notes
- Run files: hidden_files/search-language/scan-2026-11-20-0350.json (run JSON incl. diffs), snapshot-2026-11-20-0350.json (firefox snapshot), scan_now_0349.py (script).
- Space activity log entry id 682.
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: علاج جلد الوزة | بالفازلين | في المؤخرة | بزيت جونسون | في البيت | بالليزر | تحت الابط | في المناطق الحساسة | من الصيدلية | في الوجه
- كريم جلد الوزة: كريم جلد الوزة | من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: سيلوليت | الرجل | رول | الافخاذ | بالانجليزي | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: كريم سيلوليت | بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: علاج السيلوليت | في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج صن بلوك | يورياج سيكا | يوريا الدم
- كريم يوريا للجسم: كريم يوريا للجسم | للجسم النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: سكراب جسم | وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: زبدة الشيا | للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | للبشرة | افريكانا | الحواج
- مخمرية: مخمرية | العود الملكي | للجسم | رجالي | رنة خلخال | للجسم للنساء | بودي | يارا | مايت سينما | لمسة حرير
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
