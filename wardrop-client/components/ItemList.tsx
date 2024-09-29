import React from "react";
import { FlatList, ListRenderItem } from "react-native";
import { XStack, YStack, Text, Image } from "tamagui";

import { Item } from "../model/types";

interface ItemListProps {
  items: Item[];
  onItemPress: (item: Item) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onItemPress }) => {
  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <XStack
      padding="$2"
      marginVertical="$1"
      backgroundColor="$backgroundStrong"
      borderRadius="$2"
      onPress={() => onItemPress(item)}
    >
      <Image
        source={{ uri: item.image_url }}
        width={50}
        height={50}
        borderRadius="$1"
      />
      <YStack marginLeft="$2" justifyContent="center">
        <Text fontSize="$4" fontWeight="bold">
          {item.name}
        </Text>
        <Text fontSize="$3" color="$gray10">
          {item.category}
        </Text>
      </YStack>
    </XStack>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default ItemList;
