/*
  Warnings:

  - You are about to drop the column `stripeChargeId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[intendKey]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `intendKey` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "stripeChargeId",
ADD COLUMN     "intendKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_intendKey_key" ON "Payment"("intendKey");
