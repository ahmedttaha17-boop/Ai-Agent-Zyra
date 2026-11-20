CREATE TABLE `video_analyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`video_ref` text DEFAULT '' NOT NULL,
	`product` text DEFAULT '' NOT NULL,
	`duration` text DEFAULT '' NOT NULL,
	`content_type` text DEFAULT 'UGC' NOT NULL,
	`first_frame_desc` text DEFAULT '' NOT NULL,
	`clue_rating` text DEFAULT '' NOT NULL,
	`product_early_rating` text DEFAULT '' NOT NULL,
	`hook_text_rating` text DEFAULT '' NOT NULL,
	`transcript` text DEFAULT '' NOT NULL,
	`hook_class` text DEFAULT '' NOT NULL,
	`proof_moments` text DEFAULT '' NOT NULL,
	`pattern_interrupts` text DEFAULT '' NOT NULL,
	`cta_timing` text DEFAULT '' NOT NULL,
	`banned_claims_note` text DEFAULT '' NOT NULL,
	`retinol_warning` text DEFAULT 'لا ينطبق' NOT NULL,
	`cis_hook` text DEFAULT '' NOT NULL,
	`cis_format` text DEFAULT '' NOT NULL,
	`cis_angle` text DEFAULT '' NOT NULL,
	`cis_lever` text DEFAULT '' NOT NULL,
	`why_won_lost` text DEFAULT '' NOT NULL,
	`hook_score` integer DEFAULT 0 NOT NULL,
	`score_breakdown_json` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `competitor_ad_analyses` ADD COLUMN `video_hook_type` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `competitor_ad_analyses` ADD COLUMN `video_first3_sec` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `competitor_ad_analyses` ADD COLUMN `video_hook_text` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `competitor_ad_analyses` ADD COLUMN `video_duration` text DEFAULT '' NOT NULL;
