import { useCallback, useState } from "react";

import { Outfit } from "../model/types";
import {
  getUserOutfits,
  createOutfit,
  updateOutfit,
  deleteOutfit,
} from "../services/api";
import { useStore } from "../stores/useStore";

export const useOutfitViewModel = () => {
  const { user } = useStore();
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  const fetchOutfits = useCallback(async () => {
    if (!user) return;
    try {
      const response = await getUserOutfits(user.id);
      setOutfits(response.data);
    } catch (error) {
      console.error("Error fetching outfits:", error);
    }
  }, [user, setOutfits]);

  const addOutfit = useCallback(
    async (outfit: Omit<Outfit, "id" | "user_id">) => {
      if (!user) return;
      try {
        const response = await createOutfit(user.id, outfit);
        setOutfits([...outfits, response.data]);
      } catch (error) {
        console.error("Error adding outfit:", error);
      }
    },
    [user, outfits, setOutfits],
  );

  const updateOutfitById = useCallback(
    async (outfitId: number, outfitData: Partial<Outfit>) => {
      if (!user) return;
      try {
        const response = await updateOutfit(user.id, outfitId, outfitData);
        setOutfits(
          outfits.map((outfit: Outfit) =>
            outfit.id === outfitId ? response.data : outfit,
          ),
        );
      } catch (error) {
        console.error("Error updating outfit:", error);
      }
    },
    [user, outfits, setOutfits],
  );

  const deleteOutfitById = useCallback(
    async (outfitId: number) => {
      if (!user) return;
      try {
        await deleteOutfit(user.id, outfitId);
        setOutfits(outfits.filter((outfit: Outfit) => outfit.id !== outfitId));
      } catch (error) {
        console.error("Error deleting outfit:", error);
      }
    },
    [user, outfits, setOutfits],
  );

  return {
    outfits,
    fetchOutfits,
    addOutfit,
    updateOutfitById,
    deleteOutfitById,
  };
};
