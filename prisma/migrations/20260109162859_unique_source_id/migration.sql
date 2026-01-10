/*
  Warnings:

  - A unique constraint covering the columns `[sourceName,sourceId]` on the table `Work` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Work_sourceName_sourceId_key" ON "Work"("sourceName", "sourceId");
