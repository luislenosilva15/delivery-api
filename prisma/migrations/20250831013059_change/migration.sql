/*
  Warnings:

  - You are about to drop the column `paymentCardBrand` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethodAvailable` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `paymentVoucherBrand` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Company" DROP COLUMN "paymentCardBrand",
DROP COLUMN "paymentMethodAvailable",
DROP COLUMN "paymentVoucherBrand";

-- CreateTable
CREATE TABLE "public"."CompanyPayment" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "method" "public"."PaymentMethods"[] DEFAULT ARRAY['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH', 'VOUCHER']::"public"."PaymentMethods"[],
    "cardBrand" "public"."PaymentCardBrand"[] DEFAULT ARRAY['VISA', 'MASTERCARD', 'AMEX', 'ELO', 'HIPERCARD', 'OTHER']::"public"."PaymentCardBrand"[],
    "voucherBrand" "public"."PaymentVoucherBrand"[] DEFAULT ARRAY['ALELO', 'SODEXO', 'VR', 'BEN', 'VEROCHEQUE', 'OTHER']::"public"."PaymentVoucherBrand"[],

    CONSTRAINT "CompanyPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CompanyPayment" ADD CONSTRAINT "CompanyPayment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
