ALTER TABLE "gifts" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gifts" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."gift_status";--> statement-breakpoint
CREATE TYPE "public"."gift_status" AS ENUM('pending', 'sent');--> statement-breakpoint
ALTER TABLE "gifts" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."gift_status";--> statement-breakpoint
ALTER TABLE "gifts" ALTER COLUMN "status" SET DATA TYPE "public"."gift_status" USING "status"::"public"."gift_status";--> statement-breakpoint
ALTER TABLE "gifts" DROP COLUMN "delivery_date";