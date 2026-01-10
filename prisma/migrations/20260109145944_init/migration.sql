-- CreateEnum
CREATE TYPE "SourceName" AS ENUM ('IGDB', 'TMDB', 'OpenLibrary', 'Spotify', 'Discogs');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('VideoGame', 'BoardGame', 'Movie', 'TvShow', 'Book', 'MusicAlbum', 'MusicTrack');

-- CreateTable
CREATE TABLE "Emotion" (
    "id" SERIAL NOT NULL,
    "emoji" TEXT NOT NULL,
    "frenchTitle" TEXT NOT NULL,
    "englishTitle" TEXT NOT NULL,

    CONSTRAINT "Emotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "score" INTEGER,
    "content" TEXT,
    "workId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "WorkType" NOT NULL,
    "sourceName" "SourceName",
    "sourceUrl" TEXT,
    "authors" TEXT[],
    "publishers" TEXT[],
    "date" JSONB,
    "sourceCover" TEXT,
    "localCover" TEXT,
    "sourceScreenshots" TEXT[],

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EmotionToReview" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EmotionToReview_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Work_slug_key" ON "Work"("slug");

-- CreateIndex
CREATE INDEX "_EmotionToReview_B_index" ON "_EmotionToReview"("B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmotionToReview" ADD CONSTRAINT "_EmotionToReview_A_fkey" FOREIGN KEY ("A") REFERENCES "Emotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmotionToReview" ADD CONSTRAINT "_EmotionToReview_B_fkey" FOREIGN KEY ("B") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
