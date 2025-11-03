-- DropForeignKey
ALTER TABLE "public"."Client" DROP CONSTRAINT "Client_companyId_fkey";

-- AlterTable
ALTER TABLE "public"."Client" ALTER COLUMN "companyId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."ClientCompany" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "lastOrder" TIMESTAMP(3),

    CONSTRAINT "ClientCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientCompany_clientId_companyId_key" ON "public"."ClientCompany"("clientId", "companyId");

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientCompany" ADD CONSTRAINT "ClientCompany_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientCompany" ADD CONSTRAINT "ClientCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
