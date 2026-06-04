/*
  Warnings:

  - The values [PENDING,APPROVED,REJECTED,SUSPENDED] on the enum `SellerStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `phone` on the `customers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SellerStatus_new" AS ENUM ('pending', 'approved', 'rejected', 'suspended');
ALTER TABLE "Seller" ALTER COLUMN "status" TYPE "SellerStatus_new" USING ("status"::text::"SellerStatus_new");
ALTER TYPE "SellerStatus" RENAME TO "SellerStatus_old";
ALTER TYPE "SellerStatus_new" RENAME TO "SellerStatus";
DROP TYPE "public"."SellerStatus_old";
COMMIT;

-- DropIndex
DROP INDEX "customers_phone_key";

-- AlterTable
ALTER TABLE "Seller" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
