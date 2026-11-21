
## 2026-11-20 19:49 EET — scan complete (job zyra-search-language-scan)
- Endpoint reachable (suggestqueries.google.com, hl=ar, gl=eg). 12/12 keywords fetched.
- Raw: scan-2026-11-20-1949-eet.json (client=chrome, 13–15 sugg/keyword) + scan-2026-11-20-1949-eet-firefox.json (client=firefox, 10/keyword — recorded snapshot, matches prior scans' format).
- Method note: chrome client returns 13–15 suggestions and does NOT echo the bare query; firefox returns exactly 10 including the bare query. Comparing chrome output against stored top-10 would fabricate ~6 "new" items per keyword. Always use firefox format for the recorded snapshot.
- vs 19:31 EET snapshot: 9/12 keywords unchanged in top 10. New top-10: «علاج جلد الوزة في منطقة البكيني» (obs #102), «علاج السيلوليت عند النساء» (#101), «علاج السيلوليت بالاعشاب» (#100), «استخدامات ملح سيوة» + «اباجورات ملح سيوة» (#103, plural dup). No new product opportunity.
- Dropped from top 10: «علاج جلد الوزة في الوجه» (opp #4 anchor; still rank 9–11 in extended fetch), «علاج السيلوليت في الجسم»، «علاج السيلوليت في الفخذين»، «ملح سيوة»، «ملح سيوة للبيع».
- Extended fetch (15): «يوريا ٣٠٪» rank 12 (obs #38 alive below top 10), «كريم يوريا ٣٠ للجسم» + «كريم لاخفاء جلد الوزة» back in chrome top 10, «سيلوليت رول امازون» rank 11 (opp #8).
- Space writes: 12× recordkeywordscan, 4× createobservation (#100–103), logactivity #983.

## 2026-11-20 20:09 EET — scan complete (job zyra-search-language-scan)
- Endpoint reachable (suggestqueries.google.com, hl=ar, gl=eg, client=firefox). 12/12 keywords fetched, 10 suggestions each, no errors.
- Baseline: corrected 19:49 snapshot (scan-2026-11-20-1949-eet-firefox-CORRECTED.json). The on-disk 1930/1949 firefox JSONs hold placeholder strings, not real data, and must not be used as baselines.
- DATA FIX: prior runs recorded scans using list position (1-12) as the keyword id, mislabeling 9 of 12 stored rows in the space (e.g. زبدة الشيا stored ملح سيوة's list). This run recorded all 12 with the CORRECT ids and verified via getopsstate that all rows now hold their own keyword's list. Future runs must use true ids (see scan_now_20261120_2009.py), never list position.
- Diff vs corrected 19:49: 6 entered, all returning (dropped 19:49, back now) — «علاج جلد الوزة في الوجه» (opp #4 anchor), «علاج السيلوليت في الجسم», «علاج السيلوليت في الفخذين», «ملح سيوة», «ملح سيوة للبيع». The 19:49 single-scan entries (#100-103) all died: «علاج جلد الوزة في منطقة البكيني», «علاج السيلوليت عند النساء», «علاج السيلوليت بالاعشاب», «استخدامات ملح سيوة», «اباجورات ملح سيوة».
- One first-time Firefox-top-10 entry: «يورياج سيكا» in «يوريا» (#9; was rank 7 in the 19:49 extended chrome fetch) — observation #104. Competitor-variant signal, not a Zyra product gap; no new opportunity.
- Standing: «زبدة الشيا الخام» #7 (20th consecutive scan), «مخمرية لمسة حرير» #10, «سيلوليت رول امازون» / «كريم لاخفاء جلد الوزة» / «يوريا ٣٠٪» still out of top 10.
- Space writes: 12× recordkeywordscan (correct ids), 1× createobservation (#104), logactivity #988.

## 2026-11-20 20:49 EET — scan complete (job zyra-search-language-scan)
- Endpoint reachable (suggestqueries.google.com, hl=ar, gl=eg, client=firefox). 12/12 keywords fetched, 10 suggestions each, no errors.
- Baseline: 20:29 snapshot (search-language/scan-2026-11-20-2029.json). Snapshot: scan-2026-11-20-2049-eet-firefox.json.
- Diff vs 20:29: 4 entered, all returning (present at 20:09, dropped only in the single 20:29 scan) — «كريم ضد جلد الوزة», «علاج السيلوليت في الجسم», «علاج السيلوليت في الفخذين», «زبدة الشيا الاصلية». Left: «كريم علاج جلد الوزة», «زبدة الشيا للبشرة», «علاج السيلوليت عند النساء», «علاج السيلوليت بالاعشاب». Order-only change in «علاج جلد الوزة». Net: 20:49 top-10 is identical to 20:09.
- No brand-new suggestion, no new product opportunity. Rotation pattern (obs #39) confirmed a third time — bumped #39. «علاج السيلوليت عند النساء/بالاعشاب» (#100/#101) flickered: in at 20:29, out again at 20:49.
- Standing: «زبدة الشيا الخام» still in, «مخمرية لمسة حرير» still in, «يورياج سيكا» still in «يوريا», «سيلوليت رول امازون» / «كريم لاخفاء جلد الوزة» / «يوريا ٣٠٪» still out of top 10.
- Space writes: 12× recordkeywordscan (correct ids), bumpobservation #39, logactivity #1001.

## 2026-11-20 21:29 EET — scan ran but was not logged (discovered during the 21:49 run)
- A 21:29 run did execute: snapshot `search-language/snapshot-2026-11-20-2129.json` (fetched 19:30:10Z), space keyword rows updated (lastScanAt 21:31 EET), activity #1012 logged. It left no md report and no run-log entry. Its result: zero entered/left vs 21:09; order-only change in «علاج جلد الوزة» («من الصيدلية» 9→6). No observation bump, no new opportunity. Recorded here so the chain stays complete.

## 2026-11-20 22:49 EET — scan complete (job zyra-search-language-scan)
- Endpoint reachable (suggestqueries.google.com, hl=ar, gl=eg, client=chrome). 12/12 keywords fetched, 13–15 suggestions each, no errors.
- Baseline: 22:29 snapshot (search-language-scan-2026-11-20-2229.json). Snapshot: search-language-scan-2026-11-20-2249.json (fetched 22:50 EET); diff: search-language-diff-2026-11-20-2249.json.
- Diff vs 22:29: ZERO entered, ZERO exited, ZERO beyond-top-10 new. 9/12 keywords byte-identical. Order-only swaps in 3: «سيلوليت» (الافخاذ/بالانجليزي 3↔4 — same swap as 21:49), «يوريا» (سيكا/صن بلوك 7↔8 — same swap as 21:49), «مخمرية» (بودي/للجسم للنساء 5↔6 + العروسة/body/بلوب rotation 12–14).
- No brand-new suggestion, no new product opportunity. Rotation pattern (obs #39) recurred — bumped, occurrences 5→6.
- Standing: «زبدة الشيا الخام» in, «مخمرية لمسة حرير» in (#9), «يورياج سيكا» in «يوريا» (#7), «كريم لاخفاء جلد الوزة» #10, «كريم يوريا ٣٠ للجسم» #10, «سيلوليت رول امازون» #11 (extended only), «يوريا ٣٠٪» #12 (extended only).
- Space writes: 12× recordkeywordscan (correct ids; all 12 stored rows verified to match the fetched lists, lastScanAt 22:52 EET), bumpobservation #39, logactivity #1038.

## 2026-11-20 21:49 EET — scan complete (job zyra-search-language-scan)
- Endpoint reachable (suggestqueries.google.com, hl=ar, gl=eg, client=firefox). 12/12 keywords fetched, 10 suggestions each, no errors.
- Baseline: 21:29 snapshot (snapshot-2026-11-20-2129.json). Snapshot: scan-2026-11-20-2149-eet-firefox.json.
- Diff vs 21:29: one swap in «زبدة الشيا» — «زبدة الشيا للبشرة» entered (#8), «زبدة الشيا الاصلية» left. Same swap as 14:50 (#92) and 20:29 (#105): rotation, not a new signal. Order-only changes in «علاج جلد الوزة» («من الصيدلية» 6→9), «سيلوليت» («الافخاذ»/«بالانجليزي» 4↔5), «يوريا» («سيكا»/«صن بلوك» 8↔9).
- No brand-new suggestion, no new product opportunity. Rotation pattern (obs #39) recurred — bumped, occurrences 4→5.
- «علاج السيلوليت عند النساء» / «بالاعشاب» (#100/#101) out of top 10 for the 4th consecutive scan (20:49–21:49): the 3-scan death test in #39's evidence chain is complete — single-scan flickers, not rotation.
- Standing: «زبدة الشيا الخام» in, «مخمرية لمسة حرير» in, «يورياج سيكا» in «يوريا» (#8), «سيلوليت رول امازون» / «كريم لاخفاء جلد الوزة» / «يوريا ٣٠٪» still out of top 10.
- Space writes: 12× recordkeywordscan (correct ids; all 12 stored rows verified to match the fetched lists), bumpobservation #39, logactivity #1017.

## 2026-11-20 23:09 EET — scan complete (job zyra-search-language-scan)
- Endpoint reachable (suggestqueries.google.com, hl=ar, gl=eg, client=chrome). 12/12 keywords fetched, 13–15 suggestions each, no errors.
- Baseline: 22:49 snapshot (search-language-scan-2026-11-20-2249.json). Snapshot: search-language-scan-2026-11-20-2309.json; diff: search-language-diff-2026-11-20-2309.json.
- Diff vs 22:49: ZERO entered, ZERO exited, ZERO beyond-top-10 new. 11/12 keywords byte-identical. Order-only rotation in «مخمرية» only: بودي/للجسم للنساء 5↔6 flipped back to the 22:29 order + العروسة/body/بلوب rotation 12–14.
- No brand-new suggestion, no new product opportunity. Rotation pattern (obs #39) recurred — bumped, occurrences 6→7.
- Standing: «زبدة الشيا الخام» in, «مخمرية لمسة حرير» in (#9), «يورياج سيكا» in «يوريا» (#7), «كريم لاخفاء جلد الوزة» #10, «كريم يوريا ٣٠ للجسم» #10, «سيلوليت رول امازون» #11 (extended only), «يوريا ٣٠٪» #12 (extended only).
- Space writes: 12× recordkeywordscan (correct ids; all 12 stored rows verified to match the fetched lists, lastScanAt 23:13 EET), bumpobservation #39, logactivity #1043.

## 2026-11-20 23:29 EET — scan complete (job zyra-search-language-scan)
- Endpoint reachable (suggestqueries.google.com, hl=ar, gl=eg, client=chrome). 12/12 keywords fetched, 13–15 suggestions each, no errors.
- Baseline: 23:09 snapshot (search-language-scan-2026-11-20-2309.json). Snapshot: search-language-scan-2026-11-20-2329.json (fetched 23:31 EET); diff: search-language-diff-2026-11-20-2329.json.
- Diff vs 23:09: ZERO entered, ZERO exited, ZERO beyond-top-10 new. 10/12 keywords byte-identical. Order-only rotation in 2: «علاج جلد الوزة» («من الصيدلية» 5→8, with الليزر/تحت الابط/المناطق الحساسة each up one) and «يوريا» (سيكا/صن بلوك 7↔8 — same swap as 21:49 and 22:49).
- No brand-new suggestion, no new product opportunity. Rotation pattern (obs #39) recurred — bumped, occurrences 7→8.
- Standing: «زبدة الشيا الخام» in (#3), «مخمرية لمسة حرير» in (#9), «يورياج سيكا» in «يوريا» (#8), «كريم لاخفاء جلد الوزة» #10, «كريم يوريا ٣٠ للجسم» #10, «علاج جلد الوزة في الوجه» #9 (opp #4 anchor, still in top 10), «سيلوليت رول امازون» #11 (extended only), «يوريا ٣٠٪» #12 (extended only).
- Space writes: 12× recordkeywordscan (correct ids; all 12 stored rows verified to match the fetched lists, lastScanAt 23:32–23:33 EET), bumpobservation #39, logactivity #1050.

## 2026-11-21 01:11 EET — scan complete (job zyra-search-language-scan)
- Endpoint reachable (suggestqueries.google.com, hl=ar, gl=eg, client=chrome). 12/12 keywords fetched, 13–15 suggestions each, no errors.
- Baseline: 00:49 snapshot (scan-2026-11-21-0049-eet.json). Snapshot: scan-2026-11-21-0111-eet.json; diff: scan-2026-11-21-0111-eet-diff.md.
- Diff vs 00:49: ZERO entered, ZERO exited, ZERO beyond-top-10 new. 10/12 keywords byte-identical. Order-only rotation in 2: «زبدة الشيا» (الخام 6→3, للبشرة 7→10) and «مخمرية» (بودي/للجسم للنساء 5↔6 — same swap as 22:29/22:49/23:09/23:29).
- No brand-new suggestion, no new product opportunity. Rotation pattern (obs #39) recurred — bumped, occurrences 9→10.
- Standing: «زبدة الشيا الخام» in (#3), «مخمرية لمسة حرير» in (#9), «يورياج سيكا» in «يوريا» (#7), «كريم لاخفاء جلد الوزة» #10, «كريم يوريا ٣٠ للجسم» #10, «جلد الوزة في البكيني» #6 + «علاج جلد الوزة في منطقة البكيني» #10 (opp #9 anchor, still in top 10), «سيلوليت جورجينا» #10, «سكراب جسم ايفا» #10, «مخمرية رجالي للجسم» #10, «سيلوليت رول امازون» #11 (extended only), «يوريا ٣٠٪» #12 (extended only). Latin «urea» still out of top 10 (2nd scan) — rotation, not death.
- Space writes: 12× recordkeywordscan (correct ids; all 12 stored rows verified to match the fetched lists, lastScanAt 01:12–01:13 EET), bumpobservation #39, logactivity #1081.

## 2026-11-21 01:50 EET — scan complete (job zyra-search-language-scan)
- Endpoint reachable (suggestqueries.google.com, hl=ar, gl=eg, client=chrome). 12/12 keywords fetched, 13–15 suggestions each, no errors.
- Baseline: 01:11 snapshot (scan-2026-11-21-0111-eet.json). Snapshot: scan-2026-11-21-0150-eet.json (fetched 01:50 EET); diff: scan-2026-11-21-0150-eet-diff.md.
- Diff vs 01:11: ZERO entered, ZERO exited, ZERO beyond-top-10 new. 9/12 keywords byte-identical. Order-only rotation in 3: «سيلوليت» (الافخاذ/بالانجليزي 3↔4), «يوريا» (سيكا/صن بلوك 7↔8), «مخمرية» (بودي/للجسم للنساء 5↔6) — all three the same recurring swaps.
- Vs the 01:33 stored rows (activity #1094 / observation #114, no local snapshot file): «زبدة الشيا» reverted — «للوجة تجربتي» and «الافريقية» died after one scan, «الخام» (#3) and «للبشرة» (#10) returned. Recorded as observation #115 (resolution of #114).
- No brand-new suggestion, no new product opportunity. Rotation pattern (obs #39) recurred — bumped, occurrences 10→11.
- Standing: «زبدة الشيا الخام» in (#3), «مخمرية لمسة حرير» in (#9), «يورياج سيكا» in «يوريا» (#8), «كريم لاخفاء جلد الوزة» #10, «كريم يوريا ٣٠ للجسم» #10, «جلد الوزة في البكيني» #6 + «علاج جلد الوزة في منطقة البكيني» #10 (opp #9 anchor, still in top 10), «سيلوليت جورجينا» #10, «سكراب جسم ايفا» #10, «مخمرية رجالي للجسم» #10, «سيلوليت رول امازون» #11 (extended only), «يوريا ٣٠٪» #12 (extended only). Latin «urea» still out of top 10 (3rd consecutive scan) — rotation, not death.
- Space writes: 12× recordkeywordscan (correct ids; all 12 stored rows verified to match the fetched lists, lastScanAt 01:52 EET), bumpobservation #39, createobservation #115, logactivity #1096.

## 2026-11-21 04:09 EET — scan complete (job zyra-search-language-scan)
- Endpoint reachable (suggestqueries.google.com, hl=ar, gl=eg, client=firefox). 12/12 keywords fetched, 10 suggestions each, no errors.
- Baseline: 03:49 snapshot (scan-2026-11-21T0349EET.json, client=firefox — same client, clean comparison). Snapshot: scan-2026-11-21T0409EET.json (fetched 04:11 EET); diff: scan-2026-11-21-0409-eet-diff.md.
- Diff vs 03:49: 3 entered, 3 left, 1 order-only. 8/12 keywords byte-identical. «علاج جلد الوزة»: «في الوجه» entered #10 (return, opp #4 anchor), «في منطقة البكيني» left (opp #9 anchor OUT). «علاج السيلوليت»: «عند النساء» entered #10 (return after the recorded death judgment in obs #41), bare query left its own list. «زبدة الشيا»: «الخام» entered #7, «الاصلية» left (rotation). «سيلوليت»: order-only الافخاذ/بالانجليزي 4↔5.
- No brand-new suggestion (all three entered items appeared in earlier snapshots), no new product opportunity.
- Standing: «جلد الوزة في البكيني» #6, «علاج جلد الوزة في الوجه» #10 (opp #4), «مخمرية لمسة حرير» #9 (opp #7), «زبدة الشيا الخام» #7, «يورياج سيكا» #8 in «يوريا». Firefox returns 10 only, so beyond-top-10 status («سيلوليت رول امازون», «يوريا ٣٠٪») unchecked this scan; «كريم لاخفاء جلد الوزة» / «كريم يوريا ٣٠ للجسم» not in this firefox top 10 (were #10 in chrome runs — client-view difference, not a verified exit). Latin «urea» still out of top 10.
- Space writes: 12× recordkeywordscan — first write crossed ids 7/8 (يوريا list to id 7 = ملح سيوة, ملح سيوة list to id 8 = يوريا); caught by post-write verification, corrected with 2 re-writes, all 12 stored rows re-verified to match the fetched lists, lastScanAt 04:15 EET. Lesson recorded in the diff file: id 7 = ملح سيوة, id 8 = يوريا — always verify by keyword name, never by assumed id order. createobservation #120 («عند النساء» returned after death judgment), bumpobservation #44 (area family: face in, bikini out; occurrences 3→4), bumpobservation #39 (rotation pattern; occurrences 11→12), logactivity #1153.
