import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { User } from "../model/types";

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create(
  persist<AppState>(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: "wardrop-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
