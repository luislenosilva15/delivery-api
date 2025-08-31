-- CreateEnum
CREATE TYPE "public"."PaymentMethods" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH', 'VOUCHER');

-- CreateEnum
CREATE TYPE "public"."PaymentCardBrand" AS ENUM ('VISA', 'MASTERCARD', 'AMEX', 'ELO', 'HIPERCARD', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PaymentVoucherBrand" AS ENUM ('ALELO', 'SODEXO', 'VR', 'BEN', 'VEROCHEQUE', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "paymentCardBrand" "public"."PaymentCardBrand"[] DEFAULT ARRAY['VISA', 'MASTERCARD', 'AMEX', 'ELO', 'HIPERCARD', 'OTHER']::"public"."PaymentCardBrand"[],
ADD COLUMN     "paymentMethodAvailable" "public"."PaymentMethods"[] DEFAULT ARRAY['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH']::"public"."PaymentMethods"[],
ADD COLUMN     "paymentVoucherBrand" "public"."PaymentVoucherBrand"[] DEFAULT ARRAY['ALELO', 'SODEXO', 'VR', 'BEN', 'VEROCHEQUE', 'OTHER']::"public"."PaymentVoucherBrand"[];
