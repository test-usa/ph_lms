/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payment_studentId_key" ON "Payment"("studentId");
