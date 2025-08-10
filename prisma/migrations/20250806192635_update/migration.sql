-- AlterTable
ALTER TABLE "public"."OpeningHour" ADD COLUMN     "closed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;
