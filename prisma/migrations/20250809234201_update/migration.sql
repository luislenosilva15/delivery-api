/*
  Warnings:

  - You are about to drop the column `coverImageUrl` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `isAlwaysOpening` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `temporaryClosed` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Company" DROP COLUMN "coverImageUrl",
DROP COLUMN "isActive",
DROP COLUMN "isAlwaysOpening",
DROP COLUMN "temporaryClosed";
