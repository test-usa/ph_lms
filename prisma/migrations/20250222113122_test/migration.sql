/*
  Warnings:

  - You are about to drop the column `contentId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `moduleId` on the `QuizInstance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contentId]` on the table `QuizInstance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentId` to the `QuizInstance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_contentId_fkey";

-- DropForeignKey
ALTER TABLE "QuizInstance" DROP CONSTRAINT "QuizInstance_moduleId_fkey";

-- DropIndex
DROP INDEX "QuizInstance_moduleId_key";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "contentId";

-- AlterTable
ALTER TABLE "QuizInstance" DROP COLUMN "moduleId",
ADD COLUMN     "contentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QuizInstance_contentId_key" ON "QuizInstance"("contentId");

-- AddForeignKey
ALTER TABLE "QuizInstance" ADD CONSTRAINT "QuizInstance_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
