/*
  Warnings:

  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Playlist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `playlistId` column on the `Track` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_playlistId_fkey";

-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "playlistId",
ADD COLUMN     "playlistId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_id_key" ON "Playlist"("id");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
