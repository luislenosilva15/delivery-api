-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "paymentCardBrand" DROP NOT NULL,
ALTER COLUMN "paymentDebitCardBrand" DROP NOT NULL,
ALTER COLUMN "paymentVoucherBrand" DROP NOT NULL;
