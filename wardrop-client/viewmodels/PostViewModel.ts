import { useCallback } from "react";

import { Post } from "../model/types";
import {
  createPost,
  getPostById,
  likePost,
  unlikePost,
  deletePost,
} from "../services/api";
import { useStore } from "../stores/useStore";

export const usePostViewModel = () => {
  const { user } = useStore();

  const createNewPost = useCallback(
    async (postData: Omit<Post, "id" | "user_id">) => {
      if (!user) return;
      try {
        const response = await createPost(user.id, postData);
        return response.data;
      } catch (error) {
        console.error("Error creating post:", error);
      }
    },
    [user],
  );

  const fetchPostById = useCallback(async (postId: number) => {
    try {
      const response = await getPostById(postId);
      return response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }, []);

  const likePostById = useCallback(async (postId: number) => {
    try {
      const response = await likePost(postId);
      return response.data;
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }, []);

  const unlikePostById = useCallback(async (postId: number) => {
    try {
      const response = await unlikePost(postId);
      return response.data;
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  }, []);

  const deletePostById = useCallback(
    async (postId: number) => {
      if (!user) return;
      try {
        await deletePost(user.id, postId);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    [user],
  );

  return {
    createNewPost,
    fetchPostById,
    likePostById,
    unlikePostById,
    deletePostById,
  };
};
