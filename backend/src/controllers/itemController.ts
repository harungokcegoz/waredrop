import { Request, Response, NextFunction } from 'express';
import { getItemsByUserId, createItem, deleteItem, getItemById, updateItem } from '../services/itemService';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

export const getUserItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    logger.info(`Fetching items for userId: ${userId}`);
    const items = await getItemsByUserId(userId);
    res.json(items);
  } catch (error) {
    logger.error(`Error fetching items for userId: ${req.params.userId}. Error: ${(error as Error).message}`);
    next(error);
  }
};

export const updateUserItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    const itemId = parseInt(req.params.itemId);
    const { name, category, color, image_url, brand, price, commercial_link } = req.body;

    // Validate required fields
    if (!name || !category) {
      logger.warn('Missing required fields: name or category');
      throw new AppError('Name and category are required', 400);
    }

    const updatedItem = await updateItem(userId, itemId, name, category, color, image_url, brand, price, commercial_link);

    if (updatedItem) {
      logger.info(`Updated item ${itemId} for userId: ${userId}`);
      res.json(updatedItem);
      res.status(200).json(updatedItem);
    } else {
      logger.warn(`Item not found or user does not have permission: userId ${userId}, itemId ${itemId}`);
      throw new AppError('Item not found or user does not have permission', 404);
    }
  } catch (error) {
    logger.error(`Error updating item: ${(error as Error).message}`);
    next(error);
  }
};

export const getUserItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    const itemId = parseInt(req.params.itemId); 
    logger.info(`Fetching item ${itemId} for userId: ${userId}`);
    const item = await getItemById(userId, itemId); 
    if (item) {
      res.status(200).json(item);
    } else {
      logger.warn(`Item not found: userId ${userId}, itemId ${itemId}`);
      throw new AppError('Item not found or user does not have permission', 404);
    }
  } catch (error) {
    logger.error(`Error fetching item: ${(error as Error).message}`);
    next(error);
  }
};

export const addUserItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    const { name, category, color, image_url, brand, price, commercial_link } = req.body;
    if (!name || !category) {
      logger.warn('Missing required fields: name or category');
      throw new AppError('Name and category are required', 400);
    }
    const newItem = await createItem(userId, name, category, color, image_url, brand, price, commercial_link);
    logger.info(`Added new item for userId: ${userId}`);

    res.status(201).json(newItem);
  } catch (error) {
    logger.error(`Error adding item: ${(error as Error).message}`);
    next(error);
  }
};

export const deleteUserItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    const itemId = parseInt(req.params.itemId);
    logger.info(`Deleting item ${itemId} for userId: ${userId}`);
    const deletedItem = await deleteItem(userId, itemId);
    if (deletedItem) {
      logger.info(`Deleted item ${itemId} for userId: ${userId}`);
      res.json(deletedItem);
    } else {
      logger.warn(`Item not found or user does not have permission: userId ${userId}, itemId ${itemId}`);
      throw new AppError('Item not found or user does not have permission', 404);
    }
  } catch (error) {
    logger.error(`Error deleting item: ${(error as Error).message}`);
    next(error);
  }
};