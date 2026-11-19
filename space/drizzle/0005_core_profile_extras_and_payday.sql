ALTER TABLE core_profiles ADD COLUMN whatsapp_confirm_pct REAL NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE core_profiles ADD COLUMN delivery_pct REAL NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE core_profiles ADD COLUMN ad_perf_30d TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE core_profiles ADD COLUMN ad_perf_7d TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE core_profiles ADD COLUMN customer_voice TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE core_profiles ADD COLUMN creative_inventory TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE core_profiles ADD COLUMN uncertainty_flags TEXT NOT NULL DEFAULT '';
