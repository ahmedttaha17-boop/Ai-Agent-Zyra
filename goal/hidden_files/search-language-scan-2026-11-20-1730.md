# Search-language scan — 2026-11-20 17:30 EET

## What ran
- Scheduled scan (zyra-search-language-scan), 12 tracked keywords, Google Egypt autocomplete (`suggestqueries.google.com/complete/search`, `hl=ar`, `gl=eg`).
- First fetch used `client=chrome` (15 results/keyword). Compared against the stored Firefox snapshot (16:56 EET) it showed 12 "new" entries, one per keyword, with the bare keyword exiting the top 10 in all 12 — the same pattern as the discarded 14:09 Chrome scan and observation #86 (12:29).
- Recognised as a cross-client false diff: re-fetched with `client=firefox` (the series of record, 10 results/keyword) at 17:30 EET. That is the authoritative result.

## Authoritative result (Firefox, 17:30 EET vs 16:56 EET snapshot)
- Zero changes across all 12 keywords — identical top-10 sets and order.
- No brand-new suggestion, no new product opportunity.

## Chrome-vs-Chrome check (14:09 → 17:10)
- Only «يوريا» changed in set terms: «يوريا ٣٠٪» out of the top 10 (was #7, now #12), «يوريا كريم 10» in at #10. Corroborates observation #96: the Arabic-numeral 30% form oscillates and does not hold.
- «كريم يوريا ٣٠ للجسم» still in the top 10 of «كريم يوريا للجسم» in both series.
- «سيلوليت رول امازون» (opportunity #8) still at #11 in the Chrome series — below the top-10 line.

## Standing signals
- «زبدة الشيا الخام» still in top 10 — 13th consecutive scan since 13:09.
- «سيلوليت جورجينا» and «سيلوليت رول امازون» still out — 6th consecutive Firefox scan; opportunity #8 stays «قيد الدراسة».
- «مخمرية لمسة حرير» still at position 10; opportunity #7 stays «قيد الدراسة».
- Side note: the space's stored «زبدة الشيا» string showed «للبشرة» while the 16:56 archive file and today's Firefox scan both show «الاصلية» — the same known slot oscillation documented in observations #92/#93, not a new signal.

## Recorded in the space (zyra-marketing-intelligence-agent)
- `recordkeywordscan` ×12 with the Firefox top-10 lists (this also corrected an earlier write in the same run that had stored the Chrome lists).
- Observation #97 (scan summary + false-diff catch).
- Activity #938 (section «لغة البحث», event «مسح لغة بحث»).

## Files
- `hidden_files/search-language/scan-2026-11-20-1730-firefox.json` — authoritative scan (Firefox, full 10/keyword).
- `hidden_files/search-language/scan-2026-11-20-1709-CHROME-DISCARDED-false-diff.json` — the discarded Chrome fetch (15/keyword), kept as evidence of the false diff.
- `hidden_files/search-language/scan-2026-11-20T16-56-EET.json` — previous snapshot used for comparison.
- `hidden_files/search-language/scan-2026-11-20-1409-CHROME-DISCARDED-false-diff.json` — prior Chrome scan used for the Chrome-vs-Chrome check.
