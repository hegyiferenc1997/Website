ALTER TABLE "course_purchases" ALTER COLUMN "course_slug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "course_purchases" ADD COLUMN "semester" integer;--> statement-breakpoint
ALTER TABLE "course_purchases" ADD COLUMN "plan" text;--> statement-breakpoint
ALTER TABLE "course_purchases" ADD COLUMN "amount_huf" integer;--> statement-breakpoint
ALTER TABLE "course_purchases" ADD COLUMN "provider" text;--> statement-breakpoint
ALTER TABLE "course_purchases" ADD COLUMN "provider_ref" text;--> statement-breakpoint
ALTER TABLE "course_purchases" ADD CONSTRAINT "course_purchases_provider_ref_unique" UNIQUE("provider_ref");