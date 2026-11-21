# Search Language Scan — 2026-11-20 05:10 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 13–15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (extended check).
Previous snapshot: 04:49 EET scan JSON (hidden_files/search-language/scan-2026-11-20-0449.json) for firefox; 03:50 EET run JSON (hidden_files/search-language/scan-2026-11-20-0350.json, key "chrome_keywords") for chrome. Recorded via recordkeywordscan for all 12 keyword ids; verified via getopsstate: lastScanAt now 2026-11-20T03:12:36–03:12:37Z for all 12, stored suggestions match this run's firefox snapshot exactly.

## Change vs previous snapshot (firefox)
No brand-new suggestion in the record — no new observation created, no new product opportunity.
- «علاج السيلوليت»: «في الجسم» and «في الفخذين» back in (absent only at 04:49); «عند النساء» and «بالاعشاب» out of the firefox top 10. All four are rotation: «في الجسم»/«في الفخذين» were in the top 10 in every scan 00:09–04:29 today; «عند النساء»/«بالاعشاب» were recorded as observations #73/#71 at 02:49 and persisted through 04:49. Both «عند النساء» and «بالاعشاب» are still present in chrome's 14-item list this run — the firefox exit is a top-10 cutoff rotation, not demand vanishing.
- «زبدة الشيا»: «الاصلية» back in (position 9), «للبشرة» out. «الاصلية» already has observations #68 (02:09) and #76 (04:29); it was absent only at 04:49. Bumped observation #76: return in the very next scan = 1 of the 2 confirmation scans #76 asked for (04:49 was absent, 05:10 present); needs to appear in the next scan too before any step.
- «مخمرية»: «فيونكة» back in (position 5), «لمسة حرير» out of the firefox top 10 (still in chrome's list). «فيونكة» was in the firefox top 10 at 00:09–02:29 today, absent 03:09–04:49 — a returning rotation item, not brand-new; no new observation. Chrome corroborates: «فيونكة» new vs 03:50 chrome, «خمرة» gone from chrome.
- «علاج جلد الوزة»: order-only rotation («من الصيدلية» 9→6, «بالليزر» 6→7, «تحت الابط» 7→8, «في المناطق الحساسة» 8→9). No new/gone.
- The other 8 keywords: identical top-10 sets to 04:49.

## Rotation lesson recurrence
Bumped observation #21 (تدوير اقتراحات البحث): this run is another clean recurrence — the 02:49 signals reversed out of the firefox top 10 at 05:10 while the 04:49 absences rotated back in, and chrome's longer lists still contain every "changed" item. Single-scan signals remain unreliable; the firefox top-10 cutoff is the main mover.

## Bookkeeping notes
- Run files: hidden_files/search-language/scan-2026-11-20-0510.json (run JSON incl. diffs), scan_now_0509.py (script; note: a stale scan_now_0509.py from an earlier preparation pointed PREV at the nonexistent scan-2026-11-19-0450.json — overwritten with correct prev paths + chrome check before running).
- Space activity log entry id 709. Observations bumped: #21 and #76.
- No tracking timeline entry: routine rotation-only scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: علاج جلد الوزة | بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: كريم جلد الوزة | من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: سيلوليت | الرجل | رول | الافخاذ | بالانجليزي | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: كريم سيلوليت | بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: علاج السيلوليت | في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج سيكا | يورياج صن بلوك | يوريا الدم
- كريم يوريا للجسم: كريم يوريا للجسم | للجسم النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: سكراب جسم | وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: زبدة الشيا | للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | افريكانا | الاصلية | الحواج
- مخمرية: مخمرية العود الملكي | مخمرية | للجسم | رجالي | فيونكة | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
