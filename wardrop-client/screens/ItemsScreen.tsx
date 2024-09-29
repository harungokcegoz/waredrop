import React, { useEffect } from "react";
import { YStack, Button } from "tamagui";

import ItemList from "../components/ItemList";
import { Item } from "../model/types";
import { useStore } from "../stores/useStore";
import { useItemViewModel } from "../viewmodels/ItemViewModel";
const ItemsScreen = () => {
  const { user } = useStore();
  const { items, fetchItems, deleteItem } = useItemViewModel();

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user, fetchItems]);

  const handleItemPress = (item: Item) => {
    // Navigate to item details or edit screen
    console.log("Item pressed:", item);
  };

  const handleAddItem = () => {
    // Navigate to add item screen
    console.log("Add item pressed");
  };

  return (
    <YStack flex={1} padding="$4">
      <ItemList items={items} onItemPress={handleItemPress} />
      <Button onPress={handleAddItem}>Add Item</Button>
    </YStack>
  );
};

export default ItemsScreen;
