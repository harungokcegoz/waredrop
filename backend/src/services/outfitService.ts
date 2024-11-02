import { Outfit } from '../models/Outfit.d';
import pool from '../db/dbPool';
import logger from '../utils/logger';

export const getOutfitsByUserId = async (userId: number): Promise<Outfit[]> => {
  const query = `
    SELECT o.*,
           COALESCE(
             array_agg(
               row_to_json(i)
             ) FILTER (WHERE i.id IS NOT NULL),
             ARRAY[]::json[]
           ) as items
    FROM outfits o
    LEFT JOIN LATERAL unnest(o.item_ids) AS item_id ON true
    LEFT JOIN items i ON i.id = item_id
    WHERE o.user_id = $1
    GROUP BY o.id
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows.map(row => ({
    ...row,
    items: row.items || []
  }));
};

export const getOutfitById = async (outfitId: number, userId: number): Promise<Outfit | null> => {
  const query = `
    SELECT o.*,
           COALESCE(
             array_agg(
               row_to_json(i)
             ) FILTER (WHERE i.id IS NOT NULL),
             ARRAY[]::json[]
           ) as items
    FROM outfits o
    LEFT JOIN LATERAL unnest(o.item_ids) AS item_id ON true
    LEFT JOIN items i ON i.id = item_id
    WHERE o.id = $1 AND o.user_id = $2
    GROUP BY o.id
  `;

  try {
    const { rows } = await pool.query(query, [outfitId, userId]);

    if (rows.length === 0) {
      return null;
    }

    return {
      ...rows[0],
      items: rows[0].items || []
    };
  } catch (error) {
    logger.error('Error fetching outfit by ID:', error);
    throw error;
  }
};

export const createOutfit = async (userId: number, name: string, tags: string[], itemIds: number[]): Promise<Outfit> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const outfitQuery = 'INSERT INTO outfits (user_id, name, tags, item_ids) VALUES ($1, $2, $3, $4) RETURNING *';
    const outfitValues = [userId, name, tags, itemIds];
    const { rows: [outfit] } = await client.query(outfitQuery, outfitValues);

    const itemsQuery = 'SELECT * FROM items WHERE id = ANY($1::int[])';
    const { rows: items } = await client.query(itemsQuery, [itemIds]);

    await client.query('COMMIT');
    return { ...outfit, items };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateOutfit = async (userId: number, outfitId: number, name: string, tags: string[], itemIds: number[]): Promise<Outfit> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const updateQuery = 'UPDATE outfits SET name = $1, tags = $2, item_ids = $3 WHERE id = $4 AND user_id = $5 RETURNING *';
    const { rows: [outfit] } = await client.query(updateQuery, [name, tags, itemIds, outfitId, userId]);
    
    if (!outfit) {
      throw new Error('Outfit not found or user does not have permission');
    }

    const itemsQuery = 'SELECT * FROM items WHERE id = ANY($1::int[])';
    const { rows: items } = await client.query(itemsQuery, [itemIds]);

    await client.query('COMMIT');
    return { ...outfit, items };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteOutfit = async (userId: number, outfitId: number): Promise<Outfit | null> => {
  const query = 'DELETE FROM outfits WHERE id = $1 AND user_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [outfitId, userId]);
  return rows[0] || null;
};