/*
  Warnings:

  - You are about to drop the column `obervation` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "obervation",
ADD COLUMN     "observation" TEXT;
