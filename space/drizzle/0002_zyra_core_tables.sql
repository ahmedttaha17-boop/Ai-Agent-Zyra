DROP TABLE IF EXISTS entries;
--> statement-breakpoint
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  objective TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'New',
  evidence_tag TEXT NOT NULL DEFAULT 'UNKNOWN',
  assumptions TEXT NOT NULL DEFAULT '',
  confidence INTEGER NOT NULL DEFAULT 50,
  freshness TEXT NOT NULL DEFAULT '',
  stage INTEGER NOT NULL DEFAULT 1,
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE approvals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at INTEGER NOT NULL,
  decided_at INTEGER
);
--> statement-breakpoint
CREATE TABLE learnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hypothesis TEXT NOT NULL,
  decision TEXT NOT NULL DEFAULT '',
  expected_outcome TEXT NOT NULL DEFAULT '',
  actual_outcome TEXT NOT NULL DEFAULT '',
  verdict TEXT NOT NULL DEFAULT 'Pending',
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE system_checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  checked_at INTEGER NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  tasks_count INTEGER NOT NULL DEFAULT 0,
  approvals_pending INTEGER NOT NULL DEFAULT 0
);
