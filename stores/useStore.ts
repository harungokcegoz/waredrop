import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Item, User } from "../model/types";

import { initialMockUser } from "@/constants/constants";

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  wardrobe: Item[];
  setWardrobe: (items: Item[]) => void;
  addItemWardrobe: (item: Item) => void;
}

export const useStore = create(
  persist<AppState>(
    (set) => ({
      user: initialMockUser,
      wardrobe: [],
      setUser: (user: User | null) => set({ user }),
      setWardrobe: (items: Item[]) => set({ wardrobe: items }),
      addItemWardrobe: (item: Item) =>
        set((state) => ({ wardrobe: [...state.wardrobe, item] })),
    }),
    {
      name: "wardrop-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
