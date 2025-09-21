ALTER TABLE "tickets" RENAME COLUMN "title" TO "name";--> statement-breakpoint
ALTER TABLE "tickets" RENAME COLUMN "description" TO "email";--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "message" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "status" text DEFAULT 'open' NOT NULL;