# Search-language scan — 2026-11-20 21:49 EET

- Endpoint reachable (suggestqueries.google.com, hl=ar, gl=eg, client=firefox). 12/12 keywords, 10 suggestions each, no errors.
- Baseline: 21:29 snapshot (`snapshot-2026-11-20-2129.json`). NOTE: the 21:29 run fetched, recorded the keyword scans in the space (lastScanAt 21:31 EET) and logged activity #1012, but left no md report and no run-log entry; its snapshot is identical to 21:09 except order in «علاج جلد الوزة» («من الصيدلية» 6th, not 9th). Snapshot file: `hidden_files/search-language/scan-2026-11-20-2149-eet-firefox.json`.
- Diff vs 21:29: one swap in «زبدة الشيا» — «زبدة الشيا للبشرة» entered (#8), «زبدة الشيا الاصلية» left. The same swap occurred at 14:50 (obs #92) and at 20:29 (obs #105) — rotation, not a new signal. Order-only changes in «علاج جلد الوزة» («من الصيدلية» 6→9), «سيلوليت» («الافخاذ»/«بالانجليزي» swap 4↔5), «يوريا» («سيكا»/«صن بلوك» swap 8↔9).
- No brand-new suggestion, no new product opportunity. Observation #39 bumped (occurrences 4→5).
- «علاج السيلوليت عند النساء» / «بالاعشاب» (#100/#101) out of top 10 for the 4th consecutive scan (20:49, 21:09, 21:29, 21:49) — the 3-scan death test in #39's evidence chain is now complete: they were single-scan flickers, not rotation.
- Standing: «زبدة الشيا الخام» in, «مخمرية لمسة حرير» in, «يورياج سيكا» in «يوريا» (#8), «سيلوليت رول امازون» / «كريم لاخفاء جلد الوزة» / «يوريا ٣٠٪» still out of top 10.
- Space writes: 12× recordkeywordscan (correct keyword ids, all 12 stored rows verified to match the fetched lists), bumpobservation #39, logactivity #1017.
