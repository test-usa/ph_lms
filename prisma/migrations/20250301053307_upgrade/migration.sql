/*
  Warnings:

  - You are about to drop the column `accruedMark` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentInstanceId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `isSubmitted` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `acquiredMark` on the `QuizInstance` table. All the data in the column will be lost.
  - You are about to drop the column `isSubmitted` on the `QuizInstance` table. All the data in the column will be lost.
  - You are about to drop the `AssignmentInstance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Classroom` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[contentId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalMark` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Made the column `moduleId` on table `Content` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Instructor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `courseId` on table `Module` required. This step will fail if there are existing NULL values in that column.
  - Made the column `correctAnswer` on table `Quiz` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quizInstanceId` on table `Quiz` required. This step will fail if there are existing NULL values in that column.
  - Made the column `courseId` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_assignmentInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentInstance" DROP CONSTRAINT "AssignmentInstance_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Instructor" DROP CONSTRAINT "Instructor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_quizInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_courseId_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "accruedMark",
DROP COLUMN "assignmentInstanceId",
DROP COLUMN "file",
DROP COLUMN "isSubmitted",
DROP COLUMN "studentId",
ADD COLUMN     "contentId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "totalMark" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "moduleId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Instructor" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "courseId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "correctAnswer" SET NOT NULL,
ALTER COLUMN "quizInstanceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "QuizInstance" DROP COLUMN "acquiredMark",
DROP COLUMN "isSubmitted";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "courseId" SET NOT NULL;

-- DropTable
DROP TABLE "AssignmentInstance";

-- DropTable
DROP TABLE "Classroom";

-- CreateTable
CREATE TABLE "QuizSubmission" (
    "id" TEXT NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "incorrectAnswers" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "quizInstanceId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "QuizSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSubmission" (
    "id" TEXT NOT NULL,
    "submission" TEXT NOT NULL,
    "acquiredMark" INTEGER NOT NULL DEFAULT 0,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizSubmission_quizInstanceId_studentId_key" ON "QuizSubmission"("quizInstanceId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentSubmission_assignmentId_studentId_key" ON "AssignmentSubmission"("assignmentId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_contentId_key" ON "Assignment"("contentId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_quizInstanceId_fkey" FOREIGN KEY ("quizInstanceId") REFERENCES "QuizInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSubmission" ADD CONSTRAINT "QuizSubmission_quizInstanceId_fkey" FOREIGN KEY ("quizInstanceId") REFERENCES "QuizInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSubmission" ADD CONSTRAINT "QuizSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
