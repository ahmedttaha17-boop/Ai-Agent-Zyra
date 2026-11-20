CREATE TABLE `creators` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`handle` text DEFAULT '' NOT NULL,
	`platform` text DEFAULT 'Instagram' NOT NULL,
	`profile_url` text DEFAULT '' NOT NULL,
	`followers` text DEFAULT '' NOT NULL,
	`segment_fit` text DEFAULT '' NOT NULL,
	`concept_code` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'مرشحة' NOT NULL,
	`usage_rights` text DEFAULT '' NOT NULL,
	`contact_route` text DEFAULT '' NOT NULL,
	`expert_flag` integer DEFAULT 0 NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `deliveries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`department` text NOT NULL,
	`output` text DEFAULT '' NOT NULL,
	`cadence` text DEFAULT 'أسبوعي' NOT NULL,
	`last_delivery` text DEFAULT '' NOT NULL,
	`next_delivery` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'في الموعد' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reply_drafts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`topic` text NOT NULL,
	`draft_text` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'صوت العميل' NOT NULL,
	`status` text DEFAULT 'مسودة' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `retention_flows` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`trigger_note` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'غير مكتوب' NOT NULL,
	`draft_text` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `experiments` ADD COLUMN `basket_json` text DEFAULT '' NOT NULL;
