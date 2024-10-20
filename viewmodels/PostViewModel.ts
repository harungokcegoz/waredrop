import { useCallback } from "react";

import { Post } from "../model/types";
import {
  createPostApi,
  getPostByIdApi,
  likePostApi,
  deletePostApi,
  getUserFeedApi,
  getBookmarksApi,
  toggleBookmarkApi,
} from "../services/api";
import { useStore } from "../stores/useStore";

export const usePostViewModel = () => {
  const { user, setUser, setToken } = useStore();

  const createNewPost = useCallback(
    async (postData: Omit<Post, "id" | "user_id">) => {
      if (!user) return;
      try {
        const response = await createPostApi(user.id, postData);
        return response.data;
      } catch (error) {
        console.error("Error creating post:", error);
      }
    },
    [user],
  );

  const fetchPostById = useCallback(async (postId: number) => {
    try {
      const response = await getPostByIdApi(postId);
      return response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }, []);

  const likePost = useCallback(async (postId: number) => {
    try {
      if (!user) return;
      await likePostApi(postId, user.id);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }, []);

  const deletePostById = useCallback(
    async (postId: number) => {
      if (!user) return;
      try {
        await deletePostApi(user.id, postId);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    [user],
  );

  const getUserFeed = useCallback(
    async (limit = 20, offset = 0) => {
      if (!user) return [];
      try {
        const response = await getUserFeedApi(user.id, limit, offset);
        return response.data;
      } catch (error) {
        if (error.response.status === 403) {
          setUser(null);
          setToken(null);
        }
        console.error("Error fetching user feed:", error);
        return [];
      }
    },
    [user],
  );

  const bookmarkPost = useCallback(
    async (postId: number) => {
      if (!user) return;
      try {
        await toggleBookmarkApi(user.id, postId);
      } catch (error) {
        console.error("Error bookmarking post:", error);
      }
    },
    [user],
  );

  const getBookmarkedPosts = useCallback(async () => {
    if (!user) return [];
    try {
      const response = await getBookmarksApi(user.id);
      const bookmarkedPosts = response.data;
      return bookmarkedPosts;
    } catch (error) {
      console.error("Error fetching bookmarked posts:", error);
      return [];
    }
  }, [user, fetchPostById]);

  return {
    createNewPost,
    fetchPostById,
    likePost,
    deletePostById,
    getUserFeed,
    bookmarkPost,
    getBookmarkedPosts,
  };
};
