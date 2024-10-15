import axios, { AxiosInstance, AxiosResponse } from "axios";

import { User, Item, Outfit, Post, UserStats } from "../model/types";

import apiEndpoints from "./apiEndpoints";

const api: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Auth
export const googleLogin = (
  token: string,
): Promise<AxiosResponse<{ access_token: string; token_type: string }>> =>
  api.post(apiEndpoints.googleLogin(), { token });

// Users
export const getAllUsersApi = (): Promise<AxiosResponse<User[]>> =>
  api.get(apiEndpoints.getAllUsers());

export const getUserByIdApi = (userId: number): Promise<AxiosResponse<User>> =>
  api.get(apiEndpoints.getUserById(userId));

export const updateUserApi = (
  userId: number,
  userData: Partial<User>,
): Promise<AxiosResponse<User>> =>
  api.put(apiEndpoints.updateUser(userId), userData);

export const deleteUserApi = (userId: number): Promise<AxiosResponse<User>> =>
  api.delete(apiEndpoints.deleteUser(userId));

// Items
export const getUserItemsApi = (
  userId: number,
): Promise<AxiosResponse<Item[]>> => api.get(apiEndpoints.getUserItems(userId));

export const addItemApi = (
  userId: number,
  itemData: Omit<Item, "id" | "user_id">,
): Promise<AxiosResponse<Item>> => {
  return api.post(apiEndpoints.createItem(userId), itemData);
};

export const getItemByIdApi = (
  userId: number,
  itemId: number,
): Promise<AxiosResponse<Item>> =>
  api.get(apiEndpoints.getItemById(userId, itemId));

export const updateItemApi = (
  userId: number,
  itemId: number,
  itemData: Partial<Item>,
): Promise<AxiosResponse<Item>> =>
  api.put(apiEndpoints.updateItem(userId, itemId), itemData);

export const deleteItemApi = (
  userId: number,
  itemId: number,
): Promise<AxiosResponse<Item>> =>
  api.delete(apiEndpoints.deleteItem(userId, itemId));

// Outfits
export const getUserOutfits = (
  userId: number,
): Promise<AxiosResponse<Outfit[]>> =>
  api.get(apiEndpoints.getUserOutfits(userId));

export const createOutfit = (
  userId: number,
  outfitData: Omit<Outfit, "id" | "user_id">,
): Promise<AxiosResponse<Outfit>> =>
  api.post(apiEndpoints.createOutfit(userId), outfitData);

export const getOutfitById = (
  userId: number,
  outfitId: number,
): Promise<AxiosResponse<Outfit>> =>
  api.get(apiEndpoints.getOutfitById(userId, outfitId));

export const updateOutfit = (
  userId: number,
  outfitId: number,
  outfitData: Partial<Outfit>,
): Promise<AxiosResponse<Outfit>> =>
  api.put(apiEndpoints.updateOutfit(userId, outfitId), outfitData);

export const deleteOutfit = (
  userId: number,
  outfitId: number,
): Promise<AxiosResponse<Outfit>> =>
  api.delete(apiEndpoints.deleteOutfit(userId, outfitId));

// Posts
export const createPostApi = (
  userId: number,
  postData: Omit<Post, "id" | "user_id">,
): Promise<AxiosResponse<Post>> =>
  api.post(apiEndpoints.createPost(userId), postData);

export const getPostByIdApi = (postId: number): Promise<AxiosResponse<Post>> =>
  api.get(apiEndpoints.getPostById(postId));

export const likePostApi = (postId: number): Promise<AxiosResponse<Post>> =>
  api.post(apiEndpoints.likePost(postId));

export const unlikePostApi = (postId: number): Promise<AxiosResponse<Post>> =>
  api.post(apiEndpoints.unlikePost(postId));

export const deletePostApi = (
  userId: number,
  postId: number,
): Promise<AxiosResponse<Post>> =>
  api.delete(apiEndpoints.deletePost(userId, postId));

export const getUserFeedApi = (
  userId: number,
  limit: number,
  offset: number,
): Promise<AxiosResponse<Post[]>> =>
  api.get(apiEndpoints.getUserFeed(userId, limit, offset));

export const sharePostApi = (postId: number): Promise<AxiosResponse<Post>> =>
  api.post(apiEndpoints.sharePost(postId));

// Follow
export const followUserApi = (
  userId: number,
  followedId: number
): Promise<AxiosResponse<void>> =>
  api.post(apiEndpoints.followUser(userId), { followedId });

export const unfollowUserApi = (
  userId: number,
  followedId: number
): Promise<AxiosResponse<void>> =>
  api.delete(apiEndpoints.unfollowUser(userId, followedId));

export const isFollowingUserApi = (
  userId: number,
  followedId: number
): Promise<AxiosResponse<boolean>> =>
  api.get(apiEndpoints.isFollowingUser(userId, followedId));

export const getUserFollowersApi = (
  userId: number,
): Promise<AxiosResponse<User[]>> =>
  api.get(apiEndpoints.getUserFollowers(userId));

export const getUserFollowingApi = (
  userId: number,
): Promise<AxiosResponse<User[]>> =>
  api.get(apiEndpoints.getUserFollowing(userId));

// Bookmark
export const addBookmarkApi = (
  userId: number,
  postId: number,
): Promise<AxiosResponse<void>> =>
  api.post(apiEndpoints.addBookmark(userId), { postId });

export const removeBookmarkApi = (
  userId: number,
  postId: number,
): Promise<AxiosResponse<void>> =>
  api.delete(apiEndpoints.removeBookmark(userId, postId));

export const getBookmarksApi = (
  userId: number,
): Promise<AxiosResponse<number[]>> =>
  api.get(apiEndpoints.getBookmarks(userId));

// User Stats
export const getUserStatsApi = (
  userId: number,
): Promise<AxiosResponse<UserStats>> =>
  api.get(apiEndpoints.getUserStats(userId));

export const getUserPostsApi = (
  userId: number,
): Promise<AxiosResponse<Post[]>> => api.get(apiEndpoints.getUserPosts(userId));

export default api;
