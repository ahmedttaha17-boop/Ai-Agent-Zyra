# Search Language Scan — 2026-11-20 13:30 EET

- Endpoint: suggestqueries.google.com/complete/search, hl=ar, gl=eg, client=firefox (the established series format: 10 suggestions, query itself first).
- Keywords scanned: 12/12, no errors. Raw JSON: `search-language-scan-2026-11-20-1330.json`. Script: `search-language/scan_now_20261120_1329.py`.
- Baseline: space snapshot at 13:09 EET (search-language-scan-2026-11-20-1309.json; matches space lastScanAt 2026-11-20T11:11:16Z). Note: the pre-existing `search-language/scan_now_1329.py` is a stale Nov 19 file (created 2026-11-19 11:30 UTC) and was NOT used; its embedded baseline is from Nov 19.

## Comparison vs 13:09 EET

- One keyword changed: «مخمرية» — 1 new string, 1 gone. The other 11 keywords are identical except two order-only swaps.
- New string: «مخمرية فيونكة» (pos. 5). Gone: «مخمرية لمسة حرير» (was pos. 10). The مخمرية list also reordered: «مخمرية» 2→1, «مخمرية العود الملكي» 1→2.
- Order-only swaps: «سيلوليت» («سيلوليت بالانجليزي» 5→4, «سيلوليت الافخاذ» 4→5); «يوريا» («يورياج سيكا» 9→8, «يورياج صن بلوك» 8→9).
- «زبدة الشيا الاصلية» still present in the زبدة الشيا list (observation #34 confirmation continues).

## History check (90 scan files) — the finding that matters

- «مخمرية فيونكة» is NOT brand-new: present in 53 of 90 scans, earliest Nov 19 16:09, present almost continuously through Nov 20 (out only at 12:29 and 13:09, back 12:49 and 13:30). A flip-flopper around the top-10 boundary, not a first appearance.
- «مخمرية لمسة حرير» is also NOT new: present in 37 of 90 scans, earliest Nov 19 02:49. It was in most Nov 19 scans and at 12:29, exited at 12:49 (the artifact scan), returned 13:09, exited again 13:30.
- Correction: opportunity #7's evidence («اقتراح جديد في مسح جوجل مصر 20 نوفمبر 13:09 EET») is factually wrong — the name had been in the series since Nov 19. The opportunity itself (a named makhmaría variant researchers search for) stays «قيد الدراسة» for the owner; only the «new» framing is corrected. No status change was made (updateopportunity only sets status; the owner decides).
- No new product opportunity for «فيونكة»: not a brand-new suggestion, same 10th-slot churn as «لمسة حرير»; owner decides.

## Actions taken in the space

- recordkeywordscan for all 12 keywords (snapshot 13:30 EET).
- createobservation (id 89): the مخمرية churn + the #7 evidence correction.
- logactivity entry (id 872) in Search Language section.
- No new product opportunity.
