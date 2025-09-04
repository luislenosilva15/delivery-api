-- AlterTable
ALTER TABLE "public"."CompanyPayment" ADD COLUMN     "documentInTicket" BOOLEAN DEFAULT false,
ADD COLUMN     "requiredDocument" BOOLEAN DEFAULT false;
