-- Drop contract request comment table
DROP TABLE IF EXISTS "contract_request_comment";

-- Remove columns from contracts table
ALTER TABLE "contracts" DROP COLUMN IF EXISTS "status";
ALTER TABLE "contracts" DROP COLUMN IF EXISTS "is_paid";
ALTER TABLE "contracts" DROP COLUMN IF EXISTS "supplier_id";

-- Add new columns to contract_request table
ALTER TABLE "contract_request" ADD COLUMN IF NOT EXISTS "comment" text;
ALTER TABLE "contract_request" ADD COLUMN IF NOT EXISTS "is_paid" boolean DEFAULT false NOT NULL;

-- Update status enum values (pending -> ongoing -> completed instead of pending -> approved -> rejected)
-- Note: This assumes existing data uses the old enum values
UPDATE "contract_request" SET "status" = 'ongoing' WHERE "status" = 'approved';
UPDATE "contract_request" SET "status" = 'completed' WHERE "status" = 'rejected';
