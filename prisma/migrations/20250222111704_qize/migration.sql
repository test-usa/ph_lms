/*
  Warnings:

  - You are about to drop the column `moduleId` on the `Quiz` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_moduleId_fkey";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "moduleId",
ADD COLUMN     "quizInstanceId" TEXT;

-- CreateTable
CREATE TABLE "QuizInstance" (
    "id" TEXT NOT NULL,
    "totalMark" INTEGER NOT NULL,
    "acquiredMark" INTEGER NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "QuizInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizInstance_moduleId_key" ON "QuizInstance"("moduleId");

-- AddForeignKey
ALTER TABLE "QuizInstance" ADD CONSTRAINT "QuizInstance_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_quizInstanceId_fkey" FOREIGN KEY ("quizInstanceId") REFERENCES "QuizInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
