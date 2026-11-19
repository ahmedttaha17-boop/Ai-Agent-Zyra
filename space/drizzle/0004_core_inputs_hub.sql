CREATE TABLE core_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand_name TEXT NOT NULL DEFAULT 'Zyra Care',
  website_url TEXT NOT NULL DEFAULT '',
  market TEXT NOT NULL DEFAULT 'Egypt',
  currency TEXT NOT NULL DEFAULT 'EGP',
  customer_language TEXT NOT NULL DEFAULT 'Egyptian Arabic',
  meta_page TEXT NOT NULL DEFAULT '',
  instagram_handle TEXT NOT NULL DEFAULT '',
  tiktok_handle TEXT NOT NULL DEFAULT '',
  hero_offer TEXT NOT NULL DEFAULT '',
  shipping_policy TEXT NOT NULL DEFAULT '',
  return_policy TEXT NOT NULL DEFAULT '',
  guarantee TEXT NOT NULL DEFAULT '',
  icp_7ws TEXT NOT NULL DEFAULT '',
  approved_claims TEXT NOT NULL DEFAULT '',
  banned_claims TEXT NOT NULL DEFAULT '',
  brand_voice TEXT NOT NULL DEFAULT '',
  ship_cost REAL NOT NULL DEFAULT 0,
  pack_cost REAL NOT NULL DEFAULT 0,
  cod_fee_pct REAL NOT NULL DEFAULT 2,
  rto_cost REAL NOT NULL DEFAULT 0,
  base_delivery_rate REAL NOT NULL DEFAULT 0,
  discount_note TEXT NOT NULL DEFAULT '',
  test_budget REAL NOT NULL DEFAULT 0,
  min_test_days REAL NOT NULL DEFAULT 3,
  target_cpp REAL NOT NULL DEFAULT 0,
  kill_rule TEXT NOT NULL DEFAULT '',
  scale_rule TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  page_url TEXT NOT NULL DEFAULT '',
  price REAL NOT NULL DEFAULT 0,
  cogs REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Active',
  ingredients TEXT NOT NULL DEFAULT '',
  warnings TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
ALTER TABLE competitors ADD COLUMN website_url TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE competitors ADD COLUMN meta_page TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE competitors ADD COLUMN tiktok_handle TEXT NOT NULL DEFAULT '';
