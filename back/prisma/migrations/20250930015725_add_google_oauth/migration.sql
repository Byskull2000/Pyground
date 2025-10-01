/*
  Warnings:

  - A unique constraint covering the columns `[google_id]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "google_id" TEXT,
ADD COLUMN     "provider" TEXT DEFAULT 'local';

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_google_id_key" ON "public"."Usuario"("google_id");
