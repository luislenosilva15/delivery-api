-- DropForeignKey
ALTER TABLE "public"."MenuGroup" DROP CONSTRAINT "MenuGroup_menuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MenuHours" DROP CONSTRAINT "MenuHours_menuGroupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_menuGroupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductHours" DROP CONSTRAINT "ProductHours_productId_fkey";

-- AddForeignKey
ALTER TABLE "public"."MenuHours" ADD CONSTRAINT "MenuHours_menuGroupId_fkey" FOREIGN KEY ("menuGroupId") REFERENCES "public"."MenuGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuGroup" ADD CONSTRAINT "MenuGroup_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductHours" ADD CONSTRAINT "ProductHours_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_menuGroupId_fkey" FOREIGN KEY ("menuGroupId") REFERENCES "public"."MenuGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
