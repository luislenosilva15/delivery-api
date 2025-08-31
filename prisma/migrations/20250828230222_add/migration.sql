-- CreateEnum
CREATE TYPE "public"."AvailabilityStatus" AS ENUM ('DELIVERY', 'LOCAL');

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "availability" "public"."AvailabilityStatus"[] DEFAULT ARRAY['DELIVERY', 'LOCAL']::"public"."AvailabilityStatus"[];
