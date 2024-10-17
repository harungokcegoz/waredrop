import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Item, Outfit, User } from "../model/types";

interface AppState {
  user: User | null;
  wardrobe: Item[];
  outfits: Outfit[];
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setWardrobe: (items: Item[]) => void;
  addWardrobeItem: (item: Item) => void;
  updateWardrobeItem: (item: Item) => void;
  deleteWardrobeItem: (itemId: number) => void;
  setOutfits: (outfits: Outfit[]) => void;
  addOutfit: (outfit: Outfit) => void;
  updateOutfitById: (outfitId: number, outfitData: Partial<Outfit>) => void;
  deleteOutfit: (outfitId: number) => void;
}

export const useStore = create(
  persist<AppState>(
    (set) => ({
      user: null,
      wardrobe: [],
      outfits: [],
      token: null,
      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
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
      setOutfits: (outfits: Outfit[]) => set({ outfits }),
      addOutfit: (outfit: Outfit) =>
        set((state) => ({ outfits: [...state.outfits, outfit] })),
      updateOutfitById: (outfitId: number, outfitData: Partial<Outfit>) =>
        set((state) => ({
          outfits: state.outfits.map((o) =>
            o.id === outfitId ? { ...o, ...outfitData } : o,
          ),
        })),
      deleteOutfit: (outfitId: number) =>
        set((state) => ({
          outfits: state.outfits.filter((o) => o.id !== outfitId),
        })),
    }),
    {
      name: "wardrop-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
