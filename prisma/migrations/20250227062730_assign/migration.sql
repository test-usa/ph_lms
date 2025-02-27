/*
  Warnings:

  - You are about to drop the column `fullMark` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `assuredMark` on the `AssignmentInstance` table. All the data in the column will be lost.
  - You are about to drop the column `isSubmitted` on the `AssignmentInstance` table. All the data in the column will be lost.
  - You are about to drop the column `assignment` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentInstanceId` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[moduleId]` on the table `AssignmentInstance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accruedMark` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullMark` to the `AssignmentInstance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `AssignmentInstance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_assignmentInstanceId_fkey";

-- DropIndex
DROP INDEX "Assignment_assignmentInstanceId_key";

-- DropIndex
DROP INDEX "Student_assignmentInstanceId_key";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "fullMark",
DROP COLUMN "title",
ADD COLUMN     "accruedMark" INTEGER NOT NULL,
ADD COLUMN     "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "studentId" TEXT;

-- AlterTable
ALTER TABLE "AssignmentInstance" DROP COLUMN "assuredMark",
DROP COLUMN "isSubmitted",
ADD COLUMN     "fullMark" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "assignment";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "assignmentInstanceId";

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentInstance_moduleId_key" ON "AssignmentInstance"("moduleId");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
