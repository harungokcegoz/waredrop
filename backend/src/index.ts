import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { getUsers, getUser, updateUserController, deleteUserController, getStats, getUserPostsController } from './controllers/userController';
import { getUserItems, addUserItem, deleteUserItem, getUserItem, updateUserItem} from './controllers/itemController';
import { getUserOutfits, addUserOutfit, updateUserOutfit, deleteUserOutfit, getUserOutfit } from './controllers/outfitController';
import { errorHandler } from './middleware/errorHandler';
import { googleLogin } from './controllers/authController';
// import { authenticateJWT } from './middleware/auth';
import client from 'prom-client';
import logger from './utils/logger';
import { authenticateJWT } from './middleware/authMiddleware';  
import { createNewPost, getPost, deleteExistingPost, getUserFeed, postShareIncrement, likePosts } from './controllers/postController';
import { follow, unfollow, getUserFollowers, getUserFollowing } from './controllers/followController';
import { toggleBookmarkController, getBookmarks } from './controllers/bookmarkController';
import { checkRole } from './middleware/roleMiddleware';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(errorHandler);

const router = express.Router();
const port = process.env.PORT || 3000;

// Apply authentication middleware to all routes except /auth --can be commented out to bypass authentication--
// router.use((req, res, next) => {
//   if (req.path.startsWith('/auth')) {
//     return next();
//   }
//   return authenticateJWT(req, res, next);
// });
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'statusCode'],
});

// Middleware to track requests and increment the counter
router.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, String(res.statusCode)).inc();
  });
  next();
});
// Prometheus metrics endpoint
router.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// Middleware to handle authentication, except for /auth routes
// router.use((req, res, next) => {
//   if (req.path.startsWith('/auth')) {
//     return next();
//   }
//   return authenticateJWT(req, res, next);
// });


router.post('/auth/google', googleLogin);

// User routes
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUserController); 
router.delete('/users/:id', deleteUserController); 
router.get('/users/:userId/stats', checkRole(['influencer']), getStats);

// Items routes
router.get('/users/:userId/items', getUserItems);
router.get('/users/:userId/items/:itemId', getUserItem);
router.post('/users/:userId/items', addUserItem);
router.delete('/users/:userId/items/:itemId', deleteUserItem);
router.put('/users/:userId/items/:itemId', updateUserItem);

// Outfits routes
router.get('/users/:userId/outfits', getUserOutfits);
router.get('/users/:userId/outfits/:outfitId', getUserOutfit);
router.post('/users/:userId/outfits', addUserOutfit);
router.put('/users/:userId/outfits/:outfitId', updateUserOutfit);
router.delete('/users/:userId/outfits/:outfitId', deleteUserOutfit);

// Posts routes
router.get('/users/:userId/posts', getUserPostsController);
router.post('/posts', createNewPost);
router.get('/posts/:postId', getPost);
router.post('/posts/:postId/likes', likePosts);
router.delete('/posts/:postId', deleteExistingPost);
router.get('/users/:userId/feed', getUserFeed);
router.put('/posts/:postId/shares', postShareIncrement);

// Follow routes
router.post('/users/:userId/follows/:followedId', follow);
router.delete('/users/:userId/follows/:followedId', unfollow);
router.get('/users/:userId/followers', getUserFollowers);
router.get('/users/:userId/following', getUserFollowing);

// Bookmark routes
router.post('/users/:userId/bookmarks/:postId', toggleBookmarkController);
router.get('/users/:userId/bookmarks', getBookmarks);

app.use('/api', router);

app.use(errorHandler);
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

export { app, router };
