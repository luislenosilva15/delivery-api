-- CreateEnum
CREATE TYPE "public"."DeliveryFeeType" AS ENUM ('FIXED', 'DISTANCE_BASED');

-- CreateTable
CREATE TABLE "public"."DeliveryFeeTier" (
    "id" SERIAL NOT NULL,
    "deliveryFeeId" INTEGER NOT NULL,
    "maxKm" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DeliveryFeeTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeliveryFee" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "type" "public"."DeliveryFeeType" NOT NULL DEFAULT 'FIXED',
    "fixedFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isFree" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DeliveryFee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryFee_companyId_key" ON "public"."DeliveryFee"("companyId");

-- AddForeignKey
ALTER TABLE "public"."DeliveryFeeTier" ADD CONSTRAINT "DeliveryFeeTier_deliveryFeeId_fkey" FOREIGN KEY ("deliveryFeeId") REFERENCES "public"."DeliveryFee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliveryFee" ADD CONSTRAINT "DeliveryFee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
