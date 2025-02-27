/*
  Warnings:

  - You are about to drop the column `assuredMark` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `isSubmitted` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `moduleId` on the `Assignment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assignmentInstanceId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assignmentInstanceId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullMark` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_moduleId_fkey";

-- DropIndex
DROP INDEX "Assignment_moduleId_key";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "assuredMark",
DROP COLUMN "isSubmitted",
DROP COLUMN "moduleId",
ADD COLUMN     "assignmentInstanceId" TEXT,
ADD COLUMN     "fullMark" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "assignmentInstanceId" TEXT;

-- CreateTable
CREATE TABLE "AssignmentInstance" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "assuredMark" INTEGER NOT NULL,

    CONSTRAINT "AssignmentInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_assignmentInstanceId_key" ON "Assignment"("assignmentInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_assignmentInstanceId_key" ON "Student"("assignmentInstanceId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_assignmentInstanceId_fkey" FOREIGN KEY ("assignmentInstanceId") REFERENCES "AssignmentInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentInstance" ADD CONSTRAINT "AssignmentInstance_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_assignmentInstanceId_fkey" FOREIGN KEY ("assignmentInstanceId") REFERENCES "AssignmentInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
