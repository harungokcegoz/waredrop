import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Card, View, Spacer } from "tamagui";

import { Item } from "../model/types";

import { pressAnimationStyle } from "@/styles/preset-styles";

interface ClothesItemStackProps {
  items: Item[];
}

const ClothesItemStack: React.FC<ClothesItemStackProps> = ({ items }) => {
  const renderItem = ({ item }: { item: Item }) => (
    <Card
      marginRight="$2"
      width={150}
      height={200}
      {...pressAnimationStyle}
      onPress={() => {
        router.push({
          pathname: "/wardrobe/clothes/[id]",
          params: { id: item.id },
        });
      }}
    >
      <Image
        source={{ uri: item.image_url }}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
        cachePolicy="memory"
      />
    </Card>
  );

  return (
    <View>
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        estimatedItemSize={150}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={<Spacer size="$4" />}
      />
    </View>
  );
};

export default ClothesItemStack;
