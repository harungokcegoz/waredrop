import { Request, Response } from 'express';
import { getOutfitsByUserId, createOutfit, updateOutfit, deleteOutfit, getOutfitById } from '../services/outfitService';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

export const getUserOutfits = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    logger.info(`Fetching outfits for userId: ${userId}`);
    const outfits = await getOutfitsByUserId(userId);
    res.status(200).json(outfits);
  } catch (error) {
    logger.error(`Error fetching outfits: ${(error as Error).message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserOutfit = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const outfitId = parseInt(req.params.outfitId); 
    const outfit = await getOutfitById(outfitId, userId); 
    logger.info(`Fetching outfit ${outfitId} for userId: ${userId}`);
    
    if (outfit) {
      res.status(200).json(outfit);
    } else {
      logger.warn(`Outfit not found: userId ${userId}, outfitId ${outfitId}`);
      throw new AppError('Outfit not found or user does not have permission', 404);
    }
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error(`Error fetching outfit: ${(error as Error).message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const addUserOutfit = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { name, tags, itemIds } = req.body;
    
    if (!name || !tags || !Array.isArray(tags) || !itemIds || !Array.isArray(itemIds)) {
      logger.warn('Missing required fields: name or itemIds array');
      throw new AppError('Name, tags array, and itemIds array are required', 400);
    }
    const newOutfit = await createOutfit(userId, name, tags, itemIds);
    logger.info(`Added new outfit for userId: ${userId}`);
    res.status(201).json(newOutfit);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error(`Error adding outfit for this userID. Error: ${(error as Error).message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateUserOutfit = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const outfitId = parseInt(req.params.outfitId);
    const { name, tags, itemIds } = req.body;
    
    if (!name || !tags || !Array.isArray(tags) || !itemIds || !Array.isArray(itemIds)) {
      logger.warn('Missing required fields: name or itemIds array');
      return res.status(400).json({ error: 'Name, tags array, and itemIds array are required' });
    }

    const updatedOutfit = await updateOutfit(userId, outfitId, name, tags, itemIds);
    
    if (!updatedOutfit) {
      logger.warn(`Outfit not found for update: userId ${userId}, outfitId ${outfitId}`);
      return res.status(404).json({ error: 'Outfit not found' });
    } else {
      res.status(201).json(updatedOutfit);
      logger.info(`Updated outfit ${outfitId} for userId: ${userId}`);
    }
  } catch (error) {
    logger.error(`Error updating outfit for userId and outfitId. Error: ${(error as Error).message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUserOutfit = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const outfitId = parseInt(req.params.outfitId);
    logger.info(`Attempting to delete outfit ${outfitId} for userId: ${userId}`);
    const deletedOutfit = await deleteOutfit(userId, outfitId);
    if (deletedOutfit) {
      res.status(200).json(deletedOutfit);
      logger.info(`Deleted outfit ${outfitId} for userId: ${userId}`);
    } else {
      logger.warn(`Outfit not found or user does not have permission to delete: userId ${userId}, outfitId ${outfitId}`);
      res.status(404).json({ error: 'Outfit not found or user does not have permission' });
    }
  } catch (error) {
    logger.error(`Error deleting outfit. Error: ${(error as Error).message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};