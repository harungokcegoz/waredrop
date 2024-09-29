import { useCallback, useState } from "react";

import { Item } from "../model/types";
import {
  getUserItems,
  createItem,
  updateItem,
  deleteItem,
} from "../services/api";
import { useStore } from "../stores/useStore";

export const useItemViewModel = () => {
  const { user } = useStore();
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    try {
      const response = await getUserItems(user.id);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }, [user, setItems]);

  const addItem = useCallback(
    async (item: Omit<Item, "id" | "user_id">) => {
      if (!user) return;
      try {
        const response = await createItem(user.id, item);
        setItems([...items, response.data]);
      } catch (error) {
        console.error("Error adding item:", error);
      }
    },
    [user, items, setItems],
  );

  const updateItemById = useCallback(
    async (itemId: number, itemData: Partial<Item>) => {
      if (!user) return;
      try {
        const response = await updateItem(user.id, itemId, itemData);
        setItems(
          items.map((item: Item) =>
            item.id === itemId ? response.data : item,
          ),
        );
      } catch (error) {
        console.error("Error updating item:", error);
      }
    },
    [user, items, setItems],
  );

  const deleteItemById = useCallback(
    async (itemId: number) => {
      if (!user) return;
      try {
        await deleteItem(user.id, itemId);
        setItems(items.filter((item: Item) => item.id !== itemId));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
    [user, items, setItems],
  );

  return { items, fetchItems, addItem, updateItemById, deleteItemById };
};
