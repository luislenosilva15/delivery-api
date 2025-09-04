/*
  Warnings:

  - Added the required column `companyPaymentId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CompanyPayment" DROP CONSTRAINT "CompanyPayment_companyId_fkey";

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "companyPaymentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_companyPaymentId_fkey" FOREIGN KEY ("companyPaymentId") REFERENCES "public"."CompanyPayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
