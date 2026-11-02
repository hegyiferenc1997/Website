CREATE TABLE "user_activity_days" (
	"user_id" text NOT NULL,
	"day" date NOT NULL,
	"seconds" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_activity_days_user_id_day_pk" PRIMARY KEY("user_id","day")
);
--> statement-breakpoint
ALTER TABLE "user_activity_days" ADD CONSTRAINT "user_activity_days_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;