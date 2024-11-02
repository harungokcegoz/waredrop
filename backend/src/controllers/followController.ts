import { Request, Response } from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../services/followService';
import logger from '../utils/logger';

export const follow = async (req: Request, res: Response) => {
  const { userId, followedId } = req.params;

  if (isNaN(parseInt(userId)) || isNaN(parseInt(followedId))) {
    logger.warn(`Invalid input: userId and followedId must be numbers`);
    return res.status(400).json({ error: 'Invalid input: userId and followedId must be numbers' });
  }
  try {
    await followUser(parseInt(userId), parseInt(followedId));
    logger.info('successfully toggled bookmark');
    res.status(200).json({ message: 'Successfully followed user' });
  } catch (error) {
    logger.error('Error following user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unfollow = async (req: Request, res: Response) => {
  const { userId, followedId } = req.params;

  if (isNaN(parseInt(userId)) || isNaN(parseInt(followedId))) {
    logger.warn(`Invalid input: userId and followedId must be numbers`);
    return res.status(400).json({ error: 'Invalid input: userId and followedId must be numbers' });
  }
  try {
    await unfollowUser(parseInt(userId), parseInt(followedId));
    logger.info('successfully unfollowed user');
    res.status(200).json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    logger.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserFollowers = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (isNaN(parseInt(userId))) {
    logger.warn(`Invalid input: userId must be a number`);
    return res.status(400).json({ error: 'Invalid input: userId must be a number' });
  }
  try {
    const followers = await getFollowers(parseInt(userId));
    logger.info('successfully fetched followers');
    res.status(200).json(followers);
  } catch (error) {
    logger.error('Error getting followers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserFollowing = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (isNaN(parseInt(userId))) {
    logger.warn(`Invalid input: userId must be a number`);
    return res.status(400).json({ error: 'Invalid input: userId must be a number' });
  }
  try {
    const following = await getFollowing(parseInt(userId));
    res.status(200).json(following);
    logger.info('successfully fetched following users');
  } catch (error) {
    logger.error('Error getting following:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
