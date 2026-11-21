# Shopify daily sync — 2026-11-20 07:46 EET

Store: Zyra Care (zyra-care.com), EGP, EET, Basic plan. Read-only sync.
Note: the MCP server has no `list-orders`/`list-customers` tools (connector doc lists them, live tool list does not); orders/customers were pulled via `graphql_query` on the `orders`/`customers` fields instead.

## Trailing 7 days (2026-11-13 → 2026-11-20, today so far)
- Orders: 3 (ordersCount confirmed = 3). All displayFinancialStatus PENDING (COD, unpaid).
- #1915 — 2026-11-14 — 939 EGP — سكراب جلد الوزة + Signature scent routine
- #1916 — 2026-11-16 — 699 EGP — روتين جلد الوزة والفراولة
- #1917 — 2026-11-17 — 699 EGP — روتين جلد الوزة والفراولة
- Yesterday (19 Nov): 0 orders. Today (20 Nov) so far: 0 orders.
- Net revenue: 2,337 EGP. Gross: 2,637 EGP. Discounts: 300 EGP (code 100OFF on all 3 orders).
- AOV net: 779 EGP (gross 879 EGP).
- 7-day average: 0.43 orders/day — 0 yesterday is within normal low-volume range, NOT a sudden drop.

## Computed breakdown
- Hero routines share: KP routine 2/3 orders (66.7%), 1,398 EGP net = 59.8% of revenue. Cellulite Routine: 0 orders.
- Repeat-customer rate (trailing-7d buyers): 3/3 = 100% (buyer order counts 4, 2, 2). Total customers: 973.
- Top basket pair: سكراب جلد الوزة + Signature scent routine (939 EGP, #1915).
- Near-miss under 1,000 EGP free-shipping threshold: #1915 at 939 EGP (61 EGP short). The two KP orders at 699 EGP are 301 EGP short.
- Price check (anomaly resolved, not a mismatch): KP routine list price verified live at 799 EGP; the 699 EGP paid = 799 − 100OFF. Same for #1915: 440 + 599 = 1,039 − 100 = 939. No site/admin price mismatch.

## Space writes
- createsnapshot → id 2 ("Shopify daily sync — trailing 7 days to 2026-11-20")
- logactivity → id 761 (section Sync, event "Shopify daily sync")

No message sent to the user (per task). No store writes made.
