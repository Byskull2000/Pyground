-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "id_topico" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "fecha_publicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visto" (
    "id" SERIAL NOT NULL,
    "id_comentario" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fue_visto" BOOLEAN NOT NULL DEFAULT true,
    "fecha_visto" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_id_topico_fkey" FOREIGN KEY ("id_topico") REFERENCES "Topico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visto" ADD CONSTRAINT "Visto_id_comentario_fkey" FOREIGN KEY ("id_comentario") REFERENCES "Comentario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visto" ADD CONSTRAINT "Visto_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
