/* eslint-disable @typescript-eslint/no-require-imports */
import request from 'supertest';
import express from 'express';
import { app, router } from '../index';
import * as userService from '../services/userService';
import * as itemService from '../services/itemService';
import * as outfitService from '../services/outfitService';
import * as postService from '../services/postService';
import * as followService from '../services/followService';
import * as bookmarkService from '../services/bookmarkService';

// Mock the auth middleware
jest.mock('../middleware/authMiddleware', () => ({
  authenticateJWT: jest.fn((req, res, next) => {
    // Simulate a user with the influencer role
    req.body.user = { role: 'influencer' };
    next();
  }),
}));

app.use(express.json());
app.use('/api', router);

jest.mock('../services/authService');
jest.mock('../services/userService');
jest.mock('../services/itemService');
jest.mock('../services/outfitService');
jest.mock('../services/postService');
jest.mock('../services/followService');
jest.mock('../services/bookmarkService');

describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return a list of users', async () => {
      const mockUsers = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
      (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toEqual(mockUsers);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a specific user', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/users/1')
        .expect(200);

      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 for non-existent user', async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(null);

      await request(app)
        .get('/api/users/999')
        .expect(404);
    });
  });

  describe('GET /api/users/:userId/items', () => {
    it('should return a list of items for a user', async () => {
      const mockItems = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
      (itemService.getItemsByUserId as jest.Mock).mockResolvedValue(mockItems);

      const response = await request(app)
        .get('/api/users/1/items')
        .expect(200);

      expect(response.body).toEqual(mockItems);
    });
  });

  describe('POST /api/users/:userId/items', () => {
    it('should create a new item for a user', async () => {
      const mockItem = { id: 1, name: 'Test Item', category: 'Test Category', color: 'Red', imageUrl: 'http://example.com/image.jpg' };
      (itemService.createItem as jest.Mock).mockResolvedValue(mockItem);

      const response = await request(app)
        .post('/api/users/1/items')
        .send(mockItem)
        .expect(201);

      expect(response.body).toEqual(mockItem);
    });

    it('should return 400 if required fields are missing', async () => {
      await request(app)
        .post('/api/users/1/items')
        .send({ color: 'Red' })
        .expect(400);
    });
  });

  describe('DELETE /api/users/:userId/items/:itemId', () => {
    it('should delete an item', async () => {
      const mockDeletedItem = { id: 1, name: 'Deleted Item' };
      (itemService.deleteItem as jest.Mock).mockResolvedValue(mockDeletedItem);

      const response = await request(app)
        .delete('/api/users/1/items/1')
        .expect(200);

      expect(response.body).toEqual(mockDeletedItem);
    });

    it('should return 404 if item does not exist', async () => {
      (itemService.deleteItem as jest.Mock).mockResolvedValue(null);

      await request(app)
        .delete('/api/users/1/items/999')
        .expect(404);
    });
  });

  describe('GET /api/users/:userId/outfits', () => {
    it('should return a list of outfits for a user', async () => {
      const mockOutfits = [{ id: 1, name: 'Outfit 1' }, { id: 2, name: 'Outfit 2' }];
      (outfitService.getOutfitsByUserId as jest.Mock).mockResolvedValue(mockOutfits);

      const response = await request(app)
        .get('/api/users/1/outfits')
        .expect(200);

      expect(response.body).toEqual(mockOutfits);
    });
  });

  describe('POST /api/users/:userId/outfits', () => {
    it('should create a new outfit with multiple items for a user', async () => {
      const mockOutfit = { 
        id: 1, 
        name: 'Test Outfit', 
        description: 'A test outfit',
        items: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' }
        ]
      };
      (outfitService.createOutfit as jest.Mock).mockResolvedValue(mockOutfit);

      const response = await request(app)
        .post('/api/users/1/outfits')
        .send({ name: 'Test Outfit', tags: ['Tag1', 'Tag2'], itemIds: [1, 2] })
        .expect(201);

      expect(response.body).toEqual(mockOutfit);
    });

    it('should return 400 if name or itemIds are missing', async () => {
      await request(app)
        .post('/api/users/1/outfits')
        .send({ tags: ['Tag1', 'Tag2'] })
        .expect(400);
    });
  });

  describe('PUT /api/users/:userId/outfits/:outfitId', () => {
    it('should update an outfit', async () => {
      const mockUpdatedOutfit = { id: 1, name: 'Updated Outfit', tags: ['Tag1', 'Tag2'], itemIds: [1, 2] };
      (outfitService.updateOutfit as jest.Mock).mockResolvedValue(mockUpdatedOutfit);

      const response = await request(app)
        .put('/api/users/1/outfits/1')
        .send(mockUpdatedOutfit)
        .expect(201);

      expect(response.body).toEqual(mockUpdatedOutfit);
    });

    it('should return 404 if outfit does not exist', async () => {
      (outfitService.updateOutfit as jest.Mock).mockResolvedValue(null);

      await request(app)
        .put('/api/users/1/outfits/999')
        .send({ name: 'Updated Outfit', tags: ['Tag1', 'Tag2'], itemIds: [1, 2] })
        .expect(404);
    });
  });

  describe('DELETE /api/users/:userId/outfits/:outfitId', () => {
    it('should delete an outfit', async () => {
      const mockDeletedOutfit = { id: 1, name: 'Deleted Outfit' };
      (outfitService.deleteOutfit as jest.Mock).mockResolvedValue(mockDeletedOutfit);

      const response = await request(app)
        .delete('/api/users/1/outfits/1')
        .expect(200);

      expect(response.body).toEqual(mockDeletedOutfit);
    });

    it('should return 404 if outfit does not exist', async () => {
      (outfitService.deleteOutfit as jest.Mock).mockResolvedValue(null);

      await request(app)
        .delete('/api/users/1/outfits/999')
        .expect(404);
    });
  });

  describe('GET /api/users/:userId/stats', () => {
    it('should return user stats for an influencer', async () => {
      const mockStats = { 
        totalLikes: 100, 
        totalBookmarks: 50, 
        totalShares: 25, 
        followers: 1000, 
        following: 500,
        posts: 30
      };
      (userService.getUserStats as jest.Mock).mockResolvedValue(mockStats);

      const response = await request(app)
        .get('/api/users/1/stats')
        .expect(200);

      expect(response.body).toEqual(mockStats);
    });

    it('should return 403 for non-influencer users', async () => {
      // Change the mock to simulate a non-influencer user
      (require('../middleware/authMiddleware').authenticateJWT as jest.Mock).mockImplementation((req, res, next) => {
        req.body.user = { role: 'user' }; 
        next();
      });

      const response = await request(app)
        .get('/api/users/1/stats')
        .expect(403);

      expect(response.body).toEqual({ message: 'Access forbidden. Your role is not allowed to access this endpoint.' });
    });
  });

  describe('GET /api/users/:userId/posts', () => {
    it('should return user posts', async () => {
      const mockPosts = [{ id: 1, content: 'Test post' }];
      (userService.getUserPosts as jest.Mock).mockResolvedValue(mockPosts);

      const response = await request(app)
        .get('/api/users/1/posts')
        .expect(200);

      expect(response.body).toEqual(mockPosts);
    });

    it('should return an empty array if user has no posts', async () => {
      (userService.getUserPosts as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/users/1/posts')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const mockPost = { id: 1, content: 'New post' };
      (postService.createPost as jest.Mock).mockResolvedValue(mockPost);

      const response = await request(app)
        .post('/api/posts')
        .send({ userId: 1, outfitId: 1 })
        .expect(201);

      expect(response.body).toEqual(mockPost);
    });

    it('should return 400 for invalid input', async () => {
      await request(app)
        .post('/api/posts')
        .send({ userId: 1 })
        .expect(400);
    });
  });

  describe('GET /api/posts/:postId', () => {
    it('should return a specific post', async () => {
      const mockPost = { id: 1, content: 'Test post' };
      (postService.getPostById as jest.Mock).mockResolvedValue(mockPost);

      const response = await request(app)
        .get('/api/posts/1')
        .expect(200);

      expect(response.body).toEqual(mockPost);
    });

    it('should return 404 for non-existent post', async () => {
      (postService.getPostById as jest.Mock).mockResolvedValue(null);

      await request(app)
        .get('/api/posts/999')
        .expect(404);
    });
  });

  describe('POST /api/posts/:postId/likes', () => {
    it('should like a post', async () => {
      const mockResult = { liked: true };
      (postService.toggleLikePost as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/posts/1/likes')
        .query({ user_id: 1 })
        .expect(200);

      expect(response.body).toEqual(mockResult);
    });

    it('should return 400 if user_id is missing', async () => {
      await request(app)
        .post('/api/posts/1/likes')
        .expect(400);
    });
  });

  describe('DELETE /api/posts/:postId', () => {
    it('should delete a post', async () => {
      (postService.deletePost as jest.Mock).mockResolvedValue(undefined);

      await request(app)
        .delete('/api/posts/1')
        .expect(204);
    });

    it('should return 404 if post does not exist', async () => {
      (postService.deletePost as jest.Mock).mockRejectedValue(new Error('Post not found'));

      await request(app)
        .delete('/api/posts/999')
        .expect(404);
    });
  });

  describe('GET /api/users/:userId/feed', () => {
    it('should return user feed', async () => {
      const mockFeed = [{ id: 1, content: 'Feed post' }];
      (postService.getFeedPosts as jest.Mock).mockResolvedValue(mockFeed);

      const response = await request(app)
        .get('/api/users/1/feed')
        .expect(200);

      expect(response.body).toEqual(mockFeed);
    });

    it('should return an empty array if feed is empty', async () => {
      (postService.getFeedPosts as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/users/1/feed')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/users/:userId/follows', () => {
    it('should follow a user', async () => {
      (followService.followUser as jest.Mock).mockResolvedValue(undefined);

      await request(app)
        .post('/api/users/1/follows/2')
        .expect(200);
    });

    it('should return 400 if followedId is missing', async () => {
      await request(app)
        .post('/api/users/1/follows/a')
        .expect(400);
    });
  });

  describe('DELETE /api/users/:userId/follows/:followedId', () => {
    it('should unfollow a user', async () => {
      (followService.unfollowUser as jest.Mock).mockResolvedValue(undefined);

      await request(app)
        .delete('/api/users/1/follows/2')
        .expect(200);
    });
  });

  describe('GET /api/users/:userId/followers', () => {
    it('should return user followers', async () => {
      const mockFollowers = [{ id: 2, name: 'Follower' }];
      (followService.getFollowers as jest.Mock).mockResolvedValue(mockFollowers);

      const response = await request(app)
        .get('/api/users/1/followers')
        .expect(200);

      expect(response.body).toEqual(mockFollowers);
    });
  });

  describe('GET /api/users/:userId/following', () => {
    it('should return users followed by user', async () => {
      const mockFollowing = [{ id: 3, name: 'Following' }];
      (followService.getFollowing as jest.Mock).mockResolvedValue(mockFollowing);

      const response = await request(app)
        .get('/api/users/1/following')
        .expect(200);

      expect(response.body).toEqual(mockFollowing);
    });
  });

  describe('POST /api/users/:userId/bookmarks/:postId', () => {
    it('should toggle bookmark on a post', async () => {
      const mockResult = { isBookmarked: true };
      (bookmarkService.toggleBookmark as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/users/1/bookmarks/1')
        .expect(200);

      expect(response.body).toEqual(mockResult);
    });
  });

  describe('GET /api/users/:userId/bookmarks', () => {
    it('should return user bookmarks', async () => {
      const mockBookmarks = [{ id: 1, content: 'Bookmarked post' }];
      (bookmarkService.getUserBookmarks as jest.Mock).mockResolvedValue(mockBookmarks);

      const response = await request(app)
        .get('/api/users/1/bookmarks')
        .expect(200);

      expect(response.body).toEqual(mockBookmarks);
    });

    it('should return an empty array if user has no bookmarks', async () => {
      (bookmarkService.getUserBookmarks as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/users/1/bookmarks')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('PUT /api/posts/:postId/shares', () => {
    it('should increment post shares', async () => {
      (postService.incrementPostShares as jest.Mock).mockResolvedValue(undefined);

      await request(app)
        .put('/api/posts/1/shares')
        .expect(200);
    });

    it('should return 404 if post does not exist', async () => {
      (postService.incrementPostShares as jest.Mock).mockRejectedValue(new Error('Post not found'));

      await request(app)
        .put('/api/posts/999/shares')
        .expect(404);
    });
  });
});
