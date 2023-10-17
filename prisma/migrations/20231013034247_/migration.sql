/*
  Warnings:

  - The primary key for the `Track` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Track` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Track" DROP CONSTRAINT "Track_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Track_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Track_id_key" ON "Track"("id");
