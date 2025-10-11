-- CreateEnum
CREATE TYPE "RolesEnum" AS ENUM ('ADMIN', 'ACADEMICO', 'USUARIO');

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "rol" "RolesEnum" NOT NULL DEFAULT 'USUARIO';
