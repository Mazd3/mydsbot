-- DropIndex
DROP INDEX "TracksOnPlaylists_playlistId_trackId_key";

-- AlterTable
ALTER TABLE "TracksOnPlaylists" ADD CONSTRAINT "TracksOnPlaylists_pkey" PRIMARY KEY ("playlistId", "trackId");
