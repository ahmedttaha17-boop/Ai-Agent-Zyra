# Search Language Scan — 2026-11-20 08:31 EET

- Endpoint: suggestqueries.google.com/complete/search, hl=ar, gl=eg, client=firefox (the established series format: 10 suggestions, query itself first).
- Keywords scanned: 12/12, no errors. Raw JSON: `search-language-scans/scan-2026-11-20-0829.json`.
- Baseline: space snapshot at 08:10 EET (lastScanAt 2026-11-20T06:10:44Z).

## Comparison vs 08:10 EET

- 9 keywords identical (جلد الوزة، كريم جلد الوزة، سيلوليت، كريم سيلوليت، علاج السيلوليت، كريم يوريا للجسم، سكراب جسم، مخمرية، ملح سيوة).
- «علاج جلد الوزة»: same 10 suggestions, order changed only.
- «يوريا»: same 10 suggestions, order changed only (يورياج صن بلوك / يورياج سيكا swapped).
- «زبدة الشيا»: ONE real change — «زبدة الشيا الاصلية» OUT, «زبدة الشيا للبشرة» IN. This is a boundary flicker, not a clean exit: الاصلية exited 07:49, re-entered 08:10, exited again 08:31. Observation #27 bumped to record the recurrence.
- No brand-new top-10 suggestion → no new observation, no new product opportunity this scan.

## Wider read (client=chrome, 15 items) — watch items only, NOT verified new

A first-pass fetch with client=chrome returned 15 suggestions per keyword; the extra tail (positions 11–15) is not comparable with the stored 10-item series, so these are recorded as below-cutoff watch items, not as new suggestions. Several tail items are already known to the space (يوريا 30 → opportunity #1; سيلوليت رول امازون → opportunity #2; علاج جلد الوزة والشعر تحت الجلد → opportunity #3; علاج جلد الوزة في الوجه → opportunity #4). Tail items not previously recorded anywhere in the space, to watch if they enter the top 10: «سيلوليت و ليبوديما»، «كريم قود باي سيلوليت» / «كريم باي باي سيلوليت»، «يوريا لوشن نوفيرا»، «كريم mixa للجسم يوريا»، «كريم ايفلين للجسم يوريا»، «كريم اليجون يوريا للجسم»، «علاج جلد الوزة نهائيا»، «جلد الوزة في الرقبة»، «مخمرية العروسة»، «علاج السيلوليت ضياء العوضي»، «سيلوليت جورجينا»، «زبدة الشيا بكام»، «سكراب جسم باث اند بودي».

## Actions taken in the space

- recordkeywordscan for all 12 keywords (snapshot 08:31 EET).
- logactivity entry (id 775) in Search Language section.
- bumpobservation on observation #27 (الاصلية exit recurrence).
