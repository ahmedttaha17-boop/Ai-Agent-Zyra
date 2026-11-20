# Search Language Scan — 2026-11-20 02:32 EET

Source: Google Egypt autocomplete (suggestqueries.google.com, hl=ar, gl=eg). Endpoint reachable; 12/12 keywords fetched on both clients (firefox 10 results, chrome 15 results), 0 errors. Two clients used: firefox (canonical 10-result snapshot, recorded in the space) + chrome (15-result extended check).
Previous snapshot: 02:09 EET run JSON (hidden_files/search-language/scan-2026-11-20-0209.json, keys keywords + chrome_keywords) + space-stored suggestions (getopsstate at run start; lastScanAt 00:13:57Z = 02:13–02:14 EET run). Recorded via recordkeywordscan for all 12 keyword ids (corrected mapping: 1=جلد الوزة, 2=علاج جلد الوزة, 3=كريم جلد الوزة, 4=كريم سيلوليت, 5=علاج السيلوليت, 6=سيلوليت, 7=ملح سيوة, 8=يوريا, 9=مخمرية, 10=كريم يوريا للجسم, 11=سكراب جسم, 12=زبدة الشيا); verified via getopsstate: lastScanAt now 2026-11-20T00:34:50–00:35:25Z (02:34–02:35 EET), stored suggestions match this run's firefox snapshot per keyword id, corrected 4/5 mapping intact. Space activity logged (id 628).

## Change vs previous snapshot
No brand-new suggestion — no observation created. No new product opportunity.
- Firefox top-10 sets identical to 02:09 for 8 of 12 keywords. Changes in 4 keywords (rotation noise, not signal):
  - «جلد الوزة»: order-only flip («في البكيني» 8→7، «تحت الابط» 7→8 — same oscillation documented in earlier runs).
  - «كريم يوريا للجسم»: exact reversal of the 02:09 change — the 02:09 "new" spelling variants («كريم urea للجسم»، «كريم يوريا ١٠ للجسم»، «كريم يوريا 20 للجسم») are out again, and the 01:49 items («كريم يوسيرين يوريا للجسم»، «كريم يوريا مرطب للجسم»، «كريم يوريا ٤٠ للجسم») are back. Same 10-slot tail rotating between two variant sets; observation 16 already tracks this oscillation. No observation.
  - «زبدة الشيا»: «زبدة الشيا للبشرة» back in the firefox top 10 (position 8)، «زبدة الشيا الاصلية» out; «افريكانا» 8→9. Same documented oscillation (21:49/01:49 runs); «الاصلية» still covered by observation 17. No observation.
  - «مخمرية»: «مخمرية لمسة حرير» in (position 10)، «مخمرية فيونكة» out of the firefox top 10; «العود الملكي» 2→1، «مخمرية» 1→2.
    - «مخمرية لمسة حرير» is NOT new: present in the chrome 15-set since at least 01:09 (positions 9–10 across runs); it simply rotated into the firefox top 10. No observation.
    - «مخمرية فيونكة» leaving is rotation; already out of the chrome 15-set since 02:09 (replaced there by «مخمرية خمرة», angle 71). No action.
- Chrome 15-sets identical to 02:09 for 10 of 12 keywords; order-only flips in 2 («علاج جلد الوزة»: «في المناطق الحساسة» 2→8 with the rest shifting up; «مخمرية»: «بودي» 6→5، «للجسم للنساء» 5→6، «العروسة» 14→12، «body» 12→13، «بلوب» 13→14). No new or gone items in any keyword. All extended items unchanged and already covered: «علاج جلد الوزة والشعر تحت الجلد» (opportunity 3)، «سيلوليت رول امازون» (opportunity 2)، «سيلوليت و ليبوديما»، «سيلوليت الارداف»، «يوريا 30» / «يوريا ٣٠٪» (opportunity 1)، «يوريا لوشن نوفيرا» / «يوريا كريم ليلاك»، «زبدة الشيا للوجة تجربتي» / «زبدة الشيا للشعر تجربتي» / «زبدة الشيا بكام»، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت» / «cream cellulite»، «علاج السيلوليت ضياء العوضي»، Alejon/Mixa/Eveline urea-cream brand mentions in «كريم يوريا للجسم» 11–15 (observation 13/16 — brands persist in chrome 11–15; observation 16's "disappearance" was firefox-top-10 only). «مخمرية خمرة» persists in chrome (position 15, unchanged vs 02:09; recorded as angle 71). Nothing new to record.

## Bookkeeping notes
- This run's files: firefox baseline ~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-20T02-32-EET.json; run JSON ~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language/scan-2026-11-20-0229.json; chrome snapshot ~/workspace/zyra-marketing-intelligence-agent/search-scans/scan_2026-11-20T003207.json; 10-result file hidden_files/search-scans/scan-2026-11-20-0232.json; prev.json refreshed to this run's chrome results.
- Script: hidden_files/search-language/scan_now_0229.py (adapted from scan_now_0149.py; prev firefox + chrome both from the 0209 file, keys "keywords"/"chrome_keywords" — diffs computed in-script and verified against the JSON).
- Recording: all 12 recordkeywordscan calls returned ok in two parallel batches of 6; one re-record for id 8 (يوريا) to fix an ordering slip in the first pass («يوريان تيمبر» misplaced last); verification via getopsstate confirmed all 12 ids updated to 00:34:50–00:35:25Z with matching stored suggestions and the corrected 4/5 mapping intact.
- Note: the 02:09 EET run left no md run log (only its JSON + space recording + observations 16/17 + angle 71 exist); this run's md log restores the per-run record from 02:29 onward.
- No tracking timeline entry: routine no-change scan, nothing user-facing.

## Full snapshot (this run) — firefox top 10
- جلد الوزة: جلد الوزة | بالانجليزي | في المؤخرة | في اليد | في الوجه | في الذراع | في البكيني | تحت الابط | في الثدي | قبل وبعد الليزر
- علاج جلد الوزة: علاج جلد الوزة | بالفازلين | في المؤخرة | بزيت جونسون | في البيت | من الصيدلية | بالليزر | تحت الابط | في المناطق الحساسة | في الوجه
- كريم جلد الوزة: كريم جلد الوزة | من الصيدلية | من dm | كريم لعلاج جلد الوزة | كريم لازالة جلد الوزة | كريم لي جلد الوزة | افضل كريم جلد الوزة | كريم تقشير جلد الوزة | كريم يوسيرين جلد الوزة | كريم ضد جلد الوزة
- سيلوليت: سيلوليت | الرجل | رول | بالانجليزي | الافخاذ | رول نون | رولر | الجسم | البطن | الذراعين
- كريم سيلوليت: كريم سيلوليت | بعد الولادة | للتنحيف | الجسم | نيفيا | للحامل | النهدي | افضل كريم سيلوليت | كريم علاج سيلوليت | كريم انتي سيلوليت
- علاج السيلوليت: علاج السيلوليت | في المنزل | في الجسم | في المؤخرة | في الفخذين | بالقهوة | في المؤخرة طبيعيا | بالرياضة | بالليزر | الاحمر
- يوريا: يوريا كريم | يوريا | يورياج | يورياج مزيل عرق | يوريا ٢٠٪ | يوريان تيمبر | يورياج غسول | يورياج سيكا | يورياج صن بلوك | يوريا الدم
- كريم يوريا للجسم: كريم يوريا للجسم | النهدي | افضل كريم يوريا للجسم | كريم يوريا ٢٠ للجسم | كريم يوريا 10 للجسم | فوائد كريم يوريا للجسم | كريم فيه يوريا للجسم | كريم يوسيرين يوريا للجسم | كريم يوريا مرطب للجسم | كريم يوريا ٤٠ للجسم
- سكراب جسم: سكراب جسم | وردي | دوف | منزلي | قهوه | كوزمو | النهدي | اصفر | طبي | بالانجليزي
- زبدة الشيا: زبدة الشيا | للشعر | للجسم | امتنان | الخام في الصيدليات | للوجه | الخام | للبشرة | افريكانا | الحواج
- مخمرية: مخمرية العود الملكي | مخمرية | للجسم | رجالي | رنة خلخال | بودي | للجسم للنساء | يارا | مايت سينما | لمسة حرير
- ملح سيوة: ملح سيوة | الصخري | للبيع | بالانجليزي | بالفرنسية | للتصدير | اباجورة ملح سيوة | فوائد ملح سيوة للبشرة | فوائد ملح سيوة | بحيرات ملح سيوة
