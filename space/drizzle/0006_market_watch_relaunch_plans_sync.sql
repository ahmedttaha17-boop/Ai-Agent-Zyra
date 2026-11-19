CREATE TABLE IF NOT EXISTS `market_rounds` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `source` text DEFAULT 'Website' NOT NULL,
  `scope` text DEFAULT '' NOT NULL,
  `findings` text DEFAULT '' NOT NULL,
  `round_date` text DEFAULT '' NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `competitor_alerts` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `competitor` text NOT NULL,
  `change_type` text DEFAULT 'زاوية جديدة' NOT NULL,
  `detail` text DEFAULT '' NOT NULL,
  `source` text DEFAULT '' NOT NULL,
  `status` text DEFAULT 'New' NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `agent_plans` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `goal` text NOT NULL,
  `task_type` text DEFAULT 'A' NOT NULL,
  `plan_json` text DEFAULT '[]' NOT NULL,
  `status` text DEFAULT 'Proposed' NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `sync_runs` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `source` text DEFAULT '' NOT NULL,
  `status` text DEFAULT '' NOT NULL,
  `summary` text DEFAULT '' NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `relaunch_goals` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `metric` text NOT NULL,
  `target` real DEFAULT 0 NOT NULL,
  `current` real DEFAULT 0 NOT NULL,
  `unit` text DEFAULT '' NOT NULL,
  `deadline` text DEFAULT '' NOT NULL,
  `notes` text DEFAULT '' NOT NULL,
  `created_at` integer NOT NULL
);
