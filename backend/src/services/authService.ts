import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import pool from '../db/dbPool';
import { User } from '../models/User';
import logger from '../utils/logger';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  logger.info("Payload from Google:", payload); 
  return payload;
};

export const findOrCreateUser = async (email: string, name: string): Promise<User> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const selectQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await client.query(selectQuery, [email]);

    if (rows.length > 0) {
      await client.query('COMMIT');
      return rows[0];
    }

    const insertQuery = 'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *';
    const { rows: newRows } = await client.query(insertQuery, [email, name]);
    await client.query('COMMIT');
    return newRows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const generateToken = (user: User) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role
    }, 
    process.env.JWT_SECRET!, 
    { expiresIn: '1d' }
  );
};
