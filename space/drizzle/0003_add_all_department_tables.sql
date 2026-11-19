CREATE TABLE work_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'Manual',
  status TEXT NOT NULL DEFAULT 'New',
  stage INTEGER NOT NULL DEFAULT 1,
  owner_role TEXT NOT NULL DEFAULT 'Owner',
  priority TEXT NOT NULL DEFAULT 'Medium',
  due_date TEXT NOT NULL DEFAULT '',
  progress INTEGER NOT NULL DEFAULT 0,
  blocker TEXT NOT NULL DEFAULT '',
  next_action TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'Meta',
  objective TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Draft',
  budget REAL NOT NULL DEFAULT 0,
  spent REAL NOT NULL DEFAULT 0,
  results TEXT NOT NULL DEFAULT '',
  period TEXT NOT NULL DEFAULT '',
  attribution TEXT NOT NULL DEFAULT '7-day click',
  weekly_orders INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE creatives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  cis_tag TEXT NOT NULL DEFAULT '',
  product TEXT NOT NULL DEFAULT '',
  angle TEXT NOT NULL DEFAULT '',
  hook TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT '',
  talent TEXT NOT NULL DEFAULT '',
  lever TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Concept Draft',
  perf_class TEXT NOT NULL DEFAULT 'Insufficient Evidence',
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE content_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'Instagram',
  pillar TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT 'Reel',
  status TEXT NOT NULL DEFAULT 'Idea',
  scheduled_date TEXT NOT NULL DEFAULT '',
  caption_draft TEXT NOT NULL DEFAULT '',
  innovation_bucket TEXT NOT NULL DEFAULT '70% Proven',
  depth_bucket TEXT NOT NULL DEFAULT '75% Deep Problem-Solving',
  source_idea TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE competitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  positioning TEXT NOT NULL DEFAULT '',
  offer TEXT NOT NULL DEFAULT '',
  price_note TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '',
  observed_date TEXT NOT NULL DEFAULT '',
  evidence_tag TEXT NOT NULL DEFAULT 'UNKNOWN',
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE customer_insights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme TEXT NOT NULL,
  insight_type TEXT NOT NULL DEFAULT 'Objection',
  summary TEXT NOT NULL DEFAULT '',
  frequency TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE financial_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT '',
  product TEXT NOT NULL DEFAULT '',
  placed INTEGER NOT NULL DEFAULT 0,
  delivered INTEGER NOT NULL DEFAULT 0,
  contribution_placed REAL NOT NULL DEFAULT 0,
  contribution_delivered REAL NOT NULL DEFAULT 0,
  rto_rate REAL NOT NULL DEFAULT 0,
  ship_cost REAL NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE experiments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hypothesis TEXT NOT NULL,
  creative_id TEXT NOT NULL DEFAULT '',
  audience TEXT NOT NULL DEFAULT '',
  product TEXT NOT NULL DEFAULT '',
  hook TEXT NOT NULL DEFAULT '',
  angle TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT '',
  offer TEXT NOT NULL DEFAULT '',
  budget REAL NOT NULL DEFAULT 0,
  start_date TEXT NOT NULL DEFAULT '',
  end_date TEXT NOT NULL DEFAULT '',
  actuals TEXT NOT NULL DEFAULT '',
  sample_size TEXT NOT NULL DEFAULT '',
  attribution TEXT NOT NULL DEFAULT '',
  profitability TEXT NOT NULL DEFAULT '',
  verdict TEXT NOT NULL DEFAULT 'Running',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  review_type TEXT NOT NULL DEFAULT 'Weekly',
  period TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  findings TEXT NOT NULL DEFAULT '',
  decisions TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE execution_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  action_type TEXT NOT NULL DEFAULT 'Other',
  target TEXT NOT NULL DEFAULT '',
  before_value TEXT NOT NULL DEFAULT '',
  after_value TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT 'Completed',
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
