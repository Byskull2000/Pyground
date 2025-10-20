// back/src/repositories/topicos.plantilla.repository.ts
import { PrismaClient } from '@prisma/client';
import prisma from '../config/prisma';

export class TopicosPlantillaRepository {
  constructor(private prismaClient: PrismaClient = prisma) {}

  async getTopicosByUnidadPlantilla(id_unidad_plantilla: number) {
    return await this.prismaClient.topicoPlantilla.findMany({
      where: {
        id_unidad_plantilla,
        activo: true,
      },
      orderBy: {
        orden: 'asc',
      },
    });
  }

  async getTopicoPlantillaById(id: number) {
    return await this.prismaClient.topicoPlantilla.findUnique({
      where: { id },
    });
  }

  async createTopicoPlantilla(data: {
    id_unidad_plantilla: number;
    titulo: string;
    descripcion?: string;
    duracion_estimada: number;
    orden: number;
    version: number;
    publicado?: boolean;
    objetivos_aprendizaje?: string;
    activo?: boolean;
  }) {
    return await this.prismaClient.topicoPlantilla.create({
      data,
    });
  }

  async updateTopicoPlantilla(
    id: number,
    data: {
      titulo?: string;
      descripcion?: string;
      duracion_estimada?: number;
      orden?: number;
      version?: number;
      publicado?: boolean;
      objetivos_aprendizaje?: string;
      activo?: boolean;
    },
  ) {
    return await this.prismaClient.topicoPlantilla.update({
      where: { id },
      data,
    });
  }

  async deleteTopicoPlantilla(id: number) {
    return await this.prismaClient.topicoPlantilla.update({
      where: { id },
      data: { activo: false },
    });
  }

  async getMaxOrden(id_unidad_plantilla: number): Promise<number> {
    const result = await this.prismaClient.topicoPlantilla.findFirst({
      where: {
        id_unidad_plantilla,
        activo: true,
      },
      orderBy: {
        orden: 'desc',
      },
      select: {
        orden: true,
      },
    });

    return result?.orden ?? 0;
  }
}

export default new TopicosPlantillaRepository();