-- CreateTable
CREATE TABLE "TopicoPlantilla" (
    "id" SERIAL NOT NULL,
    "id_unidad_plantilla" INTEGER NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "duracion_estimada" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "objetivos_aprendizaje" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TopicoPlantilla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topico" (
    "id" SERIAL NOT NULL,
    "id_unidad" INTEGER NOT NULL,
    "id_topico_plantilla" INTEGER,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "duracion_estimada" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "objetivos_aprendizaje" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Topico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TopicoPlantillaPrerequisitos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TopicoPrerequisitos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TopicoPlantillaPrerequisitos_AB_unique" ON "_TopicoPlantillaPrerequisitos"("A", "B");

-- CreateIndex
CREATE INDEX "_TopicoPlantillaPrerequisitos_B_index" ON "_TopicoPlantillaPrerequisitos"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TopicoPrerequisitos_AB_unique" ON "_TopicoPrerequisitos"("A", "B");

-- CreateIndex
CREATE INDEX "_TopicoPrerequisitos_B_index" ON "_TopicoPrerequisitos"("B");

-- AddForeignKey
ALTER TABLE "TopicoPlantilla" ADD CONSTRAINT "TopicoPlantilla_id_unidad_plantilla_fkey" FOREIGN KEY ("id_unidad_plantilla") REFERENCES "UnidadPlantilla"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_id_unidad_fkey" FOREIGN KEY ("id_unidad") REFERENCES "Unidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TopicoPlantillaPrerequisitos" ADD CONSTRAINT "_TopicoPlantillaPrerequisitos_A_fkey" FOREIGN KEY ("A") REFERENCES "TopicoPlantilla"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TopicoPlantillaPrerequisitos" ADD CONSTRAINT "_TopicoPlantillaPrerequisitos_B_fkey" FOREIGN KEY ("B") REFERENCES "TopicoPlantilla"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TopicoPrerequisitos" ADD CONSTRAINT "_TopicoPrerequisitos_A_fkey" FOREIGN KEY ("A") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TopicoPrerequisitos" ADD CONSTRAINT "_TopicoPrerequisitos_B_fkey" FOREIGN KEY ("B") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
