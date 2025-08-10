-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isAlwaysOpening" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "temporaryClosed" BOOLEAN NOT NULL DEFAULT false;
