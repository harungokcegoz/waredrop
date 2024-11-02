import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { User } from '../models/User';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) {
        return next(new AppError('Forbidden', 403));
      }
      req.body.user = user as User;
      
      next();
    });
  } else {
    next(new AppError('Unauthorized', 401));
  }
};
