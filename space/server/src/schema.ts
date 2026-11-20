import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  type: text("type", { enum: ["A","B","C","D","E","F","G"] }).notNull(),
  objective: text("objective").notNull().default(""),
  status: text("status", { enum: ["New","Investigating","Ready for Review","Approved","Rejected","Deferred","Executing","Completed","Failed","Outcome Review"] }).notNull().default("New"),
  evidenceTag: text("evidence_tag", { enum: ["VERIFIED","ZYRA PROVEN","HYPOTHESIS","ESTIMATED","UNKNOWN","OUTDATED"] }).notNull().default("UNKNOWN"),
  assumptions: text("assumptions").notNull().default(""),
  confidence: integer("confidence").notNull().default(50),
  freshness: text("freshness").notNull().default(""),
  stage: integer("stage").notNull().default(1),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const approvals = sqliteTable("approvals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  actionType: text("action_type", { enum: ["Publish","Budget Change","Price Change","Discount","Pause Campaign","Launch Campaign","Message Customers","Other"] }).notNull(),
  description: text("description").notNull().default(""),
  status: text("status", { enum: ["Pending","Approved","Rejected","Deferred"] }).notNull().default("Pending"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  decidedAt: integer("decided_at", { mode: "timestamp_ms" }),
});

export const learnings = sqliteTable("learnings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hypothesis: text("hypothesis").notNull(),
  decision: text("decision").notNull().default(""),
  expectedOutcome: text("expected_outcome").notNull().default(""),
  actualOutcome: text("actual_outcome").notNull().default(""),
  verdict: text("verdict", { enum: ["Pending","Validated","Invalidated","Inconclusive"] }).notNull().default("Pending"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const systemChecks = sqliteTable("system_checks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  checkedAt: integer("checked_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  note: text("note").notNull().default(""),
  tasksCount: integer("tasks_count").notNull().default(0),
  approvalsPending: integer("approvals_pending").notNull().default(0),
});

export const workItems = sqliteTable("work_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  sourceType: text("source_type").notNull().default("Manual"),
  status: text("status").notNull().default("New"),
  stage: integer("stage").notNull().default(1),
  ownerRole: text("owner_role").notNull().default("Owner"),
  priority: text("priority").notNull().default("Medium"),
  dueDate: text("due_date").notNull().default(""),
  progress: integer("progress").notNull().default(0),
  blocker: text("blocker").notNull().default(""),
  nextAction: text("next_action").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const campaigns = sqliteTable("campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  platform: text("platform").notNull().default("Meta"),
  objective: text("objective").notNull().default(""),
  status: text("status").notNull().default("Draft"),
  budget: real("budget").notNull().default(0),
  spent: real("spent").notNull().default(0),
  results: text("results").notNull().default(""),
  period: text("period").notNull().default(""),
  attribution: text("attribution").notNull().default("7-day click"),
  weeklyOrders: integer("weekly_orders").notNull().default(0),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const creatives = sqliteTable("creatives", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  cisTag: text("cis_tag").notNull().default(""),
  product: text("product").notNull().default(""),
  angle: text("angle").notNull().default(""),
  hook: text("hook").notNull().default(""),
  format: text("format").notNull().default(""),
  talent: text("talent").notNull().default(""),
  lever: text("lever").notNull().default(""),
  version: integer("version").notNull().default(1),
  status: text("status").notNull().default("Concept Draft"),
  perfClass: text("perf_class").notNull().default("Insufficient Evidence"),
  hookRate: real("hook_rate").notNull().default(0),
  holdRate: real("hold_rate").notNull().default(0),
  outboundCtr: real("outbound_ctr").notNull().default(0),
  cvr: real("cvr").notNull().default(0),
  cpp: real("cpp").notNull().default(0),
  spend: real("spend").notNull().default(0),
  ordersDelivered: integer("orders_delivered").notNull().default(0),
  whyNote: text("why_note").notNull().default(""),
  notes: text("notes").notNull().default(""),
  imageBlobKey: text("image_blob_key").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const contentItems = sqliteTable("content_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  channel: text("channel").notNull().default("Instagram"),
  pillar: text("pillar").notNull().default(""),
  format: text("format").notNull().default("Reel"),
  status: text("status").notNull().default("Idea"),
  scheduledDate: text("scheduled_date").notNull().default(""),
  captionDraft: text("caption_draft").notNull().default(""),
  innovationBucket: text("innovation_bucket").notNull().default("70% Proven"),
  depthBucket: text("depth_bucket").notNull().default("75% Deep Problem-Solving"),
  sourceIdea: text("source_idea").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const competitors = sqliteTable("competitors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull().default(""),
  positioning: text("positioning").notNull().default(""),
  offer: text("offer").notNull().default(""),
  priceNote: text("price_note").notNull().default(""),
  sourceUrl: text("source_url").notNull().default(""),
  websiteUrl: text("website_url").notNull().default(""),
  metaPage: text("meta_page").notNull().default(""),
  tiktokHandle: text("tiktok_handle").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const observations = sqliteTable("observations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  source: text("source").notNull().default(""),
  observedDate: text("observed_date").notNull().default(""),
  evidenceTag: text("evidence_tag").notNull().default("UNKNOWN"),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const customerInsights = sqliteTable("customer_insights", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  theme: text("theme").notNull(),
  insightType: text("insight_type").notNull().default("Objection"),
  summary: text("summary").notNull().default(""),
  frequency: text("frequency").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const financialSnapshots = sqliteTable("financial_snapshots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  period: text("period").notNull().default(""),
  product: text("product").notNull().default(""),
  placed: integer("placed").notNull().default(0),
  delivered: integer("delivered").notNull().default(0),
  contributionPlaced: real("contribution_placed").notNull().default(0),
  contributionDelivered: real("contribution_delivered").notNull().default(0),
  breakevenRoas: real("breakeven_roas").notNull().default(0),
  rtoRate: real("rto_rate").notNull().default(0),
  shipCost: real("ship_cost").notNull().default(0),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const experiments = sqliteTable("experiments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hypothesis: text("hypothesis").notNull(),
  creativeId: text("creative_id").notNull().default(""),
  audience: text("audience").notNull().default(""),
  product: text("product").notNull().default(""),
  hook: text("hook").notNull().default(""),
  angle: text("angle").notNull().default(""),
  format: text("format").notNull().default(""),
  offer: text("offer").notNull().default(""),
  budget: real("budget").notNull().default(0),
  startDate: text("start_date").notNull().default(""),
  endDate: text("end_date").notNull().default(""),
  actuals: text("actuals").notNull().default(""),
  sampleSize: text("sample_size").notNull().default(""),
  attribution: text("attribution").notNull().default(""),
  profitability: text("profitability").notNull().default(""),
  basketJson: text("basket_json").notNull().default(""),
  verdict: text("verdict").notNull().default("Running"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  reviewType: text("review_type").notNull().default("Weekly"),
  period: text("period").notNull().default(""),
  summary: text("summary").notNull().default(""),
  findings: text("findings").notNull().default(""),
  decisions: text("decisions").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const executionLogs = sqliteTable("execution_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  actionType: text("action_type").notNull().default("Other"),
  target: text("target").notNull().default(""),
  beforeValue: text("before_value").notNull().default(""),
  afterValue: text("after_value").notNull().default(""),
  result: text("result").notNull().default("Completed"),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const coreProfiles = sqliteTable("core_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  brandName: text("brand_name").notNull().default("Zyra Care"),
  websiteUrl: text("website_url").notNull().default(""),
  market: text("market").notNull().default("Egypt"),
  currency: text("currency").notNull().default("EGP"),
  customerLanguage: text("customer_language").notNull().default("Egyptian Arabic"),
  metaPage: text("meta_page").notNull().default(""),
  instagramHandle: text("instagram_handle").notNull().default(""),
  tiktokHandle: text("tiktok_handle").notNull().default(""),
  heroOffer: text("hero_offer").notNull().default(""),
  shippingPolicy: text("shipping_policy").notNull().default(""),
  returnPolicy: text("return_policy").notNull().default(""),
  guarantee: text("guarantee").notNull().default(""),
  icp7ws: text("icp_7ws").notNull().default(""),
  approvedClaims: text("approved_claims").notNull().default(""),
  bannedClaims: text("banned_claims").notNull().default(""),
  brandVoice: text("brand_voice").notNull().default(""),
  shipCost: real("ship_cost").notNull().default(0),
  packCost: real("pack_cost").notNull().default(0),
  codFeePct: real("cod_fee_pct").notNull().default(2),
  rtoCost: real("rto_cost").notNull().default(0),
  baseDeliveryRate: real("base_delivery_rate").notNull().default(0),
  discountNote: text("discount_note").notNull().default(""),
  testBudget: real("test_budget").notNull().default(0),
  minTestDays: real("min_test_days").notNull().default(3),
  targetCpp: real("target_cpp").notNull().default(0),
  killRule: text("kill_rule").notNull().default(""),
  scaleRule: text("scale_rule").notNull().default(""),
  whatsappConfirmPct: real("whatsapp_confirm_pct").notNull().default(0),
  deliveryPct: real("delivery_pct").notNull().default(0),
  adPerf30d: text("ad_perf_30d").notNull().default(""),
  adPerf7d: text("ad_perf_7d").notNull().default(""),
  customerVoice: text("customer_voice").notNull().default(""),
  creativeInventory: text("creative_inventory").notNull().default(""),
  uncertaintyFlags: text("uncertainty_flags").notNull().default(""),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  pageUrl: text("page_url").notNull().default(""),
  price: real("price").notNull().default(0),
  cogs: real("cogs").notNull().default(0),
  status: text("status").notNull().default("Active"),
  ingredients: text("ingredients").notNull().default(""),
  warnings: text("warnings").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const marketRounds = sqliteTable("market_rounds", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  source: text("source").notNull().default("Website"),
  scope: text("scope").notNull().default(""),
  findings: text("findings").notNull().default(""),
  roundDate: text("round_date").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const competitorAlerts = sqliteTable("competitor_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  competitor: text("competitor").notNull(),
  changeType: text("change_type").notNull().default("زاوية جديدة"),
  detail: text("detail").notNull().default(""),
  source: text("source").notNull().default(""),
  status: text("status").notNull().default("New"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const agentPlans = sqliteTable("agent_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  goal: text("goal").notNull(),
  taskType: text("task_type").notNull().default("A"),
  planJson: text("plan_json").notNull().default("[]"),
  status: text("status").notNull().default("Proposed"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const syncRuns = sqliteTable("sync_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  source: text("source").notNull().default(""),
  status: text("status").notNull().default(""),
  summary: text("summary").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const relaunchGoals = sqliteTable("relaunch_goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  metric: text("metric").notNull(),
  target: real("target").notNull().default(0),
  current: real("current").notNull().default(0),
  unit: text("unit").notNull().default(""),
  deadline: text("deadline").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const generationRequests = sqliteTable("generation_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  product: text("product").notNull().default(""),
  angle: text("angle").notNull().default(""),
  format: text("format").notNull().default(""),
  hook: text("hook").notNull().default(""),
  primaryText: text("primary_text").notNull().default(""),
  cta: text("cta").notNull().default(""),
  size: text("size").notNull().default("1080x1920"),
  spec: text("spec").notNull().default(""),
  cisTag: text("cis_tag").notNull().default(""),
  status: text("status").notNull().default("New"),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const activityEvents = sqliteTable("activity_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  section: text("section").notNull().default(""),
  eventType: text("event_type").notNull().default(""),
  detail: text("detail").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const ownerInstructions = sqliteTable("owner_instructions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  instruction: text("instruction").notNull().default(""),
  scope: text("scope").notNull().default("عام"),
  active: integer("active").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const learningObservations = sqliteTable("learning_observations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  source: text("source").notNull().default("صوت العميل"),
  detail: text("detail").notNull().default(""),
  occurrences: integer("occurrences").notNull().default(1),
  firstSeenDate: text("first_seen_date").notNull().default(""),
  lastSeenDate: text("last_seen_date").notNull().default(""),
  status: text("status").notNull().default("ملاحظة"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const voiceIntakes = sqliteTable("voice_intakes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceType: text("source_type").notNull().default("واتساب مجمّع"),
  rawText: text("raw_text").notNull().default(""),
  analysisJson: text("analysis_json").notNull().default("{}"),
  summary: text("summary").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const searchKeywords = sqliteTable("search_keywords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  keyword: text("keyword").notNull(),
  suggestions: text("suggestions").notNull().default(""),
  lastScanAt: text("last_scan_at").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const productOpportunities = sqliteTable("product_opportunities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  sourceType: text("source_type").notNull().default("طلبات عملاء"),
  evidence: text("evidence").notNull().default(""),
  status: text("status").notNull().default("قيد الدراسة"),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const loopRuns = sqliteTable("loop_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  runType: text("run_type").notNull().default("Tick"),
  summary: text("summary").notNull().default(""),
  actionsTaken: text("actions_taken").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const opsSettings = sqliteTable("ops_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weeklyReviewEnabled: integer("weekly_review_enabled").notNull().default(0),
  suggestionTtlDays: integer("suggestion_ttl_days").notNull().default(14),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const organicPosts = sqliteTable("organic_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  driveUrl: text("drive_url").notNull().default(""),
  channel: text("channel").notNull().default("انستجرام"),
  topic: text("topic").notNull().default(""),
  format: text("format").notNull().default("Static"),
  slideCount: integer("slide_count").notNull().default(1),
  designText: text("design_text").notNull().default(""),
  pillar: text("pillar").notNull().default(""),
  status: text("status").notNull().default("فكرة"),
  scheduledDate: text("scheduled_date").notNull().default(""),
  complianceFlag: text("compliance_flag").notNull().default(""),
  finalCaption: text("final_caption").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const organicCaptions = sqliteTable("organic_captions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id").notNull(),
  slot: integer("slot").notNull().default(1),
  style: text("style").notNull().default(""),
  text: text("text").notNull().default(""),
  status: text("status").notNull().default("مسودة"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const thinkingEntries = sqliteTable("thinking_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  basis: text("basis").notNull().default(""),
  reasoning: text("reasoning").notNull().default(""),
  conclusion: text("conclusion").notNull().default(""),
  decision: text("decision").notNull().default(""),
  confidence: integer("confidence").notNull().default(50),
  status: text("status").notNull().default("بانتظار قرارك"),
  ownerComment: text("owner_comment").notNull().default(""),
  workItemId: integer("work_item_id").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const ownerPlans = sqliteTable("owner_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  kind: text("kind").notNull().default("خطة"),
  linkedThinkingId: integer("linked_thinking_id").notNull().default(0),
  workItemId: integer("work_item_id").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const creativeAnalyses = sqliteTable("creative_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  creativeId: integer("creative_id").notNull(),
  classification: text("classification").notNull().default("Insufficient Evidence"),
  cisHook: text("cis_hook").notNull().default(""),
  cisFormat: text("cis_format").notNull().default(""),
  cisAngle: text("cis_angle").notNull().default(""),
  cisLever: text("cis_lever").notNull().default(""),
  why: text("why").notNull().default(""),
  evidence: text("evidence").notNull().default(""),
  sampleNote: text("sample_note").notNull().default(""),
  confidence: integer("confidence").notNull().default(50),
  remix: text("remix").notNull().default(""),
  visualRead: text("visual_read").notNull().default(""),
  ocrText: text("ocr_text").notNull().default(""),
  scoresJson: text("scores_json").notNull().default(""),
  compliance: text("compliance").notNull().default(""),
  strengths: text("strengths").notNull().default(""),
  weaknesses: text("weaknesses").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const competitorAdAnalyses = sqliteTable("competitor_ad_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  observationId: integer("observation_id").notNull(),
  competitor: text("competitor").notNull().default(""),
  angle: text("angle").notNull().default(""),
  hook: text("hook").notNull().default(""),
  format: text("format").notNull().default(""),
  offer: text("offer").notNull().default(""),
  runtimeNote: text("runtime_note").notNull().default(""),
  whyWorking: text("why_working").notNull().default(""),
  weakness: text("weakness").notNull().default(""),
  lessons: text("lessons").notNull().default(""),
  videoHookType: text("video_hook_type").notNull().default(""),
  videoFirst3Sec: text("video_first3_sec").notNull().default(""),
  videoHookText: text("video_hook_text").notNull().default(""),
  videoDuration: text("video_duration").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const videoAnalyses = sqliteTable("video_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  videoRef: text("video_ref").notNull().default(""),
  product: text("product").notNull().default(""),
  duration: text("duration").notNull().default(""),
  contentType: text("content_type").notNull().default("UGC"),
  firstFrameDesc: text("first_frame_desc").notNull().default(""),
  clueRating: text("clue_rating").notNull().default(""),
  productEarlyRating: text("product_early_rating").notNull().default(""),
  hookTextRating: text("hook_text_rating").notNull().default(""),
  transcript: text("transcript").notNull().default(""),
  hookClass: text("hook_class").notNull().default(""),
  proofMoments: text("proof_moments").notNull().default(""),
  patternInterrupts: text("pattern_interrupts").notNull().default(""),
  ctaTiming: text("cta_timing").notNull().default(""),
  bannedClaimsNote: text("banned_claims_note").notNull().default(""),
  retinolWarning: text("retinol_warning").notNull().default("لا ينطبق"),
  cisHook: text("cis_hook").notNull().default(""),
  cisFormat: text("cis_format").notNull().default(""),
  cisAngle: text("cis_angle").notNull().default(""),
  cisLever: text("cis_lever").notNull().default(""),
  whyWonLost: text("why_won_lost").notNull().default(""),
  hookScore: integer("hook_score").notNull().default(0),
  scoreBreakdownJson: text("score_breakdown_json").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const angles = sqliteTable("angles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  hook: text("hook").notNull().default(""),
  product: text("product").notNull().default(""),
  segment: text("segment").notNull().default(""),
  source: text("source").notNull().default("مالك"),
  kind: text("kind").notNull().default("Static"),
  status: text("status").notNull().default("جديدة"),
  ugcStage: text("ugc_stage").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const creators = sqliteTable("creators", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  handle: text("handle").notNull().default(""),
  platform: text("platform").notNull().default("Instagram"),
  profileUrl: text("profile_url").notNull().default(""),
  followers: text("followers").notNull().default(""),
  segmentFit: text("segment_fit").notNull().default(""),
  conceptCode: text("concept_code").notNull().default(""),
  status: text("status").notNull().default("مرشحة"),
  usageRights: text("usage_rights").notNull().default(""),
  contactRoute: text("contact_route").notNull().default(""),
  expertFlag: integer("expert_flag").notNull().default(0),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const deliveries = sqliteTable("deliveries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  department: text("department").notNull(),
  output: text("output").notNull().default(""),
  cadence: text("cadence").notNull().default("أسبوعي"),
  lastDelivery: text("last_delivery").notNull().default(""),
  nextDelivery: text("next_delivery").notNull().default(""),
  status: text("status").notNull().default("في الموعد"),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const replyDrafts = sqliteTable("reply_drafts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  topic: text("topic").notNull(),
  draftText: text("draft_text").notNull().default(""),
  source: text("source").notNull().default("صوت العميل"),
  status: text("status").notNull().default("مسودة"),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const retentionFlows = sqliteTable("retention_flows", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  triggerNote: text("trigger_note").notNull().default(""),
  status: text("status").notNull().default("غير مكتوب"),
  draftText: text("draft_text").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const auditItems = sqliteTable("audit_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemKey: text("item_key").notNull(),
  pillar: integer("pillar").notNull().default(1),
  title: text("title").notNull().default(""),
  status: text("status").notNull().default("لم يبدأ"),
  notes: text("notes").notNull().default(""),
  evidence: text("evidence").notNull().default(""),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});
