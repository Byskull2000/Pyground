-- CreateEnum
CREATE TYPE "TipoContenidoEnum" AS ENUM ('TEXTO', 'IMAGEN', 'VIDEO', 'AUDIO', 'TRANSCRIPCION', 'PDF', 'ARCHIVO');

-- CreateTable
CREATE TABLE "PlantillaVista" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "cantidad_textos" INTEGER NOT NULL DEFAULT 0,
    "cantidad_imagenes" INTEGER NOT NULL DEFAULT 0,
    "cantidad_videos" INTEGER NOT NULL DEFAULT 0,
    "cantidad_audios" INTEGER NOT NULL DEFAULT 0,
    "cantidad_archivos" INTEGER NOT NULL DEFAULT 0,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantillaVista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicoVista" (
    "id" SERIAL NOT NULL,
    "id_topico" INTEGER NOT NULL,
    "id_plantilla_vista" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TopicoVista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contenido" (
    "id" SERIAL NOT NULL,
    "id_topico_vista" INTEGER NOT NULL,
    "tipo" "TipoContenidoEnum" NOT NULL,
    "texto" TEXT,
    "enlace_archivo" VARCHAR(500),
    "titulo" VARCHAR(200),
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 1,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3),

    CONSTRAINT "Contenido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlantillaVista_nombre_key" ON "PlantillaVista"("nombre");

-- AddForeignKey
ALTER TABLE "TopicoVista" ADD CONSTRAINT "TopicoVista_id_topico_fkey" FOREIGN KEY ("id_topico") REFERENCES "Topico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicoVista" ADD CONSTRAINT "TopicoVista_id_plantilla_vista_fkey" FOREIGN KEY ("id_plantilla_vista") REFERENCES "PlantillaVista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contenido" ADD CONSTRAINT "Contenido_id_topico_vista_fkey" FOREIGN KEY ("id_topico_vista") REFERENCES "TopicoVista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
