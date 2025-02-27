/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone";
