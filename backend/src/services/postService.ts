import { Post } from '../models/Post.d';
import pool from '../db/dbPool';

export const createPost = async (userId: number, outfitId: number): Promise<Post> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = `
      WITH inserted_post AS (
        INSERT INTO posts (user_id, outfit_id) 
        VALUES ($1, $2) 
        RETURNING *
      )
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
        ) as outfit
      FROM inserted_post p
      JOIN users u ON p.user_id = u.id
      JOIN outfits o ON p.outfit_id = o.id`;
    const values = [userId, outfitId];
    const { rows: [post] } = await client.query(query, values);

    await client.query('COMMIT');
    return post;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getPostById = async (postId: number, userId?: number): Promise<Post | null> => {
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
      CASE WHEN pl.id IS NOT NULL THEN true ELSE false END as is_liked,
      CASE WHEN b.id IS NOT NULL THEN true ELSE false END as is_bookmarked,
      CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_user_following
    FROM posts p
    LEFT JOIN outfits o ON p.outfit_id = o.id
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN post_likes pl ON pl.post_id = p.id AND pl.user_id = $2
    LEFT JOIN bookmarks b ON b.post_id = p.id AND b.user_id = $2
    LEFT JOIN follows f ON f.followed_id = p.user_id AND f.follower_id = $2
    WHERE p.id = $1`;
  const { rows } = await pool.query(query, [postId, userId]);

  return rows.length ? rows[0] : null;
};

export const deletePost = async (postId: number): Promise<void> => {
  const postExistsQuery = 'SELECT * FROM posts WHERE id = $1';
  const { rows } = await pool.query(postExistsQuery, [postId]);
  if (rows.length === 0) {
    throw new Error('Post not found');
  } else {
    const query = 'DELETE FROM posts WHERE id = $1';
    await pool.query(query, [postId]);
  }
};

export const getFeedPosts = async (userId: number, limit: number = 20, offset: number = 0): Promise<Post[]> => {
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
      CASE WHEN pl.id IS NOT NULL THEN true ELSE false END as is_liked,
      CASE WHEN b.id IS NOT NULL THEN true ELSE false END as is_bookmarked,
      CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_user_following
    FROM posts p
    JOIN follows f ON p.user_id = f.followed_id
    LEFT JOIN outfits o ON p.outfit_id = o.id
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN post_likes pl ON pl.post_id = p.id AND pl.user_id = $1
    LEFT JOIN bookmarks b ON b.post_id = p.id AND b.user_id = $1
    WHERE f.follower_id = $1
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const { rows } = await pool.query(query, [userId, limit, offset]);
  return rows;
};

export const sharePost = async (userId: number, postId: number): Promise<Post> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const insertQuery = `
      WITH inserted_post AS (
        INSERT INTO posts (user_id, shared_post_id)
        VALUES ($1, $2)
        RETURNING *
      )
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
        ) as user
      FROM inserted_post p
      JOIN users u ON p.user_id = u.id`;
    const { rows: [post] } = await client.query(insertQuery, [userId, postId]);

    const updateQuery = `
      UPDATE posts
      SET shares_count = shares_count + 1
      WHERE id = $1
    `;
    await client.query(updateQuery, [postId]);

    await client.query('COMMIT');
    return post;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const incrementPostShares = async (postId: number): Promise<void> => {
  const postExistsQuery = 'SELECT * FROM posts WHERE id = $1';
  const { rows } = await pool.query(postExistsQuery, [postId]);
  if (rows.length === 0) {
    throw new Error('Post not found');
  } else {
    const query = `
      UPDATE posts
    SET shares_count = shares_count + 1
    WHERE id = $1
    `;
    await pool.query(query, [postId]);
  }
};

export const toggleLikePost = async (postId: string, userId: string) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if the user has already liked the post
    const checkLikeQuery = 'SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2';
    const checkLikeResult = await client.query(checkLikeQuery, [postId, userId]);

    let result;
    if (checkLikeResult.rows.length > 0) {
      // User has already liked the post, so unlike it
      const removeLikeQuery = 'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2';
      await client.query(removeLikeQuery, [postId, userId]);

      const updatePostQuery = 'UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1 RETURNING *';
      result = await client.query(updatePostQuery, [postId]);
    } else {
      // User hasn't liked the post, so like it
      const addLikeQuery = 'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)';
      await client.query(addLikeQuery, [postId, userId]);

      const updatePostQuery = 'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1 RETURNING *';
      result = await client.query(updatePostQuery, [postId]);
    }

    await client.query('COMMIT');
    return {
      ...result.rows[0],
      isLiked: !checkLikeResult.rows.length
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
