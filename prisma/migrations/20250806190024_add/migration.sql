-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "isAlwaysOpening" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."OpeningHour" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "OpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpeningHour_companyId_dayOfWeek_idx" ON "public"."OpeningHour"("companyId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "public"."OpeningHour" ADD CONSTRAINT "OpeningHour_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
