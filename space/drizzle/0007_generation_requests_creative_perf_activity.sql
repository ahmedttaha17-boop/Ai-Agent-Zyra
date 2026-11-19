CREATE TABLE IF NOT EXISTS `generation_requests` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `title` text NOT NULL,
  `product` text DEFAULT '' NOT NULL,
  `angle` text DEFAULT '' NOT NULL,
  `format` text DEFAULT '' NOT NULL,
  `hook` text DEFAULT '' NOT NULL,
  `primary_text` text DEFAULT '' NOT NULL,
  `cta` text DEFAULT '' NOT NULL,
  `size` text DEFAULT '1080x1920' NOT NULL,
  `spec` text DEFAULT '' NOT NULL,
  `cis_tag` text DEFAULT '' NOT NULL,
  `status` text DEFAULT 'New' NOT NULL,
  `notes` text DEFAULT '' NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `activity_events` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `section` text DEFAULT '' NOT NULL,
  `event_type` text DEFAULT '' NOT NULL,
  `detail` text DEFAULT '' NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `creatives` ADD COLUMN `hook_rate` real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `creatives` ADD COLUMN `hold_rate` real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `creatives` ADD COLUMN `outbound_ctr` real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `creatives` ADD COLUMN `cvr` real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `creatives` ADD COLUMN `cpp` real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `creatives` ADD COLUMN `spend` real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `creatives` ADD COLUMN `orders_delivered` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `creatives` ADD COLUMN `why_note` text DEFAULT '' NOT NULL;
