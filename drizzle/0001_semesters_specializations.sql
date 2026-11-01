CREATE TABLE "specializations" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer NOT NULL,
	"slug" text NOT NULL,
	"name" jsonb NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "is_active" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "program_courses" ADD COLUMN "specialization_id" integer;--> statement-breakpoint
ALTER TABLE "specializations" ADD CONSTRAINT "specializations_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "specializations_program_slug" ON "specializations" USING btree ("program_id","slug");--> statement-breakpoint
ALTER TABLE "program_courses" ADD CONSTRAINT "program_courses_specialization_id_specializations_id_fk" FOREIGN KEY ("specialization_id") REFERENCES "public"."specializations"("id") ON DELETE set null ON UPDATE no action;