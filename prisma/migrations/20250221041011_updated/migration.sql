/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Instructor" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isDeleted";
