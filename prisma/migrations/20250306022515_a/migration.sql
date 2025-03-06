/*
  Warnings:

  - You are about to drop the column `phone` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Instructor` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "phone",
ADD COLUMN     "contact" TEXT;

-- AlterTable
ALTER TABLE "Instructor" DROP COLUMN "phone",
ADD COLUMN     "contact" TEXT;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "phone",
ADD COLUMN     "contact" TEXT;
