/*
  Warnings:

  - Made the column `startTime` on table `ProductHours` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endTime` on table `ProductHours` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "alwaysAvailable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."ProductHours" ALTER COLUMN "startTime" SET NOT NULL,
ALTER COLUMN "endTime" SET NOT NULL;
