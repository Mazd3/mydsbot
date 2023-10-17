/*
  Warnings:

  - You are about to drop the column `playlistId` on the `Track` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_playlistId_fkey";

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "playlistId";

-- CreateTable
CREATE TABLE "TracksOnPlaylists" (
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TracksOnPlaylists_playlistId_key" ON "TracksOnPlaylists"("playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "TracksOnPlaylists_trackId_key" ON "TracksOnPlaylists"("trackId");

-- AddForeignKey
ALTER TABLE "TracksOnPlaylists" ADD CONSTRAINT "TracksOnPlaylists_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracksOnPlaylists" ADD CONSTRAINT "TracksOnPlaylists_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
