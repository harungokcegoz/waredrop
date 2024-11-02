import { Request, Response } from 'express';
import { toggleBookmark, getUserBookmarks } from '../services/bookmarkService';
import logger from '../utils/logger';

export const toggleBookmarkController = async (req: Request, res: Response) => {
  const { userId, postId } = req.params;
  try {
    const result = await toggleBookmark(parseInt(userId), parseInt(postId));
    logger.info('successfully toggled bookmark');
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error toggling bookmark:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBookmarks = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const bookmarks = await getUserBookmarks(parseInt(userId));
    res.status(200).json(bookmarks);
    logger.info('successfully fetched user bookmarks');
  } catch (error) {
    logger.error('Error getting bookmarks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
