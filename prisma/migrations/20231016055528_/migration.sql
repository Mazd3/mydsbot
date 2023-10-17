/*
  Warnings:

  - The primary key for the `TracksOnPlaylists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[playlistId,trackId]` on the table `TracksOnPlaylists` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TracksOnPlaylists" DROP CONSTRAINT "playlist_track";

-- CreateIndex
CREATE UNIQUE INDEX "playlist_track" ON "TracksOnPlaylists"("playlistId", "trackId");
