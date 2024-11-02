import { Request, Response } from 'express';
import { verifyGoogleToken, findOrCreateUser, generateToken } from '../services/authService';
import logger from '../utils/logger';

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    logger.info('Attempting Google login'); 
    const payload = await verifyGoogleToken(token);
    
    if (!payload) {
      logger.warn('Invalid Google token');
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { email, name } = payload;
    const user = await findOrCreateUser(email!, name!);

    const jwtToken = generateToken(user);
    logger.info(`User ${user.id} successfully logged in`);

    res.json({ token: jwtToken, user });
  } catch (error) {
    logger.error(`Google login error: ${(error as Error).message}`);
    res.status(401).json({ error: 'Invalid token' });
  }
};