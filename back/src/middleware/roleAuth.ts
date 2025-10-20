//  back/src/middleware/roleAuth.ts
import { Request, Response, NextFunction } from 'express';
import { RolesEnum } from '@/types/roles';
import { ApiResponse } from '../utils/apiResponse';

export const requireRoles = (allowedRoles: RolesEnum[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json(
          new ApiResponse(false, null, 'No autorizado')
        );
      }

      const userRole = req.user.rol as RolesEnum;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json(
          new ApiResponse(false, null, 'No tiene permisos para realizar esta acción')
        );
      }

      next();
    } catch (error) {
      console.error('Error en middleware de roles:', error);
      return res.status(500).json(
        new ApiResponse(false, null, 'Error al verificar permisos')
      );
    }
  };
};

// Middleware para rutas que requieren ser el propietario o admin
export const requireOwnershipOrAdmin = (paramName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json(
          new ApiResponse(false, null, 'No autorizado')
        );
      }

      const resourceId = parseInt(req.params[paramName]);
      const userRole = req.user.rol as RolesEnum;
      const userId = req.user.id;

      // Los admins siempre tienen acceso
      if (userRole === RolesEnum.ADMIN) {
        return next();
      }

      // Para otros roles, verificar si son propietarios del recurso
      if (userId === resourceId) {
        return next();
      }

      return res.status(403).json(
        new ApiResponse(false, null, 'No tiene permisos para realizar esta acción')
      );
    } catch (error) {
      console.error('Error en middleware de propiedad:', error);
      return res.status(500).json(
        new ApiResponse(false, null, 'Error al verificar permisos')
      );
    }
  };
};