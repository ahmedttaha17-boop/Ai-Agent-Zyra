CREATE TABLE IF NOT EXISTS `audit_items` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `item_key` text NOT NULL,
  `pillar` integer DEFAULT 1 NOT NULL,
  `title` text DEFAULT '' NOT NULL,
  `status` text DEFAULT 'لم يبدأ' NOT NULL,
  `notes` text DEFAULT '' NOT NULL,
  `evidence` text DEFAULT '' NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `audit_items_key_idx` ON `audit_items` (`item_key`);
--> statement-breakpoint
ALTER TABLE `financial_snapshots` ADD COLUMN `breakeven_roas` real DEFAULT 0 NOT NULL;
