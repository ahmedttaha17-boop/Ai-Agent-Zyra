# Search-language scan — 2026-11-20 19:30 EET

## What ran
- Scheduled scan (zyra-search-language-scan, 19:29 occurrence), 12 tracked keywords, Google Egypt autocomplete (`suggestqueries.google.com/complete/search`, `hl=ar`, `gl=eg`, `client=firefox` — series of record, 10 results/keyword).
- Endpoint reachable; all 12 keywords fetched, 10 suggestions each, no errors.
- Compared against the previous Firefox snapshot `scan-2026-11-20-1910-firefox.json` (19:10 EET).
- Note: `scan-2026-11-20-1849.json` is a NON-Firefox series (15 suggestions/keyword, query itself absent — Chrome-style) and must NOT be used as the comparison baseline; mixing clients creates a uniform false diff across all 12 keywords.

## Authoritative result (Firefox, 19:30 EET vs 19:10 EET snapshot)
- One set change, in «زبدة الشيا»: «زبدة الشيا الاصلية» re-entered the top 10 at #9, pushing out «زبدة الشيا للبشرة».
  - «زبدة الشيا الاصلية» is a RETURNING suggestion, not brand-new: it was present in the Firefox snapshots at 14:11, 17:30, 17:31, 17:50 and 18:10, and the 17:30 run already documented this #8/#9 slot oscillation with «للبشرة» as a known pattern (observations #92/#93), not a new signal. It is also a plain authenticity qualifier for shea butter — a Zyra product use, not a product/problem Zyra doesn't carry. So: no observation, no new product opportunity.
- All other 11 keywords identical in set and order — no order-only swaps this run.

## Standing signals
- «زبدة الشيا الخام» still in top 10 (#7) — 19th consecutive Firefox scan since 13:09.
- «سيلوليت رول امازون» (opportunity #8) still out of the top 10 — 12th consecutive Firefox scan; stays «قيد الدراسة».
- «مخمرية لمسة حرير» still at #10; opportunity #7 stays «قيد الدراسة».
- «يوريا ٣٠٪» and «كريم يوريا ٣٠ للجسم» still out of the Firefox top 10 (20 / 10 / 40 forms present instead) — consistent with observation #96 on the oscillating Arabic-numeral 30% form.
- «كريم لاخفاء جلد الوزة» (opportunity #6) still out.

## Recorded in the space (zyra-marketing-intelligence-agent)
- `recordkeywordscan` ×12 with the Firefox top-10 lists.
- Activity #977 (section «لغة البحث», event «مسح لغة بحث»).

## Files
- `hidden_files/search-language/scan-2026-11-20-1930-firefox.json` — authoritative scan (Firefox, full 10/keyword).
- `hidden_files/search-language/scan_now_20261120_1929.py` — run script for this occurrence.
- `hidden_files/search-language/scan-2026-11-20-1910-firefox.json` — previous snapshot used for comparison.
