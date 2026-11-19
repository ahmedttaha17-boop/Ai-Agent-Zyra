# ZYRA OS — Marketing Intelligence Department
## Master Architecture & Product Specification | Version 3.3

**Document status:** Owner-operable implementation blueprint — incorporates the v3.1/v3.2 reviews and owner-experience, SLO, alert-governance and measurement refinements; requires technical discovery against the live ZYRA OS before code changes.  
**Operating model:** Autonomous research, monitoring, diagnosis and recommendation; owner-controlled execution.  
**Primary market:** Egypt  
**Brand:** Zyra Care — Problem-Solving Skincare & Body Care  
**Language:** Egyptian Arabic for customer-facing content; English may be used for technical labels and internal specifications.  
**Currency:** EGP

---

# 1. Executive intent

ZYRA OS must gain an integrated **Marketing Intelligence Department**, not a separate application and not merely a chat interface.

The department should continuously or on a configured schedule:

1. Observe connected business data and detect meaningful changes.
2. Research relevant market, competitor, customer and category signals.
3. Diagnose performance problems and identify opportunities.
4. Analyze causes while distinguishing evidence, inference and uncertainty.
5. Generate prioritized recommendations, experiments, creative briefs and execution plans.
6. Track whether recommendations were accepted, rejected, modified or deferred.
7. Measure outcomes and improve future recommendations using verified results.

The owner should be able to open ZYRA OS, see what the department has discovered and what needs attention, inspect the evidence, ask follow-up questions, approve or reject proposed actions, and monitor execution.

**Default autonomy boundary:** The AI may read, research, analyze, draft, calculate, classify, compare, alert and prepare actions within its granted permissions. It must not publish content, send customer messages, change budgets, pause/launch ads, edit campaigns, alter prices, issue discounts, or make other external/business-impacting changes without explicit approval for that action or a clearly defined pre-approved policy.

This is an **autonomous intelligence system with human-governed execution**, not unrestricted autonomous operation.

# 2. Non-negotiable principles

- **Preserve the existing ZYRA OS.** Do not rebuild the product, replace working Shopify/Bosta integrations, or move hosting as part of this project.
- **Discover before modifying.** Inspect the actual repository, database, routes, integrations, permissions, deployment and UI before designing migrations or writing implementation code.
- **One source of truth per fact.** Existing Shopify, Bosta and ZYRA OS records remain authoritative for their respective business facts. Do not duplicate orders or customers just to feed AI.
- **AI investigates; deterministic code calculates.** Financial formulas, thresholds, validation gates, permissions and execution constraints must be implemented and tested in code.
- **Evidence before recommendations.** Every material recommendation must show its data sources, time window, freshness, assumptions, confidence and expected impact.
- **Human approval before external execution.** Approval must be explicit, scoped, time-bound where appropriate, and logged.
- **No invented certainty.** Missing, delayed, conflicting or insufficient data must be disclosed. The system must be able to say “insufficient evidence.”
- **Learn from outcomes, not anecdotes.** A rule becomes established only after adequate observations and validation; correlation is not automatically causation.
- **Privacy by design.** Use aggregated or minimized customer data for AI tasks. Do not send unnecessary personal identifiers or sensitive customer information to model providers.
- **Fail safely.** If a connector, model, calculation or approval service fails, stop the affected action, preserve state and notify the owner.

# 3. Existing platform boundary

The known baseline from prior project discussions is a Node.js application hosted on Fly.io, with an existing web interface and SQLite database, and existing Shopify and Bosta integrations. Meta Ads integration was not confirmed as completed in the latest known project status.

These are discovery inputs, not permission to assume the current deployment still matches them. The implementation team must verify:

- Current repository structure, runtime and package versions.
- Actual database engine, schema, migrations, indexes and backup process.
- Current Shopify and Bosta sync flows, schedules, webhook handling and error recovery.
- Existing order, customer, product, shipment and financial data models.
- Authentication, roles, permissions, session handling and audit logs.
- Existing dashboard routes and UI component conventions.
- Fly.io app configuration, persistent volumes, secrets and deployment pipeline.
- Whether Meta credentials, app review, permissions and API access already exist.
- Existing AI/model integrations, prompt storage and usage tracking, if any.

**Do not assume PostgreSQL, Redis, n8n, vector databases, a new frontend, or a new hosting service.** Introduce a new infrastructure dependency only when discovery and measured load justify it.

# 4. Operating model: the AI department works before being asked

## 4.1 Three operating modes

### A. Continuous / scheduled intelligence

The department runs configured jobs without requiring a user prompt. Examples:

- Daily business and campaign health review.
- Scheduled financial reconciliation and contribution analysis.
- Meta performance and creative fatigue monitoring when Meta data is connected.
- Competitor and market research on approved sources and a defined cadence.
- Customer feedback and complaint theme analysis when permitted data is available.
- Weekly strategic review and experiment proposals.

### B. Event-triggered intelligence

The system reacts to meaningful events, such as:

- Delivery/RTO/return rates crossing a validated threshold.
- A campaign or ad materially deviating from its baseline.
- A creative showing a sustained fatigue signal.
- A product's contribution margin falling below its approved floor.
- A connector sync failing or critical data becoming stale.
- A new competitor offer or market signal being detected.
- A previously approved experiment reaching its review window.

Event triggers must be configurable, deduplicated and protected against alert storms.

### C. User-directed intelligence

The owner can ask questions or assign work in natural language, for example:

- “حلل أداء زيرا آخر 7 أيام وحدد أهم 3 مشاكل وفرص.”
- “ابحث عن المنافسين اللي بيبيعوا حلول KP وراجع عروضهم.”
- “اعمل 5 زوايا إعلانية لروتين السيلوليت بناءً على نتائج الإعلانات.”
- “راجع تكلفة الطلبات المسلّمة وحدد المنتجات الأقل ربحية.”

The Orchestrator identifies intent, scope, required data and permissions. If a required parameter is missing or intent confidence is below the configured threshold, it asks one focused clarification instead of guessing.

## 4.2 Work queue and owner experience

The home screen should answer:

1. What did the department discover?
2. What changed since the last review?
3. What is urgent, and why?
4. What evidence supports the finding?
5. What does the AI recommend?
6. What is the expected benefit, cost and risk?
7. What decision is needed from the owner?
8. What has already been approved and what is its execution status?

Every finding or recommendation should have a status such as:

`New → Investigating → Ready for Review → Approved / Rejected / Deferred → Executing → Completed / Failed → Outcome Review`

The system must distinguish an insight from a recommendation, a recommendation from an approval request, and an approval from successful execution.

# 5. Department modules

## 5.1 Marketing Command Center

The central work queue and decision surface.

Responsibilities:
- Daily and weekly executive summaries.
- Priority-ranked opportunities, risks and anomalies.
- Cross-module findings and recommendations.
- Approval inbox and execution status.
- Data freshness and connector health.
- “What changed?” comparisons against a relevant prior period.

Priority must consider business impact, urgency, confidence, reversibility and effort. Do not rank an item as urgent merely because a metric crossed an unvalidated generic benchmark.

## 5.2 Market & Competitor Intelligence

Responsibilities:
- Research relevant Egyptian skincare/body-care competitors and adjacent categories.
- Track publicly observable positioning, product claims, offers, bundles, pricing, landing pages and creative themes.
- Identify category language, customer objections, emerging angles and seasonal opportunities.
- Produce dated evidence records with source links and observation notes.

Rules:
- Use lawful, publicly accessible sources and approved tools.
- Do not claim access to private competitor sales, ad spend, targeting or conversion data.
- Separate observed facts from interpretation and estimates.
- Record when a source was checked; revalidate volatile information before using it in a decision.
- Competitor creative analysis should produce strategic patterns and differentiated ideas, not direct copying.

## 5.3 Customer Intelligence

Responsibilities:
- Analyze aggregated order behavior, repeat purchase, product combinations and cohort performance.
- Classify customer feedback, reviews, support themes and objections where data access and consent permit.
- Identify common purchase barriers, product expectations and post-purchase issues.
- Recommend segments and retention/upsell opportunities.

Privacy rules:
- Prefer aggregate or pseudonymous records.
- Exclude unnecessary names, phone numbers, addresses and message contents from model prompts.
- Respect WhatsApp, platform, consent and applicable marketing rules.
- Do not send customer communications automatically under the default policy.

## 5.4 Creative Intelligence Studio

Responsibilities:
- Analyze existing images, videos, ad copy, hooks, formats, offers and calls to action.
- Connect creative assets to Meta campaign/ad identifiers and verified performance data when available.
- Generate creative hypotheses, briefs, scripts, statics concepts, UGC briefs and variants.
- Maintain a searchable creative library with version history and outcomes.
- Identify winning patterns and failed approaches with evidence and context.

Every creative asset should have a stable ID and, where applicable, tags for product/routine, audience hypothesis, pain point, angle, hook, format, creator/talent, offer, CTA, placement, language, version and production status.

Do not label a creative a “winner” based on a tiny or biased sample. Store spend, impressions, attribution window, conversion volume and confidence/limitations alongside its performance.

## 5.5 Campaign Intelligence

Responsibilities:
- Monitor campaigns, ad sets and ads after Meta Read Access is available.
- Detect underdelivery, spend anomalies, fatigue signals, tracking gaps and material performance changes.
- Compare performance with ZYRA's own validated baselines and business economics.
- Propose budget reallocations, creative refreshes, audience/structure tests and controlled experiments.
- Prepare execution payloads for approval.

No universal kill/scale threshold should be hard-coded from an old prompt without validation against ZYRA's economics, attribution, conversion volume and campaign objective.

## 5.6 Financial Intelligence Engine

This is a foundational dependency and must be implemented and validated before AI is allowed to make profitability-led recommendations.

Responsibilities:
- Reconcile order, shipment, delivery, cancellation, RTO and return states.
- Calculate contribution economics by order, product, routine, cohort and campaign where attribution is supportable.
- Separate placed-order economics from delivered-order economics.
- Calculate break-even and target acquisition costs using explicitly defined formulas.
- Explain cost components and identify missing or inconsistent inputs.

Required outputs, subject to verified source data:
- Contribution per Placed Order.
- Contribution per Delivered Order.
- Net contribution after attributable marketing and operational costs.
- Break-even Placed CPA and Delivered CPA, with definitions.
- Contribution by SKU/routine and time cohort.
- RTO, cancellation and post-delivery return impact, without double-counting.

**Accounting guardrail:** Never subtract Placed CPP and Delivered CPP as if they were two independent costs. Define each denominator and cost allocation once. Distinguish RTO from cancellation and from post-delivery return. Do not count the same shipping, product or acquisition cost twice.

The engine must use deterministic, versioned code and unit tests. AI may explain the outputs and recommend action; AI must not invent or silently alter the formulas.

Before release, reconcile a representative sample of real orders manually, including delivered, RTO, cancelled, pending and returned cases. Document edge cases and obtain owner sign-off on definitions.

## 5.7 Content Intelligence

Responsibilities:
- Generate and organize an evidence-led content calendar.
- Connect customer questions, product education, seasonal needs and campaign priorities to content ideas.
- Draft Egyptian Arabic captions, scripts, carousels and stories consistent with brand voice.
- Identify gaps in the content mix and repurpose approved creative learnings.

Publishing or scheduling externally requires approval unless a specific narrow policy is explicitly pre-authorized.

## 5.8 Learning & Optimization

Responsibilities:
- Record predictions, decisions, experiments and actual outcomes.
- Compare predicted versus actual performance over defined evaluation windows.
- Identify recurring patterns while accounting for sample size, seasonality, budget, audience, attribution and confounders.
- Update recommendation confidence and surface rules that may need recalibration.
- Preserve human overrides and their outcomes.

Learning must not silently rewrite financial formulas, compliance rules, approval requirements or core operating policies.

# 6. v2.0 Prompt integration: the brain and the execution system

The v2.0 marketing prompt and frameworks should become governed knowledge assets used by the v3.1 department, not one giant prompt pasted into every AI call.

## 6.1 Prompt/knowledge structure

Store and version the source material as modular parts, with metadata:
- `part_id`
- title and purpose
- content or immutable file reference
- version and effective date
- owner/approver
- status: draft, active, retired
- task types that may use it
- dependencies and superseded version

Keep large source documents in versioned file storage where appropriate; store metadata and references in the database. Do not assume a 45,000-word prompt should be placed into one database row or sent in full to every task.

## 6.2 Prompt assembly

The Orchestrator assembles only the relevant approved parts for the task, plus:
- task instructions and output schema;
- brand profile and current approved policies;
- the minimum relevant business data;
- source timestamps and freshness;
- prior relevant experiment/creative learnings;
- explicit uncertainty and permission boundaries.

Example routing (illustrative; exact part IDs must be mapped from the actual v2.0 document):
- Creative generation → brand voice + product facts + creative frameworks + audience insights + offer rules + AEO validation requirements.
- Weekly performance review → financial definitions + campaign analysis framework + creative taxonomy + current Meta/Shopify/Bosta aggregates + learning history.
- Ad diagnosis → campaign rules + verified thresholds + creative performance + financial guardrails.

Create a traceable prompt assembly record for every important task: prompt version, included part IDs, model, data snapshot IDs and output schema version.

## 6.3 Separate executable rules from prose

The following must be deterministic code where the rule is objectively testable:
- Financial calculations and COD/contribution formulas.
- AEO or creative compliance checks that can be expressed as deterministic validations.
- Payday/calendar date checks, if still applicable and approved.
- Budget caps and allocation constraints.
- Permission and approval checks.
- Validated kill/keep/scale guardrails.
- Required-field and output-schema validation.

AI can interpret ambiguous creative quality, explain trade-offs and propose hypotheses. It cannot override code-enforced financial, permission or safety constraints.

For subjective checks, the system may use AI evaluation, but must label it as an assessment rather than a deterministic pass/fail fact.

# 7. Architecture and module communication

## 7.1 Logical architecture

`Existing ZYRA OS UI + API`  
`→ Marketing Command Center`  
`→ AI Orchestrator / Intent Detection / Task Router`  
`→ Domain Engines (Financial, Campaign, Creative, Customer, Market, Content, Learning)`  
`→ Existing Connectors + New Meta Connector + Approved Research Sources`  
`→ Model Adapter + Prompt Assembly + Knowledge Retrieval`  
`→ Recommendation & Approval Workflow`  
`→ Controlled Execution Adapter`  
`→ Audit Log + Outcome/Learning Loop`

The design should initially fit the existing application architecture. A modular monolith is preferred unless discovery shows a concrete reason to split services.

## 7.2 Task Orchestrator

For every task:
1. Parse the request or trigger.
2. Identify intent, entity scope, time window and desired output.
3. Determine required data and permissions.
4. Check connector availability and data freshness.
5. Route to the smallest suitable engine set.
6. Assemble relevant prompt parts and data snapshot.
7. Execute the analysis with a model appropriate to the task.
8. Validate structured output and deterministic constraints.
9. Save evidence, recommendation, cost and execution status.
10. Notify the owner when review or approval is required.

If intent confidence is below a configurable threshold (initial proposal: 0.80, to be tested), or a material scope detail is missing, ask for clarification. Never guess product, budget, audience, date range or execution target.

## 7.3 Module communication

Use typed internal domain events initially if compatible with the existing Node.js application. An in-process event emitter may be sufficient for non-critical notifications, but durable jobs and state-changing workflows must not depend solely on ephemeral in-memory events.

Illustrative events:
- `order_status_changed`
- `shipment_status_changed`
- `financial_snapshot_updated`
- `meta_insights_synced`
- `campaign_anomaly_detected`
- `creative_analysis_completed`
- `creative_asset_approved`
- `recommendation_created`
- `approval_granted`
- `execution_started`
- `execution_completed`
- `execution_failed`
- `experiment_review_due`
- `data_freshness_breached`

Each event should include an event ID, timestamp, source, entity IDs, schema version and correlation/task ID. Consumers must be idempotent. Persist important jobs/events so a restart does not silently lose work.

Adopt a queue/message broker only when measured workload, concurrency or reliability requirements justify it.

# 8. Data model additions — proposals, not assumed existing tables

First map the current schema. Reuse existing entities and add only the minimum necessary tables. Candidate logical entities include:

- `marketing_campaigns`, `marketing_adsets`, `marketing_ads` — only if not already represented by synced source data.
- `creative_assets`, `creative_versions`, `creative_taxonomy`, `creative_performance`.
- `market_observations`, `competitor_profiles`, `research_sources`.
- `customer_insight_aggregates` — avoid copying raw personal data.
- `financial_snapshots`, `financial_formula_versions`, `reconciliation_cases`.
- `marketing_experiments`, `experiment_observations`.
- `ai_tasks`, `ai_recommendations`, `approval_requests`, `execution_logs`.
- `prompt_parts`, `prompt_assemblies`, `knowledge_documents`.
- `learning_predictions`, `learning_outcomes`, `learning_records`.
- `ai_usage_records`, `integration_sync_logs`, `data_freshness_records`.

These are conceptual names, not a mandate to create 20+ tables. Normalize only where useful; avoid storing duplicate copies of Shopify orders, Bosta shipments or customer records.

Every important record should carry appropriate timestamps, source identifiers, version information and status. Add indexes based on observed queries, not guesswork.

# 9. Data freshness, lineage and confidence

Every key metric or insight shown to the owner should expose:
- value and unit;
- source system;
- source period/time window;
- last successful sync or observation timestamp;
- calculation/version where applicable;
- freshness status based on source-specific service expectations;
- confidence or known limitations.

Freshness thresholds must be configured per connector and data type based on actual sync behavior and service guarantees. Do not hard-code claims such as “Meta is always delayed 15–30 minutes” or “Bosta updates every 4–6 hours” without verifying them.

If critical data is stale, conflicting or incomplete, the system must:
- flag the metric as potentially unreliable;
- state which source is stale and when it last updated;
- suppress recommendations that require that metric, or mark them provisional;
- never present stale data as current.

Maintain lineage from recommendation → analysis task → data snapshot/source records → prompt/model version.

# 10. Meta Ads integration: read first, write later

## 10.1 Read access

Integrate Meta Marketing API after verifying app setup, business ownership, permissions, token security and API access. Read the data needed for campaign and creative analysis, such as campaign/ad-set/ad status, spend, impressions, reach, frequency, clicks, CTR, CPM, CPC, attributed results and available video metrics.

Metric availability and definitions vary by objective, placement, API permissions and reporting configuration. The system must store attribution settings and metric definitions and must not assume every metric exists for every ad.

Meta Ad Library may be used separately for public competitor research; it does not reveal private performance metrics.

## 10.2 Write access

Only after read integration, data validation, financial guardrails and approval workflow are proven should controlled write actions be enabled.

Potential actions include pausing/activating ads, editing budgets, creating campaigns/ad sets/ads or changing approved fields. Each action requires:
- exact account/campaign/ad target;
- before and proposed after values;
- rationale and supporting evidence;
- expected impact and downside risk;
- explicit owner approval;
- pre-execution permission and limit checks;
- idempotency protection;
- result verification from Meta;
- audit record and rollback/compensation plan where possible.

Never imply that a proposed change has been applied until the API confirms success.

# 11. Attribution and financial truth

Meta-attributed purchases, Shopify orders and Bosta delivered shipments are different facts. They must not be treated as interchangeable.

Build an explicit attribution mapping layer using available identifiers and documented matching rules. Report unmatched and ambiguous records. Do not force a match merely to make dashboards reconcile.

For each financial report, state:
- order cohort/date basis;
- status inclusion rules;
- cost components included/excluded;
- ad spend allocation method;
- attribution window/source;
- treatment of RTO, cancellation, refund and return;
- data completeness and freshness.

Where campaign-to-order attribution is not supportable, label contribution as unattributed or estimated rather than presenting false precision.

# 12. Learning loop: measurable, reviewable, and conservative

For each material recommendation or experiment, record:

1. **Prediction:** expected direction/range for relevant metrics, expected contribution impact, assumptions, confidence and evaluation window.
2. **Decision:** owner accepted, rejected, modified or deferred; reason if provided.
3. **Execution:** what actually changed, when, where and by whom/system.
4. **Observation:** actual results after the defined window, sample size and data quality.
5. **Comparison:** prediction versus actual, with uncertainty and confounders.
6. **Learning:** candidate pattern or rule, evidence count, scope and confidence.
7. **Review:** owner or authorized reviewer approves promotion of a candidate pattern into an active policy.

Do not use arbitrary claims such as “85% accurate” unless the score has a defined formula and appropriate validation set. Do not promote a pattern to a universal rule based on a few observations. Track human overrides and outcomes, but do not assume repeated overrides alone prove the AI rule is wrong; investigate context.

# 13. AI model strategy and cost controls

Use a model adapter so model providers can be changed without rewriting business logic. Route tasks by capability and cost:
- stronger reasoning for complex strategic analysis;
- lower-cost models for classification, extraction and routine summaries;
- vision-capable models for image/video-frame analysis where needed.

The system must record model/provider, task type, token usage where available, estimated or actual API cost, latency, status and retry count.

Add:
- configurable daily call and monthly spend limits;
- per-task cost ceilings;
- rate limits and concurrency limits;
- timeout and bounded retry policies;
- alert and owner approval for budget overages;
- provider fallback only where output quality and task safety allow;
- safe manual mode if no model is available.

The AI budget amount must be set by the owner after measuring real usage; do not hard-code an arbitrary EGP amount as a universal requirement.

# 14. Approval, permissions and execution safety

Suggested roles (map to actual existing RBAC after discovery):
- Owner: full visibility and final approval authority.
- Marketing Manager: review and prepare recommendations; limited execution approval only if delegated.
- Media Buyer: inspect campaigns and prepare changes within assigned scope.
- Creative Team: create/edit drafts and assets; no campaign publishing by default.

Approval request must show:
- action and exact target;
- current state and proposed state;
- why the change is recommended;
- evidence and data freshness;
- expected benefit, cost and risk;
- reversibility and rollback plan;
- expiry time if the context may change.

Approval is not blanket permission for unrelated future actions. Material changes to target, amount, budget, audience, content or timing require renewed approval unless covered by a clearly defined pre-approved policy.

Keep an immutable or tamper-evident audit trail for approvals and external actions. Provide a global pause control for AI background jobs and a separate emergency stop for external execution.

# 15. Reliability, backups and recovery

- Verify Fly.io persistent storage and current SQLite durability/backup configuration.
- Establish automated backups and test restoration, not merely backup creation.
- Take a recoverable backup before schema migrations.
- Use versioned, reversible migrations where feasible.
- Set task timeouts, bounded retries, maximum iterations and deduplication keys.
- Prevent runaway schedules and duplicate notifications.
- Provide global pause for background intelligence and a separate execution kill switch.
- Keep failed tasks inspectable and safely retryable.
- Never let AI task failure interrupt core Shopify/Bosta order operations.

SQLite remains the starting point only if the actual deployment, workload and concurrency support it. Design migrations to be portable where practical. Measure write contention, query latency, database size, backup/restore time and job concurrency. Plan a PostgreSQL migration when measured service objectives or workload require it; neither promise that SQLite will fail after six months nor mandate a migration at an arbitrary phase.

# 16. Dashboard information architecture

Proposed navigation, to be adapted to existing UI conventions:

1. Overview / Command Center
2. AI Work Queue
3. Campaign Intelligence
4. Creative Studio
5. Creative Library
6. Financial Intelligence
7. Customer Intelligence
8. Market & Competitor Research
9. Content Calendar
10. Experiments & Learning
11. Approvals & Execution Log
12. Integrations & Data Health
13. AI Settings / Prompt & Policy Versions

Each screen should prioritize decisions and evidence over decorative AI chat. Chat is an interface to assign work and investigate findings, not the whole product.

# 17. Revised implementation roadmap

The order below is dependency-based. Some discovery and foundation work can run in parallel, but no phase should be declared complete without its acceptance tests.

## Phase 0 — Technical Discovery, Prompt Inventory & Baseline Audit

Run two coordinated workstreams where access allows:

**Workstream A — Technical Discovery**
- Inspect actual codebase, database, APIs, integrations, UI, auth, deployment and backups.
- Map existing data entities and source-of-truth ownership.
- Verify current Shopify/Bosta behavior, Meta integration status and available permissions.
- Produce architecture map, data dictionary, risk register and prioritized backlog.

**Workstream B — v2.0 Prompt Inventory**
- Inventory every source part and appendix in the actual approved v2.0 prompt. The expected structure has been described as 15 parts and 13 appendices, but the inventory must verify the actual file rather than assume those counts.
- For each item record: stable ID, exact title, word count, purpose, owner/version, dependencies, applicable task(s), and whether it is AI context, deterministic code, or a hybrid check.
- Inventory all eight frameworks, ten AEO points and seven task types exactly as they appear in the source. Record conflicts, duplicate rules, obsolete thresholds and missing definitions.
- Produce a task-to-prompt assembly matrix showing the exact source parts each task needs.
- Separate executable business rules from explanatory strategy. Do not convert prose into code until the rule's meaning, inputs, edge cases and owner approval are clear.

**Planning estimate:** 2–3 weeks for Phase 0 and approximately one week for the prompt inventory may be used for initial planning only. Actual duration depends on repository access, document quality and integration complexity. The prompt inventory can run in parallel with technical discovery.

**Exit criteria:** approved as-is architecture; verified v2.0 inventory and mapping; no-duplicate/no-rebuild implementation plan; named unresolved decisions and owners.

## Phase 1 — Financial Truth + Core Intelligence Foundation

- Hold a Financial Definitions Sign-Off before production calculations are used for decisions.
- Select and manually reconcile a stratified sample of real orders, including delivered, RTO, cancelled, pending and post-delivery returned cases. Twenty orders may be a useful initial review sample, but it is not a statistical guarantee; expand the sample if categories or edge cases are not represented.
- Obtain owner sign-off on contribution definitions, cost allocation, placed/delivered denominators, RTO treatment, refunds/returns and attribution limitations.
- Implement deterministic financial calculations and reconciliation reports with versioned formulas and unit tests.
- Build task records, orchestrator skeleton, prompt assembly/versioning and model adapter.
- Add data freshness, source lineage, usage/cost logging and approval workflow foundations.
- During the initial AI usage baseline period (proposed: first two weeks after metering is available), measure actual tokens, provider charges, latency, failures and task mix. Do not set a permanent monthly budget from guessed usage; present the baseline to the owner for approval.
- Add backup, recovery, task timeout, bounded retry and pause controls.

**Exit criteria:** signed financial definitions; financial outputs reconcile against manually checked real orders and documented edge cases; AI cannot bypass code guardrails or execute external changes; AI usage is measurable.

## Phase 2 — Meta Read Access + Monitoring

- Connect Meta read-only reporting.
- Map campaign/ad identifiers to creative assets and business outcomes where possible.
- Store attribution configuration, metric definitions and sync health.
- Add daily monitoring and anomaly reports.

**Exit criteria:** sample reports reconcile with Meta UI/API within documented differences; missing metrics and attribution limitations are explicit.

## Phase 3 — Creative Intelligence Studio

- Ingest and tag existing creative assets.
- Connect assets to verified campaign/ad performance.
- Generate briefs, scripts and variants using relevant v2.0 modules.
- Add creative versioning, evidence-based winner/loser review and AEO/code validation where applicable.

**Exit criteria:** each insight can be traced to asset versions and performance data; generated content remains draft until approved.

## Phase 4 — Campaign Intelligence + Controlled Write Pilot

- Add campaign diagnosis and proposed action plans.
- Pilot one or a small number of reversible Meta actions with explicit approval.
- Verify execution, audit logging, idempotency and failure recovery.

**Exit criteria:** no unapproved external changes; approved changes are verified and fully logged.

## Phase 5 — Market & Customer Intelligence

- Add public competitor research and source tracking.
- Add privacy-minimized customer feedback and cohort insights.
- Connect findings to creative and product hypotheses.

**Exit criteria:** evidence/source provenance and privacy controls pass review.

## Phase 6 — Content Intelligence + Learning Loop

- Build content calendar and approved content workflows.
- Add prediction/outcome evaluation and experiment tracking.
- Promote candidate learnings only after evidence and review.

**Exit criteria:** prediction accuracy and learning claims are measurable, scoped and reviewable.

## Phase 7 — Scale, Optimization & Stress Testing

- Load test background tasks, dashboard reads and connector syncs.
- Review database performance and decide whether PostgreSQL is justified by measurements.
- Test provider outages, stale data, duplicate events, partial API failures, restore and pause scenarios.
- Expand controlled execution only after pilot success.

**Exit criteria:** documented service objectives, tested recovery and owner-approved operating policy.

# 18. Acceptance criteria for the complete department

The department is not production-ready merely because the dashboard renders or an AI answer looks plausible.

It must demonstrate:

- Existing Shopify/Bosta operations remain intact.
- Financial calculations match manually reconciled sample orders and documented edge cases.
- No duplicate or lost order/shipment records caused by the new layer.
- Meta data maps to the correct account/campaign/ad and records attribution settings.
- Every key metric shows source and freshness.
- Recommendations include evidence, assumptions, confidence and limitations.
- Ambiguous requests trigger clarification rather than guessed execution targets.
- No external action occurs without valid approval or an explicitly pre-approved narrow policy.
- All external actions have before/after values, actor, timestamp, API result and audit record.
- Creative assets have stable identity, versions, taxonomy and measurable outcomes.
- Learning records compare predictions with actual outcomes and disclose sample limitations.
- AI cost, failures, retries and rate limits are visible.
- Backups can be restored and the AI layer can be paused without stopping core operations.

# 19. Key risks and assumptions to validate

| Topic | Current position | Required validation |
|---|---|---|
| SQLite capacity | Keep initially if current deployment supports it | Measure concurrency, locks, query latency, size and restore performance |
| PostgreSQL migration | Plan portability; do not mandate a calendar date | Trigger only from measured workload/service needs |
| Meta metric delay | Varies by metric/API/reporting context | Measure sync behavior and document source-specific freshness |
| Bosta update cadence | Not assumed | Inspect actual integration/webhooks/polling and observed latency |
| Creative performance rules | Historical thresholds are hypotheses until validated | Backtest against ZYRA data with sample-size safeguards |
| Learning patterns | Correlation is not causation | Use controlled tests where possible and label observational findings |
| AI budget | Owner-defined after baseline | Measure real token/API spend and set limits |
| v2.0 prompt structure | Must be mapped exactly | Inventory parts, appendices, rules and conflicts before assembly |
| Existing RBAC and schema | Unknown until inspection | Reuse actual models and permissions; do not invent a parallel system |

# 20. v2.0 Prompt Inventory & Framework-to-Engine Mapping

This is a required Phase 0 deliverable, not an optional documentation exercise. The actual v2.0 source file is authoritative. Do not invent part IDs, titles, word counts or framework definitions from memory or from earlier summaries.

## 20.1 Prompt inventory schema

Create a standalone `ZYRA_v2.0_Prompt_Inventory.md` (or equivalent structured artifact) containing one row per source part and appendix:

| Field | Required meaning |
|---|---|
| `source_id` | Stable ID matching the actual source document |
| `title` | Exact source title |
| `word_count` | Measured count using a documented method |
| `purpose` | What the section governs |
| `task_mapping` | Which of the seven source task types use it |
| `execution_type` | AI context, deterministic code, hybrid, or reference-only |
| `inputs_outputs` | Required inputs and expected outputs |
| `dependencies` | Other parts, data or policies required |
| `conflicts` | Contradictions, duplicate rules or obsolete guidance |
| `status` | Active, needs clarification, superseded or rejected |

The inventory must verify whether the source truly contains 15 parts, 13 appendices, eight frameworks, ten AEO points and seven tasks. These counts are expected from prior descriptions, not substitutes for source inspection.

## 20.2 Initial framework mapping — pending source verification

The following is a routing hypothesis to validate against the exact v2.0 definitions. It is not permission to reinterpret or rewrite those frameworks:

| Framework / rule named in the review | Candidate destination | Implementation boundary |
|---|---|---|
| Fraser Cottrell | Creative Strategy / Creative Intelligence | AI uses the verified framework to develop strategy and hypotheses; outputs remain drafts until reviewed |
| Charley 75/20/5 | Budget allocation policy | Encode only after exact definitions, denominator, scope and owner-approved constraints are confirmed |
| 3:2:2 | Campaign structure / deployment planner | Must inventory the precise meaning first; do not assume it means a generic count of ads, audiences or creatives |
| 4PI+2 | Product lifecycle / product intelligence | Map exact stages, states, triggers and required evidence before coding |
| COD Math | Financial Intelligence Engine | Deterministic, tested calculation; AI explains the result but does not calculate or override it |
| 70/20/10 | Budget allocation / portfolio policy | Code-enforced only after owner sign-off on what each allocation bucket means and how exceptions work |
| 7-Stage Flywheel | Orchestrator / review workflow | Convert verified stages into task states, events and review checkpoints |
| AEO (10 points) | Creative validation / compliance gate | Deterministic points become code checks; subjective points remain AI assessments with explicit labels and human review |

For every mapping, document: exact source passage, interpretation, destination module, code/context classification, test cases, owner and approval status. If the source is ambiguous, preserve the ambiguity as an open decision rather than silently choosing a meaning.

# 21. Learning evidence thresholds and policy promotion

Learning maturity must be based on evidence quality, not a single universal observation count. The following counts are proposed *minimum review gates* for an initial implementation, not proof of statistical validity:

- **Candidate pattern:** at least 5 relevant observations, with scope and confounders recorded.
- **Validated pattern:** target at least 20 relevant observations spanning at least two weeks, with consistent direction and no obvious data-quality defect. If the observations are highly correlated or concentrated in one campaign/ad set, they do not count as 20 independent observations.
- **Active policy candidate:** target at least 50 relevant observations across at least four weeks, plus a documented backtest or controlled experiment where feasible, impact/risk assessment and explicit owner approval.

These gates must be configurable by metric and experiment type. For low-volume outcomes, use longer observation windows or controlled tests rather than pretending the minimum count proves causality. A pattern must be scoped (product, audience hypothesis, placement, objective, season and account context) and must not be promoted to a universal rule merely because it passed a count threshold.

If a candidate contradicts an existing approved policy, it must be escalated for owner review. The system must not silently change the policy. Track human overrides as evidence for investigation, not automatic proof that either the AI or the human was correct.

# 22. Egyptian market and ZYRA operating context

The marketing department must preserve verified Egypt-specific operating context from the approved brand/business profile and the v2.0 source. It must not treat unverified operational claims as universal truths.

Phase 0 must explicitly inventory and classify:
- Egyptian Arabic brand voice and customer-facing language rules.
- COD order flow and the actual role of WhatsApp confirmation in ZYRA's process.
- Payday-related calendar logic, including the described 25th-to-1st period, if confirmed as a current approved business rule.
- Actual Bosta delivery service levels by region, based on ZYRA's integration and observed shipment history; do not hard-code claims such as Cairo 48h, Delta 72h or Upper Egypt 120h without validation.
- Seasonality and product/routine associations (including the referenced winter/summer and wedding-season rules), after checking current product portfolio, historical sales and the exact v2.0 source.
- Offer, discount, shipping, return and customer-contact policies.

Classify each item as one of: verified business fact, owner-approved policy, historical observation, hypothesis or unknown. Deterministic date/eligibility/financial rules belong in code once approved. Cultural interpretation, message tone and creative adaptation belong in AI context, subject to brand and compliance review.

# 23. AI cost baseline and operating budget

Phase 1 must enable usage metering before a monthly AI budget is fixed. For the initial measurement window (proposed two weeks), report by task and model:
- number of calls and successful/failed calls;
- input/output tokens where provided;
- actual provider charge and currency, plus recorded FX conversion method if shown in EGP;
- average and p95 latency;
- retries and fallback usage;
- cost per completed task and cost per useful approved output where measurable.

At the end of the baseline window, present observed weekly/monthly run-rate scenarios to the owner. The owner sets the budget and alert thresholds. Enforce hard limits in code, but support a manual pause and owner-approved overage. Provider outage or budget exhaustion must not silently switch to an unapproved model or trigger low-quality autonomous execution; use a visible degraded/manual mode.

# 24. Review of the v3.1 assessment: accepted decisions and cautions

The supplied review's central conclusions are accepted: v3.1 materially improves governance through deterministic code boundaries, uncertainty disclosure, event-triggered intelligence, a durable work queue, staged Meta write access and a measurement-led infrastructure strategy.

The following refinements are incorporated in v3.2:
1. Phase 0 now includes a standalone v2.0 Prompt Inventory and exact task-to-part mapping.
2. Creative Studio must map the verified v2.0 frameworks before generation workflows are considered complete.
3. Learning now has explicit, configurable evidence maturity gates, while clarifying that counts alone do not establish statistical validity or causation.
4. AI cost measurement is a Phase 1 deliverable, with an initial two-week baseline proposal before owner-set limits.
5. Egypt-specific commercial and operational context is explicitly inventoried and classified before it becomes code or AI policy.
6. Financial Definitions Sign-Off is required before production financial recommendations rely on the engine.

The following statements from the review must remain hypotheses until validated:
- “5 / 20 / 50 observations” are governance floors for review, not statistically sufficient sample sizes in every case.
- “20 orders” is a practical initial reconciliation sample, not a guarantee that all financial edge cases are covered.
- Two weeks is a proposed AI-cost baseline window, not necessarily enough for rare or seasonal task types.
- Payday dates, COD/WhatsApp process, regional Bosta delivery times and seasonal product associations must be verified against current approved ZYRA policies and data.
- No universal SQLite failure date or mandatory PostgreSQL migration phase should be imposed; measured workload and recovery objectives decide.

# 25. Immediate next deliverables (revised)

1. **ZYRA OS Technical Discovery & Architecture Audit** — actual codebase, schema, APIs, integrations, RBAC, UI, Fly.io deployment, persistence, backup and recovery.
2. **ZYRA v2.0 Prompt Inventory** — exact parts, appendices, frameworks, AEO points, seven tasks, conflicts and task-to-part assembly map.
3. **ZYRA Financial Definitions & Reconciliation Pack** — status taxonomy, formula dictionary, cost allocation, sample order reconciliation and owner sign-off.
4. **ZYRA Egypt Operating Context Register** — verified policies and facts separated from historical observations and hypotheses.

No implementation phase should proceed on guessed schema, guessed prompt mappings, guessed financial definitions or unverified market rules.

---

# 26. Immediate next deliverable

The first implementation deliverable is **ZYRA OS Technical Discovery & Architecture Audit**, not code changes.

It must include:
1. Existing system architecture diagram.
2. Database schema and source-of-truth map.
3. Shopify/Bosta integration and sync map.
4. Meta integration readiness assessment.
5. Authentication, roles and permission map.
6. Current dashboard/navigation map.
7. Deployment, secrets, persistence and backup assessment.
8. v2.0 prompt inventory and mapping to domain engines.
9. Data quality/freshness gaps.
10. Risk register and phased implementation backlog with effort/dependencies.

No destructive migration, hosting move, replacement of working integrations, or broad Meta write permission should happen during discovery.

---

# Final operating contract

**The department works proactively. The owner stays in control.**

- AI monitors, researches, discovers, analyzes, calculates through approved code, diagnoses, drafts and recommends.
- AI presents prioritized findings with evidence, freshness, confidence, expected impact and risk.
- The owner reviews, questions, approves, rejects or modifies recommendations.
- The execution layer performs only the specifically approved action and verifies the result.
- The system records the outcome and uses it to improve future recommendations.

**AI investigates. Code validates and calculates. The owner decides. Approved execution acts. The system measures and learns.**


# 27. Owner One-Page Operating Brief — What happens on Day 1

The owner opens the existing ZYRA OS and lands on a focused Command Center, not a blank AI chat. It shows:
- **New findings:** issues and opportunities discovered since the previous review, with evidence and timestamps.
- **Needs your decision:** recommendations waiting for approval, rejection or deferral.
- **In progress:** approved tasks currently executing, including failures.
- **Outcome review:** completed actions whose results are ready to assess.
- **System health:** last successful Shopify, Bosta and (once connected) Meta sync; stale data; AI task failures and usage.

Subject to available integrations and configured schedules, the department checks permitted business data, detects changes, researches approved public sources, investigates anomalies, prepares recommendations and places useful work in the queue. It does not publish, message customers, change budgets, pause ads, alter prices or make other external business-impacting changes without required approval.

Day 1 does **not** mean all connectors are integrated, all frameworks mapped or Meta write access enabled. Label each capability **Live**, **Read-only**, **Draft-only**, **Pending connection**, or **Not yet implemented**. Day 1 means safe inspection, source freshness, auditable findings, transparent uncertainty and an owner decision workflow.

Initial owner scorecard (targets set after Phase 0 baselining):
1. Evidence integrity: material findings with traceable sources, time windows, freshness and limitations.
2. Decision usefulness: owner-rated usefulness and rejection/deferment reasons by recommendation type.
3. Execution reliability: approved actions completed against the correct target, verified externally and logged.
4. Business outcome: realized incremental contribution or avoided loss where attribution is supportable; otherwise “inconclusive.”
5. Operational reliability: freshness compliance, task success/failure, latency and recovery.

Do not optimize for finding volume or approval rate alone; both can reward trivial recommendations.

# 28. Owner Sign-Off Pack

Before production financial recommendations, provide a concise, versioned decision pack. Every item needs an exact definition, evidence/source, decision, named approver and effective date.

| Decision area | Owner approval required | Guardrail |
|---|---|---|
| Autonomy boundary | Read-only, draft-only, approval-required and narrowly pre-authorized actions | “Let AI work” is not blanket execution permission |
| Financial definitions | Order states, revenue basis, COGS, shipping, packaging, fees, refunds, RTO, cancellation, return and ad-spend allocation | Placed and delivered economics are distinct |
| Attribution | Matching keys, attribution window, unmatched records, estimated vs observed reporting | Meta purchases ≠ Shopify orders ≠ Bosta deliveries |
| Egypt context | COD/WhatsApp process, payday, regional delivery, offers, returns, seasonality and language | Historical assumptions are not current policy by default |
| Learning policy | Evidence gates, scope, review authority and promotion process | Counts alone do not prove causality or significance |
| AI cost | Monthly budget, per-task ceiling, rate limits, overage and fallback | Measure usage before setting a permanent budget |
| Service objectives | Freshness, latency, availability, recovery and alert response | Set from measured baseline and business criticality |
| Privacy | Permitted sources, minimization, retention, access and contact consent | Data access does not imply permission to send all data to a model |

Unresolved items remain **Open — owner decision required** and block dependent production behavior. Approval records must capture the exact policy/decision-pack version.

# 29. Service Level Objectives (SLOs) and operational measurement

SLOs must cover user-visible and business-critical workflows, not just server uptime. Phase 0 measures the baseline; Phase 1 proposes targets for owner approval. Proposed targets must never be presented as achieved performance.

| Category | Service-level indicator (SLI) | Reporting requirement |
|---|---|---|
| Dashboard | p50/p95/p99 latency for key routes and work-queue actions | By route and time window; separate third-party wait time |
| Availability | Successful health checks and critical owner workflows | Separate planned maintenance and dependency outages |
| Data freshness | Age of latest successful sync vs approved source-specific objective | Per connector/data type; show last success/failure |
| Sync reliability | Successful/partial/failed runs, lag and reconciliation exceptions | Per Shopify, Bosta, Meta and future sources |
| AI tasks | Completed, failed, timed-out, retried and cancelled tasks | By task/model; distinguish provider and validation failures |
| Execution | Approved actions executed against exact target and verified | Include expired, duplicate-blocked, failed and rolled-back actions |
| Recovery | Detection, restoration and backup-recovery time | Test restoration, not merely backup creation |

Procedure: (1) measure normal and peak periods in Phase 0; (2) identify critical workflows; (3) propose targets/error budgets in Phase 1; (4) set freshness objectives from observed sync behavior and provider constraints; (5) review monthly and after material changes.

A dashboard p95 threshold such as 500 ms may be evaluated as a candidate optimization trigger, not a universal requirement. Measure actual routes, payloads, caching and user impact. Do not promise fixed uptime or Meta/Bosta freshness windows without baseline evidence.

On breach, create/update one incident, mark affected metrics stale/degraded, suppress dependent recommendations or mark them provisional, notify according to severity, and record recovery/reconciliation needs.

# 30. Alert Storm Protection Policy

A single underlying incident must not create dozens of owner notifications.

**Fingerprint and deduplication:** create a stable fingerprint from source/subsystem, entity type/ID, rule ID/version, severity and relevant time window. If the same active fingerprint recurs, update its evidence, occurrence count and `last_seen_at`; do not create another alert. Do not merge unrelated incidents merely because they share a category.

**Grouping and cooldown:** group alerts only when a shared root cause is supported (for example, one connector outage affecting multiple metrics). Configure cooldown by alert class; append observations to the active incident during cooldown. Notify again on severity increase, material scope expansion, escalation-window breach or recovery. Recovery notices should state what needs revalidation.

**Retry policy:** use exponential backoff with jitter for transient connector/API failures, respecting provider rate limits and a maximum retry/time budget. Backoff is not alert deduplication. Do not retry permanent failures (revoked credentials, invalid permissions, malformed requests) indefinitely; create one actionable incident and pause the affected integration.

**Severity:** Critical (unsafe external execution, financial integrity failure or core order workflow impact); High (critical source stale/unavailable and dependent decisions unsafe); Medium (degraded non-critical analysis or repeated task failure with workaround); Low (informational/recoverable events suitable for digest). Exact channels, cooldowns and escalation timers are configuration decisions after Phase 0. Each alert must state the owner action or that no action is required.

# 31. Creative Performance Evidence and Winner Validation

Do not declare a creative a winner using a universal conversion count or fixed CPA tolerance alone. The method depends on objective, baseline rate, spend, attribution, conversion volume, audience overlap, placement, time window and outcome variance.

For each comparison retain: stable creative/version IDs; campaign/ad set/ad IDs and objective; date range, spend, impressions, reach and frequency; attribution settings and event definition; primary and guardrail metrics; conversions and denominator; audience/placement/offer context; delivery/business outcome linkage where available; freshness, missing fields and confounders.

Evaluation protocol:
1. Define the primary metric and guardrails before the test (e.g. delivered-order contribution or qualified purchase CPA).
2. Define the comparator and whether the design is randomized, split-tested or observational.
3. Assess sample adequacy for the expected effect and baseline variance; use confidence intervals or a pre-specified Bayesian decision rule where appropriate, documenting assumptions.
4. Account for multiple comparisons, audience overlap, budget imbalance, learning phase, seasonality and attribution changes.
5. Require business-outcome validation for profitability/delivery claims, not just Meta CTR or attributed purchases.
6. Classify as **Insufficient evidence**, **Promising**, **Validated for this scope**, or **Declining/Fatigued**, retaining scope and evaluation window.

“100+ conversions and CPA within ±20% of baseline” may be a screening heuristic in a particular test, but is not a universal statistical-significance test. Depending on baseline rate, spend, variance and design, it can miss real effects or certify noise. Select and document the method before reading results.

“Winner” means better performance against a defined objective/comparator in a stated scope and period—not across every product, audience, season or budget. Re-evaluate after material changes to offer, audience, placement, landing page, price, availability or market conditions.

# 32. Dashboard Information Architecture — Owner-first navigation

The 13 proposed views remain capabilities, but need not all be top-level tabs. Inspect the existing UI in Phase 0 and validate navigation with the owner before expansion.

Suggested primary navigation:
1. **Command Center** — findings, priorities, data health and executive summary.
2. **Work Queue** — investigations, recommendations, decisions and outcome reviews.
3. **Performance** — campaigns, creatives and financial intelligence as subviews.
4. **Research & Content** — market, customer, competitor and content workflows.
5. **Approvals & Activity** — approval inbox, execution log and audit trail.

Integrations, prompt versions, policies and advanced diagnostics can live under Settings/System Health or contextual drill-downs. Validate with owner tasks: find a risk, approve a recommendation, inspect evidence and verify execution. This is a proposal, not a mandate to replace the current dashboard.

# 33. Success Scorecard and Anti-Gaming Rules

The owner approves 3–5 primary measures after Phase 0. Candidate measures:
- Evidence completeness: recommendations with valid source lineage, freshness, scope and limitations.
- Decision quality: owner usefulness rating and rejection/deferment reasons by task type; acceptance rate is diagnostic, not a standalone target.
- Execution correctness: approved external actions applied to the exact approved target and independently verified.
- Business impact: realized contribution improvement/avoided loss where attribution supports it; otherwise “not attributable” or “inconclusive.”
- Operational health: SLO attainment, sync reliability, task completion, recovery and AI cost per useful completed task.

Anti-gaming rules: do not reward raw recommendation volume; do not reward approval rate without quality/outcome review; approval or execution alone is not success; do not claim incremental lift from before/after comparisons without addressing confounders; report rejected, deferred, expired and failed recommendations; periodically review false positives and missed opportunities.

# 34. v3.3 Change Log

This release adds: (1) owner-facing Day 1 operating brief; (2) Owner Sign-Off Pack; (3) SLI/SLO baseline-to-target process; (4) alert fingerprinting, deduplication, grouping, cooldown and escalation; (5) scoped creative winner evaluation; (6) owner-first navigation; and (7) balanced success scorecard with anti-gaming rules. The v3.2 architecture, discovery-first rule, existing-platform preservation, deterministic financial guardrails and owner-controlled execution boundary remain in force.
