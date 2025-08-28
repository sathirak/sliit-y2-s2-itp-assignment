CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "category" text NOT NULL,
  "description" text NOT NULL,
  "size" text NOT NULL,
  "color" text NOT NULL,
  "qty" integer NOT NULL,
  "price" text NOT NULL,
  "product_image" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "products_name_idx" ON "products" ("name");
CREATE INDEX IF NOT EXISTS "products_category_idx" ON "products" ("category");
CREATE INDEX IF NOT EXISTS "products_deleted_idx" ON "products" ("deleted");
