import axios, { AxiosInstance, AxiosResponse } from "axios";

import { User, Item, Outfit, Post } from "../model/types";

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
export const getAllUsers = (): Promise<AxiosResponse<User[]>> =>
  api.get(apiEndpoints.getAllUsers());

export const getUserById = (userId: number): Promise<AxiosResponse<User>> =>
  api.get(apiEndpoints.getUserById(userId));

export const updateUser = (
  userId: number,
  userData: Partial<User>,
): Promise<AxiosResponse<User>> =>
  api.put(apiEndpoints.updateUser(userId), userData);

export const deleteUser = (userId: number): Promise<AxiosResponse<User>> =>
  api.delete(apiEndpoints.deleteUser(userId));

// Items
export const getUserItems = (userId: number): Promise<AxiosResponse<Item[]>> =>
  api.get(apiEndpoints.getUserItems(userId));

export const createItem = (
  userId: number,
  itemData: Omit<Item, "id" | "user_id">,
): Promise<AxiosResponse<Item>> =>
  api.post(apiEndpoints.createItem(userId), itemData);

export const getItemById = (
  userId: number,
  itemId: number,
): Promise<AxiosResponse<Item>> =>
  api.get(apiEndpoints.getItemById(userId, itemId));

export const updateItem = (
  userId: number,
  itemId: number,
  itemData: Partial<Item>,
): Promise<AxiosResponse<Item>> =>
  api.put(apiEndpoints.updateItem(userId, itemId), itemData);

export const deleteItem = (
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
export const createPost = (
  userId: number,
  postData: Omit<Post, "id" | "user_id">,
): Promise<AxiosResponse<Post>> =>
  api.post(apiEndpoints.createPost(userId), postData);

export const getPostById = (postId: number): Promise<AxiosResponse<Post>> =>
  api.get(apiEndpoints.getPostById(postId));

export const likePost = (postId: number): Promise<AxiosResponse<Post>> =>
  api.post(apiEndpoints.likePost(postId));

export const unlikePost = (postId: number): Promise<AxiosResponse<Post>> =>
  api.post(apiEndpoints.unlikePost(postId));

export const deletePost = (
  userId: number,
  postId: number,
): Promise<AxiosResponse<Post>> =>
  api.delete(apiEndpoints.deletePost(userId, postId));

export default api;
