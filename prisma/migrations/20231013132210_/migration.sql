-- DropIndex
DROP INDEX "TracksOnPlaylists_playlistId_key";

-- DropIndex
DROP INDEX "TracksOnPlaylists_trackId_key";

-- AlterTable
ALTER TABLE "TracksOnPlaylists" ADD CONSTRAINT "TracksOnPlaylists_pkey" PRIMARY KEY ("playlistId", "trackId");
