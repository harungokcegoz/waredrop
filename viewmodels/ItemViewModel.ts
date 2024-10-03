import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";

import { Item } from "../model/types";
import {
  getUserItems,
  createItem,
  updateItem,
  deleteItem,
} from "../services/api";
import { useStore } from "../stores/useStore";

const STORAGE_KEY = "@wardrobe_items";

export const useItemViewModel = () => {
  const { user } = useStore();
  const [items, setItems] = useState<Item[]>([]);

  const saveItemsToStorage = async (updatedItems: Item[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error saving items to storage:", error);
    }
  };

  const fetchItems = useCallback(async () => {
    try {
      const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }

      if (user) {
        const response = await getUserItems(user.id);
        setItems(response.data);
        saveItemsToStorage(response.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }, [user, setItems]);

  const addItem = useCallback(
    async (item: Omit<Item, "id" | "user_id">) => {
      try {
        const newItem = { ...item, id: Date.now(), user_id: user?.id || 0 };
        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        saveItemsToStorage(updatedItems);

        if (user) {
          const response = await createItem(user.id, item);
          const serverItem = response.data;
          setItems((items) =>
            items.map((i) => (i.id === newItem.id ? serverItem : i)),
          );
          saveItemsToStorage(
            items.map((i) => (i.id === newItem.id ? serverItem : i)),
          );
        }
      } catch (error) {
        console.error("Error adding item:", error);
      }
    },
    [user, items, setItems],
  );

  const updateItemById = useCallback(
    async (itemId: number, itemData: Partial<Item>) => {
      try {
        const updatedItems = items.map((item) =>
          item.id === itemId ? { ...item, ...itemData } : item,
        );
        setItems(updatedItems);
        saveItemsToStorage(updatedItems);

        if (user) {
          await updateItem(user.id, itemId, itemData);
        }
      } catch (error) {
        console.error("Error updating item:", error);
      }
    },
    [user, items, setItems],
  );

  const deleteItemById = useCallback(
    async (itemId: number) => {
      try {
        const updatedItems = items.filter((item) => item.id !== itemId);
        setItems(updatedItems);
        saveItemsToStorage(updatedItems);

        if (user) {
          await deleteItem(user.id, itemId);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
    [user, items, setItems],
  );

  const getItemById = useCallback(
    (itemId: number) => {
      return items.find((item) => item.id === itemId);
    },
    [items],
  );

  return {
    items,
    fetchItems,
    addItem,
    updateItemById,
    deleteItemById,
    getItemById,
  };
};
