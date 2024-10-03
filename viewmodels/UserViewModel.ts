import { useCallback } from "react";

import { User } from "../model/types";
import { getUserById, updateUser, deleteUser } from "../services/api";
import { useStore } from "../stores/useStore";

export const useUserViewModel = () => {
  const { user, setUser } = useStore();

  const fetchUser = useCallback(
    async (userId: number) => {
      try {
        const response = await getUserById(userId);
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
        const response = await updateUser(user.id, userData);
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
      await deleteUser(user.id);
      setUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }, [user, setUser]);

  return { user, fetchUser, updateUserProfile, deleteUserAccount };
};
