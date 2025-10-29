/*
  Warnings:

  - You are about to drop the column `productAvailabilityBy` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "productAvailabilityBy";

-- DropEnum
DROP TYPE "public"."ProductAvailabilityBy";
