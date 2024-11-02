import { Request, Response } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getUserStats, getUserPosts } from '../services/userService';
import logger from '../utils/logger';

export const getUsers = async (req: Request, res: Response) => {
  logger.info('Fetching all users');
  try {
    const users = await getAllUsers();
    logger.info('Users fetched successfully');
    res.json(users);
  } catch (error) {
    logger.error(`Error fetching users: ${(error as Error).message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    logger.info(`Fetching user with ID: ${id}`);
    const user = await getUserById(id);
    if (user) {
      logger.info(`User found with ID: ${id}`);
      res.json(user);
    } else {
      logger.warn(`User not found with ID: ${id}`);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    logger.error(`Error fetching user. Error: ${(error as Error).message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    logger.info(`Updating user with ID: ${id}`);

    if (!name || !email) {
      logger.warn('Name and email are required for user update');
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const updatedUser = await updateUser(id, name, email);
    if (updatedUser) {
      logger.info(`User updated successfully with ID: ${id}`);
      res.json(updatedUser);
    } else {
      logger.warn(`User not found for update with ID: ${id}`);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    logger.error(`Error updating user. Error: ${(error as Error).message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    logger.info(`Deleting user with ID: ${id}`);

    const deletedUser = await deleteUser(id);
    if (deletedUser) {
      logger.info(`User deleted successfully with ID: ${id}`);
      res.json({ message: 'User deleted successfully' });
    } else {
      logger.warn(`User not found for deletion with ID: ${id}`);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    logger.error(`Error deleting user. Error: ${(error as Error).message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.userId);
    if (isNaN(id)) {
      logger.warn('Invalid user ID');
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const stats = await getUserStats(id);
    res.status(200).json(stats);
    logger.info('successfully fetched user stats');
  } catch (error) {
    logger.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'An error occurred while fetching user stats' });
  }
};

export const getUserPostsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.userId);
    if (isNaN(id)) {
      logger.warn('Invalid user ID');
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const posts = await getUserPosts(id);
    res.status(200).json(posts);
    logger.info('successfully fetched user posts');
  } catch (error) {
    logger.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'An error occurred while fetching user posts' });
  }
};
