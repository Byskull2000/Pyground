/*
  Warnings:

  - You are about to drop the column `publicado` on the `Unidad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Edicion" ADD COLUMN     "estado_publicado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Unidad" DROP COLUMN "publicado",
ADD COLUMN     "estado_publicado" BOOLEAN NOT NULL DEFAULT false;
