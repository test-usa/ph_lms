/*
  Warnings:

  - A unique constraint covering the columns `[contentId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentId` to the `Progress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "contentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Progress_contentId_key" ON "Progress"("contentId");

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
