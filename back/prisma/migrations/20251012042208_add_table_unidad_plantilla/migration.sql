-- CreateTable
CREATE TABLE "UnidadPlantilla" (
    "id" SERIAL NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "icono" VARCHAR(100),
    "color" VARCHAR(20),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UnidadPlantilla_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UnidadPlantilla" ADD CONSTRAINT "UnidadPlantilla_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
