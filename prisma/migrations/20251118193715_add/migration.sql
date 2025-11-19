/*
  Warnings:

  - Added the required column `coordinates` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "coordinates" TEXT NOT NULL;
