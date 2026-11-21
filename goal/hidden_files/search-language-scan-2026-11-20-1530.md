# Search Language Scan — 2026-11-20 15:30 EET

- Endpoint: suggestqueries.google.com/complete/search, hl=ar, gl=eg, client=firefox (the established series format: 10 suggestions, query itself first).
- Keywords scanned: 12/12, no errors. Raw JSON: `search-language-scan-2026-11-20-1529.json` (baseline copy in `search-language/scan-2026-11-20-1530-eet.json`). Script: `scan_search_language.py` (established).
- Baseline: space snapshot at 15:09 EET (`search-language/scan-2026-11-20-1509-eet.json`; verified identical to the space-stored suggestions field by field, lastScanAt 2026-11-20T13:10:57Z).

## Comparison vs 15:09 EET

- «سيلوليت»: «سيلوليت جورجينا» and «سيلوليت رول امازون» LEFT the top 10 after a single scan (entered 15:09); «سيلوليت الافخاذ» and «سيلوليت الجسم» returned (present at 14:30, out at 15:09, back at 15:30 — the 15:09 scan was the blip, 15:30 restores the stable set; only الافخاذ/بالانجليزي swapped positions 4/5 vs 14:30). Verified against 109 snapshot files: الافخاذ/الجسم appear in 92 snapshots — returning, not new.
- «زبدة الشيا»: «زبدة الشيا للبشرة» entered, «زبدة الشيا الاصلية» left — the same flip as the 14:50 scan (observation #92); the pair has flip-flopped all day (#79/#82/#83/#92, #34). «زبدة الشيا الخام» still present at pos. 7 — 8th consecutive scan (13:09–15:30).
- «علاج جلد الوزة»: order-only («من الصيدلية» 6→9). «مخمرية»: order-only (1↔2, 6↔7 swaps; restores the 13:30/13:51 ordering, same as the 14:30 note). «مخمرية لمسة حرير» still in at pos. 10; «مخمرية فيونكة» still out (flip-flop documented in observation #89; opportunity #7 stays «قيد الدراسة»).
- The other 8 keywords are byte-identical to 15:09.
- No brand-new string in any of the 12 keywords (all entered strings verified as returning across the snapshot history).

## Actions taken in the space

- recordkeywordscan for all 12 keywords (snapshot 15:30 EET), all returned ok.
- logactivity entry (id 908) in Search Language section.
- createobservation #94: «سيلوليت جورجينا» + «سيلوليت رول امازون» died after one scan in the firefox series (same pattern as «كريم urea للجسم», #35), resolving observation #93's open question. Chrome 15-result series shows both persistently at ranks 10–11 (19 Nov 18:49/22:50Z, 20 Nov 10:49/14:09) — they hover below the top-10 cutoff, so opportunity #8 stays «قيد الدراسة»; no decision.
- bumpobservation #37: «زبدة الشيا الخام» hold extends to 8 consecutive scans.
- No new product opportunity — no brand-new suggestion names a product or problem Zyra does not carry.

## Note on a stale script

- `search-language/scan_now_1529.py` was NOT used: it diffs against `~/workspace/zyra-marketing-intelligence-agent/search-language/scan-2026-11-19T15-10-EET.json` (a 19 Nov file) and writes into the `~/workspace/zyra-marketing-intelligence-agent/search-language/` series, which stopped at 03:12 EET on 20 Nov. Its docstring's getopsstate claim (lastScanAt 13:12:55Z) also does not match the state read at run start (13:10:57Z). Renamed to `scan_now_1529.py.STALE-DO-NOT-USE` so a later run does not pick it up. The established series is the root `scan_search_language.py` + `search-language/scan-YYYY-MM-DD-HHMM-eet.json` baseline files in this hidden_files directory.
