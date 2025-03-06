/*
  Warnings:

  - You are about to drop the column `contact` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Instructor` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "contact";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "thumbnail";

-- AlterTable
ALTER TABLE "Instructor" DROP COLUMN "contact";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "contact";
