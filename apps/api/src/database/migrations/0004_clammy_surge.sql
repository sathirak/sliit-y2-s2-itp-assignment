ALTER TABLE "tickets" ALTER COLUMN "status" SET DEFAULT 'OPEN';--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "notes" text;