ALTER TABLE `creatives` ADD COLUMN `image_blob_key` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `creative_analyses` ADD COLUMN `visual_read` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `creative_analyses` ADD COLUMN `ocr_text` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `creative_analyses` ADD COLUMN `scores_json` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `creative_analyses` ADD COLUMN `compliance` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `creative_analyses` ADD COLUMN `strengths` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `creative_analyses` ADD COLUMN `weaknesses` text DEFAULT '' NOT NULL;
