/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Course` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_paymentId_fkey";

-- DropIndex
DROP INDEX "Course_paymentId_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "paymentId";

-- CreateTable
CREATE TABLE "_CourseToPayment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToPayment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseToPayment_B_index" ON "_CourseToPayment"("B");

-- AddForeignKey
ALTER TABLE "_CourseToPayment" ADD CONSTRAINT "_CourseToPayment_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToPayment" ADD CONSTRAINT "_CourseToPayment_B_fkey" FOREIGN KEY ("B") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
