import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

declare global {
    namespace Express {
      interface Request {
        user?: User;
      }
    }
}

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const userRole = req.body.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access forbidden. Your role is not allowed to access this endpoint.' });
    }

    next();
  };
};