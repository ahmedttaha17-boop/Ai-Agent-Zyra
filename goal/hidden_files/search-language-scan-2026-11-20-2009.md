# Search-language scan — 2026-11-20 20:09 EET

## What ran
- Scheduled scan (zyra-search-language-scan, 20:09 occurrence), 12 tracked keywords, Google Egypt autocomplete (`suggestqueries.google.com/complete/search`, `hl=ar`, `gl=eg`, `client=firefox` — series of record, 10 results/keyword).
- Endpoint reachable; all 12 keywords fetched, 10 suggestions each, no errors.
- Compared against the 19:49 EET Firefox snapshot — with a correction: the on-disk `scan-2026-11-20-1949-eet-firefox.json` and `scan-2026-11-20-1930-firefox.json` hold placeholder strings, not real data, and the space's stored rows were MISLABELED (see below). Baseline used: `search-language/scan-2026-11-20-1949-eet-firefox-CORRECTED.json`, rebuilt from the space's stored suggestions re-paired to their true keywords by content and cross-checked against the correctly-keyed 19:49 chrome raw file.

## Data-quality fix (important for future runs)
- Prior runs recorded scans with list position (1–12 in script order) as the keyword id, but the space's keyword ids follow seed creation order (جلد الوزة=1, علاج جلد الوزة=2, كريم جلد الوزة=3, كريم سيلوليت=4, علاج السيلوليت=5, سيلوليت=6, ملح سيوة=7, يوريا=8, مخمرية=9, كريم يوريا للجسم=10, سكراب جسم=11, زبدة الشيا=12). Result: 9 of 12 stored rows held another keyword's list (e.g. «زبدة الشيا» stored ملح سيوة's list; «ملح سيوة» stored يوريا's).
- This run recorded all 12 scans with the CORRECT ids, and a post-write `getopsstate` check confirms all 12 rows now hold their own keyword's list (lastScanAt 2026-11-20T18:15:35–36Z). Future runs must keep using the true ids (listed in `scan_now_20261120_2009.py`), never list position — otherwise the diff will fabricate ~10 "new" items per keyword.

## Authoritative result (Firefox, 20:09 EET vs corrected 19:49 EET)
- 6 entered items, all RETURNING (each dropped at 19:49 and came back now — a swap-back, not new demand):
  - «علاج جلد الوزة»: «علاج جلد الوزة في الوجه» re-entered; «علاج جلد الوزة في منطقة البكيني» (obs #102) left after one scan. «في الوجه» is opportunity #4's anchor — no new observation, no new opportunity.
  - «علاج السيلوليت»: «علاج السيلوليت في الجسم» and «علاج السيلوليت في الفخذين» re-entered; «علاج السيلوليت عند النساء» (#101) and «علاج السيلوليت بالاعشاب» (#100) left after one scan.
  - «ملح سيوة»: bare «ملح سيوة» and «ملح سيوة للبيع» re-entered; «استخدامات ملح سيوة» and «اباجورات ملح سيوة» (#103) left after one scan.
  - «يوريا»: «يورياج سيكا» entered at #9; nothing left — the 19:49 list had only 9 items, so سيكا filled the empty 10th slot and «يوريا الدم» simply moved to #10.
- One first-time Firefox-top-10 entry: «يورياج سيكا» — recorded as observation #104. It was already rank 7 in the 19:49 extended (chrome, 15) fetch, so this is a promotion into the top 10, not a first-ever appearance; it is a Uriage Cica variant inside the already-tracked يورياج presence in the same keyword — not a product/problem Zyra doesn't carry, so no new product opportunity.
- All other 8 keywords identical in set and order — no order-only swaps this run.

## Standing signals
- «زبدة الشيا الخام» still in top 10 (#7) — 20th consecutive Firefox scan since 13:09.
- «سيلوليت رول امازون» (opportunity #8) still out of the top 10 — 13th consecutive Firefox scan; stays «قيد الدراسة».
- «مخمرية لمسة حرير» still at #10; opportunity #7 stays «قيد الدراسة».
- «يوريا ٣٠٪» and «كريم يوريا ٣٠ للجسم» still out of the Firefox top 10 (20 / 10 / 40 forms present instead) — consistent with observation #96 on the oscillating Arabic-numeral 30% form.
- «كريم لاخفاء جلد الوزة» (opportunity #6) still out.

## Recorded in the space (zyra-marketing-intelligence-agent)
- `recordkeywordscan` ×12 with the Firefox top-10 lists, correct keyword ids (fixing the mislabeled rows).
- Observation #104 («يورياج سيكا»).
- Activity #988 (section «لغة البحث», event «مسح لغة بحث»).

## Files
- `hidden_files/search-language/scan-2026-11-20-2009-eet-firefox.json` — authoritative scan (Firefox, full 10/keyword).
- `hidden_files/search-language/scan_now_20261120_2009.py` — run script for this occurrence.
- `hidden_files/search-language/scan-2026-11-20-1949-eet-firefox-CORRECTED.json` — corrected 19:49 baseline (relabeled stored rows + correction note).
