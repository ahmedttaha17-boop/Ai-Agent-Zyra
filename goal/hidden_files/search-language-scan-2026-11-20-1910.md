# Search-language scan — 2026-11-20 19:10 EET

## What ran
- Scheduled scan (zyra-search-language-scan, 19:09 occurrence), 12 tracked keywords, Google Egypt autocomplete (`suggestqueries.google.com/complete/search`, `hl=ar`, `gl=eg`, `client=firefox` — series of record, 10 results/keyword).
- Endpoint reachable; all 12 keywords fetched, 10 suggestions each, no errors.
- Compared against the previous Firefox snapshot `scan-2026-11-20-1831-firefox.json` (18:31 EET).
- Note: `scan-2026-11-20-1849.json` is a NON-Firefox series (15 suggestions/keyword, query itself absent — Chrome-style) and must NOT be used as the comparison baseline; mixing clients creates a uniform false diff across all 12 keywords. Its top 10 is the Firefox top 10 minus the query itself plus the 11th item.

## Authoritative result (Firefox, 19:10 EET vs 18:31 EET snapshot)
- No set change in any of the 12 keywords — zero entered, zero left. No brand-new suggestion, so no observation and no new product opportunity.
- Order-only adjacent swaps in 2 keywords (noise, no set change):
  - «سيلوليت»: «سيلوليت بالانجليزي» up #5→#4, «سيلوليت الافخاذ» down #4→#5.
  - «يوريا»: «يورياج صن بلوك» ↔ «يورياج سيكا» (#8/#9) — reverts the 18:31 swap.
- All other 10 keywords identical in set and order.

## Standing signals
- «زبدة الشيا الخام» still in top 10 (#7) — 18th consecutive Firefox scan since 13:09.
- «سيلوليت رول امازون» (opportunity #8) still out of the top 10 — 11th consecutive Firefox scan; stays «قيد الدراسة».
- «مخمرية لمسة حرير» still at #10; opportunity #7 stays «قيد الدراسة».
- «يوريا ٣٠٪» and «كريم يوريا ٣٠ للجسم» still out of the Firefox top 10 (20 / 10 / 40 forms present instead) — consistent with observation #96 on the oscillating Arabic-numeral 30% form.
- «كريم لاخفاء جلد الوزة» (opportunity #6) still out.

## Recorded in the space (zyra-marketing-intelligence-agent)
- `recordkeywordscan` ×12 with the Firefox top-10 lists.
- Activity #972 (section «لغة البحث», event «مسح لغة بحث»).

## Files
- `hidden_files/search-language/scan-2026-11-20-1910-firefox.json` — authoritative scan (Firefox, full 10/keyword).
- `hidden_files/search-language/scan_now_20261120_1909.py` — run script for this occurrence.
- `hidden_files/search-language/scan-2026-11-20-1831-firefox.json` — previous snapshot used for comparison.
