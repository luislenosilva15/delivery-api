/*
  Warnings:

  - Made the column `logoUrl` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Company" ALTER COLUMN "logoUrl" SET NOT NULL;
