import { useCallback } from "react";

import { User, UserStats } from "../model/types";
import {
  getUserByIdApi,
  updateUserApi,
  deleteUserApi,
  getBookmarksApi,
  getUserFollowersApi,
  getUserFollowingApi,
  followUserApi,
  unfollowUserApi,
  getUserStatsApi,
  getUserPostsApi,
} from "../services/api";
import { useStore } from "../stores/useStore";

export const useUserViewModel = () => {
  const { user, setUser } = useStore();

  const getUserProfile = useCallback(async () => {
    if (!user) return null;
    try {
      const response = await getUserByIdApi(user.id);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }, [user]);

  const getUserFollowers = useCallback(async () => {
    if (!user) return [];
    try {
      const response = await getUserFollowersApi(user.id);
      return response.data;
    } catch (error) {
      console.error("Error fetching user followers:", error);
      return [];
    }
  }, [user]);

  const getUserFollowing = useCallback(async () => {
    if (!user) return [];
    try {
      const response = await getUserFollowingApi(user.id);
      return response.data;
    } catch (error) {
      console.error("Error fetching user following:", error);
      return [];
    }
  }, [user]);

  const fetchUser = useCallback(
    async (userId: number) => {
      try {
        const response = await getUserByIdApi(userId);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    [setUser],
  );

  const updateUserProfile = useCallback(
    async (userData: Partial<User>) => {
      if (!user) return;
      try {
        const response = await updateUserApi(user.id, userData);
        setUser(response.data);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
    [user, setUser],
  );

  const deleteUserAccount = useCallback(async () => {
    if (!user) return;
    try {
      await deleteUserApi(user.id);
      setUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }, [user, setUser]);

  const followUser = useCallback(
    async (followedId: number) => {
      if (!user) return;
      try {
        await followUserApi(user.id, followedId);
      } catch (error) {
        console.error("Error following user:", error);
      }
    },
    [user],
  );

  const unfollowUser = useCallback(
    async (followedId: number) => {
      if (!user) return;
      try {
        await unfollowUserApi(user.id, followedId);
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    },
    [user],
  );

  const getUserBookmarks = useCallback(async () => {
    if (!user) return [];
    try {
      const response = await getBookmarksApi(user.id);
      return response.data;
    } catch (error) {
      console.error("Error fetching user bookmarks:", error);
      return [];
    }
  }, [user]);

  const getUserStats = useCallback(async () => {
    if (!user) return null;
    try {
      const response = await getUserStatsApi(user.id);
      return response.data;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }
  }, [user]);

  const getUserPosts = useCallback(async () => {
    if (!user) return [];
    try {
      const response = await getUserPostsApi(user.id);
      return response.data;
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return [];
    }
  }, [user]);

  return {
    user,
    getUserProfile,
    fetchUser,
    getUserBookmarks,
    getUserFollowers,
    getUserFollowing,
    followUser,
    unfollowUser,
    updateUserProfile,
    deleteUserAccount,
    getUserStats,
    getUserPosts,
  };
};
