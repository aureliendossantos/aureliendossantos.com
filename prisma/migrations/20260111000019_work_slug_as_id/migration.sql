/*
  Warnings:

  - The primary key for the `Work` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `slug` on the `Work` table. All the data in the column will be lost.
  - Made the column `score` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_workId_fkey";

-- DropIndex
DROP INDEX "Work_slug_key";

-- AlterTable
ALTER TABLE "Emotion" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Emotion_id_seq";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "workId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Work" DROP CONSTRAINT "Work_pkey",
DROP COLUMN "slug",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Work_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Work_id_seq";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
