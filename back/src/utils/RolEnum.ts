import { RolesEnum } from '../../generated/prisma';

export const stringToRolEnum = (rol: string): RolesEnum => {
  const upperRol = rol.toUpperCase() as keyof typeof RolesEnum;
  if (!(upperRol in RolesEnum)) {
    throw new Error(`Rol inválido: ${rol}`);
  }
  return RolesEnum[upperRol];
};

export const rolEnumToString = (rol: RolesEnum): string => {
  return rol.toString(); 
};
