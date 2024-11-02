import { Item } from '../models/Item';
import pool from '../db/dbPool';
import { removeBackground, Config } from '@imgly/background-removal-node';
import path from 'path';
import logger from '../utils/logger';

const config: Config = {
  publicPath: `file://${path.resolve(`node_modules/@imgly/background-removal-node/dist/`)}/`,
  debug: true, // Set to false in production
  model: 'medium',
  output: {
    format: 'image/png',
    quality: 1,
  },
};

async function removeBackgroundFromUrl(imageUrl: string): Promise<string> {
  try {
    const blob = await removeBackground(imageUrl, config);
    const arrayBuffer = await blob.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    return `data:image/png;base64,${base64String}`;
  } catch (error) {
    logger.error('Error removing background from URL:', error);
    return imageUrl; // Return original URL if background removal fails
  }
}

async function removeBackgroundFromBase64(base64Image: string): Promise<string> {
  try {
    // Remove the data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: 'image/png' });
    
    // Remove background
    const processedBlob = await removeBackground(blob, config);
    
    // Convert processed blob back to base64
    const arrayBuffer = await processedBlob.arrayBuffer();
    const processedBase64 = Buffer.from(arrayBuffer).toString('base64');
    
    return `data:image/png;base64,${processedBase64}`;
  } catch (error) {
    logger.error('Error removing background from base64 image:', error);
    return base64Image;
  }
}

export const getItemsByUserId = async (userId: number): Promise<Item[]> => {
  const query = 'SELECT id, user_id, name, category, color, image_url, brand, price, commercial_link, created_at, updated_at FROM items WHERE user_id = $1';
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const getItemById = async (userId: number, itemId: number): Promise<Item | null> => {
  const query = 'SELECT id, user_id, name, category, color, image_url, brand, price, commercial_link, created_at, updated_at FROM items WHERE id = $1 AND user_id = $2';
  const { rows } = await pool.query(query, [itemId, userId]);
  return rows[0] || null;
};

export const createItem = async (userId: number, name: string, category: string, color: string, imageBase64: string, brand: string, price: number, commercialLink: string): Promise<Item> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const processedImageBase64 = await removeBackgroundFromBase64(imageBase64);
    
    const query = 'INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [userId, name, category, color, processedImageBase64, brand, price, commercialLink];
    const { rows } = await client.query(query, values);

    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateItem = async (
  userId: number,
  itemId: number,
  name: string,
  category: string,
  color: string,
  imageUrl: string,
  brand: string,
  price: number,
  commercialLink: string
): Promise<Item | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = `
      UPDATE items 
      SET name = $1, category = $2, color = $3, image_url = $4, brand = $5, price = $6, commercial_link = $7, updated_at = NOW()
      WHERE id = $8 AND user_id = $9 
      RETURNING *`;
    const values = [name, category, color, imageUrl, brand, price, commercialLink, itemId, userId];
    const { rows } = await client.query(query, values);

    await client.query('COMMIT');
    return rows[0] || null;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteItem = async (userId: number, itemId: number): Promise<Item | null> => {
  const query = 'DELETE FROM items WHERE id = $1 AND user_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [itemId, userId]);
  return rows[0] || null;
};
