-- CreateEnum
CREATE TYPE "public"."PaymentDebitCardBrand" AS ENUM ('VISA', 'MASTERCARD', 'AMEX', 'ELO', 'HIPERCARD', 'OTHER');

-- AlterTable
ALTER TABLE "public"."CompanyPayment" ADD COLUMN     "debitCardBrand" "public"."PaymentDebitCardBrand"[] DEFAULT ARRAY['VISA', 'MASTERCARD', 'AMEX', 'ELO', 'HIPERCARD', 'OTHER']::"public"."PaymentDebitCardBrand"[];
