CREATE TYPE "public"."lesson_kind" AS ENUM('lesson', 'practice', 'quiz');--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" integer NOT NULL,
	"slug" text NOT NULL,
	"position" integer NOT NULL,
	"kind" "lesson_kind" DEFAULT 'lesson' NOT NULL,
	"title" jsonb NOT NULL,
	"summary" jsonb,
	"body" jsonb NOT NULL,
	"minutes" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "description" jsonb;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lessons_topic_slug" ON "lessons" USING btree ("topic_id","slug");--> statement-breakpoint
ALTER TABLE "topics" DROP COLUMN "content_path";