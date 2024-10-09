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
  addWardrobeItem: (item: Item) => void;
  updateWardrobeItem: (item: Item) => void;
  deleteWardrobeItem: (itemId: number) => void;
}

export const useStore = create(
  persist<AppState>(
    (set) => ({
      user: initialMockUser,
      wardrobe: [],
      setUser: (user: User | null) => set({ user }),
      setWardrobe: (items: Item[]) => set({ wardrobe: items }),
      addWardrobeItem: (item: Item) =>
        set((state) => ({ wardrobe: [...state.wardrobe, item] })),
      updateWardrobeItem: (item: Item) =>
        set((state) => ({
          wardrobe: state.wardrobe.map((i) => (i.id === item.id ? item : i)),
        })),
      deleteWardrobeItem: (itemId: number) =>
        set((state) => ({
          wardrobe: state.wardrobe.filter((i) => i.id !== itemId),
        })),
    }),
    {
      name: "wardrop-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
