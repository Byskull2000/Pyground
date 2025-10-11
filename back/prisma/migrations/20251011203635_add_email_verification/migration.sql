-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "codigo_expiracion" TIMESTAMP(3),
ADD COLUMN     "codigo_verificacion" TEXT,
ADD COLUMN     "email_verificado" BOOLEAN NOT NULL DEFAULT false;
