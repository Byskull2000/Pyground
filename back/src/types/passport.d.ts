import { IUser } from './index';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface EmptyInterface {}
