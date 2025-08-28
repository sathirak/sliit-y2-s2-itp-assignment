-- Create contracts table
CREATE TABLE IF NOT EXISTS "contracts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "description" text NOT NULL,
  "amount" decimal(10,2) NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "is_paid" boolean NOT NULL DEFAULT false,
  "owner_id" uuid NOT NULL,
  "supplier_id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false,
  CONSTRAINT "contracts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "contracts_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create contract_request table
CREATE TABLE IF NOT EXISTS "contract_request" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "description" text NOT NULL,
  "amount" decimal(10,2) NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "owner_id" uuid NOT NULL,
  "supplier_id" uuid NOT NULL,
  "owner_approved" boolean NOT NULL DEFAULT false,
  "owner_approved_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false,
  CONSTRAINT "contract_request_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "contract_request_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create contract_request_comment table
CREATE TABLE IF NOT EXISTS "contract_request_comment" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "comment" text NOT NULL,
  "contract_request_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "contract_request_comment_contract_request_id_fkey" FOREIGN KEY ("contract_request_id") REFERENCES "contract_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "contract_request_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Enable Row Level Security
ALTER TABLE "contracts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contract_request" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contract_request_comment" ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "contracts_owner_id_idx" ON "contracts"("owner_id");
CREATE INDEX IF NOT EXISTS "contracts_supplier_id_idx" ON "contracts"("supplier_id");
CREATE INDEX IF NOT EXISTS "contracts_status_idx" ON "contracts"("status");
CREATE INDEX IF NOT EXISTS "contracts_deleted_idx" ON "contracts"("deleted");
CREATE INDEX IF NOT EXISTS "contracts_created_at_idx" ON "contracts"("created_at");

CREATE INDEX IF NOT EXISTS "contract_request_owner_id_idx" ON "contract_request"("owner_id");
CREATE INDEX IF NOT EXISTS "contract_request_supplier_id_idx" ON "contract_request"("supplier_id");
CREATE INDEX IF NOT EXISTS "contract_request_status_idx" ON "contract_request"("status");
CREATE INDEX IF NOT EXISTS "contract_request_deleted_idx" ON "contract_request"("deleted");
CREATE INDEX IF NOT EXISTS "contract_request_created_at_idx" ON "contract_request"("created_at");

CREATE INDEX IF NOT EXISTS "contract_request_comment_contract_request_id_idx" ON "contract_request_comment"("contract_request_id");
CREATE INDEX IF NOT EXISTS "contract_request_comment_user_id_idx" ON "contract_request_comment"("user_id");
CREATE INDEX IF NOT EXISTS "contract_request_comment_created_at_idx" ON "contract_request_comment"("created_at");
