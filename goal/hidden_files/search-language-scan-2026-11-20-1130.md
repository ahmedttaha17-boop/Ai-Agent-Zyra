# Search Language Scan — 2026-11-20 11:30 EET

- Endpoint: suggestqueries.google.com/complete/search, hl=ar, gl=eg, client=firefox (the established series format: 10 suggestions, query itself first).
- Keywords scanned: 12/12, no errors. Raw JSON: `search-language-scans/scan-2026-11-20-1130.json`.
- Baseline: space snapshot at 11:10 EET (scan-2026-11-20-1110.json).

## Comparison vs 11:10 EET

- One keyword changed: «كريم يوريا للجسم» — 3 new strings, 3 gone. The other 11 keywords are identical (same 10 suggestions, same order).
- New strings: «كريم urea للجسم» (pos. 3), «كريم يوريا ١٠ للجسم» (pos. 7), «كريم يوريا 20 للجسم» (pos. 8).
- Gone: «كريم يوسيرين يوريا للجسم», «كريم يوريا مرطب للجسم», «كريم يوريا ٤٠ للجسم».
- Semantic read: only «كريم urea للجسم» is a genuinely new query — first-ever appearance in the series (verified across all scan files); Latin-script "urea" inside an Arabic query. The other two are numeral-form twins of queries already present («كريم يوريا 10 للجسم» Latin 10 and «كريم يوريا ٢٠ للجسم» Arabic-Indic 20) — same queries, digit form swapped; both forms now sit in the top 10 at once.
- «زبدة الشيا الاصلية» still present in the زبدة الشيا list (in since 09:10; no flip this scan).

## Actions taken in the space

- recordkeywordscan for all 12 keywords (snapshot 11:30 EET).
- createobservation (id 84): «كريم urea للجسم» — first Latin-script «urea» appearance.
- No new product opportunity: urea body cream is a product Zyra carries (KP lotion, urea 25%).
- logactivity entry (id 831) in Search Language section.
