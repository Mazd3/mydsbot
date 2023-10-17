/*
  Warnings:

  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Track` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_playlistId_fkey";

-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Playlist_id_seq";

-- AlterTable
ALTER TABLE "Track" DROP CONSTRAINT "Track_pkey",
ALTER COLUMN "playlistId" SET DATA TYPE TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Track_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Track_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_id_key" ON "Playlist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Track_id_key" ON "Track"("id");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
