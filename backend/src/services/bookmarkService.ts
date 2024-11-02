import pool from '../db/dbPool';
import { Post } from '../models/Post';

export const toggleBookmark = async (userId: number, postId: number): Promise<{ isBookmarked: boolean }> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if the bookmark exists
    const checkQuery = 'SELECT * FROM bookmarks WHERE user_id = $1 AND post_id = $2';
    const checkResult = await client.query(checkQuery, [userId, postId]);

    let isBookmarked: boolean;

    if (checkResult.rows.length > 0) {
      // Bookmark exists, so remove it
      const deleteQuery = 'DELETE FROM bookmarks WHERE user_id = $1 AND post_id = $2';
      await client.query(deleteQuery, [userId, postId]);

      const updateQuery = 'UPDATE posts SET bookmarks_count = bookmarks_count - 1 WHERE id = $1';
      await client.query(updateQuery, [postId]);

      isBookmarked = false;
    } else {
      // Bookmark doesn't exist, so add it
      const insertQuery = 'INSERT INTO bookmarks (user_id, post_id) VALUES ($1, $2)';
      await client.query(insertQuery, [userId, postId]);

      const updateQuery = 'UPDATE posts SET bookmarks_count = bookmarks_count + 1 WHERE id = $1';
      await client.query(updateQuery, [postId]);

      isBookmarked = true;
    }

    await client.query('COMMIT');
    return { isBookmarked };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getUserBookmarks = async (userId: number): Promise<Post[]> => {
  const query = `
    SELECT 
      p.*,
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
      ) as outfit,
      true as is_bookmarked,
      CASE WHEN pl.id IS NOT NULL THEN true ELSE false END as is_liked,
      CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_user_following
    FROM bookmarks b
    JOIN posts p ON b.post_id = p.id
    JOIN users u ON p.user_id = u.id
    LEFT JOIN outfits o ON p.outfit_id = o.id
    LEFT JOIN post_likes pl ON pl.post_id = p.id AND pl.user_id = $1
    LEFT JOIN follows f ON f.followed_id = p.user_id AND f.follower_id = $1
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};
