/*
  Warnings:

  - You are about to drop the column `alwaysOpen` on the `ProductHours` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ProductHours" DROP COLUMN "alwaysOpen",
ADD COLUMN     "closed" BOOLEAN NOT NULL DEFAULT false;
