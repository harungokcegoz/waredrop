import pool from '../db/dbPool';
import { User } from '../models/User';

export const followUser = async (followerId: number, followedId: number): Promise<void> => {
  const query = `
    INSERT INTO follows (follower_id, followed_id)
    VALUES ($1, $2)
    ON CONFLICT (follower_id, followed_id) DO NOTHING
  `;
  await pool.query(query, [followerId, followedId]);
};

export const unfollowUser = async (followerId: number, followedId: number): Promise<void> => {
  const query = `
    DELETE FROM follows
    WHERE follower_id = $1 AND followed_id = $2
  `;
  await pool.query(query, [followerId, followedId]);
};

export const getFollowers = async (userId: number): Promise<User[]> => {
  const query = `
    SELECT u.id, u.email, u.name, u.role, u.profile_picture_url, u.google_id, u.created_at, u.updated_at
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.followed_id = $1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const getFollowing = async (userId: number): Promise<User[]> => {
  const query = `
    SELECT u.id, u.email, u.name, u.role, u.profile_picture_url, u.google_id, u.created_at, u.updated_at
    FROM follows f
    JOIN users u ON f.followed_id = u.id
    WHERE f.follower_id = $1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};
