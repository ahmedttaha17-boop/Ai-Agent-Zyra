# Financial Intelligence, Sequential Diagnosis & Compliance Gates

## 1. Financial Intelligence & COD Economics (Zero Double-Counting)
- **Exact Definitions**:
  - `Placed CPP = Total Ad Spend / Placed Orders`
  - `Delivered CPP = Total Ad Spend / Delivered Orders`
  - `Net Delivery Rate = Delivered Orders / Placed Orders`
  - Use `Delivered CPP = Placed CPP / Net Delivery Rate` **only** when all figures come from the exact same cohort and timeframe. Never multiply Confirmation x Delivery without verifying denominators.
- **Cohort Contribution Economics**:
  - Define `Collected Revenue` explicitly (state whether customer-paid shipping is included).
  - State `RTO Restock` assumption explicitly (e.g., 100% restocked undamaged vs. damaged loss).
  - Formula: `Net Collected Revenue - COGS - Shipping Costs - Packaging - Payment/COD Fees - Discounts/Refunds - RTO/Return/Cancel Costs - Attributable Ad Spend`.
  - **Prohibitions**: Never deduct `Placed CPP` and `Delivered CPP` together; never deduct `RTO allocation` twice if actual shipping/return costs are already in cohort expenses. Distinguish `Gross Profit` vs. `Contribution Profit` vs. `Net Profit`.
  - Distinguish `Cohort Contribution per Delivered Order` (absorbs RTO losses) from `Contribution of an Individual Delivered Order` (standalone delivered unit margin).
  - Run sensitivity checks across varying `RTO Rates` and `Shipping Costs` using `scripts/cod_cohort_calc.py`. Never invent `GPT` or `Break-Even CPP` when data is missing. Allow a `Loss-Leader Test` only with an explicit strategic goal, approved loss budget, duration, and stop conditions.

## 2. Sequential Funnel Diagnosis & Experimentation Protocol
- **Never treat starting benchmarks as absolute rules**: Compare `Hook Rate`, `Hold Rate`, `CTR`, `CPM`, `CPP`, and `LPV / Outbound Clicks` against `Account Baseline`, `Sample Size`, `Spend`, `Duration`, `Attribution Window`, and `Placements`.
- **Sequential Funnel Analysis**: `Outbound Click -> LPV -> ATC -> IC -> Placed Order -> Confirmed Order -> Delivered Order`.
  - *High Hook + High CTR is NOT conclusive proof* of audience or message quality (could be curiosity/clickbait or low-intent placements).
  - Isolate leaks by step before deciding `KEEP / ITERATE / KILL / SCALE / INVESTIGATE / INSUFFICIENT DATA`.
- **Required 7-Field Verdict Format**: `1. What Happened`, `2. Why It Happened`, `3. Evidence`, `4. Confidence`, `5. Recommended Action`, `6. Expected Impact`, `7. What to Measure Next`.

## 3. Zyra Care Brand, Medical Compliance & Data Integrity
- **Visual Identity**: Deep Teal (`#013835`), Warm Ivory/Cream (`#FFF2E9`), Terracotta (`#E2915A` button with `#013835` text). Fonts: `Alexandria` (Headings), `Tajawal` (Body). Egyptian Arabic for customer copy, English for internal tags/analysis, strictly RTL. `9:16` (`1080x1920`) with core elements inside center `1080x1080` safe zone.
- **Medical & Policy Guardrails**:
  - Separate `Cosmetic Appearance Claims`, `Ingredient Facts`, `Clinical Claims`, and `Medical Claims`.
  - Never invent concentrations, clinical studies, before/after results, clinic prices, or unverified guarantees (e.g., 14-day guarantee requires verified Shopify policy confirmation).
  - Never grant `Compliance PASS` without verifying product ingredients, active status, pricing, and Meta policies.
  - Mandatory Retinol warning on Cellulite cream creatives: `"الكريم فيه ريتينول: ممنوع أثناء الحمل، وفي الرضاعة بعد استشارة الدكتور"`.
- **Product Data Integrity**: Resolve any SKU conflicts (`R01/R02` vs. `R03/R04`) by requesting a live Shopify table (`Product ID`, `SKU`, `Product Name`, `Current Price`, `Active Status`). Use **Product Names** until verified.
- **Learning Loop**: Log every experiment (`Hypothesis, Creative ID, Audience, Product, Hook, Angle, Format, Offer, Budget, Dates, Actuals, Sample, Attribution, Profitability, Verdict`) into `Proven Wrapper Library` or `Dead Angle Graveyard`.
