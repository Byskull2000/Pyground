/*
  Warnings:

  - You are about to drop the column `id_topico_vista` on the `Contenido` table. All the data in the column will be lost.
  - You are about to drop the `PlantillaVista` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopicoVista` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_topico` to the `Contenido` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contenido" DROP CONSTRAINT "Contenido_id_topico_vista_fkey";

-- DropForeignKey
ALTER TABLE "TopicoVista" DROP CONSTRAINT "TopicoVista_id_plantilla_vista_fkey";

-- DropForeignKey
ALTER TABLE "TopicoVista" DROP CONSTRAINT "TopicoVista_id_topico_fkey";

-- AlterTable
ALTER TABLE "Contenido" DROP COLUMN "id_topico_vista",
ADD COLUMN     "id_topico" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PlantillaVista";

-- DropTable
DROP TABLE "TopicoVista";

-- AddForeignKey
ALTER TABLE "Contenido" ADD CONSTRAINT "Contenido_id_topico_fkey" FOREIGN KEY ("id_topico") REFERENCES "Topico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
