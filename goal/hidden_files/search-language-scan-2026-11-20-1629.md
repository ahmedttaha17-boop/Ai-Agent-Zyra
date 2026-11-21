# Search Language Scan — 2026-11-20 16:29 EET

- Endpoint: suggestqueries.google.com/complete/search, hl=ar, gl=eg, client=firefox (the established series format: 10 suggestions, query itself first).
- Keywords scanned: 12/12, no errors. Raw JSON: `search-language-scan-2026-11-20-1629.json` (baseline copy in `search-language/scan-2026-11-20-1629-eet.json`). Script: `search-language/scan_now_1629.py` (new for this run; root `scan_search_language.py` still carries a stale hardcoded 1349 output path — not used).
- Baseline: space snapshot at 16:09 EET (`search-language/scan-2026-11-20T16-09-EET.json`; verified identical to the space-stored suggestions field by field before fetching, lastScanAt 2026-11-20T14:12:20Z). The 16:09 scan itself was already recorded in the space (activity #918) and analysed in the 16:18 hourly review (activity #923).
- History check: every entered string was checked against all 85 snapshot files in `search-language/` — both entered strings are returning, none brand-new.

## Comparison vs 16:09 EET

- «يوريا»: «يوريا الدم» entered, «يوريا ٣٠٪» left. «يوريا الدم» is in 78/85 snapshots (the stable member); «يوريا ٣٠٪» in only 5/85. In the firefox series «يوريا ٣٠٪» entered at 16:09 and died after exactly one scan — the same one-scan death as «كريم urea للجسم» (#35) and «سيلوليت جورجينا»/«رول امازون» (#94). This qualifies observation #38 (created 16:28 EET, minutes before this scan), which claimed the Arabic-numeral form "lives": it does not — it flip-flops like the Latin form. «يوريان تيمبر» still in at pos. 6.
- «زبدة الشيا»: «زبدة الشيا الاصلية» entered, «زبدة الشيا للبشرة» left — the same flip as the 14:50 and 15:30 scans (documented flip-flop, #92/#34/#30). «زبدة الشيا الخام» still present at pos. 7 — 11th consecutive scan (13:09–16:29).
- «علاج جلد الوزة»: order-only («من الصيدلية» 6→9; «بالليزر»/«تحت الابط»/«في المناطق الحساسة» each +1). «سيلوليت»: order-only («بالانجليزي»/«الافخاذ» swap 4/5, same swap as 15:30 vs 14:30). «مخمرية»: order-only (1↔2, 6↔7 swaps).
- The other 7 keywords are byte-identical to 16:09.
- «سيلوليت جورجينا» and «سيلوليت رول امازون» still out — 4th consecutive scan absent (15:30, 15:49, 16:09, 16:29); the one-scan death is confirmed, opportunity #8 stays «قيد الدراسة». «مخمرية لمسة حرير» still in at pos. 10; «مخمرية فيونكة» still out — opportunity #7 stays «قيد الدراسة».
- No brand-new string in any of the 12 keywords (all entered strings verified as returning across the snapshot history).

## Actions taken in the space

- recordkeywordscan for all 12 keywords (snapshot 16:29 EET), all returned ok.
- logactivity entry (id 928) in Search Language section.
- createobservation #96: «يوريا ٣٠٪» died after one scan (16:09→16:29) — the Arabic-numeral form flip-flops like the Latin one; «يوريا الدم» is the stable member. Supports keeping thinking #70's exclusion of «يوريا ٣٠٪» from test creative until it proves itself over multiple scans.
- bumpobservation #37: «زبدة الشيا الخام» hold extends to 11 consecutive scans.
- No new product opportunity — no brand-new suggestion names a product or problem Zyra does not carry.
