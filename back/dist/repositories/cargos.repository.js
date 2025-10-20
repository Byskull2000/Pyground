"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCargoById = exports.getCargoByNombre = exports.getCargos = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getCargos = async () => {
    return prisma_1.default.cargo.findMany();
};
exports.getCargos = getCargos;
const getCargoByNombre = async (nombre) => {
    return prisma_1.default.cargo.findUnique({
        where: { nombre },
    });
};
exports.getCargoByNombre = getCargoByNombre;
const getCargoById = async (id) => {
    return prisma_1.default.cargo.findUnique({
        where: { id },
    });
};
exports.getCargoById = getCargoById;
