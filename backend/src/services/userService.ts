import { User } from '../models/User';
import pool from '../db/dbPool';
import { Post } from '../models/Post';

export const getAllUsers = async (): Promise<User[]> => {
  const query = 'SELECT id, email, name, google_id, profile_picture_url, created_at, updated_at FROM users';
  const { rows } = await pool.query(query);
  return rows;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const query = 'SELECT id, email, name, google_id, profile_picture_url, role, created_at, updated_at FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

export const updateUser = async (id: number, name: string, email: string): Promise<User | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = 'UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING *';
    const values = [name, email, id];
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

export const deleteUser = async (id: number): Promise<User | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await client.query(query, [id]);

    await client.query('COMMIT');
    return rows[0] || null;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getUserStats = async (userId: number): Promise<{ 
  totalLikes: number; 
  totalBookmarks: number; 
  totalShares: number; 
  followers: number; 
  following: number;
  posts: number;
}> => {
  const query = `
    SELECT 
      COALESCE(SUM(p.likes_count), 0) AS "totalLikes",
      COALESCE(SUM(p.bookmarks_count), 0) AS "totalBookmarks",
      COALESCE(SUM(p.shares_count), 0) AS "totalShares",
      (SELECT COUNT(*) FROM follows WHERE followed_id = $1) AS "followersCount",
      (SELECT COUNT(*) FROM follows WHERE follower_id = $1) AS "followingCount",
      COUNT(p.id) AS "totalPosts"
    FROM posts p
    WHERE p.user_id = $1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

export const getUserPosts = async (userId: number): Promise<Post[]> => {
  const query = `
    SELECT 
      p.id, 
      p.outfit_id, 
      p.likes_count, 
      p.shares_count, 
      p.bookmarks_count,
      p.created_at,
      p.updated_at,
      p.shared_post_id,
      EXISTS (
        SELECT 1 FROM bookmarks b 
        WHERE b.post_id = p.id AND b.user_id = $1
      ) AS is_bookmarked,
      json_build_object(
        'id', u.id,
        'email', u.email,
        'name', u.name,
        'role', u.role,
        'profile_picture_url', u.profile_picture_url,
        'google_id', u.google_id,
        'created_at', u.created_at,
        'updated_at', u.updated_at
      ) as user,
      json_build_object(
        'id', o.id,
        'user_id', o.user_id,
        'name', o.name,
        'tags', o.tags,
        'items', (
          SELECT json_agg(json_build_object(
            'id', i.id,
            'user_id', i.user_id,
            'name', i.name,
            'category', i.category,
            'color', i.color,
            'image_url', i.image_url,
            'brand', i.brand,
            'price', i.price,
            'commercial_link', i.commercial_link,
            'created_at', i.created_at,
            'updated_at', i.updated_at
          ))
          FROM unnest(o.item_ids) item_id
          JOIN items i ON i.id = item_id
        ),
        'created_at', o.created_at,
        'updated_at', o.updated_at
      ) as outfit
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN outfits o ON p.outfit_id = o.id
    WHERE p.user_id = $1
    ORDER BY p.created_at DESC
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};
