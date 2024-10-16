import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React, { useCallback } from "react";
import { Card, View, Spacer } from "tamagui";

import { Item } from "../model/types";

import { colors, pressAnimationStyle } from "@/styles/preset-styles";

interface ClothesItemStackProps {
  items: Item[];
  onItemPress: (itemId: number) => void;
  selectedItems?: Item[];
  horizontal?: boolean;
}

const ClothesItemStack: React.FC<ClothesItemStackProps> = ({
  items,
  onItemPress,
  selectedItems,
  horizontal = true,
}) => {
  const isItemSelected = useCallback(
    (item: Item) => selectedItems?.some((i) => i.id === item.id),
    [selectedItems],
  );

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      const isSelected = isItemSelected(item);
      return (
        <Card
          marginRight="$4"
          marginBottom="$2"
          width={150}
          height={200}
          {...pressAnimationStyle}
          onPress={() => onItemPress(item.id)}
          borderWidth={isSelected ? 3 : 0}
          borderColor={isSelected ? colors.primary : "transparent"}
          borderRadius="$8"
        >
          <Image
            source={{ uri: item.image_url }}
            style={{
              width: "100%",
              height: "100%",
            }}
            contentFit="cover"
            cachePolicy="memory"
          />
        </Card>
      );
    },
    [isItemSelected, onItemPress],
  );

  return (
    <View>
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={horizontal}
        estimatedItemSize={150}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={horizontal ? <Spacer size="$4" /> : null}
        ListFooterComponent={horizontal ? <Spacer size="$4" /> : null}
        extraData={selectedItems}
      />
    </View>
  );
};

export default ClothesItemStack;
