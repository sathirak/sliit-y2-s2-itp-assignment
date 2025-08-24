CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
