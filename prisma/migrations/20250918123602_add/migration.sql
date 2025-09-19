-- CreateTable
CREATE TABLE "public"."OrderDeliveryAddress" (
    "id" SERIAL NOT NULL,
    "cep" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "reference" TEXT,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "OrderDeliveryAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderDeliveryAddress_orderId_key" ON "public"."OrderDeliveryAddress"("orderId");

-- AddForeignKey
ALTER TABLE "public"."OrderDeliveryAddress" ADD CONSTRAINT "OrderDeliveryAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
