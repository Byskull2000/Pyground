"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolEnumToString = exports.stringToRolEnum = void 0;
const prisma_1 = require("../../generated/prisma");
const stringToRolEnum = (rol) => {
    const upperRol = rol.toUpperCase();
    if (!(upperRol in prisma_1.RolesEnum)) {
        throw new Error(`Rol inválido: ${rol}`);
    }
    return prisma_1.RolesEnum[upperRol];
};
exports.stringToRolEnum = stringToRolEnum;
const rolEnumToString = (rol) => {
    return rol.toString();
};
exports.rolEnumToString = rolEnumToString;
