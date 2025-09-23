import { IUser } from './index';

declare global {
  namespace Express {
    interface User extends IUser {}
    
    interface Request {
      user?: IUser;
    }
  }
}

declare module 'passport' {
  interface AuthenticateOptions {
    failureRedirect?: string;
    successRedirect?: string;
  }
}