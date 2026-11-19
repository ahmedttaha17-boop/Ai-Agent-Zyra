CREATE TABLE `owner_instructions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`instruction` text DEFAULT '' NOT NULL,
	`scope` text DEFAULT 'عام' NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `learning_observations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`source` text DEFAULT 'صوت العميل' NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`occurrences` integer DEFAULT 1 NOT NULL,
	`first_seen_date` text DEFAULT '' NOT NULL,
	`last_seen_date` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'ملاحظة' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `voice_intakes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_type` text DEFAULT 'واتساب مجمّع' NOT NULL,
	`raw_text` text DEFAULT '' NOT NULL,
	`analysis_json` text DEFAULT '{}' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `search_keywords` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`keyword` text NOT NULL,
	`suggestions` text DEFAULT '' NOT NULL,
	`last_scan_at` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_opportunities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`source_type` text DEFAULT 'طلبات عملاء' NOT NULL,
	`evidence` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'قيد الدراسة' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `loop_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`run_type` text DEFAULT 'Tick' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`actions_taken` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ops_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`weekly_review_enabled` integer DEFAULT 0 NOT NULL,
	`suggestion_ttl_days` integer DEFAULT 14 NOT NULL,
	`updated_at` integer NOT NULL
);
