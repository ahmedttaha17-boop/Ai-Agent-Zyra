CREATE TABLE IF NOT EXISTS `angles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`hook` text DEFAULT '' NOT NULL,
	`product` text DEFAULT '' NOT NULL,
	`segment` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'مالك' NOT NULL,
	`kind` text DEFAULT 'Static' NOT NULL,
	`status` text DEFAULT 'جديدة' NOT NULL,
	`ugc_stage` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
