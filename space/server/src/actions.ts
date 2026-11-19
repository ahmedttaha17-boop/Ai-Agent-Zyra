import { defineAction, z, type ActionsModule } from "@hatch/space-sdk";
import { desc, eq, sql } from "drizzle-orm";
import * as schema from "./schema";
import { WEBSITE_PRODUCTS } from "./website-seed";

// ---- Competitor rotation pointer: SINGLE source of truth ----
// Used by BOTH getOpsState and runLoopTick so the two can never disagree on
// who is next. Rotation order = registration order (competitor id ASC).
// A competitor counts as covered "today" (Africa/Cairo business day) when a
// market round recorded today names it — matched on scope + findings against
// the full stored name OR any name part (split on — – - ( ) ، , /), so a
// round logged with a short name (e.g. scope "Era Care") still covers the
// stored full name ("Era Care (ايرا كير)"). The old code matched the full
// name as an exact substring of scope only, which never matched short-name
// rounds and froze the pointer on Era Care for 12+ consecutive ticks, while
// getOpsState used a different all-time scope+findings rule and disagreed.
function cairoDateStr(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}
function competitorNameKeys(name: string): string[] {
  const keys = new Set<string>();
  const full = name.trim();
  if (full) keys.add(full);
  for (const part of full.split(/[—–\-()،,/|]+/)) {
    const p = part.trim();
    if (p.length >= 3) keys.add(p);
    const firstWord = p.split(/\s+/)[0] ?? "";
    if (firstWord.length >= 4) keys.add(firstWord);
  }
  return [...keys];
}
function nextCompetitorName(
  comps: { id: number; name: string }[],
  rounds: { scope: string; findings: string; roundDate: string; createdAt: Date }[],
  now: Date,
): string {
  const today = cairoDateStr(now);
  const todaysTexts = rounds
    .filter(r => r.roundDate === today || cairoDateStr(r.createdAt) === today)
    .map(r => `${r.scope} ${r.findings}`);
  const next = comps.find(c => {
    const keys = competitorNameKeys(c.name);
    return !todaysTexts.some(t => keys.some(k => t.includes(k)));
  });
  return next ? next.name : "";
}

const taskTypeEnum = z.enum(["A","B","C","D","E","F","G"]);
const taskStatusEnum = z.enum(["New","Investigating","Ready for Review","Approved","Rejected","Deferred","Executing","Completed","Failed","Outcome Review"]);
const evidenceEnum = z.enum(["VERIFIED","ZYRA PROVEN","HYPOTHESIS","ESTIMATED","UNKNOWN","OUTDATED"]);

export const Actions = {
  getDashboard: defineAction({
    description: "Returns dashboard counts, integration states, and last system check.",
    request: z.object({}),
    response: z.object({
      tasksTotal: z.number(), tasksNew: z.number(), tasksInProgress: z.number(), tasksReady: z.number(),
      approvalsPending: z.number(), approvalsTotal: z.number(),
      learningsTotal: z.number(),
      workTotal: z.number(), workOverdue: z.number(), campaignsTotal: z.number(), creativesTotal: z.number(), contentTotal: z.number(), experimentsTotal: z.number(),
      marketRoundsTotal: z.number(), alertsOpen: z.number(), plansTotal: z.number(), relaunchGoalsTotal: z.number(),
      lastCheckAt: z.string().nullable(), lastSyncAt: z.string().nullable(), lastSyncSummary: z.string(),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const allTasks = await db.select().from(schema.tasks);
      const allApprovals = await db.select().from(schema.approvals);
      const allLearnings = await db.select().from(schema.learnings);
      const checks = await db.select().from(schema.systemChecks).orderBy(desc(schema.systemChecks.id)).limit(1);
      const allWork = await db.select().from(schema.workItems);
      const allCamp = await db.select().from(schema.campaigns);
      const allCrea = await db.select().from(schema.creatives);
      const allContent = await db.select().from(schema.contentItems);
      const allExp = await db.select().from(schema.experiments);
      const allRounds = await db.select().from(schema.marketRounds);
      const allAlerts = await db.select().from(schema.competitorAlerts);
      const allPlans = await db.select().from(schema.agentPlans);
      const allGoals = await db.select().from(schema.relaunchGoals);
      const syncs = await db.select().from(schema.syncRuns).orderBy(desc(schema.syncRuns.id)).limit(1);
      const todayStr = new Date().toISOString().slice(0,10);
      return {
        tasksTotal: allTasks.length,
        tasksNew: allTasks.filter(t=>t.status==="New").length,
        tasksInProgress: allTasks.filter(t=>["Investigating","Executing"].includes(t.status)).length,
        tasksReady: allTasks.filter(t=>t.status==="Ready for Review").length,
        approvalsPending: allApprovals.filter(a=>a.status==="Pending").length,
        approvalsTotal: allApprovals.length,
        learningsTotal: allLearnings.length,
        workTotal: allWork.length, workOverdue: allWork.filter(w=>w.dueDate && w.dueDate < todayStr && !["Completed","Failed"].includes(w.status)).length,
        campaignsTotal: allCamp.length, creativesTotal: allCrea.length, contentTotal: allContent.length, experimentsTotal: allExp.length,
        marketRoundsTotal: allRounds.length, alertsOpen: allAlerts.filter(a=>a.status==="New").length, plansTotal: allPlans.length, relaunchGoalsTotal: allGoals.length,
        lastCheckAt: checks[0] ? checks[0].checkedAt.toISOString() : null,
        lastSyncAt: syncs[0] ? syncs[0].createdAt.toISOString() : null,
        lastSyncSummary: syncs[0] ? syncs[0].summary : "",
      };
    },
  }),

  listTasks: defineAction({
    description: "Lists work queue tasks newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ tasks: z.array(z.object({
      id: z.number(), title: z.string(), type: z.string(), objective: z.string(), status: z.string(),
      evidenceTag: z.string(), assumptions: z.string(), confidence: z.number(), freshness: z.string(),
      stage: z.number(), notes: z.string(), createdAt: z.string(), updatedAt: z.string(),
    }))}),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.tasks).orderBy(desc(schema.tasks.id)).limit(args.limit);
      return { tasks: rows.map(r=>({ id:r.id, title:r.title, type:r.type, objective:r.objective, status:r.status, evidenceTag:r.evidenceTag, assumptions:r.assumptions, confidence:r.confidence, freshness:r.freshness, stage:r.stage, notes:r.notes, createdAt:r.createdAt.toISOString(), updatedAt:r.updatedAt.toISOString() })) };
    },
  }),

  createTask: defineAction({
    description: "Creates a new work queue task.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      type: taskTypeEnum,
      objective: z.string().max(1000).default(""),
      evidenceTag: evidenceEnum.default("UNKNOWN"),
      assumptions: z.string().max(1000).default(""),
      confidence: z.number().int().min(0).max(100).default(50),
      freshness: z.string().max(200).default(""),
      notes: z.string().max(2000).default(""),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.tasks).values({ title: args.title, type: args.type, objective: args.objective, evidenceTag: args.evidenceTag, assumptions: args.assumptions, confidence: args.confidence, freshness: args.freshness, notes: args.notes, status: "New", stage: 1 }).returning({ id: schema.tasks.id });
      ctx.invalidateQueries();
      return { id: res[0]!.id };
    },
  }),

  updateTask: defineAction({
    description: "Updates a task status, stage, or fields.",
    request: z.object({
      id: z.number().int().positive(),
      status: taskStatusEnum.optional(),
      stage: z.number().int().min(1).max(8).optional(),
      evidenceTag: evidenceEnum.optional(),
      confidence: z.number().int().min(0).max(100).optional(),
      notes: z.string().max(2000).optional(),
      freshness: z.string().max(200).optional(),
    }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> {
      const db = ctx.db<typeof schema>();
      const patch: Record<string, unknown> = { updatedAt: new Date() };
      if (args.status) patch.status = args.status;
      if (args.stage) patch.stage = args.stage;
      if (args.evidenceTag) patch.evidenceTag = args.evidenceTag;
      if (args.confidence !== undefined) patch.confidence = args.confidence;
      if (args.notes !== undefined) patch.notes = args.notes;
      if (args.freshness !== undefined) patch.freshness = args.freshness;
      await db.update(schema.tasks).set(patch).where(eq(schema.tasks.id, args.id));
      ctx.invalidateQueries();
      return { ok: true as const };
    },
  }),

  deleteTask: defineAction({
    description: "Deletes a task.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.tasks).where(eq(schema.tasks.id, args.id));
      ctx.invalidateQueries();
      return { ok: true as const };
    },
  }),

  listApprovals: defineAction({
    description: "Lists approval requests newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ approvals: z.array(z.object({
      id: z.number(), title: z.string(), actionType: z.string(), description: z.string(), status: z.string(), createdAt: z.string(), decidedAt: z.string().nullable(),
    }))}),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.approvals).orderBy(desc(schema.approvals.id)).limit(args.limit);
      return { approvals: rows.map(r=>({ id:r.id, title:r.title, actionType:r.actionType, description:r.description, status:r.status, createdAt:r.createdAt.toISOString(), decidedAt: r.decidedAt ? r.decidedAt.toISOString() : null })) };
    },
  }),

  createApproval: defineAction({
    description: "Creates an approval request — no external action executes without owner approval.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      actionType: z.enum(["Publish","Budget Change","Price Change","Discount","Pause Campaign","Launch Campaign","Message Customers","Other"]),
      description: z.string().max(1500).default(""),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.approvals).values({ title: args.title, actionType: args.actionType, description: args.description }).returning({ id: schema.approvals.id });
      ctx.invalidateQueries();
      return { id: res[0]!.id };
    },
  }),

  decideApproval: defineAction({
    description: "Records owner decision on an approval request.",
    request: z.object({ id: z.number().int().positive(), status: z.enum(["Approved","Rejected","Deferred","Pending"]) }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> {
      const db = ctx.db<typeof schema>();
      await db.update(schema.approvals).set({ status: args.status, decidedAt: args.status==="Pending" ? null : new Date() }).where(eq(schema.approvals.id, args.id));
      if (args.status !== "Pending") await db.insert(schema.activityEvents).values({ section: "Approvals", eventType: `قرار اعتماد: ${args.status}`, detail: `طلب اعتماد #${args.id} اتحسم بحالة ${args.status} — التنفيذ الخارجي (إن وجد) يُسجل في سجل التنفيذ بقيم Before/After` });
      ctx.invalidateQueries();
      return { ok: true as const };
    },
  }),

  listLearnings: defineAction({
    description: "Lists learning log entries newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ learnings: z.array(z.object({
      id: z.number(), hypothesis: z.string(), decision: z.string(), expectedOutcome: z.string(), actualOutcome: z.string(), verdict: z.string(), createdAt: z.string(),
    }))}),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.learnings).orderBy(desc(schema.learnings.id)).limit(args.limit);
      return { learnings: rows.map(r=>({ id:r.id, hypothesis:r.hypothesis, decision:r.decision, expectedOutcome:r.expectedOutcome, actualOutcome:r.actualOutcome, verdict:r.verdict, createdAt:r.createdAt.toISOString() })) };
    },
  }),

  createLearning: defineAction({
    description: "Logs a hypothesis/decision for the learning loop.",
    request: z.object({
      hypothesis: z.string().trim().min(1).max(1000),
      decision: z.string().max(1000).default(""),
      expectedOutcome: z.string().max(1000).default(""),
      actualOutcome: z.string().max(1000).default(""),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.learnings).values({ hypothesis: args.hypothesis, decision: args.decision, expectedOutcome: args.expectedOutcome, actualOutcome: args.actualOutcome }).returning({ id: schema.learnings.id });
      ctx.invalidateQueries();
      return { id: res[0]!.id };
    },
  }),

  updateLearning: defineAction({
    description: "Updates a learning entry with actual outcome and verdict.",
    request: z.object({ id: z.number().int().positive(), actualOutcome: z.string().max(1000), verdict: z.enum(["Pending","Validated","Invalidated","Inconclusive"]) }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> {
      const db = ctx.db<typeof schema>();
      await db.update(schema.learnings).set({ actualOutcome: args.actualOutcome, verdict: args.verdict }).where(eq(schema.learnings.id, args.id));
      ctx.invalidateQueries();
      return { ok: true as const };
    },
  }),

  calculateCOD: defineAction({
    description: "Deterministic COD cohort calculator — exact port of cod_cohort_calc.py, zero double-counting.",
    request: z.object({
      placed: z.number().int().positive(),
      cancelled: z.number().int().min(0),
      rto: z.number().int().min(0),
      adSpend: z.number().min(0),
      revPerDelivered: z.number().min(0),
      cogsPerDelivered: z.number().min(0),
      packPerShipped: z.number().min(0),
      shipPerShipped: z.number().min(0),
      rtoFee: z.number().min(0),
      codPct: z.number().min(0).max(1).default(0.02),
    }),
    response: z.object({
      ok: z.boolean(), error: z.string().nullable(),
      shipped: z.number(), delivered: z.number(), netDeliveryRatePct: z.number(),
      placedCPP: z.number(), deliveredCPP: z.number(),
      netCollectedRevenue: z.number(), grossProfit: z.number(), contribBeforeAds: z.number(),
      cohortContribProfit: z.number(), contribPerPlaced: z.number(), cohortContribPerDelivered: z.number(),
      individualDeliveredContrib: z.number(), breakevenPlacedCPP: z.number(), breakevenDeliveredCPP: z.number(),
    }),
    async handler(_ctx, args) {
      const shipped = args.placed - args.cancelled;
      const delivered = shipped - args.rto;
      if (args.placed <= 0 || shipped <= 0 || delivered <= 0) {
        return { ok: false, error: "Order counts must result in positive placed, shipped, and delivered orders.", shipped: Math.max(shipped,0), delivered: Math.max(delivered,0), netDeliveryRatePct: 0, placedCPP:0, deliveredCPP:0, netCollectedRevenue:0, grossProfit:0, contribBeforeAds:0, cohortContribProfit:0, contribPerPlaced:0, cohortContribPerDelivered:0, individualDeliveredContrib:0, breakevenPlacedCPP:0, breakevenDeliveredCPP:0 };
      }
      const r2 = (n:number)=> Math.round(n*100)/100;
      const netDeliveryRate = delivered / args.placed;
      const placedCPP = args.adSpend / args.placed;
      const deliveredCPP = args.adSpend / delivered;
      const netCollectedRevenue = delivered * args.revPerDelivered;
      const totalCOGS = delivered * args.cogsPerDelivered;
      const totalPack = shipped * args.packPerShipped;
      const totalShip = shipped * args.shipPerShipped;
      const totalRTOFees = args.rto * args.rtoFee;
      const totalCODFees = netCollectedRevenue * args.codPct;
      const totalOps = totalCOGS + totalPack + totalShip + totalRTOFees + totalCODFees;
      const contribBeforeAds = netCollectedRevenue - totalOps;
      const cohortContribProfit = contribBeforeAds - args.adSpend;
      const grossProfit = netCollectedRevenue - totalCOGS;
      const contribPerPlaced = cohortContribProfit / args.placed;
      const cohortContribPerDelivered = cohortContribProfit / delivered;
      const individualDeliveredContrib = args.revPerDelivered - args.cogsPerDelivered - args.packPerShipped - args.shipPerShipped - (args.revPerDelivered * args.codPct) - deliveredCPP;
      const breakevenPlacedCPP = contribBeforeAds / args.placed;
      const breakevenDeliveredCPP = contribBeforeAds / delivered;
      return { ok:true, error:null, shipped, delivered, netDeliveryRatePct: r2(netDeliveryRate*100), placedCPP: r2(placedCPP), deliveredCPP: r2(deliveredCPP), netCollectedRevenue: r2(netCollectedRevenue), grossProfit: r2(grossProfit), contribBeforeAds: r2(contribBeforeAds), cohortContribProfit: r2(cohortContribProfit), contribPerPlaced: r2(contribPerPlaced), cohortContribPerDelivered: r2(cohortContribPerDelivered), individualDeliveredContrib: r2(individualDeliveredContrib), breakevenPlacedCPP: r2(breakevenPlacedCPP), breakevenDeliveredCPP: r2(breakevenDeliveredCPP) };
    },
  }),

  validateCreative: defineAction({
    description: "Deterministic creative validator — exact port of validate_zyra_output.py.",
    request: z.object({
      text: z.string().min(1).max(5000),
      isRetinol: z.boolean().default(false),
      shopifyVerified: z.boolean().default(false),
    }),
    response: z.object({
      status: z.enum(["PASS","CONDITIONAL_REVIEW","FAIL"]),
      errors: z.array(z.string()), warnings: z.array(z.string()), passedChecks: z.array(z.string()),
      retinolWarningText: z.string(),
    }),
    async handler(_ctx, args) {
      const BANNED = ["علاج","يعالج","نهائي","نهائياً","يقضي للأبد","مضمون 100%","مرض"];
      const UNVERIFIED = ["عيادات","جلسات","ضمان 14","١٤ يوم","10,000 عميلة","+10000"];
      const PATTERNS: {label:string, re:RegExp}[] = [
        { label: "عندك\\s+سيلوليت", re: /عندك\s+سيلوليت/ },
        { label: "دراعك\\s+زي\\s+الرملة", re: /دراعك\s+زي\s+الرملة/ },
        { label: "جسمك\\s+في", re: /جسمك\s+في/ },
        { label: "بتطفي\\s+النور", re: /بتطفي\s+النور/ },
      ];
      const errors: string[] = []; const warnings: string[] = [];
      for (const t of BANNED) if (args.text.includes(t)) errors.push(`BANNED_MEDICAL_TERM: '${t}' found in copy.`);
      for (const c of UNVERIFIED) if (args.text.includes(c)) warnings.push(`UNVERIFIED_CLAIM: '${c}' requires verified policy/source before publishing.`);
      for (const p of PATTERNS) if (p.re.test(args.text)) warnings.push(`PERSONAL_ATTRIBUTE_RISK: Pattern '${p.label}' may trigger Meta Personal Attributes policy.`);
      if (args.isRetinol) {
        if (!args.text.includes("ريتينول") || !args.text.includes("الحمل")) errors.push("MISSING_RETINOL_WARNING: Cellulite/Retinol copy must include pregnancy/lactation warning.");
      }
      if (!args.shopifyVerified && (args.text.includes("Ready to Publish") || args.text.includes("جاهز للنشر"))) errors.push("PREMATURE_PUBLISH_CLAIM: Cannot mark Ready to Publish while Shopify data is unverified.");
      const status = errors.length===0 && warnings.length===0 ? "PASS" as const : errors.length===0 ? "CONDITIONAL_REVIEW" as const : "FAIL" as const;
      return { status, errors, warnings, passedChecks: ["medical_claims_scan","unverified_claims_scan","personal_attributes_scan", args.isRetinol ? "retinol_disclaimer_check" : "general_product_check","shopify_readiness_gate"], retinolWarningText: "الكريم فيه ريتينول: ممنوع أثناء الحمل، وفي الرضاعة بعد استشارة الدكتور" };
    },
  }),

  refreshDaily: defineAction({
    description: "Daily system check — records freshness, counts queue state. No external data claimed while integrations are pending.",
    request: z.object({}),
    response: z.object({ ok: z.literal(true), checkedAt: z.string(), tasksCount: z.number(), approvalsPending: z.number() }),
    async handler(ctx): Promise<{ok:true, checkedAt:string, tasksCount:number, approvalsPending:number}> {
      const db = ctx.db<typeof schema>();
      const tasks = await db.select({ c: sql<number>`count(*)` }).from(schema.tasks);
      const pend = await db.select({ c: sql<number>`count(*)` }).from(schema.approvals).where(eq(schema.approvals.status, "Pending"));
      const tc = tasks[0]?.c ?? 0; const ap = pend[0]?.c ?? 0;
      const now = new Date();
      await db.insert(schema.systemChecks).values({ checkedAt: now, note: "Daily check: sources are Core Inputs + public Website / Meta Ads Library / TikTok Ads Library. No live private ad account connected.", tasksCount: tc, approvalsPending: ap });
      ctx.invalidateQueries();
      return { ok: true as const, checkedAt: now.toISOString(), tasksCount: tc, approvalsPending: ap };
    },
  }),

  // ---- Work Tracking ----
  listWorkItems: defineAction({
    description: "Lists work tracking items newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ items: z.array(z.object({ id: z.number(), title: z.string(), sourceType: z.string(), status: z.string(), stage: z.number(), ownerRole: z.string(), priority: z.string(), dueDate: z.string(), progress: z.number(), blocker: z.string(), nextAction: z.string(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.workItems).orderBy(desc(schema.workItems.id)).limit(args.limit); return { items: rows.map(r=>({ id:r.id, title:r.title, sourceType:r.sourceType, status:r.status, stage:r.stage, ownerRole:r.ownerRole, priority:r.priority, dueDate:r.dueDate, progress:r.progress, blocker:r.blocker, nextAction:r.nextAction, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createWorkItem: defineAction({
    description: "Creates a work tracking item.",
    request: z.object({ title: z.string().trim().min(1).max(200), sourceType: z.string().max(50).default("Manual"), ownerRole: z.string().max(50).default("Owner"), priority: z.enum(["Low","Medium","High","Critical"]).default("Medium"), dueDate: z.string().max(20).default(""), progress: z.number().int().min(0).max(100).default(0), blocker: z.string().max(1000).default(""), nextAction: z.string().max(1000).default(""), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.workItems).values({ title: args.title, sourceType: args.sourceType, ownerRole: args.ownerRole, priority: args.priority, dueDate: args.dueDate, progress: args.progress, blocker: args.blocker, nextAction: args.nextAction, notes: args.notes }).returning({ id: schema.workItems.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateWorkItem: defineAction({
    description: "Updates a work tracking item.",
    request: z.object({ id: z.number().int().positive(), status: z.string().max(50).optional(), stage: z.number().int().min(1).max(8).optional(), progress: z.number().int().min(0).max(100).optional(), blocker: z.string().max(1000).optional(), nextAction: z.string().max(1000).optional(), priority: z.string().max(20).optional(), ownerRole: z.string().max(50).optional(), dueDate: z.string().max(20).optional() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const patch: Record<string, unknown> = { updatedAt: new Date() }; if (args.status) patch.status = args.status; if (args.stage) patch.stage = args.stage; if (args.progress !== undefined) patch.progress = args.progress; if (args.blocker !== undefined) patch.blocker = args.blocker; if (args.nextAction !== undefined) patch.nextAction = args.nextAction; if (args.priority) patch.priority = args.priority; if (args.ownerRole) patch.ownerRole = args.ownerRole; if (args.dueDate !== undefined) patch.dueDate = args.dueDate; await db.update(schema.workItems).set(patch).where(eq(schema.workItems.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteWorkItem: defineAction({
    description: "Deletes a work tracking item.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.workItems).where(eq(schema.workItems.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Campaigns / Media Buyer ----
  listCampaigns: defineAction({
    description: "Lists campaigns newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ campaigns: z.array(z.object({ id: z.number(), name: z.string(), platform: z.string(), objective: z.string(), status: z.string(), budget: z.number(), spent: z.number(), results: z.string(), period: z.string(), attribution: z.string(), weeklyOrders: z.number(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.campaigns).orderBy(desc(schema.campaigns.id)).limit(args.limit); return { campaigns: rows.map(r=>({ id:r.id, name:r.name, platform:r.platform, objective:r.objective, status:r.status, budget:r.budget, spent:r.spent, results:r.results, period:r.period, attribution:r.attribution, weeklyOrders:r.weeklyOrders, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createCampaign: defineAction({
    description: "Creates a campaign record.",
    request: z.object({ name: z.string().trim().min(1).max(200), platform: z.string().max(50).default("Meta"), objective: z.string().max(500).default(""), status: z.string().max(50).default("Draft"), budget: z.number().min(0).default(0), spent: z.number().min(0).default(0), results: z.string().max(1000).default(""), period: z.string().max(200).default(""), attribution: z.string().max(100).default("7-day click"), weeklyOrders: z.number().int().min(0).default(0), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.campaigns).values(args).returning({ id: schema.campaigns.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateCampaign: defineAction({
    description: "Updates a campaign status or figures.",
    request: z.object({ id: z.number().int().positive(), status: z.string().max(50).optional(), spent: z.number().min(0).optional(), budget: z.number().min(0).optional(), results: z.string().max(1000).optional(), notes: z.string().max(2000).optional() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const patch: Record<string, unknown> = { updatedAt: new Date() }; if (args.status) patch.status = args.status; if (args.spent !== undefined) patch.spent = args.spent; if (args.budget !== undefined) patch.budget = args.budget; if (args.results !== undefined) patch.results = args.results; if (args.notes !== undefined) patch.notes = args.notes; await db.update(schema.campaigns).set(patch).where(eq(schema.campaigns.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteCampaign: defineAction({
    description: "Deletes a campaign record.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.campaigns).where(eq(schema.campaigns.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  campaignStructure: defineAction({
    description: "Computes Domino tier and 3:2:2 / Olympic Rings structure from weekly orders.",
    request: z.object({ weeklyOrders: z.number().int().min(0) }),
    response: z.object({ tier: z.number(), tierLabel: z.string(), adSets: z.number(), adSetPlan: z.string(), combos322: z.number(), ringsCombos: z.number(), guidance: z.string() }),
    async handler(_ctx, args) { const w = args.weeklyOrders; const tier = w < 35 ? 1 : w <= 70 ? 2 : 3; const adSets = tier; const plan = tier===1 ? "1 Broad Ad Set — 1 Hero Offer per CBO" : tier===2 ? "2 Ad Sets — 1 Control + 1 Testing" : "3 Ad Sets — Control + Testing + Scaling"; const guidance = "Attribution: 7-day click only, exclude Audience Network. 3:2:2 = 3 Visuals (same format) x 2 Primary Texts x 2 Headlines = 12 combos. 5 Olympic Rings = 3 Hello + 2 Close roles for 1 Hero Offer = up to 60 combos, not 60 live ads."; return { tier, tierLabel: `Tier ${tier}`, adSets, adSetPlan: plan, combos322: 12, ringsCombos: 60, guidance }; },
  }),
  diagnoseFunnel: defineAction({
    description: "Sequential funnel diagnosis producing the 7-field verdict.",
    request: z.object({ hookRate: z.number().min(0).default(0), holdRate: z.number().min(0).default(0), ctr: z.number().min(0).default(0), cpm: z.number().min(0).default(0), cpp: z.number().min(0).default(0), outboundClicks: z.number().int().min(0).default(0), lpv: z.number().int().min(0).default(0), atc: z.number().int().min(0).default(0), ic: z.number().int().min(0).default(0), placed: z.number().int().min(0).default(0), confirmed: z.number().int().min(0).default(0), delivered: z.number().int().min(0).default(0), spend: z.number().min(0).default(0), adAgeHours: z.number().min(0).default(999) }),
    response: z.object({ verdict: z.string(), whatHappened: z.string(), why: z.string(), evidence: z.string(), confidence: z.number(), recommendedAction: z.string(), expectedImpact: z.string(), measureNext: z.string(), warnings: z.array(z.string()) }),
    async handler(_ctx, args) {
      const warnings: string[] = [];
      if (args.adAgeHours < 72) warnings.push("Day Trade Trap: الإعلان عمره أقل من 72 ساعة — ممنوع الحكم بالقتل قبل 48–72 ساعة (Andromeda Cold Start, Score يبدأ من 0).");
      const totalFunnel = args.outboundClicks + args.lpv + args.atc + args.placed;
      let verdict = "INVESTIGATE"; let what = ""; let why = ""; let action = ""; let impact = ""; let conf = 50;
      if (totalFunnel === 0 && args.spend === 0) { verdict = "INSUFFICIENT DATA"; what = "لا توجد بيانات قمع أو إنفاق كافية للتشخيص."; why = "العينة فارغة — أي حكم الآن هيكون تخمين."; action = "اجمع بيانات: شغّل الحملة وانتظر حجماً كافياً قبل أي قرار."; impact = "تجنّب قرار خاطئ مبني على فراغ."; conf = 20; }
      else if (args.outboundClicks > 0 && args.lpv / Math.max(args.outboundClicks,1) < 0.5) { verdict = "ITERATE"; what = `تسرب كبير بين Outbound Click وLPV: ${args.lpv} من ${args.outboundClicks} وصلوا الصفحة.`; why = "بطء تحميل أو عدم تطابق Scent Match بين الإعلان واللاندنج (1:1 Scent Match)."; action = "راجع سرعة الصفحة وتطابق عنوان الإعلان مع أول شاشة في اللاندنج قبل لمس الميزانية."; impact = "رفع LPV Rate يضاعف قيمة نفس الإنفاق."; conf = 70; }
      else if (args.lpv > 0 && args.atc / Math.max(args.lpv,1) < 0.05 && args.lpv >= 50) { verdict = "ITERATE"; what = `زوار وصلوا (${args.lpv} LPV) لكن ATC ضعيف (${args.atc}).`; why = "عرض/سعر/ثقة على صفحة المنتج لا يقنع بالإضافة للسلة."; action = "راجع العرض والضمانات والريفيوهات على صفحة المنتج؛ جرّب زاوية Objection-Smashing."; impact = "تحسين ATC يرفع الطلبات بدون زيادة ترافيك."; conf = 65; }
      else if (args.placed > 0 && args.delivered / Math.max(args.placed,1) < 0.5) { verdict = "INVESTIGATE"; what = `طلبات موضوعة ${args.placed} لكن المُسلّم ${args.delivered} فقط — NDR أقل من 50%.`; why = "مشكلة تأكيد COD أو توصيل Bosta أو RTO مرتفع، مش مشكلة إعلان بالضرورة."; action = "راجع تأكيد واتساب وأسباب RTO حسب المنطقة قبل إيقاف الحملة."; impact = "إصلاح التوصيل يرفع الربحية أكثر من أي تغيير كرييتيف."; conf = 75; }
      else if (args.delivered >= 20 && args.cpp > 0) { verdict = "KEEP"; what = `تسليم فعلي ${args.delivered} طلباً مع CPP مسجل ${args.cpp} EGP.`; why = "حجم كافٍ للحكم الأولي — قارن CPP ب Break-even من حاسبة COD قبل أي Scaling."; action = "قارن Delivered CPP ب Break-even Delivered CPP؛ لو أقل منه بثبات فكّر في SCALE تدريجي عبر Approvals."; impact = "قرار مبني على اقتصاديات حقيقية لا انطباع."; conf = 70; }
      else { verdict = "INVESTIGATE"; what = "البيانات لا تُظهر تسرباً واحداً حاسماً في القمع."; why = "تحتاج مقارنة ب Baseline الحساب وفصل Placements قبل الحكم."; action = "اجمع 48–72 ساعة إضافية وقارن Hook/Hold/CTR بمتوسط الحساب."; impact = "حكم أدق بعينة أكبر."; conf = 45; }
      if (args.hookRate > 0 && args.ctr > 0) warnings.push("تنبيه: Hook وCTR عاليان ليسا دليلاً قاطعاً على جودة الجمهور — قد يكون فضولاً أو Placements منخفضة النية.");
      const evidence = `Hook ${args.hookRate}% · Hold ${args.holdRate}% · CTR ${args.ctr}% · CPM ${args.cpm} · CPP ${args.cpp} · Clicks ${args.outboundClicks} → LPV ${args.lpv} → ATC ${args.atc} → IC ${args.ic} → Placed ${args.placed} → Confirmed ${args.confirmed} → Delivered ${args.delivered} · Spend ${args.spend} EGP`;
      return { verdict, whatHappened: what, why, evidence, confidence: conf, recommendedAction: action, expectedImpact: impact, measureNext: "قِس نفس خطوة القمع المتسربة في النافذة التالية بنفس نافذة الإسناد وقارن بال Baseline.", warnings };
    },
  }),

  // ---- Creatives ----
  listCreatives: defineAction({
    description: "Lists creative assets newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ creatives: z.array(z.object({ id: z.number(), title: z.string(), cisTag: z.string(), product: z.string(), angle: z.string(), hook: z.string(), format: z.string(), talent: z.string(), lever: z.string(), version: z.number(), status: z.string(), perfClass: z.string(), hookRate: z.number(), holdRate: z.number(), outboundCtr: z.number(), cvr: z.number(), cpp: z.number(), spend: z.number(), ordersDelivered: z.number(), whyNote: z.string(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.creatives).orderBy(desc(schema.creatives.id)).limit(args.limit); return { creatives: rows.map(r=>({ id:r.id, title:r.title, cisTag:r.cisTag, product:r.product, angle:r.angle, hook:r.hook, format:r.format, talent:r.talent, lever:r.lever, version:r.version, status:r.status, perfClass:r.perfClass, hookRate:r.hookRate, holdRate:r.holdRate, outboundCtr:r.outboundCtr, cvr:r.cvr, cpp:r.cpp, spend:r.spend, ordersDelivered:r.ordersDelivered, whyNote:r.whyNote, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createCreative: defineAction({
    description: "Creates a creative asset with CIS tag.",
    request: z.object({ title: z.string().trim().min(1).max(200), product: z.string().max(100).default(""), angle: z.string().max(100).default(""), hook: z.string().max(200).default(""), format: z.string().max(100).default(""), talent: z.string().max(100).default(""), lever: z.string().max(100).default(""), version: z.number().int().min(1).default(1), status: z.string().max(50).default("Concept Draft"), perfClass: z.string().max(80).default("Insufficient Evidence"), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number(), cisTag: z.string() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const clean = (s:string)=> s.trim().replace(/\s+/g,"_") || "NA"; const cisTag = `ZYRA_${clean(args.product)}_${clean(args.angle)}_${clean(args.hook)}_${clean(args.format)}_${clean(args.talent)}_${clean(args.lever)}_V${args.version}`; const res = await db.insert(schema.creatives).values({ title: args.title, cisTag, product: args.product, angle: args.angle, hook: args.hook, format: args.format, talent: args.talent, lever: args.lever, version: args.version, status: args.status, perfClass: args.perfClass, notes: args.notes }).returning({ id: schema.creatives.id }); ctx.invalidateQueries(); return { id: res[0]!.id, cisTag }; },
  }),
  updateCreative: defineAction({
    description: "Updates a creative status, performance class, or measured performance fields.",
    request: z.object({ id: z.number().int().positive(), status: z.string().max(50).optional(), perfClass: z.string().max(80).optional(), notes: z.string().max(2000).optional(), hookRate: z.number().min(0).optional(), holdRate: z.number().min(0).optional(), outboundCtr: z.number().min(0).optional(), cvr: z.number().min(0).optional(), cpp: z.number().min(0).optional(), spend: z.number().min(0).optional(), ordersDelivered: z.number().int().min(0).optional(), whyNote: z.string().max(2000).optional() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const patch: Record<string, unknown> = { updatedAt: new Date() }; if (args.status) patch.status = args.status; if (args.perfClass) patch.perfClass = args.perfClass; if (args.notes !== undefined) patch.notes = args.notes; if (args.hookRate !== undefined) patch.hookRate = args.hookRate; if (args.holdRate !== undefined) patch.holdRate = args.holdRate; if (args.outboundCtr !== undefined) patch.outboundCtr = args.outboundCtr; if (args.cvr !== undefined) patch.cvr = args.cvr; if (args.cpp !== undefined) patch.cpp = args.cpp; if (args.spend !== undefined) patch.spend = args.spend; if (args.ordersDelivered !== undefined) patch.ordersDelivered = args.ordersDelivered; if (args.whyNote !== undefined) patch.whyNote = args.whyNote; const before = await db.select().from(schema.creatives).where(eq(schema.creatives.id, args.id)); await db.update(schema.creatives).set(patch).where(eq(schema.creatives.id, args.id)); if (args.status === "Ready to Publish" && before[0] && before[0].status !== "Ready to Publish") { await db.insert(schema.workItems).values({ title: `بناء حملة للكرييتيف الجاهز: ${before[0].title}`, sourceType: "Campaign", ownerRole: "Media Buyer", priority: "High", nextAction: "ابنِ هيكلة الحملة (Domino/3:2:2) وجهّز طلب اعتماد الإطلاق", notes: `حدث مترابط: creative_approved (${before[0].cisTag}) أنشأ مهمة الحملة دي تلقائياً` }); await db.insert(schema.activityEvents).values({ section: "Creative → Media", eventType: "creative_approved", detail: `«${before[0].title}» بقى Ready to Publish — اتولدت مهمة بناء حملة في متابعة الشغل` }); } ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteCreative: defineAction({
    description: "Deletes a creative asset.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.creatives).where(eq(schema.creatives.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Content ----
  listContent: defineAction({
    description: "Lists content calendar items newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ items: z.array(z.object({ id: z.number(), title: z.string(), channel: z.string(), pillar: z.string(), format: z.string(), status: z.string(), scheduledDate: z.string(), captionDraft: z.string(), innovationBucket: z.string(), depthBucket: z.string(), sourceIdea: z.string(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.contentItems).orderBy(desc(schema.contentItems.id)).limit(args.limit); return { items: rows.map(r=>({ id:r.id, title:r.title, channel:r.channel, pillar:r.pillar, format:r.format, status:r.status, scheduledDate:r.scheduledDate, captionDraft:r.captionDraft, innovationBucket:r.innovationBucket, depthBucket:r.depthBucket, sourceIdea:r.sourceIdea, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createContent: defineAction({
    description: "Creates a content calendar item (draft only, no publishing).",
    request: z.object({ title: z.string().trim().min(1).max(200), channel: z.string().max(50).default("Instagram"), pillar: z.string().max(200).default(""), format: z.string().max(50).default("Reel"), status: z.string().max(50).default("Idea"), scheduledDate: z.string().max(20).default(""), captionDraft: z.string().max(3000).default(""), innovationBucket: z.string().max(80).default("70% Proven"), depthBucket: z.string().max(80).default("75% Deep Problem-Solving"), sourceIdea: z.string().max(1000).default(""), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.contentItems).values(args).returning({ id: schema.contentItems.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateContent: defineAction({
    description: "Updates a content item status.",
    request: z.object({ id: z.number().int().positive(), status: z.string().max(50).optional(), captionDraft: z.string().max(3000).optional(), notes: z.string().max(2000).optional() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const patch: Record<string, unknown> = { updatedAt: new Date() }; if (args.status) patch.status = args.status; if (args.captionDraft !== undefined) patch.captionDraft = args.captionDraft; if (args.notes !== undefined) patch.notes = args.notes; await db.update(schema.contentItems).set(patch).where(eq(schema.contentItems.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteContent: defineAction({
    description: "Deletes a content item.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.contentItems).where(eq(schema.contentItems.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Research & Customer ----
  listCompetitors: defineAction({
    description: "Lists competitor profiles.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ competitors: z.array(z.object({ id: z.number(), name: z.string(), category: z.string(), positioning: z.string(), offer: z.string(), priceNote: z.string(), sourceUrl: z.string(), websiteUrl: z.string(), metaPage: z.string(), tiktokHandle: z.string(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.competitors).orderBy(desc(schema.competitors.id)).limit(args.limit); return { competitors: rows.map(r=>({ id:r.id, name:r.name, category:r.category, positioning:r.positioning, offer:r.offer, priceNote:r.priceNote, sourceUrl:r.sourceUrl, websiteUrl:r.websiteUrl, metaPage:r.metaPage, tiktokHandle:r.tiktokHandle, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createCompetitor: defineAction({
    description: "Creates a competitor profile from public observation.",
    request: z.object({ name: z.string().trim().min(1).max(200), category: z.string().max(200).default(""), positioning: z.string().max(1000).default(""), offer: z.string().max(1000).default(""), priceNote: z.string().max(500).default(""), sourceUrl: z.string().max(1000).default(""), websiteUrl: z.string().max(1000).default(""), metaPage: z.string().max(500).default(""), tiktokHandle: z.string().max(500).default(""), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.competitors).values(args).returning({ id: schema.competitors.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  deleteCompetitor: defineAction({
    description: "Deletes a competitor profile.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.competitors).where(eq(schema.competitors.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  listObservations: defineAction({
    description: "Lists market observations.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ observations: z.array(z.object({ id: z.number(), title: z.string(), source: z.string(), observedDate: z.string(), evidenceTag: z.string(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.observations).orderBy(desc(schema.observations.id)).limit(args.limit); return { observations: rows.map(r=>({ id:r.id, title:r.title, source:r.source, observedDate:r.observedDate, evidenceTag:r.evidenceTag, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createObservation: defineAction({
    description: "Creates a dated market observation with source.",
    request: z.object({ title: z.string().trim().min(1).max(300), source: z.string().max(1000).default(""), observedDate: z.string().max(20).default(""), evidenceTag: z.string().max(30).default("UNKNOWN"), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.observations).values(args).returning({ id: schema.observations.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  deleteObservation: defineAction({
    description: "Deletes a market observation.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.observations).where(eq(schema.observations.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  listCustomerInsights: defineAction({
    description: "Lists aggregated customer insight themes (no personal data).",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ insights: z.array(z.object({ id: z.number(), theme: z.string(), insightType: z.string(), summary: z.string(), frequency: z.string(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.customerInsights).orderBy(desc(schema.customerInsights.id)).limit(args.limit); return { insights: rows.map(r=>({ id:r.id, theme:r.theme, insightType:r.insightType, summary:r.summary, frequency:r.frequency, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createCustomerInsight: defineAction({
    description: "Creates an aggregated customer insight theme.",
    request: z.object({ theme: z.string().trim().min(1).max(200), insightType: z.string().max(50).default("Objection"), summary: z.string().max(2000).default(""), frequency: z.string().max(200).default(""), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.customerInsights).values(args).returning({ id: schema.customerInsights.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  deleteCustomerInsight: defineAction({
    description: "Deletes a customer insight theme.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.customerInsights).where(eq(schema.customerInsights.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Financial snapshots ----
  listSnapshots: defineAction({
    description: "Lists financial snapshots.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ snapshots: z.array(z.object({ id: z.number(), label: z.string(), period: z.string(), product: z.string(), placed: z.number(), delivered: z.number(), contributionPlaced: z.number(), contributionDelivered: z.number(), breakevenRoas: z.number(), rtoRate: z.number(), shipCost: z.number(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.financialSnapshots).orderBy(desc(schema.financialSnapshots.id)).limit(args.limit); return { snapshots: rows.map(r=>({ id:r.id, label:r.label, period:r.period, product:r.product, placed:r.placed, delivered:r.delivered, contributionPlaced:r.contributionPlaced, contributionDelivered:r.contributionDelivered, breakevenRoas:r.breakevenRoas, rtoRate:r.rtoRate, shipCost:r.shipCost, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createSnapshot: defineAction({
    description: "Saves a financial snapshot for a product/cohort.",
    request: z.object({ label: z.string().trim().min(1).max(200), period: z.string().max(200).default(""), product: z.string().max(200).default(""), placed: z.number().int().min(0).default(0), delivered: z.number().int().min(0).default(0), contributionPlaced: z.number().default(0), contributionDelivered: z.number().default(0), breakevenRoas: z.number().min(0).default(0), rtoRate: z.number().min(0).default(0), shipCost: z.number().min(0).default(0), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.financialSnapshots).values(args).returning({ id: schema.financialSnapshots.id }); await db.insert(schema.activityEvents).values({ section: "Financial", eventType: "لقطة مالية جديدة — إعادة حساب", detail: `لقطة «${args.label}» (${args.product || "عام"}) — بوابة المحرك المالي لقرارات Task D اتحدّثت دلوقتي` }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  deleteSnapshot: defineAction({
    description: "Deletes a financial snapshot.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.financialSnapshots).where(eq(schema.financialSnapshots.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Experiments ----
  listExperiments: defineAction({
    description: "Lists experiments newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ experiments: z.array(z.object({ id: z.number(), hypothesis: z.string(), creativeId: z.string(), audience: z.string(), product: z.string(), hook: z.string(), angle: z.string(), format: z.string(), offer: z.string(), budget: z.number(), startDate: z.string(), endDate: z.string(), actuals: z.string(), sampleSize: z.string(), attribution: z.string(), profitability: z.string(), verdict: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.experiments).orderBy(desc(schema.experiments.id)).limit(args.limit); return { experiments: rows.map(r=>({ id:r.id, hypothesis:r.hypothesis, creativeId:r.creativeId, audience:r.audience, product:r.product, hook:r.hook, angle:r.angle, format:r.format, offer:r.offer, budget:r.budget, startDate:r.startDate, endDate:r.endDate, actuals:r.actuals, sampleSize:r.sampleSize, attribution:r.attribution, profitability:r.profitability, verdict:r.verdict, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createExperiment: defineAction({
    description: "Creates a full experiment record.",
    request: z.object({ hypothesis: z.string().trim().min(1).max(1000), creativeId: z.string().max(200).default(""), audience: z.string().max(500).default(""), product: z.string().max(200).default(""), hook: z.string().max(500).default(""), angle: z.string().max(200).default(""), format: z.string().max(200).default(""), offer: z.string().max(500).default(""), budget: z.number().min(0).default(0), startDate: z.string().max(20).default(""), endDate: z.string().max(20).default(""), actuals: z.string().max(2000).default(""), sampleSize: z.string().max(200).default(""), attribution: z.string().max(200).default(""), profitability: z.string().max(500).default(""), verdict: z.string().max(50).default("Running") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.experiments).values(args).returning({ id: schema.experiments.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateExperiment: defineAction({
    description: "Updates an experiment verdict or actuals.",
    request: z.object({ id: z.number().int().positive(), verdict: z.string().max(50).optional(), actuals: z.string().max(2000).optional(), profitability: z.string().max(500).optional() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const patch: Record<string, unknown> = { updatedAt: new Date() }; if (args.verdict) patch.verdict = args.verdict; if (args.actuals !== undefined) patch.actuals = args.actuals; if (args.profitability !== undefined) patch.profitability = args.profitability; await db.update(schema.experiments).set(patch).where(eq(schema.experiments.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteExperiment: defineAction({
    description: "Deletes an experiment.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.experiments).where(eq(schema.experiments.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Reviews ----
  listReviews: defineAction({
    description: "Lists weekly/monthly performance reviews.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ reviews: z.array(z.object({ id: z.number(), title: z.string(), reviewType: z.string(), period: z.string(), summary: z.string(), findings: z.string(), decisions: z.string(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.reviews).orderBy(desc(schema.reviews.id)).limit(args.limit); return { reviews: rows.map(r=>({ id:r.id, title:r.title, reviewType:r.reviewType, period:r.period, summary:r.summary, findings:r.findings, decisions:r.decisions, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createReview: defineAction({
    description: "Creates a weekly or monthly review record (Task G).",
    request: z.object({ title: z.string().trim().min(1).max(200), reviewType: z.enum(["Weekly","Monthly"]).default("Weekly"), period: z.string().max(200).default(""), summary: z.string().max(3000).default(""), findings: z.string().max(3000).default(""), decisions: z.string().max(3000).default(""), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.reviews).values(args).returning({ id: schema.reviews.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  deleteReview: defineAction({
    description: "Deletes a review record.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.reviews).where(eq(schema.reviews.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Execution logs ----
  listExecutions: defineAction({
    description: "Lists execution log entries with before/after values.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ executions: z.array(z.object({ id: z.number(), title: z.string(), actionType: z.string(), target: z.string(), beforeValue: z.string(), afterValue: z.string(), result: z.string(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.executionLogs).orderBy(desc(schema.executionLogs.id)).limit(args.limit); return { executions: rows.map(r=>({ id:r.id, title:r.title, actionType:r.actionType, target:r.target, beforeValue:r.beforeValue, afterValue:r.afterValue, result:r.result, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createExecution: defineAction({
    description: "Logs an executed approved action with before/after values.",
    request: z.object({ title: z.string().trim().min(1).max(200), actionType: z.string().max(50).default("Other"), target: z.string().max(500).default(""), beforeValue: z.string().max(1000).default(""), afterValue: z.string().max(1000).default(""), result: z.string().max(50).default("Completed"), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.executionLogs).values(args).returning({ id: schema.executionLogs.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  deleteExecution: defineAction({
    description: "Deletes an execution log entry.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.executionLogs).where(eq(schema.executionLogs.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),


  // ---- Core Inputs Hub ----
  getCoreProfile: defineAction({
    description: "Returns the latest core inputs profile (brand, COD economics, media settings) or null.",
    request: z.object({}),
    response: z.object({ profile: z.object({ id: z.number(), brandName: z.string(), websiteUrl: z.string(), market: z.string(), currency: z.string(), customerLanguage: z.string(), metaPage: z.string(), instagramHandle: z.string(), tiktokHandle: z.string(), heroOffer: z.string(), shippingPolicy: z.string(), returnPolicy: z.string(), guarantee: z.string(), icp7ws: z.string(), approvedClaims: z.string(), bannedClaims: z.string(), brandVoice: z.string(), shipCost: z.number(), packCost: z.number(), codFeePct: z.number(), rtoCost: z.number(), baseDeliveryRate: z.number(), discountNote: z.string(), testBudget: z.number(), minTestDays: z.number(), targetCpp: z.number(), killRule: z.string(), scaleRule: z.string(), whatsappConfirmPct: z.number(), deliveryPct: z.number(), adPerf30d: z.string(), adPerf7d: z.string(), customerVoice: z.string(), creativeInventory: z.string(), uncertaintyFlags: z.string(), updatedAt: z.string() }).nullable() }),
    async handler(ctx) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.coreProfiles).orderBy(desc(schema.coreProfiles.id)).limit(1); const r = rows[0]; if (!r) return { profile: null }; return { profile: { id:r.id, brandName:r.brandName, websiteUrl:r.websiteUrl, market:r.market, currency:r.currency, customerLanguage:r.customerLanguage, metaPage:r.metaPage, instagramHandle:r.instagramHandle, tiktokHandle:r.tiktokHandle, heroOffer:r.heroOffer, shippingPolicy:r.shippingPolicy, returnPolicy:r.returnPolicy, guarantee:r.guarantee, icp7ws:r.icp7ws, approvedClaims:r.approvedClaims, bannedClaims:r.bannedClaims, brandVoice:r.brandVoice, shipCost:r.shipCost, packCost:r.packCost, codFeePct:r.codFeePct, rtoCost:r.rtoCost, baseDeliveryRate:r.baseDeliveryRate, discountNote:r.discountNote, testBudget:r.testBudget, minTestDays:r.minTestDays, targetCpp:r.targetCpp, killRule:r.killRule, scaleRule:r.scaleRule, whatsappConfirmPct:r.whatsappConfirmPct, deliveryPct:r.deliveryPct, adPerf30d:r.adPerf30d, adPerf7d:r.adPerf7d, customerVoice:r.customerVoice, creativeInventory:r.creativeInventory, uncertaintyFlags:r.uncertaintyFlags, updatedAt:r.updatedAt.toISOString() } }; },
  }),
  saveCoreProfile: defineAction({
    description: "Saves (creates a new version of) the core inputs profile.",
    request: z.object({ brandName: z.string().trim().min(1).max(200), websiteUrl: z.string().max(1000).default(""), market: z.string().max(100).default("Egypt"), currency: z.string().max(10).default("EGP"), customerLanguage: z.string().max(100).default("Egyptian Arabic"), metaPage: z.string().max(500).default(""), instagramHandle: z.string().max(500).default(""), tiktokHandle: z.string().max(500).default(""), heroOffer: z.string().max(2000).default(""), shippingPolicy: z.string().max(2000).default(""), returnPolicy: z.string().max(2000).default(""), guarantee: z.string().max(2000).default(""), icp7ws: z.string().max(3000).default(""), approvedClaims: z.string().max(3000).default(""), bannedClaims: z.string().max(3000).default(""), brandVoice: z.string().max(2000).default(""), shipCost: z.number().min(0).default(0), packCost: z.number().min(0).default(0), codFeePct: z.number().min(0).max(100).default(2), rtoCost: z.number().min(0).default(0), baseDeliveryRate: z.number().min(0).max(100).default(0), discountNote: z.string().max(1000).default(""), testBudget: z.number().min(0).default(0), minTestDays: z.number().min(0).default(3), targetCpp: z.number().min(0).default(0), killRule: z.string().max(2000).default(""), scaleRule: z.string().max(2000).default(""), whatsappConfirmPct: z.number().min(0).max(100).default(0), deliveryPct: z.number().min(0).max(100).default(0), adPerf30d: z.string().max(3000).default(""), adPerf7d: z.string().max(3000).default(""), customerVoice: z.string().max(3000).default(""), creativeInventory: z.string().max(3000).default(""), uncertaintyFlags: z.string().max(3000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.coreProfiles).values({ ...args, updatedAt: new Date() }).returning({ id: schema.coreProfiles.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  listProducts: defineAction({
    description: "Lists core-input products/routines.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ products: z.array(z.object({ id: z.number(), name: z.string(), pageUrl: z.string(), price: z.number(), cogs: z.number(), status: z.string(), ingredients: z.string(), warnings: z.string(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.products).orderBy(desc(schema.products.id)).limit(args.limit); return { products: rows.map(r=>({ id:r.id, name:r.name, pageUrl:r.pageUrl, price:r.price, cogs:r.cogs, status:r.status, ingredients:r.ingredients, warnings:r.warnings, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createProduct: defineAction({
    description: "Creates a product/routine in core inputs.",
    request: z.object({ name: z.string().trim().min(1).max(200), pageUrl: z.string().max(1000).default(""), price: z.number().min(0).default(0), cogs: z.number().min(0).default(0), status: z.string().max(50).default("Active"), ingredients: z.string().max(2000).default(""), warnings: z.string().max(2000).default(""), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.products).values(args).returning({ id: schema.products.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateProduct: defineAction({
    description: "Updates a product status or price.",
    request: z.object({ id: z.number().int().positive(), status: z.string().max(50).optional(), price: z.number().min(0).optional(), cogs: z.number().min(0).optional(), notes: z.string().max(2000).optional() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const patch: Record<string, unknown> = {}; if (args.status) patch.status = args.status; if (args.price !== undefined) patch.price = args.price; if (args.cogs !== undefined) patch.cogs = args.cogs; if (args.notes !== undefined) patch.notes = args.notes; await db.update(schema.products).set(patch).where(eq(schema.products.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteProduct: defineAction({
    description: "Deletes a product from core inputs.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.products).where(eq(schema.products.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),


  decideTaskD: defineAction({
    description: "Task D Kill/Pause/Scale decision engine — mandatory order: COD math, thresholds, CIS, payday, freshness.",
    request: z.object({ gpt: z.number(), aov: z.number().min(0), ctr: z.number().min(0), accountAvgCtr: z.number().min(0), daysRunning: z.number().min(0), hookRate: z.number().min(0), holdRate: z.number().min(0), convRate: z.number().min(0), creativeAgeDays: z.number().min(0), tier: z.number().int().min(1).max(3).default(1), paydayState: z.enum(["SCALE_OK","CAUTION","PAYDAY"]).default("SCALE_OK"), coldStart: z.boolean().default(false) }),
    response: z.object({ verdict: z.string(), confidence: z.string(), steps: z.array(z.object({ step: z.string(), result: z.string(), detail: z.string() })), reason: z.string(), frameworkRef: z.string(), scaleBudgetPct: z.number(), graveyardNote: z.string() }),
    async handler(_ctx, args) {
      const steps: {step:string,result:string,detail:string}[] = [];
      // Step 1 COD Math
      if (args.gpt < 0) { steps.push({ step:"1. COD Math Check", result:"FAIL — GPT < 0", detail:`GPT = ${args.gpt} EGP. Priority 1: COD Math is Law.` }); return { verdict:"KILL", confidence: args.coldStart ? "MEDIUM" : "HIGH", steps, reason:"GPT سالب — الإعلان بيخسر على مستوى الوحدة. COD Math Check فشل (Priority 1) فالحكم KILL فوراً بغض النظر عن أي CTR.", frameworkRef:"Master Prompt PART 7 Priority Hierarchy + Task D Step 1", scaleBudgetPct:0, graveyardNote:"يُسجل السبب في Dead Angle Graveyard: GPT<0." }; }
      steps.push({ step:"1. COD Math Check", result:"PASS", detail:`GPT = ${args.gpt} EGP على AOV = ${args.aov} EGP (${args.aov>0 ? Math.round(args.gpt/args.aov*100) : 0}% من AOV).` });
      const gptPct = args.aov>0 ? args.gpt/args.aov : 1;
      // Step 2 thresholds
      const ratio = args.accountAvgCtr>0 ? args.ctr/args.accountAvgCtr : 0;
      let threshVerdict = ""; let threshDetail = "";
      if (args.accountAvgCtr<=0) { threshVerdict="INSUFFICIENT DATA"; threshDetail="متوسط CTR الحساب غير مدخل — لا يمكن تطبيق العتبات."; }
      else if (args.daysRunning>=3 && ratio<0.5) { threshVerdict="KILL"; threshDetail=`CTR عند ${Math.round(ratio*100)}% من متوسط الحساب بعد ${args.daysRunning} أيام (<50% بعد 3 أيام = KILL).`; }
      else if (args.daysRunning>=7 && ratio<0.7) { threshVerdict="ITERATE"; threshDetail=`CTR عند ${Math.round(ratio*100)}% من المتوسط بعد 7 أيام (<70% = ITERATE).`; }
      else if (args.daysRunning>=7 && ratio>1.2) { threshVerdict="SCALE candidate"; threshDetail=`CTR عند ${Math.round(ratio*100)}% من المتوسط بعد 7 أيام (>120% = مرشح SCALE).`; }
      else { threshVerdict="KEEP / MONITOR"; threshDetail=`CTR عند ${args.accountAvgCtr>0?Math.round(ratio*100):0}% من المتوسط — داخل النطاق الطبيعي أو العينة لسه صغيرة.`; }
      steps.push({ step:"2. Performance Thresholds", result: threshVerdict, detail: threshDetail });
      // Step 3 CIS
      let cis = "لا عنق زجاجة واضح في CIS.";
      if (args.hookRate>0 && args.hookRate<20) cis = "Hook Rate منخفض — المشكلة في الـ Hook (أول 3 ثواني/أول سطر).";
      else if (args.holdRate>0 && args.holdRate<25) cis = "Hold Rate منخفض — المشكلة في الـ Body/المحتوى الأوسط.";
      else if (args.convRate>0 && args.convRate<1) cis = "Conversion منخفض رغم المشاهدة — المشكلة في CTA/Offer أو اللاندنج.";
      steps.push({ step:"3. CIS Diagnosis (Hook→Hook Rate · Format/Talent→Hold · Angle/Lever→CVR)", result: cis.includes("منخفض") ? "BOTTLENECK FOUND" : "OK", detail: cis });
      // Step 4 Payday
      const paydayBlocked = args.paydayState==="PAYDAY";
      steps.push({ step:"4. Payday Check", result: paydayBlocked ? "SCALE BLOCKED" : args.paydayState, detail: paydayBlocked ? "فترة Payday (25–5) — الـ SCALE محظور حسب Payday is Law، انتظر أو اكتفِ بـ KEEP." : args.paydayState==="CAUTION" ? "فترة ما قبل المرتب (15–24) — انخفاض متوقع، لا تقتل حملة مثبتة بسبب هبوط منتصف الشهر." : "خارج فترات الحذر — SCALE مسموح إذا عدّى باقي الخطوات." });
      // Step 5 Freshness
      const freshLimit = args.tier===1?14:args.tier===2?21:7;
      const stale = args.creativeAgeDays>freshLimit;
      steps.push({ step:"5. Freshness Check", result: stale?"STALE":"FRESH", detail:`عمر الكرييتيف ${args.creativeAgeDays} يوم — حد Tier ${args.tier} هو ${freshLimit} يوم.` });
      // Final
      let verdict = "KEEP"; let reason = "كل الفحوصات عدّت — استمر وراقب."; let conf = "MEDIUM"; let scalePct = 0; let grave = "";
      if (threshVerdict==="KILL" && args.daysRunning>=3 && !args.coldStart) { verdict="KILL"; reason="CTR أقل من 50% من متوسط الحساب بعد 3 أيام فأكثر مع GPT موجب لكن أداء إعلاني منهك — KILL حسب عتبات Task D."; conf="HIGH"; grave="يُسجل في Dead Angle Graveyard: CTR collapse vs account average."; }
      else if (args.coldStart && args.daysRunning<14) { verdict="INSUFFICIENT DATA"; reason="وضع Cold Start (منتج <14 يوم أو <50 طلب): لغة عدم يقين إلزامية — لا KILL ولا SCALE، اجمع بيانات."; conf="INSUFFICIENT DATA"; }
      else if (threshVerdict==="INSUFFICIENT DATA") { verdict="INSUFFICIENT DATA"; reason="متوسط CTR الحساب مفقود — الحكم مؤجل حتى اكتمال المدخلات."; conf="INSUFFICIENT DATA"; }
      else if (threshVerdict==="SCALE candidate") {
        if (gptPct<0.15) { verdict="ITERATE"; reason="مرشح SCALE بالأداء لكن GPT أقل من 15% من AOV — DO NOT SCALE حسب Task D Step 1. حسّن الاقتصاديات أولاً."; conf="HIGH"; }
        else if (paydayBlocked) { verdict="KEEP"; reason="مرشح SCALE لكن Payday Check حظر الـ SCALE الآن — KEEP حتى نهاية فترة الـ Payday."; conf="HIGH"; }
        else if (stale) { verdict="ITERATE"; reason="مرشح SCALE لكن الكرييتيف تجاوز حد الـ Freshness — جدّد الكرييتيف قبل الزيادة."; conf="MEDIUM"; }
        else { verdict="SCALE"; reason="أداء >120% من المتوسط بعد 7 أيام + GPT صحي + Payday OK + Fresh — SCALE تدريجي عبر Approvals."; conf="HIGH"; scalePct=20; }
      }
      else if (threshVerdict==="ITERATE" || cis.includes("منخفض")) { verdict="ITERATE"; reason="يوجد عنق زجاجة قابل للإصلاح (عتبات أو CIS) — غيّر متغيراً واحداً وأعد الاختبار."; conf="MEDIUM"; }
      return { verdict, confidence: conf, steps, reason, frameworkRef:"Task D mandatory order: COD Math → Thresholds → CIS → Payday → Freshness (Master Prompt v2.0)", scaleBudgetPct: scalePct, graveyardNote: grave };
    },
  }),

  // ---- Market Watch: rounds, alerts, syncs ----
  listMarketRounds: defineAction({
    description: "Lists market watch rounds newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ rounds: z.array(z.object({ id: z.number(), source: z.string(), scope: z.string(), findings: z.string(), roundDate: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.marketRounds).orderBy(desc(schema.marketRounds.id)).limit(args.limit); return { rounds: rows.map(r=>({ id:r.id, source:r.source, scope:r.scope, findings:r.findings, roundDate:r.roundDate, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createMarketRound: defineAction({
    description: "Records a market watch round (source, scope, findings).",
    request: z.object({ source: z.string().max(100).default("Website"), scope: z.string().max(1000).default(""), findings: z.string().max(4000).default(""), roundDate: z.string().max(20).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.marketRounds).values(args).returning({ id: schema.marketRounds.id }); await db.insert(schema.activityEvents).values({ section: "Market Watch", eventType: "جولة متابعة", detail: `${args.source}: ${args.scope}`.slice(0, 500) }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  deleteMarketRound: defineAction({
    description: "Deletes a market watch round.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.marketRounds).where(eq(schema.marketRounds.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  listCompetitorAlerts: defineAction({
    description: "Lists competitor change alerts newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ alerts: z.array(z.object({ id: z.number(), competitor: z.string(), changeType: z.string(), detail: z.string(), source: z.string(), status: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.competitorAlerts).orderBy(desc(schema.competitorAlerts.id)).limit(args.limit); return { alerts: rows.map(r=>({ id:r.id, competitor:r.competitor, changeType:r.changeType, detail:r.detail, source:r.source, status:r.status, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createCompetitorAlert: defineAction({
    description: "Creates a competitor change alert.",
    request: z.object({ competitor: z.string().trim().min(1).max(200), changeType: z.string().max(100).default("زاوية جديدة"), detail: z.string().max(2000).default(""), source: z.string().max(1000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.competitorAlerts).values(args).returning({ id: schema.competitorAlerts.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateCompetitorAlert: defineAction({
    description: "Updates a competitor alert status.",
    request: z.object({ id: z.number().int().positive(), status: z.string().max(50) }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.update(schema.competitorAlerts).set({ status: args.status }).where(eq(schema.competitorAlerts.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteCompetitorAlert: defineAction({
    description: "Deletes a competitor alert.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.competitorAlerts).where(eq(schema.competitorAlerts.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  listSyncs: defineAction({
    description: "Lists sync/import runs (Sync Log) newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ syncs: z.array(z.object({ id: z.number(), source: z.string(), status: z.string(), summary: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.syncRuns).orderBy(desc(schema.syncRuns.id)).limit(args.limit); return { syncs: rows.map(r=>({ id:r.id, source:r.source, status:r.status, summary:r.summary, createdAt:r.createdAt.toISOString() })) }; },
  }),
  listActivity: defineAction({
    description: "Lists cross-section activity events newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ events: z.array(z.object({ id: z.number(), section: z.string(), eventType: z.string(), detail: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.activityEvents).orderBy(desc(schema.activityEvents.id)).limit(args.limit); return { events: rows.map(r=>({ id:r.id, section:r.section, eventType:r.eventType, detail:r.detail, createdAt:r.createdAt.toISOString() })) }; },
  }),
  logActivity: defineAction({
    description: "Logs a cross-section activity event.",
    request: z.object({ section: z.string().max(100), eventType: z.string().max(100), detail: z.string().max(1000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.activityEvents).values(args).returning({ id: schema.activityEvents.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),

  // ---- Agent Plans (Ask Zyra planner) ----
  listAgentPlans: defineAction({
    description: "Lists agent-generated plans newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ plans: z.array(z.object({ id: z.number(), goal: z.string(), taskType: z.string(), steps: z.array(z.object({ step: z.string(), stage: z.string(), section: z.string(), detail: z.string() })), status: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.agentPlans).orderBy(desc(schema.agentPlans.id)).limit(args.limit); return { plans: rows.map(r=>{ let steps: {step:string,stage:string,section:string,detail:string}[] = []; try { const p = JSON.parse(r.planJson); if (Array.isArray(p)) steps = p; } catch { steps = []; } return { id:r.id, goal:r.goal, taskType:r.taskType, steps, status:r.status, createdAt:r.createdAt.toISOString() }; }) }; },
  }),
  createAgentPlan: defineAction({
    description: "Saves an agent plan (goal classified to a task type A-G with 8-stage steps).",
    request: z.object({ goal: z.string().trim().min(1).max(500), taskType: taskTypeEnum, steps: z.array(z.object({ step: z.string().max(300), stage: z.string().max(50), section: z.string().max(100), detail: z.string().max(1000) })).max(12) }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.agentPlans).values({ goal: args.goal, taskType: args.taskType, planJson: JSON.stringify(args.steps), status: "Proposed" }).returning({ id: schema.agentPlans.id }); await db.insert(schema.activityEvents).values({ section: "Ask Zyra", eventType: "خطة جديدة", detail: `مهمة ${args.taskType}: ${args.goal}`.slice(0, 500) }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateAgentPlan: defineAction({
    description: "Updates an agent plan status (Proposed/Approved/Rejected).",
    request: z.object({ id: z.number().int().positive(), status: z.enum(["Proposed","Approved","Rejected"]) }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.update(schema.agentPlans).set({ status: args.status }).where(eq(schema.agentPlans.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteAgentPlan: defineAction({
    description: "Deletes an agent plan.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.agentPlans).where(eq(schema.agentPlans.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Relaunch goals ----
  listRelaunchGoals: defineAction({
    description: "Lists relaunch success goals/metrics.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ goals: z.array(z.object({ id: z.number(), metric: z.string(), target: z.number(), current: z.number(), unit: z.string(), deadline: z.string(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.relaunchGoals).orderBy(desc(schema.relaunchGoals.id)).limit(args.limit); return { goals: rows.map(r=>({ id:r.id, metric:r.metric, target:r.target, current:r.current, unit:r.unit, deadline:r.deadline, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createRelaunchGoal: defineAction({
    description: "Creates a relaunch goal/metric to track.",
    request: z.object({ metric: z.string().trim().min(1).max(200), target: z.number().min(0).default(0), current: z.number().min(0).default(0), unit: z.string().max(50).default(""), deadline: z.string().max(20).default(""), notes: z.string().max(1000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.relaunchGoals).values(args).returning({ id: schema.relaunchGoals.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateRelaunchGoal: defineAction({
    description: "Updates a relaunch goal current value or target.",
    request: z.object({ id: z.number().int().positive(), current: z.number().min(0).optional(), target: z.number().min(0).optional(), notes: z.string().max(1000).optional() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const patch: Record<string, unknown> = {}; if (args.current !== undefined) patch.current = args.current; if (args.target !== undefined) patch.target = args.target; if (args.notes !== undefined) patch.notes = args.notes; await db.update(schema.relaunchGoals).set(patch).where(eq(schema.relaunchGoals.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteRelaunchGoal: defineAction({
    description: "Deletes a relaunch goal.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.relaunchGoals).where(eq(schema.relaunchGoals.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Creative Generation Studio ----
  listGenerationRequests: defineAction({
    description: "Lists creative generation requests newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ requests: z.array(z.object({ id: z.number(), title: z.string(), product: z.string(), angle: z.string(), format: z.string(), hook: z.string(), primaryText: z.string(), cta: z.string(), size: z.string(), spec: z.string(), cisTag: z.string(), status: z.string(), notes: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.generationRequests).orderBy(desc(schema.generationRequests.id)).limit(args.limit); return { requests: rows.map(r=>({ id:r.id, title:r.title, product:r.product, angle:r.angle, format:r.format, hook:r.hook, primaryText:r.primaryText, cta:r.cta, size:r.size, spec:r.spec, cisTag:r.cisTag, status:r.status, notes:r.notes, createdAt:r.createdAt.toISOString() })) }; },
  }),
  createGenerationRequest: defineAction({
    description: "Creates a creative generation request for Muse to fulfil from the queue.",
    request: z.object({ title: z.string().trim().min(1).max(200), product: z.string().max(100).default(""), angle: z.string().max(100).default(""), format: z.string().max(100).default(""), hook: z.string().max(300).default(""), primaryText: z.string().max(2000).default(""), cta: z.string().max(200).default(""), size: z.string().max(30).default("1080x1920"), spec: z.string().max(4000).default(""), cisTag: z.string().max(500).default(""), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.generationRequests).values({ ...args, status: "New" }).returning({ id: schema.generationRequests.id }); await db.insert(schema.workItems).values({ title: `توليد كرييتيف: ${args.title}`, sourceType: "Creative", ownerRole: "Creative", priority: "Medium", nextAction: "Muse ينفذ طلب التوليد من قائمة الاستوديو ويسجل الناتج كأصل مسودة", notes: `Generation Request #${res[0]!.id} — ${args.cisTag}` }); await db.insert(schema.activityEvents).values({ section: "Creative Studio", eventType: "طلب توليد", detail: args.title.slice(0, 500) }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateGenerationRequest: defineAction({
    description: "Updates a generation request status (New/Generating/Delivered/Approved/Rejected).",
    request: z.object({ id: z.number().int().positive(), status: z.enum(["New","Generating","Delivered","Approved","Rejected"]), notes: z.string().max(2000).optional() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const patch: Record<string, unknown> = { status: args.status, updatedAt: new Date() }; if (args.notes !== undefined) patch.notes = args.notes; await db.update(schema.generationRequests).set(patch).where(eq(schema.generationRequests.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteGenerationRequest: defineAction({
    description: "Deletes a generation request.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.generationRequests).where(eq(schema.generationRequests.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Winner / Performance Analysis (CIS layers) ----
  analyzeCreative: defineAction({
    description: "Analyzes a creative's CIS layers vs account averages: classification, why it won/lost, fatigue, modular remix.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.boolean(), classification: z.string(), confidence: z.string(), sampleNote: z.string(), layers: z.array(z.object({ layer: z.string(), metric: z.string(), value: z.number(), avg: z.number(), verdict: z.string() })), why: z.string(), fatigue: z.string(), remix: z.string() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.creatives);
      const c = rows.find(r=>r.id===args.id);
      if (!c) return { ok:false, classification:"NOT FOUND", confidence:"—", sampleNote:"", layers:[], why:"الكرييتيف غير موجود.", fatigue:"", remix:"" };
      const withData = rows.filter(r=>r.id!==c.id && (r.spend>0 || r.hookRate>0 || r.cvr>0));
      const avg = (f:(r: typeof schema.creatives.$inferSelect)=>number)=>{ const vs = withData.map(f).filter(v=>v>0); return vs.length ? Math.round(vs.reduce((a,b)=>a+b,0)/vs.length*100)/100 : 0; };
      const avgHook = avg(r=>r.hookRate), avgHold = avg(r=>r.holdRate), avgCtr = avg(r=>r.outboundCtr), avgCvr = avg(r=>r.cvr), avgCpp = avg(r=>r.cpp);
      const cmp = (v:number, a:number, invert=false)=>{ if (v<=0) return "NO DATA"; if (a<=0) return "NO BASELINE"; const r = v/a; const good = invert ? r<=1 : r>=1; const strong = invert ? r<=0.8 : r>=1.2; if (strong && good) return "STRONG"; if (good) return "OK"; return "WEAK"; };
      const layers = [
        { layer:"Hook → Hook Rate", metric:"Hook Rate %", value:c.hookRate, avg:avgHook, verdict: cmp(c.hookRate, avgHook) },
        { layer:"Format/Talent → Hold Rate", metric:"Hold Rate %", value:c.holdRate, avg:avgHold, verdict: cmp(c.holdRate, avgHold) },
        { layer:"Format/Talent → Outbound CTR", metric:"Outbound CTR %", value:c.outboundCtr, avg:avgCtr, verdict: cmp(c.outboundCtr, avgCtr) },
        { layer:"Angle/Lever → CVR", metric:"CVR %", value:c.cvr, avg:avgCvr, verdict: cmp(c.cvr, avgCvr) },
        { layer:"Angle/Lever → CPP", metric:"CPP EGP", value:c.cpp, avg:avgCpp, verdict: cmp(c.cpp, avgCpp, true) },
      ];
      const hasData = c.spend>0 || c.hookRate>0 || c.cvr>0 || c.ordersDelivered>0;
      const sampleNote = !hasData ? "لا توجد أي بيانات أداء مدخلة لهذا الكرييتيف بعد." : c.ordersDelivered>0 && c.ordersDelivered<10 ? `عينة صغيرة: ${c.ordersDelivered} طلب مُسلّم فقط (<10) — الحكم مؤقت.` : `العينة: ${c.ordersDelivered} طلب مُسلّم · إنفاق ${c.spend} EGP.`;
      let classification = "Insufficient Evidence"; let confidence = "LOW";
      if (hasData && c.ordersDelivered>=10) {
        const strong = layers.filter(l=>l.verdict==="STRONG").length; const weak = layers.filter(l=>l.verdict==="WEAK").length;
        const convStrong = layers[3]!.verdict==="STRONG" || layers[4]!.verdict==="STRONG";
        if (strong>=3 && convStrong && weak===0) { classification = "Validated for this scope"; confidence = "HIGH"; }
        else if (strong>=2 && weak<=1) { classification = "Promising"; confidence = "MEDIUM"; }
        else if (weak>=3) { classification = "Declining-Fatigued"; confidence = "MEDIUM"; }
        else { classification = "Promising"; confidence = "LOW"; }
      } else if (hasData) { classification = "Insufficient Evidence"; confidence = "LOW"; }
      const ageDays = Math.max(0, Math.round((Date.now() - c.createdAt.getTime())/86400000));
      const fatigue = ageDays>14 && layers[0]!.verdict==="WEAK" ? `⚠️ إجهاد محتمل: عمر الكرييتيف ${ageDays} يوم وHook Rate أقل من متوسط الحساب — جدّد الـ Hook أو أعد الإنتاج قبل زيادة الإنفاق.` : ageDays>21 ? `عمر الكرييتيف ${ageDays} يوم — راجع حد الـ Freshness حسب الـ Tier قبل أي SCALE.` : "لا إشارة إجهاد حالياً (العمر وHook Rate داخل النطاق).";
      const sorted = [...layers].filter(l=>l.verdict!=="NO DATA" && l.verdict!=="NO BASELINE");
      const best = sorted.find(l=>l.verdict==="STRONG"); const worst = [...sorted].reverse().find(l=>l.verdict==="WEAK");
      const why = classification==="Insufficient Evidence" ? "لا يمكن تفسير فوز/خسارة بدون عينة كافية — أدخل أرقام الأداء الحقيقية أولاً (Insufficient Evidence is a Valid Answer)." : `أقوى طبقة: ${best ? best.layer + " (" + best.value + " مقابل متوسط " + best.avg + ")" : "لا طبقة قوية واضحة"}. أضعف طبقة: ${worst ? worst.layer + " (" + worst.value + " مقابل متوسط " + worst.avg + ")" : "لا طبقة ضعيفة حاسمة"}. الحكم مبني على طبقات CIS: الـ Hook مسؤول عن Hook Rate، الفورمات/الموهبة عن Hold وCTR، والزاوية/الرافعة عن CVR وCPP.`;
      const hookDonor = rows.filter(r=>r.id!==c.id && r.hookRate>0).sort((a,b)=>b.hookRate-a.hookRate)[0];
      const angleDonor = rows.filter(r=>r.id!==c.id && r.cvr>0).sort((a,b)=>b.cvr-a.cvr)[0];
      const remix = hookDonor && angleDonor && hookDonor.id!==angleDonor.id ? `Modular Remix مقترح: خذ Hook من «${hookDonor.title}» (Hook Rate ${hookDonor.hookRate}%) مع زاوية «${angleDonor.angle}» من «${angleDonor.title}» (CVR ${angleDonor.cvr}%) — تركيبة جديدة بتاخد CIS Tag وإصدار مستقل وتُختبر كمتغير واحد.` : "Modular Remix: لسه مفيش فائزان مختلفان بأرقام كافية لاقتراح ريمكس موثوق.";
      if (classification!=="Insufficient Evidence" || hasData) { await db.update(schema.creatives).set({ perfClass: classification }).where(eq(schema.creatives.id, c.id)); ctx.invalidateQueries(); }
      return { ok:true, classification, confidence, sampleNote, layers, why, fatigue, remix };
    },
  }),

  // ---- Comprehensive Audit (8 pillars, advisory methodology) ----
  listAuditState: defineAction({
    description: "Returns saved audit checklist item states keyed by item key.",
    request: z.object({}),
    response: z.object({ items: z.array(z.object({ itemKey: z.string(), pillar: z.number(), title: z.string(), status: z.string(), notes: z.string(), evidence: z.string(), updatedAt: z.string() })) }),
    async handler(ctx) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.auditItems); return { items: rows.map(r=>({ itemKey:r.itemKey, pillar:r.pillar, title:r.title, status:r.status, notes:r.notes, evidence:r.evidence, updatedAt:r.updatedAt.toISOString() })) }; },
  }),
  setAuditState: defineAction({
    description: "Upserts one audit checklist item state (status/notes/evidence).",
    request: z.object({ itemKey: z.string().trim().min(1).max(100), pillar: z.number().int().min(1).max(8), title: z.string().max(300), status: z.enum(["لم يبدأ","جارٍ","مكتمل"]), notes: z.string().max(2000).default(""), evidence: z.string().max(2000).default("") }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const existing = await db.select().from(schema.auditItems).where(eq(schema.auditItems.itemKey, args.itemKey)); if (existing[0]) { await db.update(schema.auditItems).set({ status: args.status, notes: args.notes, evidence: args.evidence, title: args.title, pillar: args.pillar, updatedAt: new Date() }).where(eq(schema.auditItems.itemKey, args.itemKey)); } else { await db.insert(schema.auditItems).values({ itemKey: args.itemKey, pillar: args.pillar, title: args.title, status: args.status, notes: args.notes, evidence: args.evidence }); } ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Website import: reads zyra-care.com public catalog & policies into Core Inputs ----
  importWebsiteData: defineAction({
    description: "Reads the brand's public website (zyra-care.com) catalog and policies and fills Core Inputs, products, market watch, competitors, relaunch plan items. Idempotent: never duplicates or overwrites owner edits.",
    request: z.object({}),
    response: z.object({ ok: z.literal(true), liveFetch: z.boolean(), productsAdded: z.number(), productsTotal: z.number(), profileCreated: z.boolean(), competitorsAdded: z.number(), roundsAdded: z.number(), workItemsAdded: z.number(), planCreated: z.boolean(), summary: z.string() }),
    async handler(ctx): Promise<{ok:true, liveFetch:boolean, productsAdded:number, productsTotal:number, profileCreated:boolean, competitorsAdded:number, roundsAdded:number, workItemsAdded:number, planCreated:boolean, summary:string}> {
      const db = ctx.db<typeof schema>();
      const today = new Date().toISOString().slice(0,10);
      // 1) Try live fetch of the public Shopify catalog
      type P = { name: string; pageUrl: string; price: number; ingredients: string; warnings: string; notes: string };
      let live: P[] = [];
      let liveFetch = false;
      try {
        const ctrl = new AbortController(); const t = setTimeout(()=>ctrl.abort(), 20000);
        const res = await fetch("https://zyra-care.com/products.json?limit=250", { signal: ctrl.signal, headers: { "user-agent": "Mozilla/5.0 (ZyraAgent)" } });
        clearTimeout(t);
        if (res.ok) {
          const data = await res.json() as { products?: { title: string; handle: string; body_html?: string; variants?: { price: string }[] }[] };
          const strip = (h: string)=> h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          live = (data.products ?? []).map(p=>{
            const seed = WEBSITE_PRODUCTS.find(s=>s.pageUrl.endsWith("/"+p.handle));
            const body = strip(p.body_html ?? "");
            return { name: p.title, pageUrl: `https://zyra-care.com/products/${p.handle}`, price: Number(p.variants?.[0]?.price ?? seed?.price ?? 0), ingredients: seed?.ingredients ?? "", warnings: seed?.warnings ?? "", notes: (body || seed?.notes || "").slice(0, 850) };
          }).filter(p=>p.name);
          liveFetch = live.length > 0;
        }
      } catch { liveFetch = false; }
      const catalog: P[] = liveFetch ? live : WEBSITE_PRODUCTS.map(s=>({ name: s.name, pageUrl: s.pageUrl, price: s.price, ingredients: s.ingredients, warnings: s.warnings, notes: s.notes }));
      // 2) Products (dedupe by pageUrl) — owner-provided COGS: 350 EGP for each Dual Hero routine
      const HERO_HANDLES = ["cellulite-smoothing-routine", "kp-calm-smooth-routine"];
      const heroCogs = (url: string)=> HERO_HANDLES.some(h=>url.endsWith(h)) ? 350 : 0;
      const existing = await db.select().from(schema.products);
      const haveUrls = new Set(existing.map(p=>p.pageUrl));
      let productsAdded = 0;
      for (const p of catalog) { if (!haveUrls.has(p.pageUrl)) { await db.insert(schema.products).values({ name: p.name, pageUrl: p.pageUrl, price: p.price, cogs: heroCogs(p.pageUrl), status: "Active", ingredients: p.ingredients, warnings: p.warnings, notes: p.notes }); productsAdded++; } }
      for (const p of existing) { if (heroCogs(p.pageUrl)===350 && p.cogs===0) await db.update(schema.products).set({ cogs: 350 }).where(eq(schema.products.id, p.id)); }
      // 3) Core profile (only when none exists — never overwrite owner edits)
      const profiles = await db.select().from(schema.coreProfiles);
      let profileCreated = false;
      if (profiles.length === 0) {
        await db.insert(schema.coreProfiles).values({
          brandName: "Zyra Care", websiteUrl: "https://zyra-care.com", market: "Egypt", currency: "EGP", customerLanguage: "Egyptian Arabic",
          heroOffer: "روتينات متكاملة لكل مشكلة بشرة/جسم — «مشكلتك ليها روتين» · أكتر من 1000 عميلة طلبوا من زيرا (كما هو معلن على الويبسايت)",
          shippingPolicy: "شحن 75 EGP لكل المحافظات، ومجاني للطلبات من 1000 EGP · الأوردر بيتشحن خلال 3–5 أيام عمل (من الويبسايت)",
          returnPolicy: "استبدال واسترجاع خلال 14 يوم من الاستلام (من الويبسايت)",
          guarantee: "الدفع عند الاستلام + تأكيد الأوردر قبل الشحن وإرسال طريقة الاستخدام بالترتيب (وعود معلنة على الويبسايت)",
          approvedClaims: "نعومة وترطيب من أول أسبوع · تحسّن تدريجي في مظهر السطح مع الانتظام 4–8 أسابيع (صياغات الويبسايت الحذرة: يحسّن الملمس والمظهر)",
          bannedClaims: "يعالج/علاج · نهائي · يقضي للأبد · مضمون 100% · تخسيس أو إزالة السيلوليت (الويبسايت نفسه ينفيها) · أي ادعاء طبي",
          brandVoice: "صريح وحذر: بنقولك المتوقع بالظبط وإمتى المنتج مش مناسب ليكي، من غير وعود مبالغ فيها (من صفحة «مين زيرا؟»)",
          shipCost: 75, targetCpp: 160,
          killRule: "GPT<0 ⇒ KILL فوري. للهيرو المزدوج (بافتراضات تشغيلية افتراضية): Placed CPP أعلى من Break-even ‏≈275 EGP يعني خسارة — لا إطلاق.",
          scaleRule: "Scale فقط لو GPT ≥ ‏15% من AOV. للهيرو: تصمد البوابة حتى Placed CPP ‏≈180، والهدف التشغيلي المعتمد ≤150–160 EGP.",
          uncertaintyFlags: "COGS الهيروين = 350 EGP من المالك (مؤكد). لكن: رسوم Bosta الفعلية غير مؤكدة — أرقام Break-even (275) والمساهمة (381/مُسلّم) محسوبة بافتراضات السكربت الافتراضية (تعبئة 20 / شحن 70 / مرتجع 50 / COD ‏2%) عند تسليم صافٍ 72% افتراضي. نسب WhatsApp/Delivery الفعلية وميزانية الاختبار الأسبوعية لسه على المالك. COGS باقي المنتجات غير مدخل.",
          updatedAt: new Date(),
        });
        profileCreated = true;
      }
      // 4) Market round + observation for this read
      const rounds = await db.select().from(schema.marketRounds);
      let roundsAdded = 0;
      if (!rounds.some(r=>r.roundDate===today && r.source.includes("zyra-care.com"))) {
        await db.insert(schema.marketRounds).values({ source: "موقع البراند zyra-care.com", scope: "قراءة الكتالوج الكامل + السياسات (شحن/استرجاع/دفع عند الاستلام)", findings: `تمت قراءة ${catalog.length} منتج بأسعارها الحالية من ${liveFetch ? "الويبسايت مباشرة" : "لقطة الويبسايت الموثقة"} — روتينات 599–1300 EGP ومنتجات مفردة 120–450 EGP. الشحن 75 EGP ومجاني من 1000 EGP، استرجاع 14 يوم، شحن خلال 3–5 أيام عمل.`, roundDate: today });
        roundsAdded++;
      }
      const obs = await db.select().from(schema.observations);
      if (!obs.some(o=>o.title.startsWith("قراءة ويبسايت"))) {
        await db.insert(schema.observations).values({ title: "قراءة ويبسايت zyra-care.com: الكتالوج والسياسات", source: "https://zyra-care.com", observedDate: today, evidenceTag: "VERIFIED", notes: `23 منتج: روتينات حسب المشكلة (سيلوليت 799، جلد الوزة 799، بشرة دهنية/جافة/باهتة 599، كيت الساحل 1300) + مفردات (لوشن يوريا 25% بـ 360، كريم سيلوليت ريتينول/كافيين بـ 350، سكراب ملح سيوة بـ 390). مكونات معلنة: ملح سيوة، يوريا 25%، كافيين، ريتينول، زبدة شيا.` });
      }
      // 5) Researched competitors (public sources, dated) — only when table empty
      const comps = await db.select().from(schema.competitors);
      let competitorsAdded = 0;
      if (comps.length === 0) {
        const seedComps = [
          { name: "Hayah — Urepar", category: "جلد الوزة / يوريا (صيدلي)", positioning: "كريم يوريا 10% لجلد الوزة والجلد الخشن — توزيع صيدليات ومتاجر أونلاين", offer: "Urepar Cream 10% Urea", priceNote: "439 EGP (Cairo Drop)", sourceUrl: "https://cairodrop.com/products/urepar-cream-10-urea-body-lotion-by-hayah", websiteUrl: "https://cairodrop.com/products/urepar-cream-10-urea-body-lotion-by-hayah", notes: "منافس مباشر للوشن جلد الوزة — تركيزه 10% مقابل 25% عند ZYRA وبسعر أعلى." },
          { name: "Skinova Image", category: "جلد الوزة / يوريا (صيدلي)", positioning: "لوشن يوريا بلس 20% + لاكتيك أسيد وسيراميد لجلد الوزة والخشونة", offer: "Urea Lotion Plus 20%", priceNote: "199 EGP (Pharma Image)", sourceUrl: "https://pharmaimage.com.eg/products/skinova-image-urea-lotion-plus", websiteUrl: "https://pharmaimage.com.eg/products/skinova-image-urea-lotion-plus", notes: "أرخص منافس يوريا عالي التركيز — ضغط سعري على فئة جلد الوزة." },
          { name: "Melano Pharma — Uremel", category: "جلد الوزة / يوريا (صيدلي)", positioning: "كريم يوريا 20% + ساليسيليك 2% لجلد الوزة والكعب المتشقق", offer: "Uremel Cream 20%", priceNote: "350 EGP (Melano Store)", sourceUrl: "https://melanopharma.store/products/uremel-20", websiteUrl: "https://melanopharma.store/products/uremel-20", notes: "سعر قريب جداً من لوشن ZYRA (360) بتركيز 20% مقابل 25%." },
          { name: "Alejon", category: "جلد الوزة / يوريا (صيدلي)", positioning: "كريم يوريا 10% و20% للجلد الجاف الخشن وجلد الوزة — صيدليات الفؤاد وغيرها", offer: "Urea Cream 10% — 200ml", priceNote: "380 EGP (AlFouad Pharmacies)", sourceUrl: "https://alfouadpharmacies.com/en/products/alejon-urea-cream-200ml", websiteUrl: "https://alfouadpharmacies.com/en/products/alejon-urea-cream-200ml", notes: "حضور صيدلي قوي — قناة توزيع لا تملكها ZYRA (بيع مباشر فقط)." },
          { name: "Bobana", category: "سكراب وعناية جسم (جماهيري)", positioning: "براند مصري جماهيري: سكرابات جسم 300 جم ولوشنات بأسعار اقتصادية وتوزيع واسع (جوميا/صيدليات)", offer: "سكراب مشمش / عسل وكولاجين 300 جم", priceNote: "شريحة اقتصادية — راجع جوميا", sourceUrl: "https://www.jumia.com.eg/ar/personal-care-d/seller-c7569470-d8c8-49a3-a2eb-6d65cbef9903/", websiteUrl: "", notes: "منافس سكراب ملح سيوة من زاوية السعر والحجم والتوزيع، مش التركيبة." },
          { name: "Eva Cosmetics", category: "عناية بشرة وجسم (جماهيري)", positioning: "أقدم براند مصري جماهيري — Natural Glow Body Scrub وخطوط Skin Clinic، توزيع في كل مكان", offer: "Natural Glow Body Scrub", priceNote: "شريحة اقتصادية", sourceUrl: "https://www.jumia.com.eg/ar/personal-care-d/seller-c7569470-d8c8-49a3-a2eb-6d65cbef9903/", websiteUrl: "", notes: "قوة البراند والتوزيع — ZYRA تتميز عنه بالروتين المتكامل للمشكلة والبيع المباشر COD." },
        ];
        for (const c of seedComps) { await db.insert(schema.competitors).values(c); competitorsAdded++; }
        await db.insert(schema.observations).values({ title: "سوق اليوريا/جلد الوزة مزدحم: تركيزات 10–20% وأسعار 149–439 EGP", source: "صفحات منتجات المنافسين (روابطها في بروفايلات المنافسين)", observedDate: today, evidenceTag: "VERIFIED", notes: "لوشن ZYRA يوريا 25% هو الأعلى تركيزاً في المقارنة المرصودة وبسعر 360 EGP — زاوية تمييز موثقة بالأرقام، والمنافسة الأقوى صيدلية القناة (توزيع صيدليات) لا إعلانية فقط." });
        await db.insert(schema.competitorAlerts).values({ competitor: "سوق اليوريا الصيدلي (Hayah/Skinova/Melano/Alejon)", changeType: "منتج منافس", detail: "أربعة منافسين صيدليين يبيعون منتجات يوريا لجلد الوزة بتركيزات 10–20% وأسعار 199–439 EGP — راجع تنبيه التمييز: ZYRA عندها 25% بـ 360 EGP.", source: "بحث ويب موثق بروابط صفحات المنتجات", status: "New" });
      }
      // 6) Relaunch plan + work items (only once)
      const work = await db.select().from(schema.workItems);
      let workItemsAdded = 0;
      if (!work.some(w=>w.sourceType==="Relaunch")) {
        const items: [string, string, string, string][] = [
          ["تثبيت المدخلات الأساسية: COGS لكل منتج + نسب تأكيد واتساب والتسليم الفعلية", "Owner", "Critical", "مرحلة 1 — تحضير ما قبل الإطلاق"],
          ["جولة دراسة منافسين كاملة: Meta Ads Library + TikTok Creative Center لأهم المنافسين", "Analyst", "High", "مرحلة 1 — تحضير ما قبل الإطلاق"],
          ["قوائم فحص Cold Start للروتينات المعاد إطلاقها (سيلوليت + جلد الوزة أولاً)", "Creative", "High", "مرحلة 1 — تحضير ما قبل الإطلاق"],
          ["إنتاج أول دفعة كرييتيف Relaunch: 3 زوايا للروتين البطل + فحص Validator", "Creative", "High", "مرحلة 1 — تحضير ما قبل الإطلاق"],
          ["بناء حملتين منفصلتين للـ Dual Hero: CBO مستقل لروتين السيلوليت وCBO مستقل لروتين جلد الوزة (Hero Offer واحد لكل حملة — Domino)", "Media Buyer", "High", "مرحلة 2 — أسبوع الإطلاق"],
          ["تقسيم ميزانية الاختبار بين الهيروين وتتبع Kill/Scale مستقل لكل روتين على حدة", "Media Buyer", "High", "مرحلة 2 — أسبوع الإطلاق"],
          ["اختبار Cross-Bundle: عرض الروتينين معاً (799+799) كزاوية Offer/Value مستقلة بـ CIS Tag خاص", "Creative", "Medium", "مرحلة 3 — أول 30 يوم"],
          ["طلب اعتماد إطلاق الحملة وميزانيتها من المالك", "Owner", "Critical", "مرحلة 2 — أسبوع الإطلاق"],
          ["فحص AEO/Validator نهائي على كل أصول الإطلاق قبل أي نشر", "Creative", "High", "مرحلة 2 — أسبوع الإطلاق"],
          ["متابعة Funnel يومية + لقطة مالية أسبوعية من حاسبة COD", "Analyst", "Medium", "مرحلة 3 — أول 30 يوم"],
          ["أول قرار Task D (KILL/ITERATE/SCALE) بعد 7 أيام بيانات نظيفة", "Media Buyer", "High", "مرحلة 3 — أول 30 يوم"],
          ["مراجعة أسبوعية Task B: تحديث Proven Wrappers وDead Angle Graveyard", "Analyst", "Medium", "مرحلة 3 — أول 30 يوم"],
          ["تقييم أول 30 يوم: أهداف Relaunch مقابل الفعلي + Outcome Review", "Owner", "High", "مرحلة 4 — تقييم واستمرار/تصحيح"],
          ["خطة الربع التالي Task C: استمرار أو تصحيح بناءً على التعلم الموثق", "Owner", "Medium", "مرحلة 4 — تقييم واستمرار/تصحيح"],
        ];
        for (const [title, role, pri, phase] of items) { await db.insert(schema.workItems).values({ title, sourceType: "Relaunch", ownerRole: role, priority: pri, nextAction: "ابدأ بمرحلة UNDERSTAND وحدّث التقدم هنا", notes: phase + " — خطة Relaunch مولّدة من قراءة الويبسايت والسوق، بانتظار تواريخ واعتماد المالك" }); workItemsAdded++; }
      }
      const plans = await db.select().from(schema.agentPlans);
      let planCreated = false;
      if (!plans.some(p=>p.goal.includes("Relaunch"))) {
        const steps = [
          { step: "قراءة الويبسايت وتثبيت الكتالوج والسياسات في المدخلات الأساسية", stage: "RETRIEVE", section: "المدخلات الأساسية", detail: "23 منتج بأسعار حقيقية من zyra-care.com + شحن 75/مجاني من 1000 + استرجاع 14 يوم. COGS لسه على المالك." },
          { step: "دراسة السوق: منافسو اليوريا الصيدليون + الجماهيريون", stage: "RETRIEVE", section: "متابعة السوق", detail: "فجوة تمييز موثقة: يوريا 25% الأعلى تركيزاً بـ 360 EGP مقابل 10–20% عند المنافسين." },
          { step: "تجهيز كرييتيف الإطلاق للـ Dual Hero بقاعدة Rule of One + Cold Start checklist", stage: "EXECUTE", section: "الكرييتيف", detail: "هيرو مزدوج بقرار مالك: روتين السيلوليت 799 + روتين جلد الوزة/الفراولة 799 — كل إعلان مشكلة واحدة واحتياج عاطفي واحد واعتراض واحد ودليل واحد، مع تحذير الريتينول وفحص AEO." },
          { step: "حملتان منفصلتان + اعتماد الإطلاق", stage: "PLAN", section: "الميديا باير", detail: "CBO مستقل لكل Hero Offer (قاعدة Domino)، ميزانية اختبار منقسمة بين الهيروين، وتتبع Kill/Scale مستقل لكل روتين — الإطلاق نفسه قرار مالك في الاعتمادات، مع فرصة Cross-Bundle (799+799) كاختبار لاحق." },
          { step: "متابعة أول 30 يوم: Funnel يومي ولقطات COD أسبوعية", stage: "VALIDATE", section: "متابعة الشغل", detail: "أول Task D بعد 7 أيام نظيفة خارج تشويش الـ Payday قدر الإمكان." },
          { step: "تقييم وتعلم: Proven/Dead + خطة تصحيح", stage: "DELIVER & LEARN", section: "التجارب والتعلم", detail: "Outcome Review على كل عنصر Relaunch وتسجيل التعلم قبل أي Scale." },
        ];
        await db.insert(schema.agentPlans).values({ goal: "خطة Relaunch: إعادة إطلاق Zyra Care من قراءة الويبسايت والسوق لحد أول قرار Kill/Scale", taskType: "C", planJson: JSON.stringify(steps), status: "Proposed" });
        planCreated = true;
      }
      // 6b) Hero unit-economics snapshot [EST] — computed by cod_cohort_calc.py with script-default ops assumptions
      const snaps = await db.select().from(schema.financialSnapshots);
      if (!snaps.some(s=>s.label.includes("Dual Hero"))) {
        await db.insert(schema.financialSnapshots).values({ label: "Dual Hero — اقتصاديات وحدة محسوبة [EST]", period: "Relaunch — قبل الإطلاق", product: "روتين السيلوليت + روتين جلد الوزة (799 EGP لكل منهما)", placed: 0, delivered: 0, contributionPlaced: 0, contributionDelivered: 381, rtoRate: 0, shipCost: 70, notes: "محسوب بـ cod_cohort_calc.py: إيراد محصّل 874 ‏(799 + شحن 75) · COGS ‏350 من المالك · افتراضات تشغيلية افتراضية من السكربت: تعبئة 20 / شحن 70 / رسوم مرتجع 50 / COD ‏2% · تسليم صافٍ افتراضي 72%. النتائج: Break-even Placed CPP ‏≈275 EGP · مساهمة قبل الإعلانات ‏≈381 EGP لكل مُسلّم · بوابة Scale ‏(GPT ≥15% AOV) تصمد حتى Placed CPP ‏≈180 · هدف تشغيلي مقترح ≤150–160. ⚠️ رسوم Bosta الفعلية ونسب التأكيد/التسليم الحقيقية غير مؤكدة — الأرقام [EST] لحين تأكيدها." });
      }
      // 7) Sync log + activity
      const summary = `${liveFetch ? "قراءة حية" : "قراءة من لقطة موثقة (تعذر الجلب الحي)"} من zyra-care.com: ${catalog.length} منتج في الكتالوج، أُضيف ${productsAdded} منتج جديد، ${competitorsAdded} منافس، ${workItemsAdded} عنصر Relaunch.`;
      await db.insert(schema.syncRuns).values({ source: "zyra-care.com (Shopify public catalog)", status: liveFetch ? "Live read OK" : "Snapshot fallback", summary });
      await db.insert(schema.activityEvents).values({ section: "Integrations", eventType: "مزامنة ويبسايت", detail: summary.slice(0, 500) });
      ctx.invalidateQueries();
      return { ok: true as const, liveFetch, productsAdded, productsTotal: catalog.length, profileCreated, competitorsAdded, roundsAdded, workItemsAdded, planCreated, summary };
    },
  }),
  // ---- Ops & Learning System (owner-reported operating model, executed inside this system) ----
  getOpsState: defineAction({
    description: "Returns the operating-model state: loop settings, loop runs, owner instructions, learning observations with lifecycle stage, voice intakes, search keywords, product opportunities, and module statuses.",
    request: z.object({}),
    response: z.object({
      weeklyReviewEnabled: z.boolean(), suggestionTtlDays: z.number(),
      instructions: z.array(z.object({ id: z.number(), title: z.string(), instruction: z.string(), scope: z.string(), active: z.boolean(), createdAt: z.string() })),
      observations: z.array(z.object({ id: z.number(), title: z.string(), source: z.string(), detail: z.string(), occurrences: z.number(), firstSeenDate: z.string(), lastSeenDate: z.string(), status: z.string(), daysTracked: z.number(), lifecycle: z.string(), createdAt: z.string() })),
      intakes: z.array(z.object({ id: z.number(), sourceType: z.string(), rawText: z.string(), summary: z.string(), themes: z.array(z.object({ theme: z.string(), mentions: z.number(), note: z.string() })), productRequests: z.array(z.string()), searchPhrases: z.array(z.string()), createdAt: z.string() })),
      keywords: z.array(z.object({ id: z.number(), keyword: z.string(), suggestions: z.string(), lastScanAt: z.string(), notes: z.string(), createdAt: z.string() })),
      opportunities: z.array(z.object({ id: z.number(), title: z.string(), sourceType: z.string(), evidence: z.string(), status: z.string(), notes: z.string(), createdAt: z.string() })),
      loopRuns: z.array(z.object({ id: z.number(), runType: z.string(), summary: z.string(), actionsTaken: z.string(), createdAt: z.string() })),
      nextCompetitor: z.string(),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const settingsRows = await db.select().from(schema.opsSettings).orderBy(desc(schema.opsSettings.id)).limit(1);
      const s = settingsRows[0];
      const instr = await db.select().from(schema.ownerInstructions).orderBy(desc(schema.ownerInstructions.id)).limit(100);
      const obs = await db.select().from(schema.learningObservations).orderBy(desc(schema.learningObservations.id)).limit(100);
      const intakes = await db.select().from(schema.voiceIntakes).orderBy(desc(schema.voiceIntakes.id)).limit(50);
      const kws = await db.select().from(schema.searchKeywords).orderBy(desc(schema.searchKeywords.id)).limit(100);
      const opps = await db.select().from(schema.productOpportunities).orderBy(desc(schema.productOpportunities.id)).limit(100);
      const runs = await db.select().from(schema.loopRuns).orderBy(desc(schema.loopRuns.id)).limit(30);
      const comps = await db.select().from(schema.competitors).orderBy(schema.competitors.id);
      const rounds = await db.select().from(schema.marketRounds);
      const nextCompName = nextCompetitorName(comps, rounds, new Date());
      const today = new Date();
      const parseAnalysis = (j: string) => { try { const p = JSON.parse(j) as { themes?: {theme:string,mentions:number,note:string}[], productRequests?: string[], searchPhrases?: string[] }; return { themes: p.themes ?? [], productRequests: p.productRequests ?? [], searchPhrases: p.searchPhrases ?? [] }; } catch { return { themes: [], productRequests: [], searchPhrases: [] }; } };
      return {
        weeklyReviewEnabled: (s?.weeklyReviewEnabled ?? 0) === 1,
        suggestionTtlDays: s?.suggestionTtlDays ?? 14,
        instructions: instr.map(r=>({ id:r.id, title:r.title, instruction:r.instruction, scope:r.scope, active:r.active===1, createdAt:r.createdAt.toISOString() })),
        observations: obs.map(r=>{
          const first = r.firstSeenDate ? new Date(r.firstSeenDate + "T00:00:00") : r.createdAt;
          const days = Math.max(0, Math.floor((today.getTime() - first.getTime()) / 86400000));
          const lifecycle = r.status === "مرفوضة" ? "مرفوضة" : days >= 7 ? "ثابتة" : days >= 3 ? "مرشّحة" : "ملاحظة";
          return { id:r.id, title:r.title, source:r.source, detail:r.detail, occurrences:r.occurrences, firstSeenDate:r.firstSeenDate, lastSeenDate:r.lastSeenDate, status:r.status, daysTracked: days, lifecycle, createdAt:r.createdAt.toISOString() };
        }),
        intakes: intakes.map(r=>({ id:r.id, sourceType:r.sourceType, rawText:r.rawText, summary:r.summary, ...parseAnalysis(r.analysisJson), createdAt:r.createdAt.toISOString() })),
        keywords: kws.map(r=>({ id:r.id, keyword:r.keyword, suggestions:r.suggestions, lastScanAt:r.lastScanAt, notes:r.notes, createdAt:r.createdAt.toISOString() })),
        opportunities: opps.map(r=>({ id:r.id, title:r.title, sourceType:r.sourceType, evidence:r.evidence, status:r.status, notes:r.notes, createdAt:r.createdAt.toISOString() })),
        loopRuns: runs.map(r=>({ id:r.id, runType:r.runType, summary:r.summary, actionsTaken:r.actionsTaken, createdAt:r.createdAt.toISOString() })),
        nextCompetitor: nextCompName,
      };
    },
  }),
  setOpsSettings: defineAction({
    description: "Updates loop settings: weekly model review lock and stale-suggestion TTL.",
    request: z.object({ weeklyReviewEnabled: z.boolean().optional(), suggestionTtlDays: z.number().int().min(1).max(90).optional() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.opsSettings).orderBy(desc(schema.opsSettings.id)).limit(1);
      const cur = rows[0];
      const weekly = args.weeklyReviewEnabled !== undefined ? (args.weeklyReviewEnabled ? 1 : 0) : (cur?.weeklyReviewEnabled ?? 0);
      const ttl = args.suggestionTtlDays ?? cur?.suggestionTtlDays ?? 14;
      if (cur) await db.update(schema.opsSettings).set({ weeklyReviewEnabled: weekly, suggestionTtlDays: ttl, updatedAt: new Date() }).where(eq(schema.opsSettings.id, cur.id));
      else await db.insert(schema.opsSettings).values({ weeklyReviewEnabled: weekly, suggestionTtlDays: ttl });
      await db.insert(schema.activityEvents).values({ section: "Ops & Learning", eventType: "تحديث إعدادات اللوب", detail: `المراجعة الأسبوعية بالموديل: ${weekly===1 ? "مفعّلة من المالك" : "مقفولة"} · صلاحية الاقتراحات: ${ttl} يوم` });
      ctx.invalidateQueries();
      return { ok: true as const };
    },
  }),
  createInstruction: defineAction({
    description: "Creates an owner instruction — owner instructions override any automated inference.",
    request: z.object({ title: z.string().trim().min(1).max(200), instruction: z.string().max(3000).default(""), scope: z.string().max(100).default("عام") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.ownerInstructions).values(args).returning({ id: schema.ownerInstructions.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateInstruction: defineAction({
    description: "Updates an owner instruction text or active flag.",
    request: z.object({ id: z.number().int().positive(), instruction: z.string().max(3000).optional(), active: z.boolean().optional(), scope: z.string().max(100).optional() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const patch: Record<string, unknown> = { updatedAt: new Date() }; if (args.instruction !== undefined) patch.instruction = args.instruction; if (args.active !== undefined) patch.active = args.active ? 1 : 0; if (args.scope !== undefined) patch.scope = args.scope; await db.update(schema.ownerInstructions).set(patch).where(eq(schema.ownerInstructions.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteInstruction: defineAction({
    description: "Deletes an owner instruction.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.ownerInstructions).where(eq(schema.ownerInstructions.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  createObservation2: defineAction({
    description: "Creates a learning observation that matures: candidate after 3 days, confirmed after 7 days of tracking.",
    request: z.object({ title: z.string().trim().min(1).max(300), source: z.string().max(100).default("صوت العميل"), detail: z.string().max(3000).default(""), occurrences: z.number().int().min(1).max(10000).default(1), firstSeenDate: z.string().max(20).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const today = new Date().toISOString().slice(0,10); const res = await db.insert(schema.learningObservations).values({ title: args.title, source: args.source, detail: args.detail, occurrences: args.occurrences, firstSeenDate: args.firstSeenDate || today, lastSeenDate: today }).returning({ id: schema.learningObservations.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  bumpObservation: defineAction({
    description: "Records another occurrence of a learning observation (recurrence tracking).",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.learningObservations).where(eq(schema.learningObservations.id, args.id)); const r = rows[0]; if (r) await db.update(schema.learningObservations).set({ occurrences: r.occurrences + 1, lastSeenDate: new Date().toISOString().slice(0,10) }).where(eq(schema.learningObservations.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteObservation2: defineAction({
    description: "Deletes a learning observation.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.learningObservations).where(eq(schema.learningObservations.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  analyzePastedText: defineAction({
    description: "Analyzes owner-pasted aggregated text (WhatsApp/tickets aggregate, Facebook group text the owner belongs to, or a competitor ad transcript) — extracts themes, product requests, and search phrases in aggregate. Raw pasted text is never stored; only the aggregate analysis is kept.",
    request: z.object({ sourceType: z.enum(["واتساب مجمّع","تذاكر دعم مجمّعة","نص جروب فيسبوك (لصق المالك)","نص/تفريغ إعلان منافس (لصق المالك)","أخرى"]), text: z.string().trim().min(20).max(12000) }),
    response: z.object({ id: z.number(), summary: z.string(), themes: z.array(z.object({ theme: z.string(), mentions: z.number(), note: z.string() })), productRequests: z.array(z.string()), searchPhrases: z.array(z.string()) }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const analysisSchema = z.object({
        summary: z.string(),
        themes: z.array(z.object({ theme: z.string(), mentions: z.number(), note: z.string() })),
        productRequests: z.array(z.string()),
        searchPhrases: z.array(z.string()),
      });
      const out = await ctx.inference.complete(
        `حلّل النص المجمّع التالي (من ${args.sourceType}) تحليلاً تجميعياً فقط: استخرج المواضيع المتكررة مع عدد مرات ظهورها التقريبي وملاحظة قصيرة لكل موضوع، وطلبات منتجات غير موجودة حالياً عند البراند إن وُجدت، وعبارات بحث/لغة العملاء الحرفية المهمة. تجاهل أي أسماء أو أرقام هواتف أو بيانات شخصية تماماً ولا تكررها. النص:\n\n${args.text}`,
        { schema: analysisSchema, system: "أنت محلل صوت عميل وسوق لبراند عناية مصري. التحليل تجميعي ومجهول الهوية دائماً. لا تخترع مواضيع غير موجودة في النص." }
      );
      const res = await db.insert(schema.voiceIntakes).values({ sourceType: args.sourceType, rawText: "", summary: out.summary, analysisJson: JSON.stringify({ themes: out.themes, productRequests: out.productRequests, searchPhrases: out.searchPhrases }) }).returning({ id: schema.voiceIntakes.id });
      for (const pr of out.productRequests.slice(0, 10)) {
        const existing = await db.select().from(schema.productOpportunities);
        if (!existing.some(o=>o.title === pr)) await db.insert(schema.productOpportunities).values({ title: pr, sourceType: "طلبات عملاء", evidence: `استُخرج من تحليل ${args.sourceType} بتاريخ ${new Date().toISOString().slice(0,10)}`, status: "قيد الدراسة" });
      }
      for (const t of out.themes.slice(0, 10)) {
        const existing = await db.select().from(schema.learningObservations);
        if (!existing.some(o=>o.title === t.theme)) await db.insert(schema.learningObservations).values({ title: t.theme, source: args.sourceType.includes("منافس") ? "إعلانات منافسين" : "صوت العميل", detail: t.note, occurrences: Math.max(1, t.mentions), firstSeenDate: new Date().toISOString().slice(0,10), lastSeenDate: new Date().toISOString().slice(0,10) });
      }
      await db.insert(schema.activityEvents).values({ section: "Ops & Learning", eventType: "تحليل نص ملصوق", detail: `${args.sourceType}: ${out.themes.length} موضوع · ${out.productRequests.length} طلب منتج · ${out.searchPhrases.length} عبارة بحث` });
      ctx.invalidateQueries();
      return { id: res[0]!.id, summary: out.summary, themes: out.themes, productRequests: out.productRequests, searchPhrases: out.searchPhrases };
    },
  }),
  deleteIntake: defineAction({
    description: "Deletes a stored aggregate text analysis.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.voiceIntakes).where(eq(schema.voiceIntakes.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  createKeyword: defineAction({
    description: "Adds a Google Egypt search-language keyword to track (suggestions scan cadence: every 20 minutes in the operating model; scans are recorded from owner-pasted/observed suggestions).",
    request: z.object({ keyword: z.string().trim().min(1).max(200), notes: z.string().max(1000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.searchKeywords).values(args).returning({ id: schema.searchKeywords.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  recordKeywordScan: defineAction({
    description: "Records a Google Egypt suggestions scan result for a tracked keyword.",
    request: z.object({ id: z.number().int().positive(), suggestions: z.string().max(3000) }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.update(schema.searchKeywords).set({ suggestions: args.suggestions, lastScanAt: new Date().toISOString() }).where(eq(schema.searchKeywords.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteKeyword: defineAction({
    description: "Deletes a tracked search keyword.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.searchKeywords).where(eq(schema.searchKeywords.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  createOpportunity: defineAction({
    description: "Creates a new-product opportunity (sources: customer requests, competitor new products, order bundles, upcoming season).",
    request: z.object({ title: z.string().trim().min(1).max(300), sourceType: z.enum(["طلبات عملاء","منتجات جديدة عند المنافسين","باقات من الأوردرات","موسم قريب"]), evidence: z.string().max(2000).default(""), notes: z.string().max(2000).default("") }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.productOpportunities).values(args).returning({ id: schema.productOpportunities.id }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateOpportunity: defineAction({
    description: "Updates a product opportunity status.",
    request: z.object({ id: z.number().int().positive(), status: z.enum(["قيد الدراسة","مرشّحة","معتمدة للتطوير","مرفوضة"]) }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.update(schema.productOpportunities).set({ status: args.status }).where(eq(schema.productOpportunities.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteOpportunity: defineAction({
    description: "Deletes a product opportunity.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.productOpportunities).where(eq(schema.productOpportunities.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  runLoopTick: defineAction({
    description: "Executes one operating-loop tick inside this system (max 3 due actions): competitor rotation scan-due note, audience-brief/content staleness check, stale proposed-plan expiry, and learning lifecycle promotion. Also supports advisor review (hourly), daily learning summary, and the weekly model review (locked unless the owner enables it).",
    request: z.object({ runType: z.enum(["Tick","Advisor Review","Daily Summary","Weekly Review"]).default("Tick") }),
    response: z.object({ ok: z.literal(true), summary: z.string(), actions: z.array(z.string()), blocked: z.string() }),
    async handler(ctx, args): Promise<{ok:true, summary:string, actions:string[], blocked:string}> {
      const db = ctx.db<typeof schema>();
      const settingsRows = await db.select().from(schema.opsSettings).orderBy(desc(schema.opsSettings.id)).limit(1);
      const ttl = settingsRows[0]?.suggestionTtlDays ?? 14;
      const weeklyEnabled = (settingsRows[0]?.weeklyReviewEnabled ?? 0) === 1;
      if (args.runType === "Weekly Review" && !weeklyEnabled) {
        const blocked = "المراجعة الأسبوعية بالموديل مقفولة بقرار المالك — لن تُنفذ حتى يفعّلها المالك من إعدادات اللوب. عند تفعيلها بتمر على السقوف والأسعار.";
        await db.insert(schema.loopRuns).values({ runType: "Weekly Review", summary: blocked, actionsTaken: "" });
        ctx.invalidateQueries();
        return { ok: true as const, summary: blocked, actions: [], blocked };
      }
      const now = new Date();
      const actions: string[] = [];
      if (args.runType === "Tick") {
        // 1) Competitor rotation: one competitor per round, each once/day —
        // pointer comes from the shared nextCompetitorName() helper (same
        // source of truth as getOpsState), so once today's market round for
        // the due competitor is recorded, later ticks advance past it.
        const comps = await db.select().from(schema.competitors).orderBy(schema.competitors.id);
        const rounds = await db.select().from(schema.marketRounds);
        const nextCompName = nextCompetitorName(comps, rounds, now);
        if (nextCompName && actions.length < 3) actions.push(`مسح المنافس الدوري التالي: «${nextCompName}» — دوره النهارده (منافس واحد في الجولة، كل منافس مرة يومياً). نفّذ المسح من متابعة السوق وسجّله كجولة.`);
        // 2) Stale proposed plans expiry
        const plans = await db.select().from(schema.agentPlans);
        const stale = plans.filter(p=>p.status === "Proposed" && (now.getTime() - p.createdAt.getTime()) / 86400000 > ttl);
        for (const p of stale.slice(0, Math.max(0, 3 - actions.length))) { await db.update(schema.agentPlans).set({ status: "Rejected" }).where(eq(schema.agentPlans.id, p.id)); actions.push(`انتهت صلاحية اقتراح قديم (>${ttl} يوم): خطة «${p.goal}» اتقفلت كمنتهية — أعد توليدها لو لسه لازمة.`); }
        // 3) Audience briefs / content staleness (briefs refresh every 6h in the model)
        const content = await db.select().from(schema.contentItems);
        if (actions.length < 3) actions.push(content.length ? `بريفات الجمهور وتقويم المحتوى: ${content.length} عنصر مسودة — التحديث الدوري (كل 6 ساعات) بيراجع المسودات بس؛ النشر ممنوع (Draft-only).` : "بريفات الجمهور: لا مسودات محتوى بعد — التحديث الدوري (كل 6 ساعات) هيلاقيها فاضية لحد ما تتكتب مسودات.");
      } else if (args.runType === "Advisor Review") {
        const appr = await db.select().from(schema.approvals);
        const work = await db.select().from(schema.workItems);
        const todayStr = now.toISOString().slice(0,10);
        const overdue = work.filter(w=>w.dueDate && w.dueDate < todayStr && !["Completed","Failed"].includes(w.status));
        actions.push(`مراجعة المستشار (كل ساعة): اعتمادات معلّقة ${appr.filter(a=>a.status==="Pending").length} · عناصر شغل متأخرة ${overdue.length} · أي توصية هنا اقتراح فقط — القرار للمالك.`);
      } else if (args.runType === "Daily Summary") {
        const obs = await db.select().from(schema.learningObservations);
        const cand = obs.filter(o=>{ const d = (now.getTime() - new Date((o.firstSeenDate || o.createdAt.toISOString().slice(0,10)) + "T00:00:00").getTime()) / 86400000; return d >= 3 && d < 7; }).length;
        const conf = obs.filter(o=>{ const d = (now.getTime() - new Date((o.firstSeenDate || o.createdAt.toISOString().slice(0,10)) + "T00:00:00").getTime()) / 86400000; return d >= 7; }).length;
        actions.push(`ملخص التعلّم اليومي: ${obs.length} ملاحظة متعقبة · ${cand} مرشّحة (3–7 أيام) · ${conf} ثابتة (7+ أيام) · تعليمات المالك النشطة تتغلب على أي استنتاج.`);
      } else if (args.runType === "Weekly Review") {
        const prods = await db.select().from(schema.products);
        actions.push(`المراجعة الأسبوعية بالموديل (مفعّلة من المالك): مراجعة سقوف وأسعار ${prods.length} منتج — أي تعديل سعر/سقف يروح Approvals ولا يُنفذ تلقائياً.`);
      }
      const summary = actions.length ? actions.join(" ") : "التيك اتنفذ: لا إجراءات مستحقة في الجولة دي.";
      await db.insert(schema.loopRuns).values({ runType: args.runType, summary, actionsTaken: actions.join("\n") });
      await db.insert(schema.activityEvents).values({ section: "Ops & Learning", eventType: `لوب: ${args.runType}`, detail: summary.slice(0, 500) });
      ctx.invalidateQueries();
      return { ok: true as const, summary, actions, blocked: "" };
    },
  }),
  listOrganicPosts: defineAction({
    description: "Lists organic social posts (designs) with their caption variants, newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ posts: z.array(z.object({
      id: z.number(), name: z.string(), driveUrl: z.string(), channel: z.string(), topic: z.string(), format: z.string(), slideCount: z.number(), designText: z.string(), pillar: z.string(), status: z.string(), scheduledDate: z.string(), complianceFlag: z.string(), finalCaption: z.string(), notes: z.string(), createdAt: z.string(), updatedAt: z.string(),
      captions: z.array(z.object({ id: z.number(), postId: z.number(), slot: z.number(), style: z.string(), text: z.string(), status: z.string(), updatedAt: z.string() })),
    }))}),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.organicPosts).orderBy(desc(schema.organicPosts.id)).limit(args.limit);
      const caps = await db.select().from(schema.organicCaptions).orderBy(schema.organicCaptions.slot);
      return { posts: rows.map(r=>({ id:r.id, name:r.name, driveUrl:r.driveUrl, channel:r.channel, topic:r.topic, format:r.format, slideCount:r.slideCount, designText:r.designText, pillar:r.pillar, status:r.status, scheduledDate:r.scheduledDate, complianceFlag:r.complianceFlag, finalCaption:r.finalCaption, notes:r.notes, createdAt:r.createdAt.toISOString(), updatedAt:r.updatedAt.toISOString(), captions: caps.filter(c=>c.postId===r.id).map(c=>({ id:c.id, postId:c.postId, slot:c.slot, style:c.style, text:c.text, status:c.status, updatedAt:c.updatedAt.toISOString() })) })) };
    },
  }),

  createOrganicPost: defineAction({
    description: "Creates an organic post/design record in the Organic library.",
    request: z.object({
      name: z.string().trim().min(1).max(200),
      driveUrl: z.string().max(500).default(""),
      channel: z.string().max(50).default("انستجرام"),
      topic: z.string().max(300).default(""),
      format: z.string().max(50).default("Static"),
      slideCount: z.number().int().min(1).max(30).default(1),
      designText: z.string().max(2000).default(""),
      pillar: z.string().max(200).default(""),
      status: z.string().max(50).default("فكرة"),
      scheduledDate: z.string().max(50).default(""),
      complianceFlag: z.string().max(300).default(""),
      notes: z.string().max(2000).default(""),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.organicPosts).values(args).returning({ id: schema.organicPosts.id });
      await db.insert(schema.activityEvents).values({ section: "Organic", eventType: "تصميم عضوي جديد", detail: `«${args.name}» — ${args.channel} · ${args.topic || "بدون موضوع"}`.slice(0, 500) });
      ctx.invalidateQueries();
      return { id: res[0]!.id };
    },
  }),

  updateOrganicPost: defineAction({
    description: "Updates an organic post: status, schedule, compliance flag, or the approved final caption.",
    request: z.object({
      id: z.number().int().positive(),
      name: z.string().trim().min(1).max(200).optional(),
      driveUrl: z.string().max(500).optional(),
      channel: z.string().max(50).optional(),
      topic: z.string().max(300).optional(),
      format: z.string().max(50).optional(),
      slideCount: z.number().int().min(1).max(30).optional(),
      designText: z.string().max(2000).optional(),
      pillar: z.string().max(200).optional(),
      status: z.string().max(50).optional(),
      scheduledDate: z.string().max(50).optional(),
      complianceFlag: z.string().max(300).optional(),
      finalCaption: z.string().max(4000).optional(),
      notes: z.string().max(2000).optional(),
    }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> {
      const db = ctx.db<typeof schema>();
      const { id, ...rest } = args;
      const patch: Record<string, unknown> = { updatedAt: new Date() };
      for (const [k, v] of Object.entries(rest)) if (v !== undefined) patch[k] = v;
      await db.update(schema.organicPosts).set(patch).where(eq(schema.organicPosts.id, id));
      ctx.invalidateQueries();
      return { ok: true as const };
    },
  }),

  deleteOrganicPost: defineAction({
    description: "Deletes an organic post and its caption variants.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.organicCaptions).where(eq(schema.organicCaptions.postId, args.id));
      await db.delete(schema.organicPosts).where(eq(schema.organicPosts.id, args.id));
      ctx.invalidateQueries();
      return { ok: true as const };
    },
  }),

  saveOrganicCaption: defineAction({
    description: "Creates or updates one caption variant (slot 1-3) of an organic post, including its status (مسودة/مرشّحة/معتمدة).",
    request: z.object({
      id: z.number().int().positive().optional(),
      postId: z.number().int().positive(),
      slot: z.number().int().min(1).max(3),
      style: z.string().max(100).default(""),
      text: z.string().max(4000).default(""),
      status: z.string().max(50).default("مسودة"),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      if (args.id) {
        await db.update(schema.organicCaptions).set({ style: args.style, text: args.text, status: args.status, updatedAt: new Date() }).where(eq(schema.organicCaptions.id, args.id));
        ctx.invalidateQueries();
        return { id: args.id };
      }
      const existing = await db.select().from(schema.organicCaptions).where(eq(schema.organicCaptions.postId, args.postId));
      const same = existing.find(c=>c.slot===args.slot);
      if (same) {
        await db.update(schema.organicCaptions).set({ style: args.style, text: args.text, status: args.status, updatedAt: new Date() }).where(eq(schema.organicCaptions.id, same.id));
        ctx.invalidateQueries();
        return { id: same.id };
      }
      const res = await db.insert(schema.organicCaptions).values({ postId: args.postId, slot: args.slot, style: args.style, text: args.text, status: args.status }).returning({ id: schema.organicCaptions.id });
      ctx.invalidateQueries();
      return { id: res[0]!.id };
    },
  }),

  deleteOrganicCaption: defineAction({
    description: "Deletes one caption variant of an organic post.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.organicCaptions).where(eq(schema.organicCaptions.id, args.id));
      ctx.invalidateQueries();
      return { ok: true as const };
    },
  }),

  // ---- Zyra Thinking & Decisions (تفكير زيرا وقراراتنا) ----
  listThinking: defineAction({
    description: "Lists Zyra's recorded thinking entries (idea, evidence basis, reasoning, conclusion, proposed decision, owner decision state) newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ entries: z.array(z.object({ id: z.number(), title: z.string(), basis: z.string(), reasoning: z.string(), conclusion: z.string(), decision: z.string(), confidence: z.number(), status: z.string(), ownerComment: z.string(), workItemId: z.number(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.thinkingEntries).orderBy(desc(schema.thinkingEntries.id)).limit(args.limit); return { entries: rows.map(r=>({ id:r.id, title:r.title, basis:r.basis, reasoning:r.reasoning, conclusion:r.conclusion, decision:r.decision, confidence:r.confidence, status:r.status, ownerComment:r.ownerComment, workItemId:r.workItemId, createdAt:r.createdAt.toISOString() })) }; },
  }),
  generateThinking: defineAction({
    description: "Makes Zyra think out loud from ONLY the data currently recorded in the system (core profile, products, latest financial snapshot, relaunch goals/work, competitors, alerts, pending approvals, latest creative & competitor-ad analyses) and records each thought as a dated entry with its evidence basis, conclusion and a proposed decision awaiting the owner.",
    request: z.object({}),
    response: z.object({ created: z.number() }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const profiles = await db.select().from(schema.coreProfiles).orderBy(desc(schema.coreProfiles.id)).limit(1);
      const profile = profiles[0] ?? null;
      const products = await db.select().from(schema.products);
      const snaps = await db.select().from(schema.financialSnapshots).orderBy(desc(schema.financialSnapshots.id)).limit(1);
      const goals = await db.select().from(schema.relaunchGoals);
      const work = await db.select().from(schema.workItems);
      const comps = await db.select().from(schema.competitors);
      const alerts = await db.select().from(schema.competitorAlerts).orderBy(desc(schema.competitorAlerts.id)).limit(8);
      const appr = await db.select().from(schema.approvals);
      const creaAn = await db.select().from(schema.creativeAnalyses).orderBy(desc(schema.creativeAnalyses.id)).limit(5);
      const compAn = await db.select().from(schema.competitorAdAnalyses).orderBy(desc(schema.competitorAdAnalyses.id)).limit(5);
      const organic = await db.select().from(schema.organicPosts);
      const today = new Date().toISOString().slice(0,10);
      const overdue = work.filter(w=>w.dueDate && w.dueDate < today && !["Completed","Failed"].includes(w.status));
      const filled = profile ? [profile.heroOffer, profile.shippingPolicy, profile.icp7ws, profile.approvedClaims, profile.adPerf30d, profile.customerVoice, profile.creativeInventory].filter(v=>v && v.trim()).length : 0;
      const digest = [
        `التاريخ: ${today}`,
        profile ? `الملف الأساسي: عرض الهيرو «${profile.heroOffer || "غير مُدخل"}» · WhatsApp%=${profile.whatsappConfirmPct} · Delivery%=${profile.deliveryPct} · Target CPP=${profile.targetCpp} · حقول أساسية ممتلئة ${filled}/7 · رايات عدم يقين: ${profile.uncertaintyFlags || "لا شيء مسجل"}` : "الملف الأساسي: غير موجود بعد",
        `المنتجات المسجلة: ${products.length} — الهيروات: ${products.filter(p=>p.cogs>0).map(p=>`${p.name} (سعر ${p.price}، COGS ${p.cogs})`).join("؛ ") || "لا COGS مسجل"}`,
        snaps[0] ? `آخر لقطة مالية (${snaps[0].label}، ${snaps[0].createdAt.toISOString().slice(0,10)}): موضوع ${snaps[0].placed} · مُسلّم ${snaps[0].delivered} · مساهمة/مُسلّم ${snaps[0].contributionDelivered} · Break-even ROAS ${snaps[0].breakevenRoas} · RTO ${snaps[0].rtoRate}%` : "لا لقطات مالية مسجلة بعد",
        `أهداف الريلونش: ${goals.length ? goals.map(g=>`${g.metric}: مستهدف ${g.target} ${g.unit}، محقق ${g.current}`).join("؛ ") : "لا أهداف مسجلة"}`,
        `الشغل: ${work.length} عنصر (${overdue.length} متأخر) · اعتمادات معلّقة: ${appr.filter(a=>a.status==="Pending").length}`,
        `المنافسون المسجلون: ${comps.length} (${comps.slice(0,8).map(c=>c.name).join("، ")}) · تنبيهات سوق أخيرة: ${alerts.map(a=>`${a.competitor}: ${a.changeType}`).join("؛ ") || "لا تنبيهات"}`,
        `تحليلات كرييتف أخيرة: ${creaAn.map(a=>`كرييتف #${a.creativeId} → ${a.classification}`).join("؛ ") || "لا تحليلات بعد"}`,
        `تحليلات إعلانات منافسين أخيرة: ${compAn.map(a=>`${a.competitor || "منافس"}: ${a.lessons.slice(0,120)}`).join("؛ ") || "لا تحليلات بعد"}`,
        `الأورجانيك: ${organic.length} بوست مسجل (${organic.filter(p=>p.status==="معتمد").length} معتمد)`,
      ].join("\n");
      const out = await ctx.inference.complete(
        `إنتِ «زيرا» — عقل قسم الذكاء التسويقي لبراند Zyra Care (مصر، COD، عامية مصرية في الكتابة). فكّري بصوت عالي بناءً على المعطيات المسجلة فعلياً التالية فقط — ممنوع أي رقم أو حقيقة من بره المعطيات دي، والناقص يتقال إنه ناقص ويتحول لخطوة تجميع بيانات لو لزم.\n\n${digest}\n\nاكتبي من 2 لـ 4 مدخلات تفكير: كل واحدة فكرة واحدة مركزة (Rule of One) فيها: عنوان الفكرة، المعطيات اللي اتبنت عليها (اذكري المصدر والتاريخ من المعطيات)، سلسلة التفكير (لأن ← إذن)، الاستنتاج، وقرار مقترح واحد محدد قابل للتنفيذ والقياس، ونسبة ثقة صادقة (انخفاضها واجب لما البيانات ناقصة أو تقديرية [EST]). الأولوية: اقتصاديات COD أولاً، ثم بوابات الامتثال AEO، ثم هوية البراند. أي قرار Kill/Scale مقترح لازم يمر على Payday والبيانات الفعلية — ولو البيانات مش كافية، القرار المقترح يكون «جمع بيانات» مش قرار تنفيذي.`,
        { schema: z.object({ entries: z.array(z.object({ title: z.string(), basis: z.string(), reasoning: z.string(), conclusion: z.string(), decision: z.string(), confidence: z.number().int().min(0).max(100) })).min(1).max(4) }), system: "أنت عقل تحليلي صارم وصادق: لا هلوسة، لا أرقام مخترعة، كل استنتاج مربوط بمعطى مسجل ومؤرخ. القرارات مقترحات فقط — المالك يقرر." }
      );
      let created = 0;
      for (const e of out.entries) {
        await db.insert(schema.thinkingEntries).values({ title: e.title, basis: e.basis, reasoning: e.reasoning, conclusion: e.conclusion, decision: e.decision, confidence: e.confidence, status: "بانتظار قرارك" });
        created++;
      }
      await db.insert(schema.activityEvents).values({ section: "Thinking", eventType: "تفكير جديد", detail: `اتولدت ${created} مدخلات تفكير من بيانات النظام الحالية (${today})` });
      ctx.invalidateQueries();
      return { created };
    },
  }),
  decideThinking: defineAction({
    description: "Owner decision on a thinking entry: approving converts the proposed decision into a tracked work item; rejecting closes it. The AI never executes anything itself.",
    request: z.object({ id: z.number().int().positive(), decision: z.enum(["معتمد","مرفوض"]), ownerComment: z.string().max(2000).default("") }),
    response: z.object({ ok: z.literal(true), workItemId: z.number() }),
    async handler(ctx, args): Promise<{ok:true, workItemId:number}> {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.thinkingEntries).where(eq(schema.thinkingEntries.id, args.id));
      const entry = rows[0];
      if (!entry) return { ok: true as const, workItemId: 0 };
      let workItemId = entry.workItemId;
      if (args.decision === "معتمد" && workItemId === 0) {
        const res = await db.insert(schema.workItems).values({ title: entry.decision || entry.title, sourceType: "Thinking", ownerRole: "Owner", priority: "High", nextAction: entry.decision || entry.title, notes: `قرار معتمد من «تفكير زيرا وقراراتنا» #${entry.id} — الفكرة: ${entry.title} · الاستنتاج: ${entry.conclusion}` }).returning({ id: schema.workItems.id });
        workItemId = res[0]!.id;
      }
      await db.update(schema.thinkingEntries).set({ status: args.decision, workItemId, ...(args.ownerComment ? { ownerComment: args.ownerComment } : {}) }).where(eq(schema.thinkingEntries.id, args.id));
      await db.insert(schema.activityEvents).values({ section: "Thinking", eventType: args.decision === "معتمد" ? "قرار معتمد" : "قرار مرفوض", detail: `«${entry.title}» — ${args.decision}${args.decision === "معتمد" ? " واتحول لعنصر متابعة شغل" : ""}` });
      ctx.invalidateQueries();
      return { ok: true as const, workItemId };
    },
  }),
  commentThinking: defineAction({
    description: "Saves the owner's reply/comment on a thinking entry.",
    request: z.object({ id: z.number().int().positive(), ownerComment: z.string().max(2000) }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.update(schema.thinkingEntries).set({ ownerComment: args.ownerComment }).where(eq(schema.thinkingEntries.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteThinking: defineAction({
    description: "Deletes a thinking entry.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.thinkingEntries).where(eq(schema.thinkingEntries.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Owner Planning (تخطيط) ----
  listOwnerPlans: defineAction({
    description: "Lists the owner's own written plans/goals/ideas/directives, newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ plans: z.array(z.object({ id: z.number(), title: z.string(), body: z.string(), kind: z.string(), linkedThinkingId: z.number(), workItemId: z.number(), createdAt: z.string(), updatedAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.ownerPlans).orderBy(desc(schema.ownerPlans.id)).limit(args.limit); return { plans: rows.map(r=>({ id:r.id, title:r.title, body:r.body, kind:r.kind, linkedThinkingId:r.linkedThinkingId, workItemId:r.workItemId, createdAt:r.createdAt.toISOString(), updatedAt:r.updatedAt.toISOString() })) }; },
  }),
  createOwnerPlan: defineAction({
    description: "Saves a new owner-written planning entry (goal, idea, directive, or plan), optionally linked to a thinking entry.",
    request: z.object({ title: z.string().trim().min(1).max(300), body: z.string().max(6000).default(""), kind: z.enum(["هدف","فكرة","توجيه","خطة"]).default("خطة"), linkedThinkingId: z.number().int().min(0).default(0) }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const res = await db.insert(schema.ownerPlans).values(args).returning({ id: schema.ownerPlans.id }); await db.insert(schema.activityEvents).values({ section: "Planning", eventType: "عنصر تخطيط جديد", detail: `${args.kind}: ${args.title}` }); ctx.invalidateQueries(); return { id: res[0]!.id }; },
  }),
  updateOwnerPlan: defineAction({
    description: "Updates an owner planning entry (text or linked thinking entry).",
    request: z.object({ id: z.number().int().positive(), title: z.string().trim().min(1).max(300).optional(), body: z.string().max(6000).optional(), kind: z.enum(["هدف","فكرة","توجيه","خطة"]).optional(), linkedThinkingId: z.number().int().min(0).optional() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); const { id, ...rest } = args; const patch: Record<string, unknown> = { updatedAt: new Date() }; for (const [k, v] of Object.entries(rest)) if (v !== undefined) patch[k] = v; await db.update(schema.ownerPlans).set(patch).where(eq(schema.ownerPlans.id, id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  deleteOwnerPlan: defineAction({
    description: "Deletes an owner planning entry.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.ownerPlans).where(eq(schema.ownerPlans.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
  convertPlanToWork: defineAction({
    description: "Converts an owner planning entry into a tracked work item (follow-up task).",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true), workItemId: z.number() }),
    async handler(ctx, args): Promise<{ok:true, workItemId:number}> {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.ownerPlans).where(eq(schema.ownerPlans.id, args.id));
      const p = rows[0];
      if (!p || p.workItemId !== 0) return { ok: true as const, workItemId: p?.workItemId ?? 0 };
      const res = await db.insert(schema.workItems).values({ title: p.title, sourceType: "Owner Plan", ownerRole: "Owner", priority: "Medium", nextAction: p.body.slice(0, 300), notes: `اتحول من عنصر تخطيط المالك #${p.id} (${p.kind})${p.linkedThinkingId ? ` · مرتبط بمدخلة تفكير #${p.linkedThinkingId}` : ""}` }).returning({ id: schema.workItems.id });
      await db.update(schema.ownerPlans).set({ workItemId: res[0]!.id, updatedAt: new Date() }).where(eq(schema.ownerPlans.id, args.id));
      await db.insert(schema.activityEvents).values({ section: "Planning", eventType: "تخطيط اتحول لمهمة", detail: `«${p.title}» بقى عنصر متابعة شغل #${res[0]!.id}` });
      ctx.invalidateQueries();
      return { ok: true as const, workItemId: res[0]!.id };
    },
  }),

  // ---- Creative Analysis loop (تحليل الكرييتف — CIS) ----
  listCreativeAnalyses: defineAction({
    description: "Lists recorded creative analyses (CIS layers, why it won/lost, evidence, remix ideas) newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ analyses: z.array(z.object({ id: z.number(), creativeId: z.number(), classification: z.string(), cisHook: z.string(), cisFormat: z.string(), cisAngle: z.string(), cisLever: z.string(), why: z.string(), evidence: z.string(), sampleNote: z.string(), confidence: z.number(), remix: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.creativeAnalyses).orderBy(desc(schema.creativeAnalyses.id)).limit(args.limit); return { analyses: rows.map(r=>({ id:r.id, creativeId:r.creativeId, classification:r.classification, cisHook:r.cisHook, cisFormat:r.cisFormat, cisAngle:r.cisAngle, cisLever:r.cisLever, why:r.why, evidence:r.evidence, sampleNote:r.sampleNote, confidence:r.confidence, remix:r.remix, createdAt:r.createdAt.toISOString() })) }; },
  }),
  analyzeCreativeDeep: defineAction({
    description: "Analyzes one recorded creative layer by layer (CIS: Hook/Format/Angle/Lever) using ONLY its recorded metrics and notes — explains why it won or lost with evidence, classifies it (Promising/Validated/Declining/Insufficient Evidence), and proposes remix ideas. Records the analysis and updates the creative's performance class. No invented numbers.",
    request: z.object({ creativeId: z.number().int().positive() }),
    response: z.object({ id: z.number(), classification: z.string() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.creatives).where(eq(schema.creatives.id, args.creativeId));
      const c = rows[0];
      if (!c) throw new Error("الكرييتف غير موجود");
      const hasMetrics = c.spend > 0 || c.ordersDelivered > 0 || c.hookRate > 0 || c.cpp > 0;
      const sampleNote = !hasMetrics ? "لا توجد أي أرقام أداء مسجلة لهذا الكرييتف بعد — التحليل بنيوي فقط والتصنيف Insufficient Evidence وجوباً." : `العينة المسجلة: إنفاق ${c.spend} جنيه · طلبات مُسلّمة ${c.ordersDelivered} · CPP مسجل ${c.cpp} جنيه${c.ordersDelivered < 10 ? " — عينة صغيرة (أقل من 10 طلبات مُسلّمة): الثقة منخفضة والتصنيف لا يتجاوز Promising." : ""}`;
      const facts = `الكرييتف: ${c.title} · CIS Tag: ${c.cisTag} · المنتج: ${c.product || "غير محدد"} · الزاوية: ${c.angle || "غير محددة"} · الهوك: ${c.hook || "غير محدد"} · الفورمات: ${c.format || "غير محدد"} · الموهبة/المصدر: ${c.talent || "غير محدد"} · الرافعة: ${c.lever || "غير محددة"} · الإصدار: V${c.version} · الحالة: ${c.status} · التصنيف الحالي: ${c.perfClass}\nالأرقام المسجلة فعلياً: Hook Rate ${c.hookRate}% · Hold Rate ${c.holdRate}% · Outbound CTR ${c.outboundCtr}% · CVR ${c.cvr}% · CPP ${c.cpp} جنيه · الإنفاق ${c.spend} جنيه · طلبات مُسلّمة ${c.ordersDelivered}\nملاحظة «ليه» المسجلة: ${c.whyNote || "لا توجد"} · ملاحظات: ${c.notes || "لا توجد"}\nحالة العينة: ${sampleNote}`;
      const out = await ctx.inference.complete(
        `حلّل الكرييتف التالي طبقة طبقة (CIS) بناءً على بياناته المسجلة فقط. ممنوع اختراع أرقام أو نتائج غير موجودة. لو مفيش أرقام أداء، التصنيف Insufficient Evidence حتماً والتحليل يبقى بنيوي (قوة الطبقات على الورق) مع طلب بيانات صريح.\n\n${facts}\n\nلكل طبقة (Hook / Format / Angle / Lever) اكتب حكماً قصيراً مبنياً على المسجل. وبعدين: ليه نجح أو ليه فشل (أو ليه لسه بدري) بالأدلة الرقمية المسجلة حرفياً، والتصنيف، واقتراحات Remix محددة (متغير واحد يتغير في كل اقتراح — Rule of One).`,
        { schema: z.object({ classification: z.enum(["Promising","Validated","Declining","Insufficient Evidence"]), cisHook: z.string(), cisFormat: z.string(), cisAngle: z.string(), cisLever: z.string(), why: z.string(), evidence: z.string(), confidence: z.number().int().min(0).max(100), remix: z.array(z.string()).max(5) }), system: "أنت محلل كرييتف صارم بمنهجية CIS: تفسر الأرقام المسجلة فقط، تعلن حجم العينة والثقة، ولا ترفع تصنيفاً فوق ما تسمح به العينة." }
      );
      const res = await db.insert(schema.creativeAnalyses).values({ creativeId: c.id, classification: out.classification, cisHook: out.cisHook, cisFormat: out.cisFormat, cisAngle: out.cisAngle, cisLever: out.cisLever, why: out.why, evidence: out.evidence, sampleNote, confidence: out.confidence, remix: out.remix.join("\n") }).returning({ id: schema.creativeAnalyses.id });
      await db.update(schema.creatives).set({ perfClass: out.classification, updatedAt: new Date() }).where(eq(schema.creatives.id, c.id));
      await db.insert(schema.activityEvents).values({ section: "Creative Analysis", eventType: "تحليل كرييتف", detail: `«${c.title}» → ${out.classification} (ثقة ${out.confidence}%)` });
      ctx.invalidateQueries();
      return { id: res[0]!.id, classification: out.classification };
    },
  }),
  deleteCreativeAnalysis: defineAction({
    description: "Deletes a recorded creative analysis.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.creativeAnalyses).where(eq(schema.creativeAnalyses.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),

  // ---- Competitor Ad Analysis loop (تحليل إعلانات المنافسين) ----
  listCompetitorAdAnalyses: defineAction({
    description: "Lists recorded competitor-ad analyses (angle, hook, format, offer, runtime, why it works, weakness, lessons for Zyra) newest first.",
    request: z.object({ limit: z.number().int().positive().max(200).default(100) }),
    response: z.object({ analyses: z.array(z.object({ id: z.number(), observationId: z.number(), competitor: z.string(), angle: z.string(), hook: z.string(), format: z.string(), offer: z.string(), runtimeNote: z.string(), whyWorking: z.string(), weakness: z.string(), lessons: z.string(), createdAt: z.string() })) }),
    async handler(ctx, args) { const db = ctx.db<typeof schema>(); const rows = await db.select().from(schema.competitorAdAnalyses).orderBy(desc(schema.competitorAdAnalyses.id)).limit(args.limit); return { analyses: rows.map(r=>({ id:r.id, observationId:r.observationId, competitor:r.competitor, angle:r.angle, hook:r.hook, format:r.format, offer:r.offer, runtimeNote:r.runtimeNote, whyWorking:r.whyWorking, weakness:r.weakness, lessons:r.lessons, createdAt:r.createdAt.toISOString() })) }; },
  }),
  analyzeCompetitorAd: defineAction({
    description: "Analyzes one recorded competitor ad (a market observation from Meta/TikTok Ads Library or the competitor's site): angle, hook, format, offer, runtime/longevity, why it is working (or its weakness), and concrete lessons for Zyra. Uses only the recorded observation and the matched competitor profile — no invented data.",
    request: z.object({ observationId: z.number().int().positive() }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.observations).where(eq(schema.observations.id, args.observationId));
      const o = rows[0];
      if (!o) throw new Error("الملاحظة/الإعلان غير موجود");
      const comps = await db.select().from(schema.competitors);
      const matched = comps.find(c=> (o.title + " " + o.notes).includes(c.name)) ?? null;
      const facts = `الإعلان/الملاحظة المسجلة: ${o.title} · المصدر: ${o.source || "غير مذكور"} · تاريخ الرصد: ${o.observedDate || o.createdAt.toISOString().slice(0,10)} · وسم الأدلة: ${o.evidenceTag} · التفاصيل المسجلة: ${o.notes || "لا تفاصيل إضافية مسجلة"}\n${matched ? `بروفايل المنافس المطابق: ${matched.name} — فئة: ${matched.category} · تموضع: ${matched.positioning} · عرضه: ${matched.offer} · أسعار: ${matched.priceNote}` : "لا يوجد بروفايل منافس مطابق مسجل — حدد المنافس من نص الملاحظة فقط لو مذكور صراحة، وإلا اكتب «غير محدد من التسجيل»."}`;
      const out = await ctx.inference.complete(
        `حلّل إعلان المنافس المسجل التالي من بياناته المسجلة فقط — ممنوع اختراع مدة تشغيل أو أرقام أداء أو محتوى إعلان غير موصوف في التسجيل؛ الناقص يتقال إنه غير مسجل.\n\n${facts}\n\nاستخرج: الزاوية، الهوك، الفورمات، العرض، وملاحظة مدة التشغيل/الاستمرارية (من التواريخ المسجلة فقط — تاريخ بدء أو مدة لو مذكورة، وإلا «غير مسجلة»)، وليه الإعلان ده شغال/ناجح على الأرجح (أو فين ضعفه)، ونقطة ضعفه الأوضح، ودروساً عملية لزيرا (تتبنى/تتجنب/تختبر) من غير نسخ أعمى ومن غير ادعاءات طبية أو مقارنات باسم براند (AEO).`,
        { schema: z.object({ competitor: z.string(), angle: z.string(), hook: z.string(), format: z.string(), offer: z.string(), runtimeNote: z.string(), whyWorking: z.string(), weakness: z.string(), lessons: z.array(z.string()).max(5) }), system: "أنت محلل إعلانات منافسين صارم: تفكك الإعلان لعناصره من التسجيل فقط، وتميز بوضوح بين المسجل والمستنتج، وتستخرج دروساً قابلة للاختبار لزيرا." }
      );
      const res = await db.insert(schema.competitorAdAnalyses).values({ observationId: o.id, competitor: out.competitor || matched?.name || "", angle: out.angle, hook: out.hook, format: out.format, offer: out.offer, runtimeNote: out.runtimeNote, whyWorking: out.whyWorking, weakness: out.weakness, lessons: out.lessons.join("\n") }).returning({ id: schema.competitorAdAnalyses.id });
      await db.insert(schema.activityEvents).values({ section: "Competitor Ads", eventType: "تحليل إعلان منافس", detail: `«${o.title}» (${out.competitor || matched?.name || "منافس"})` });
      ctx.invalidateQueries();
      return { id: res[0]!.id };
    },
  }),
  runAnalysisLoop: defineAction({
    description: "Runs the continuous analysis loop once: every recorded competitor ad (observation) and every recorded creative that has no analysis yet gets a full recorded analysis (same grounded method as the single-item analyzers). Idempotent — already-analyzed items are skipped, so it is safe to run repeatedly and after each new data entry.",
    request: z.object({}),
    response: z.object({ competitorAnalyzed: z.number(), creativeAnalyzed: z.number(), skipped: z.number() }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      let competitorAnalyzed = 0, creativeAnalyzed = 0, skipped = 0;
      // --- Competitor ads loop ---
      const obs = await db.select().from(schema.observations).orderBy(schema.observations.id);
      const doneObs = new Set((await db.select().from(schema.competitorAdAnalyses)).map(a=>a.observationId));
      const comps = await db.select().from(schema.competitors);
      for (const o of obs) {
        if (doneObs.has(o.id)) { skipped++; continue; }
        if (competitorAnalyzed >= 15) { skipped++; continue; }
        const matched = comps.find(c=> (o.title + " " + o.notes).includes(c.name)) ?? null;
        const facts = `الإعلان/الملاحظة المسجلة: ${o.title} · المصدر: ${o.source || "غير مذكور"} · تاريخ الرصد: ${o.observedDate || o.createdAt.toISOString().slice(0,10)} · وسم الأدلة: ${o.evidenceTag} · التفاصيل المسجلة: ${o.notes || "لا تفاصيل إضافية مسجلة"}\n${matched ? `بروفايل المنافس المطابق: ${matched.name} — فئة: ${matched.category} · تموضع: ${matched.positioning} · عرضه: ${matched.offer} · أسعار: ${matched.priceNote}` : "لا يوجد بروفايل منافس مطابق مسجل — حدد المنافس من نص الملاحظة فقط لو مذكور صراحة، وإلا اكتب «غير محدد من التسجيل»."}`;
        try {
          const out = await ctx.inference.complete(
            `حلّل إعلان المنافس المسجل التالي من بياناته المسجلة فقط — ممنوع اختراع مدة تشغيل أو أرقام أداء أو محتوى إعلان غير موصوف في التسجيل؛ الناقص يتقال إنه غير مسجل.\n\n${facts}\n\nاستخرج: الزاوية، الهوك، الفورمات، العرض، وملاحظة مدة التشغيل/الاستمرارية (من التواريخ المسجلة فقط — تاريخ بدء أو مدة لو مذكورة، وإلا «غير مسجلة»)، وليه الإعلان ده شغال/ناجح على الأرجح (أو فين ضعفه)، ونقطة ضعفه الأوضح، ودروساً عملية لزيرا (تتبنى/تتجنب/تختبر) من غير نسخ أعمى ومن غير ادعاءات طبية أو مقارنات باسم براند (AEO).`,
            { schema: z.object({ competitor: z.string(), angle: z.string(), hook: z.string(), format: z.string(), offer: z.string(), runtimeNote: z.string(), whyWorking: z.string(), weakness: z.string(), lessons: z.array(z.string()).max(5) }), system: "أنت محلل إعلانات منافسين صارم: تفكك الإعلان لعناصره من التسجيل فقط، وتميز بوضوح بين المسجل والمستنتج، وتستخرج دروساً قابلة للاختبار لزيرا." }
          );
          await db.insert(schema.competitorAdAnalyses).values({ observationId: o.id, competitor: out.competitor || matched?.name || "", angle: out.angle, hook: out.hook, format: out.format, offer: out.offer, runtimeNote: out.runtimeNote, whyWorking: out.whyWorking, weakness: out.weakness, lessons: out.lessons.join("\n") });
          competitorAnalyzed++;
        } catch { skipped++; }
      }
      // --- Creatives loop ---
      const creas = await db.select().from(schema.creatives).orderBy(schema.creatives.id);
      const doneCrea = new Set((await db.select().from(schema.creativeAnalyses)).map(a=>a.creativeId));
      for (const c of creas) {
        if (doneCrea.has(c.id)) { skipped++; continue; }
        if (creativeAnalyzed >= 15) { skipped++; continue; }
        const hasMetrics = c.spend > 0 || c.ordersDelivered > 0 || c.hookRate > 0 || c.cpp > 0;
        const sampleNote = !hasMetrics ? "لا توجد أي أرقام أداء مسجلة لهذا الكرييتف بعد — التحليل بنيوي فقط والتصنيف Insufficient Evidence وجوباً." : `العينة المسجلة: إنفاق ${c.spend} جنيه · طلبات مُسلّمة ${c.ordersDelivered} · CPP مسجل ${c.cpp} جنيه${c.ordersDelivered < 10 ? " — عينة صغيرة (أقل من 10 طلبات مُسلّمة): الثقة منخفضة والتصنيف لا يتجاوز Promising." : ""}`;
        const facts = `الكرييتف: ${c.title} · CIS Tag: ${c.cisTag} · المنتج: ${c.product || "غير محدد"} · الزاوية: ${c.angle || "غير محددة"} · الهوك: ${c.hook || "غير محدد"} · الفورمات: ${c.format || "غير محدد"} · الموهبة/المصدر: ${c.talent || "غير محدد"} · الرافعة: ${c.lever || "غير محددة"} · الإصدار: V${c.version} · الحالة: ${c.status} · التصنيف الحالي: ${c.perfClass}\nالأرقام المسجلة فعلياً: Hook Rate ${c.hookRate}% · Hold Rate ${c.holdRate}% · Outbound CTR ${c.outboundCtr}% · CVR ${c.cvr}% · CPP ${c.cpp} جنيه · الإنفاق ${c.spend} جنيه · طلبات مُسلّمة ${c.ordersDelivered}\nملاحظة «ليه» المسجلة: ${c.whyNote || "لا توجد"} · ملاحظات: ${c.notes || "لا توجد"}\nحالة العينة: ${sampleNote}`;
        try {
          const out = await ctx.inference.complete(
            `حلّل الكرييتف التالي طبقة طبقة (CIS) بناءً على بياناته المسجلة فقط. ممنوع اختراع أرقام أو نتائج غير موجودة. لو مفيش أرقام أداء، التصنيف Insufficient Evidence حتماً والتحليل يبقى بنيوي (قوة الطبقات على الورق) مع طلب بيانات صريح.\n\n${facts}\n\nلكل طبقة (Hook / Format / Angle / Lever) اكتب حكماً قصيراً مبنياً على المسجل. وبعدين: ليه نجح أو ليه فشل (أو ليه لسه بدري) بالأدلة الرقمية المسجلة حرفياً، والتصنيف، واقتراحات Remix محددة (متغير واحد يتغير في كل اقتراح — Rule of One).`,
            { schema: z.object({ classification: z.enum(["Promising","Validated","Declining","Insufficient Evidence"]), cisHook: z.string(), cisFormat: z.string(), cisAngle: z.string(), cisLever: z.string(), why: z.string(), evidence: z.string(), confidence: z.number().int().min(0).max(100), remix: z.array(z.string()).max(5) }), system: "أنت محلل كرييتف صارم بمنهجية CIS: تفسر الأرقام المسجلة فقط، تعلن حجم العينة والثقة، ولا ترفع تصنيفاً فوق ما تسمح به العينة." }
          );
          await db.insert(schema.creativeAnalyses).values({ creativeId: c.id, classification: out.classification, cisHook: out.cisHook, cisFormat: out.cisFormat, cisAngle: out.cisAngle, cisLever: out.cisLever, why: out.why, evidence: out.evidence, sampleNote, confidence: out.confidence, remix: out.remix.join("\n") });
          await db.update(schema.creatives).set({ perfClass: out.classification, updatedAt: new Date() }).where(eq(schema.creatives.id, c.id));
          creativeAnalyzed++;
        } catch { skipped++; }
      }
      if (competitorAnalyzed + creativeAnalyzed > 0) await db.insert(schema.activityEvents).values({ section: "Analysis Loop", eventType: "تشغيل لوب التحليل", detail: `تحاليل جديدة: ${competitorAnalyzed} إعلان منافس · ${creativeAnalyzed} كرييتف` });
      ctx.invalidateQueries();
      return { competitorAnalyzed, creativeAnalyzed, skipped };
    },
  }),
  deleteCompetitorAdAnalysis: defineAction({
    description: "Deletes a recorded competitor-ad analysis.",
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ok:true}> { const db = ctx.db<typeof schema>(); await db.delete(schema.competitorAdAnalyses).where(eq(schema.competitorAdAnalyses.id, args.id)); ctx.invalidateQueries(); return { ok: true as const }; },
  }),
} satisfies ActionsModule;
