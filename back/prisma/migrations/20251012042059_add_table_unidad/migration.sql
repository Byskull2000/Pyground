-- CreateTable
CREATE TABLE "Unidad" (
    "id" SERIAL NOT NULL,
    "id_edicion" INTEGER NOT NULL,
    "id_unidad_plantilla" INTEGER,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL,
    "icono" VARCHAR(100),
    "color" VARCHAR(20),
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3),

    CONSTRAINT "Unidad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Unidad" ADD CONSTRAINT "Unidad_id_edicion_fkey" FOREIGN KEY ("id_edicion") REFERENCES "Edicion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
