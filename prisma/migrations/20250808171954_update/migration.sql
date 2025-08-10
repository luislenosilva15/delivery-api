-- DropIndex
DROP INDEX "public"."OpeningHour_companyId_dayOfWeek_idx";

-- CreateIndex
CREATE INDEX "OpeningHour_companyId_idx" ON "public"."OpeningHour"("companyId");
