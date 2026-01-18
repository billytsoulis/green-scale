CREATE TYPE "public"."project_status" AS ENUM('DRAFT', 'ACTIVE', 'FULLY_FUNDED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."kyc_status" AS ENUM('PENDING', 'VERIFIED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"status" "project_status" DEFAULT 'DRAFT' NOT NULL,
	"category" text NOT NULL,
	"target_irr" numeric(5, 2) NOT NULL,
	"min_investment" numeric(12, 2) NOT NULL,
	"esg_score" integer DEFAULT 0 NOT NULL,
	"location" jsonb NOT NULL,
	"content_en" jsonb NOT NULL,
	"content_el" jsonb NOT NULL,
	"media" jsonb DEFAULT '[]'::jsonb,
	"funding_status" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "linked_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"value" numeric(20, 2) NOT NULL,
	"esg_score" integer NOT NULL,
	"sector" text NOT NULL,
	"status" text DEFAULT 'ACTIVE',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rebalance_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"previous_score" integer NOT NULL,
	"new_score" integer NOT NULL,
	"total_value" numeric(20, 2) NOT NULL,
	"trades_snapshot" jsonb NOT NULL,
	"executed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"value_intent" text,
	"kyc_status" "kyc_status" DEFAULT 'PENDING',
	"kyc_step" integer DEFAULT 1,
	"annual_net_worth" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "linked_assets" ADD CONSTRAINT "linked_assets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rebalance_transactions" ADD CONSTRAINT "rebalance_transactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;