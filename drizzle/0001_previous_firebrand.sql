CREATE TABLE "follows" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"food_bank_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "follows_user_id_food_bank_id_unique" UNIQUE("user_id","food_bank_id")
);
--> statement-breakpoint
CREATE TABLE "food_banks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"area" text NOT NULL,
	"drop_off_place" text NOT NULL,
	"drop_off_times" text NOT NULL,
	"plenty" text DEFAULT '' NOT NULL,
	"needs_updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "list_items" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"need_id" text NOT NULL,
	"given_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "needs" (
	"id" text PRIMARY KEY NOT NULL,
	"food_bank_id" text NOT NULL,
	"item" text NOT NULL,
	"category" text NOT NULL,
	"level" text NOT NULL,
	"note" text,
	"no_longer_needed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_food_bank_id_food_banks_id_fk" FOREIGN KEY ("food_bank_id") REFERENCES "public"."food_banks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_banks" ADD CONSTRAINT "food_banks_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_need_id_needs_id_fk" FOREIGN KEY ("need_id") REFERENCES "public"."needs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "needs" ADD CONSTRAINT "needs_food_bank_id_food_banks_id_fk" FOREIGN KEY ("food_bank_id") REFERENCES "public"."food_banks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "needs" ADD CONSTRAINT "needs_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;