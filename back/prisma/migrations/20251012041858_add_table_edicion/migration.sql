-- CreateTable
CREATE TABLE "Edicion" (
    "id" SERIAL NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "nombre_edicion" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "fecha_apertura" TIMESTAMP(3) NOT NULL,
    "fecha_cierre" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creado_por" VARCHAR(100) NOT NULL,

    CONSTRAINT "Edicion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Edicion" ADD CONSTRAINT "Edicion_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
