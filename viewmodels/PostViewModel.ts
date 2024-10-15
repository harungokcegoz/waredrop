import { useCallback } from "react";

import { Post } from "../model/types";
import {
  createPostApi,
  getPostByIdApi,
  likePostApi,
  unlikePostApi,
  deletePostApi,
  addBookmarkApi,
  removeBookmarkApi,
  getUserFeedApi,
  sharePostApi,
} from "../services/api";
import { useStore } from "../stores/useStore";

export const usePostViewModel = () => {
  const { user } = useStore();

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
      await likePostApi(postId);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }, []);

  const unlikePost = useCallback(async (postId: number) => {
    try {
      await unlikePostApi(postId);
    } catch (error) {
      console.error("Error unliking post:", error);
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
        console.error("Error fetching user feed:", error);
        return [];
      }
    },
    [user],
  );

  const sharePost = useCallback(async (postId: number) => {
    try {
      await sharePostApi(postId);
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  }, []);

  const bookmarkPost = useCallback(
    async (postId: number) => {
      if (!user) return;
      try {
        await addBookmarkApi(user.id, postId);
      } catch (error) {
        console.error("Error bookmarking post:", error);
      }
    },
    [user],
  );

  const unbookmarkPost = useCallback(
    async (postId: number) => {
      if (!user) return;
      try {
        await removeBookmarkApi(user.id, postId);
      } catch (error) {
        console.error("Error unbookmarking post:", error);
      }
    },
    [user],
  );

  return {
    createNewPost,
    fetchPostById,
    likePost,
    unlikePost,
    deletePostById,
    getUserFeed,
    sharePost,
    bookmarkPost,
    unbookmarkPost,
  };
};
