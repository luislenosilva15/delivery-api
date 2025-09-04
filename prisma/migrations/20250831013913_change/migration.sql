/*
  Warnings:

  - You are about to drop the column `companyPaymentId` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyId]` on the table `CompanyPayment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `CompanyPayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_companyPaymentId_fkey";

-- AlterTable
ALTER TABLE "public"."Company" DROP COLUMN "companyPaymentId";

-- AlterTable
ALTER TABLE "public"."CompanyPayment" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CompanyPayment_companyId_key" ON "public"."CompanyPayment"("companyId");

-- AddForeignKey
ALTER TABLE "public"."CompanyPayment" ADD CONSTRAINT "CompanyPayment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
