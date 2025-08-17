/*
  Warnings:

  - You are about to drop the column `alwaysOpen` on the `MenuHours` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `MenuHours` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."MenuHours" DROP COLUMN "alwaysOpen",
DROP COLUMN "companyId",
ADD COLUMN     "closed" BOOLEAN NOT NULL DEFAULT false;
