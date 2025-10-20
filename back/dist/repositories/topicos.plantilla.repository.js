"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicosPlantillaRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class TopicosPlantillaRepository {
    constructor(prismaClient = prisma_1.default) {
        this.prismaClient = prismaClient;
    }
    async getTopicosByUnidadPlantilla(id_unidad_plantilla) {
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
    async getTopicoPlantillaById(id) {
        return await this.prismaClient.topicoPlantilla.findUnique({
            where: { id },
        });
    }
    async createTopicoPlantilla(data) {
        return await this.prismaClient.topicoPlantilla.create({
            data,
        });
    }
    async updateTopicoPlantilla(id, data) {
        return await this.prismaClient.topicoPlantilla.update({
            where: { id },
            data,
        });
    }
    async deleteTopicoPlantilla(id) {
        return await this.prismaClient.topicoPlantilla.update({
            where: { id },
            data: { activo: false },
        });
    }
    async getMaxOrden(id_unidad_plantilla) {
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
exports.TopicosPlantillaRepository = TopicosPlantillaRepository;
exports.default = new TopicosPlantillaRepository();
