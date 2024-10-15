import { useCallback } from "react";

import { Outfit } from "../model/types";
import {
  getUserOutfits,
  createOutfit,
  updateOutfit,
  deleteOutfit,
  getOutfitById as getOutfitByIdApi,
} from "../services/api";
import { useStore } from "../stores/useStore";
import { alert } from "../utils/utils";
export const useOutfitViewModel = () => {
  const { user, outfits, setOutfits } = useStore();

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
    async (outfit: { name: string; tags: string[]; itemIds: number[] }) => {
      if (!user) return;
      try {
        const response = await createOutfit(user.id, outfit);
        if (response.status === 201) {
          setOutfits([...outfits, response.data]);
          alert("Outfit added successfully", "");
        } else {
          alert("Error adding outfit", "Please try again");
        }
      } catch (error) {
        console.error("Error adding outfit:", error);
        alert("Error adding outfit", "Please try again");
      }
    },
    [user, outfits, setOutfits],
  );

  const updateOutfitById = useCallback(
    async (
      outfitId: number,
      outfitData: { name: string; tags: string[]; itemIds: number[] },
    ) => {
      if (!user) return;
      try {
        const response = await updateOutfit(user.id, outfitId, outfitData);
        if (response.status === 201) {
          setOutfits(
            outfits.map((outfit: Outfit) =>
              outfit.id === outfitId ? response.data : outfit,
            ),
          );
          alert("Outfit updated successfully", "");
        } else {
          alert("Error updating outfit", "Please try again");
        }
      } catch (error) {
        console.error("Error updating outfit:", error);
        alert("Error updating outfit", "Please try again");
      }
    },
    [user, outfits, setOutfits],
  );

  const deleteOutfitById = useCallback(
    async (outfitId: number) => {
      if (!user) return;
      try {
        const response = await deleteOutfit(user.id, outfitId);
        if (response.status === 200) {
          setOutfits(
            outfits.filter((outfit: Outfit) => outfit.id !== outfitId),
          );
          alert("Outfit deleted successfully", "");
        } else {
          alert("Error deleting outfit", "Please try again");
        }
      } catch (error) {
        console.error("Error deleting outfit:", error);
        alert("Error deleting outfit", "Please try again");
      }
    },
    [user, outfits, setOutfits],
  );

  const getOutfitById = useCallback(
    async (outfitId: number, userId: number) => {
      if (!user) return null;
      try {
        const response = await getOutfitByIdApi(userId, outfitId);
        return response.data;
      } catch (error) {
        console.error("Error fetching outfit:", error);
        return null;
      }
    },
    [user],
  );

  return {
    fetchOutfits,
    addOutfit,
    updateOutfitById,
    deleteOutfitById,
    getOutfitById,
  };
};
