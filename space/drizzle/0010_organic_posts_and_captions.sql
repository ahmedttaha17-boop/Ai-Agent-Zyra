CREATE TABLE `organic_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`drive_url` text DEFAULT '' NOT NULL,
	`channel` text DEFAULT 'انستجرام' NOT NULL,
	`topic` text DEFAULT '' NOT NULL,
	`format` text DEFAULT 'Static' NOT NULL,
	`slide_count` integer DEFAULT 1 NOT NULL,
	`design_text` text DEFAULT '' NOT NULL,
	`pillar` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'فكرة' NOT NULL,
	`scheduled_date` text DEFAULT '' NOT NULL,
	`compliance_flag` text DEFAULT '' NOT NULL,
	`final_caption` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `organic_captions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`slot` integer DEFAULT 1 NOT NULL,
	`style` text DEFAULT '' NOT NULL,
	`text` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'مسودة' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
