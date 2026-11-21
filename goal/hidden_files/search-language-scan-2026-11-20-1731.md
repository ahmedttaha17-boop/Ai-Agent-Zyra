# Search-language scan — 2026-11-20 17:31 EET

## What ran
- Scheduled scan (zyra-search-language-scan, 17:29 occurrence), 12 tracked keywords, Google Egypt autocomplete (`suggestqueries.google.com/complete/search`, `hl=ar`, `gl=eg`, `client=firefox` — series of record, 10 results/keyword).
- Endpoint reachable; all 12 keywords fetched, 10 suggestions each, no errors.
- Compared against the previous snapshot `scan-2026-11-20-1730-firefox.json` (17:16 EET fetch, recorded in the space at 17:18 EET). Note: that 17:30 file was the previous (17:09) occurrence's late run, not this one.

## Authoritative result (Firefox, 17:31 EET vs 17:30 EET snapshot)
- Zero changes in sets across all 12 keywords — no entered, no left.
- Order-only adjacent swaps in 3 keywords (noise, no set change):
  - «سيلوليت»: «سيلوليت الافخاذ» ↔ «سيلوليت بالانجليزي» (#4/#5).
  - «يوريا»: «يورياج سيكا» ↔ «يورياج صن بلوك» (#8/#9).
  - «مخمرية»: «مخمرية» ↔ «مخمرية العود الملكي» (#1/#2)، و«مخمرية بودي» ↔ «مخمرية للجسم للنساء» (#6/#7).
- No brand-new suggestion, no new product opportunity.

## Standing signals
- «زبدة الشيا الخام» still in top 10 (#7) — 14th consecutive scan since 13:09.
- «سيلوليت رول امازون» (opportunity #8) still out of the top 10 — 7th consecutive Firefox scan; stays «قيد الدراسة».
- «مخمرية لمسة حرير» still at #10; opportunity #7 stays «قيد الدراسة».
- «يوريا ٣٠٪» and «كريم يوريا ٣٠ للجسم» still out of the Firefox top 10 (20 / 10 / 40 forms present instead) — consistent with observation #96 on the oscillating Arabic-numeral 30% form.
- «كريم لاخفاء جلد الوزة» (opportunity #6) still out.

## Recorded in the space (zyra-marketing-intelligence-agent)
- `recordkeywordscan` ×12 with the Firefox top-10 lists.
- Activity #944 (section «لغة البحث», event «مسح لغة بحث»).

## Files
- `hidden_files/search-language/scan-2026-11-20-1731-firefox.json` — authoritative scan (Firefox, full 10/keyword).
- `hidden_files/search-language/scan_now_20261120_1729.py` — run script for this occurrence.
- `hidden_files/search-language/scan-2026-11-20-1730-firefox.json` — previous snapshot used for comparison.
