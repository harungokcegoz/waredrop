import { useCallback, useState } from "react";

import { Item } from "../model/types";
import {
  getUserItemsApi,
  addItemApi,
  deleteItemApi,
  getItemByIdApi,
  updateItemApi,
} from "../services/api";
import { useStore } from "../stores/useStore";
import { alert } from "../utils/utils";

export const useItemViewModel = () => {
  const { user, wardrobe, setWardrobe, addItemWardrobe } = useStore();
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      if (user) {
        const response = await getUserItemsApi(user.id);
        setWardrobe(response.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }, [user, setWardrobe]);

  const addItem = useCallback(
    async (item: Omit<Item, "id" | "user_id">) => {
      try {
        const newItem = { ...item, id: Date.now(), user_id: user?.id || 0 };
        if (user) {
          const response = await addItemApi(user.id, item);
          if (response.status === 201) {
            alert("Clothes item added successfully", "");
            addItemWardrobe(newItem);
            setIsSuccess(true);
            fetchItems();
          } else {
            alert("Error adding item", "Please try again");
            setIsSuccess(false);
          }
        }
      } catch (error) {
        console.error("Error adding item:", error);
      }
    },
    [user, addItemWardrobe, fetchItems],
  );

  const updateItemById = useCallback(
    async (itemId: number, itemData: Partial<Item>) => {
      try {
        const updatedItems = wardrobe.map((item) =>
          item.id === itemId ? { ...item, ...itemData } : item,
        );
        setWardrobe(updatedItems);
        if (user) {
          await updateItemApi(user.id, itemId, itemData);
        }
      } catch (error) {
        console.error("Error updating item:", error);
      }
    },
    [user, wardrobe, setWardrobe],
  );

  const deleteItemById = useCallback(
    async (itemId: number) => {
      try {
        const updatedItems = wardrobe.filter((item) => item.id !== itemId);
        if (user) {
          await deleteItemApi(user.id, itemId);
          setWardrobe(updatedItems);
          alert("Clothes item deleted successfully", "");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
    [user, wardrobe, setWardrobe],
  );

  const getItemById = useCallback(
    async (itemId: number) => {
      if (user) {
        const response = await getItemByIdApi(user.id, itemId);
        return response.data;
      }
    },
    [user],
  );

  return {
    wardrobe,
    fetchItems,
    addItem,
    updateItemById,
    deleteItemById,
    getItemById,
    isSuccess,
  };
};
