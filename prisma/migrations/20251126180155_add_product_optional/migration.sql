-- CreateEnum
CREATE TYPE "public"."OptionalType" AS ENUM ('SIMPLE', 'OPTIONS');

-- CreateTable
CREATE TABLE "public"."Optional" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."OptionalType" NOT NULL,
    "code" TEXT,
    "price" DOUBLE PRECISION,
    "minSelections" INTEGER,
    "maxSelections" INTEGER,
    "canRepeat" BOOLEAN NOT NULL DEFAULT false,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "menuId" INTEGER NOT NULL,

    CONSTRAINT "Optional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OptionalOption" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "code" TEXT,
    "optionalId" INTEGER NOT NULL,

    CONSTRAINT "OptionalOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductOptional" (
    "productId" INTEGER NOT NULL,
    "optionalId" INTEGER NOT NULL,

    CONSTRAINT "ProductOptional_pkey" PRIMARY KEY ("productId","optionalId")
);

-- CreateIndex
CREATE INDEX "Optional_menuId_idx" ON "public"."Optional"("menuId");

-- CreateIndex
CREATE INDEX "OptionalOption_optionalId_idx" ON "public"."OptionalOption"("optionalId");

-- AddForeignKey
ALTER TABLE "public"."Optional" ADD CONSTRAINT "Optional_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OptionalOption" ADD CONSTRAINT "OptionalOption_optionalId_fkey" FOREIGN KEY ("optionalId") REFERENCES "public"."Optional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductOptional" ADD CONSTRAINT "ProductOptional_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductOptional" ADD CONSTRAINT "ProductOptional_optionalId_fkey" FOREIGN KEY ("optionalId") REFERENCES "public"."Optional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
