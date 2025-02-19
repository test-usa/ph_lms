/*
  Warnings:

  - You are about to drop the column `courseId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `stripeChargeId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "courseId",
DROP COLUMN "status",
DROP COLUMN "stripeChargeId",
ADD COLUMN     "success" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_userId_key" ON "Payment"("userId");
