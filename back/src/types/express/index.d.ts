import { RolesEnum } from '../roles';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      rol: RolesEnum;
    }
  }
}