CREATE TABLE `thinking_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`basis` text DEFAULT '' NOT NULL,
	`reasoning` text DEFAULT '' NOT NULL,
	`conclusion` text DEFAULT '' NOT NULL,
	`decision` text DEFAULT '' NOT NULL,
	`confidence` integer DEFAULT 50 NOT NULL,
	`status` text DEFAULT 'بانتظار قرارك' NOT NULL,
	`owner_comment` text DEFAULT '' NOT NULL,
	`work_item_id` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `owner_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`kind` text DEFAULT 'خطة' NOT NULL,
	`linked_thinking_id` integer DEFAULT 0 NOT NULL,
	`work_item_id` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `creative_analyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`creative_id` integer NOT NULL,
	`classification` text DEFAULT 'Insufficient Evidence' NOT NULL,
	`cis_hook` text DEFAULT '' NOT NULL,
	`cis_format` text DEFAULT '' NOT NULL,
	`cis_angle` text DEFAULT '' NOT NULL,
	`cis_lever` text DEFAULT '' NOT NULL,
	`why` text DEFAULT '' NOT NULL,
	`evidence` text DEFAULT '' NOT NULL,
	`sample_note` text DEFAULT '' NOT NULL,
	`confidence` integer DEFAULT 50 NOT NULL,
	`remix` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `competitor_ad_analyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`observation_id` integer NOT NULL,
	`competitor` text DEFAULT '' NOT NULL,
	`angle` text DEFAULT '' NOT NULL,
	`hook` text DEFAULT '' NOT NULL,
	`format` text DEFAULT '' NOT NULL,
	`offer` text DEFAULT '' NOT NULL,
	`runtime_note` text DEFAULT '' NOT NULL,
	`why_working` text DEFAULT '' NOT NULL,
	`weakness` text DEFAULT '' NOT NULL,
	`lessons` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
