-- CreateEnum
CREATE TYPE "public"."CuisineType" AS ENUM ('PIZZERIA', 'PASTA', 'JAPANESE', 'BURGER', 'VEGAN', 'BBQ', 'SEAFOOD', 'SUSHI', 'CHINESE', 'INDIAN', 'MEXICAN', 'THAI', 'ARABIC', 'BAKERY', 'CAFE', 'FASTFOOD', 'HEALTHY', 'DESSERT', 'STEAKHOUSE', 'BRAZILIAN', 'OTHERS');

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "cuisineType" "public"."CuisineType" NOT NULL DEFAULT 'OTHERS';
