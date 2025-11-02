/*
  Warnings:

  - A unique constraint covering the columns `[slugName]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slugName` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "slugName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_slugName_key" ON "public"."Company"("slugName");
