# Search-language scan — 2026-11-20 18:10 EET

## What ran
- Scheduled scan (zyra-search-language-scan, 18:09 occurrence), 12 tracked keywords, Google Egypt autocomplete (`suggestqueries.google.com/complete/search`, `hl=ar`, `gl=eg`, `client=firefox` — series of record, 10 results/keyword).
- Endpoint reachable; all 12 keywords fetched, 10 suggestions each, no errors.
- Compared against the previous snapshot `scan-2026-11-20-1750-firefox.json` (17:50 EET).

## Authoritative result (Firefox, 18:10 EET vs 17:50 EET snapshot)
- One set change, in «زبدة الشيا»: «زبدة الشيا للبشرة» re-entered the top 10 at #8, pushing out «زبدة الشيا الاصلية».
  - «زبدة الشيا للبشرة» is a RETURNING suggestion, not brand-new: it was in the top 10 before the 13:09 scan, when «زبدة الشيا الخام» displaced it (observation #37). It is also a plain skin-use phrase for shea butter — squarely a Zyra product use, not a product/problem Zyra doesn't carry. So: no observation, no new product opportunity. Noted in activity #954 for the daily learning summary.
- Order-only adjacent swaps in 2 keywords (noise, no set change):
  - «علاج جلد الوزة»: «علاج جلد الوزة من الصيدلية» up #9→#6, «علاج جلد الوزة بالليزر» down #6→#7, «تحت الابط» #7→#8, «في المناطق الحساسة» #8→#9.
  - «يوريا»: «يورياج سيكا» ↔ «يورياج صن بلوك» (#8/#9) — reverts the 17:50 swap.
- All other 9 keywords identical in set and order.

## Standing signals
- «زبدة الشيا الخام» still in top 10 (#7) — 16th consecutive scan since 13:09.
- «سيلوليت رول امازون» (opportunity #8) still out of the top 10 — 9th consecutive Firefox scan; stays «قيد الدراسة».
- «مخمرية لمسة حرير» still at #10; opportunity #7 stays «قيد الدراسة».
- «يوريا ٣٠٪» and «كريم يوريا ٣٠ للجسم» still out of the Firefox top 10 (20 / 10 / 40 forms present instead) — consistent with observation #96 on the oscillating Arabic-numeral 30% form.
- «كريم لاخفاء جلد الوزة» (opportunity #6) still out.

## Recorded in the space (zyra-marketing-intelligence-agent)
- `recordkeywordscan` ×12 with the Firefox top-10 lists.
- Activity #954 (section «لغة البحث», event «مسح لغة بحث»).

## Files
- `hidden_files/search-language/scan-2026-11-20-1810-firefox.json` — authoritative scan (Firefox, full 10/keyword).
- `hidden_files/search-language/scan_now_20261120_1809.py` — run script for this occurrence.
- `hidden_files/search-language/scan-2026-11-20-1750-firefox.json` — previous snapshot used for comparison.
