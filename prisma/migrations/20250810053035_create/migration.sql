-- CreateEnum
CREATE TYPE "public"."ProductAvailabilityBy" AS ENUM ('DELIVERY', 'LOCAL');

-- CreateTable
CREATE TABLE "public"."MenuHours" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "menuGroupId" INTEGER,
    "alwaysOpen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MenuHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MenuGroup" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "menuId" INTEGER NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MenuGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Menu" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductHours" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "alwaysOpen" BOOLEAN NOT NULL DEFAULT false,
    "productId" INTEGER,

    CONSTRAINT "ProductHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "menuGroupId" INTEGER NOT NULL,
    "isAdultOnly" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "productAvailabilityBy" "public"."ProductAvailabilityBy" NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MenuHours" ADD CONSTRAINT "MenuHours_menuGroupId_fkey" FOREIGN KEY ("menuGroupId") REFERENCES "public"."MenuGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuGroup" ADD CONSTRAINT "MenuGroup_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Menu" ADD CONSTRAINT "Menu_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductHours" ADD CONSTRAINT "ProductHours_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_menuGroupId_fkey" FOREIGN KEY ("menuGroupId") REFERENCES "public"."MenuGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
