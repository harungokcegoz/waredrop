import { useCallback } from "react";

import { Item } from "../model/types";
import {
  getUserItems,
  createItem,
  updateItem,
  deleteItem,
} from "../services/api";
import { useStore } from "../stores/useStore";
import { alert } from "../utils/utils";

export const useItemViewModel = () => {
  const { user, wardrobe, setWardrobe, addItemWardrobe } = useStore();

  const fetchItems = useCallback(async () => {
    try {
      if (user) {
        const response = await getUserItems(user.id);
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
        addItemWardrobe(newItem);

        if (user) {
          const response = await createItem(user.id, item);
          if (response.status === 200) {
            alert("Clothes item added successfully", "");
          } else {
            alert("Error adding item", "Please try again");
          }
        }
      } catch (error) {
        console.error("Error adding item:", error);
      }
    },
    [user, wardrobe, setWardrobe, addItemWardrobe],
  );

  const updateItemById = useCallback(
    async (itemId: number, itemData: Partial<Item>) => {
      try {
        const updatedItems = wardrobe.map((item) =>
          item.id === itemId ? { ...item, ...itemData } : item,
        );
        setWardrobe(updatedItems);
        if (user) {
          await updateItem(user.id, itemId, itemData);
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
        setWardrobe(updatedItems);
        if (user) {
          await deleteItem(user.id, itemId);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
    [user, wardrobe, setWardrobe],
  );

  const getItemById = useCallback(
    (itemId: number) => {
      return wardrobe.find((item) => item.id === itemId);
    },
    [wardrobe],
  );

  return {
    wardrobe,
    fetchItems,
    addItem,
    updateItemById,
    deleteItemById,
    getItemById,
  };
};
