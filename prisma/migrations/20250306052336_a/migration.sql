/*
  Warnings:

  - Added the required column `deadline` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionStatus` to the `AssignmentSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionTime` to the `AssignmentSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('LATE', 'ONTIME');

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AssignmentSubmission" ADD COLUMN     "submissionStatus" "SubmissionStatus" NOT NULL,
ADD COLUMN     "submissionTime" TIMESTAMP(3) NOT NULL;
