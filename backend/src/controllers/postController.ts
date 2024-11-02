import { Request, Response, NextFunction } from 'express';
import { createPost, getPostById, deletePost, getFeedPosts, incrementPostShares, toggleLikePost } from '../services/postService';
import logger from '../utils/logger';

export const createNewPost = async (req: Request, res: Response) => {
  const { userId, outfitId } = req.body;
  logger.info(`Creating new post for userId: ${userId}, outfitId: ${outfitId}`);

  if (isNaN(outfitId) || isNaN(userId)) {
    logger.warn('Invalid input for post creation. Values must be numbers.');
    return res.status(400).json({ error: 'Invalid input: outfitId and userId must be numbers' });
  }

  try {
    const response = await createPost(parseInt(userId), parseInt(outfitId));
    if (response) {
      logger.info(`Post created successfully for userId: ${userId}, outfitId: ${outfitId}`);
      res.status(201).json(response);
    } else {
      res.status(400).json({ error: 'Error creating post' });
    }
  } catch (err) {
    logger.error(`Error creating post for userId: ${userId}, outfitId: ${outfitId}. Error: ${(err as Error).message}`);
    res.status(500).json({ error: 'Error creating post' });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = parseInt(req.params.userId);
    logger.info(`Fetching post with postId: ${postId}`);
    const post = await getPostById(postId, userId);

    if (post) {
      res.status(200).json(post);
      logger.info(`Post found with postId: ${postId}`);

    } else {
      logger.warn(`Post not found with postId: ${postId}`);
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    logger.error(`Error fetching post. Error: ${(error as Error).message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const likePosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId;
    logger.info(`Liking post with postId: ${postId}`);
    const userId = req.query.user_id as string;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required in the query parameters' });
    }

    const result = await toggleLikePost(postId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteExistingPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    logger.info(`Deleting post with postId: ${postId}`);

    if (isNaN(parseInt(postId))) {
      logger.warn(`Invalid input: postId must be a number`);
      return res.status(400).json({ error: 'Invalid input: postId must be a number' });
    }

    await deletePost(parseInt(postId));
    logger.info(`Post deleted successfully. postId: ${postId}`);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === 'Post not found') {
      logger.warn(`Post not found.`);
      res.status(404).json({ error: 'Post not found' });
    } else {
      logger.error(`Error deleting post. Error: ${(error as Error).message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getUserFeed = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { limit, offset } = req.query;
  try {
    const posts = await getFeedPosts(parseInt(userId), parseInt(limit as string) || 20, parseInt(offset as string) || 0);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching user feed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const postShareIncrement = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    await incrementPostShares(parseInt(postId));
    res.status(200).json({ message: 'Post shared successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Post not found') {
      logger.warn(`Post not found.`);
      res.status(404).json({ error: 'Post not found' });
    } else {
      logger.error(`Error sharing post. Error: ${(error as Error).message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
