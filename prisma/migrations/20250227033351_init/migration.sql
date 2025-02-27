/*
  Warnings:

  - You are about to drop the column `email` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Instructor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Instructor` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.
  - Added the required column `assuredMark` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Admin_email_key";

-- DropIndex
DROP INDEX "Instructor_email_key";

-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "email",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "assuredMark" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Instructor" DROP COLUMN "email",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "email",
DROP COLUMN "name";
