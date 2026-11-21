# Search Language Scan — 2026-11-20 16:54 EET

- Endpoint: suggestqueries.google.com/complete/search, hl=ar, gl=eg, client=firefox (the established series format: 10 suggestions, query itself first).
- Keywords scanned: 12/12, no errors. Raw JSON: `search-language-scan-2026-11-20-1649.json` (baseline copy in `search-language/scan-2026-11-20-1649-eet.json`; space-stored baseline copy in `search-language/scan-2026-11-20T16-56-EET.json`). Script: `search-language/scan_now_20261120_1649.py` (adapted from the 1629 script; the older `search-language/scan_now_1649.py` is a 2026-11-19 script — not used).
- Baseline: space snapshot at 16:36 EET (`search-language/scan-2026-11-20T16-36-EET.json`, reconstructed verbatim from getopsstate, lastScanAt 2026-11-20T14:36:29Z). Baseline discrepancy noted: the space-stored «يوريا» list had only 9 items — «يوريان تيمبر» was missing from the space record although the 16:33 local fetch still had it at pos. 6. The space record (lastScanAt 14:36:29Z) was evidently made from a slightly later fetch than the local 16:33 file, i.e. «يوريان تيمبر» dropped out between 16:33 and 16:36 and returned in this scan. The diff below is vs the space-stored baseline, as the space is the authoritative previous snapshot.
- History check: every entered string was checked against all 81 snapshot files in `search-language/` — both entered strings are returning, none brand-new.

## Comparison vs 16:36 EET (space-stored)

- «يوريا»: «يوريان تيمبر» entered at pos. 6 — returning (present in the 16:33 local fetch and in the long history; only the space's 16:36 record lacked it). «يوريا ٣٠٪» still out — 2nd consecutive scan absent after its one-scan return at 16:09.
- «زبدة الشيا»: «زبدة الشيا للبشرة» entered at pos. 8, «زبدة الشيا الاصلية» left — the same documented flip-flop as the 14:50 and 15:30 scans (#92/#34/#30). «زبدة الشيا الخام» still present at pos. 7 — 12th consecutive scan (13:09–16:54).
- «علاج جلد الوزة»: order-only («من الصيدلية» 9→6; «بالليزر» 6→7; «تحت الابط» 7→8; «في المناطق الحساسة» 8→9).
- «مخمرية»: order-only (1↔2 swap, 6↔7 swap — same swaps as 16:29 vs 16:09).
- The other 8 keywords are byte-identical to 16:36.
- «سيلوليت جورجينا» and «سيلوليت رول امازون» still out — 5th consecutive scan absent (15:30, 15:49, 16:09, 16:29, 16:54); the one-scan death is confirmed, opportunity #8 stays «قيد الدراسة». «مخمرية لمسة حرير» still in at pos. 10; «مخمرية فيونكة» still out — opportunity #7 stays «قيد الدراسة».
- No brand-new string in any of the 12 keywords (all entered strings verified as returning across the snapshot history).

## Actions taken in the space

- recordkeywordscan for all 12 keywords (snapshot 16:54 EET), all returned ok; verified afterwards via getopsstate — all 12 keywords hold 10 items each with lastScanAt 2026-11-20T14:55:48–14:56:09Z.
- logactivity entry (id 933) in Search Language section.
- bumpobservation #37: «زبدة الشيا الخام» hold extends to 12 consecutive scans (occurrences now 12).
- No new observation — no brand-new suggestion; both entered strings are documented returning flip-flops.
- No new product opportunity — no brand-new suggestion names a product or problem Zyra does not carry.
