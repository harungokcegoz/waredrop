import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Card, View } from "tamagui";

import { getImage } from "../assets/imagesMap";
import { Item } from "../model/types";

import { pressAnimationStyle } from "@/styles/preset-styles";

interface ClothesItemStackProps {
  items: Item[];
}

const ITEMS: Item[] = [
  {
    id: 1,
    user_id: 1,
    category: "Jacket",
    name: "Jacket",
    image_url: getImage("jacket") as string,
    brand: "Brand",
    price: 100,
    color: "Red",
  },
  {
    id: 2,
    user_id: 1,
    category: "Pants",
    name: "Pants",
    image_url: getImage("jacket") as string,
    brand: "Brand",
    price: 100,
    color: "Red",
  },
  {
    id: 3,
    user_id: 1,
    category: "Shirt",
    name: "Shirt",
    image_url: getImage("jacket") as string,
    brand: "Brand",
    price: 100,
    color: "Red",
  },
  {
    id: 4,
    user_id: 1,
    category: "Shoes",
    name: "Shoes",
    image_url: getImage("jacket") as string,
    brand: "Brand",
    price: 100,
    color: "Red",
  },
  {
    id: 5,
    user_id: 1,
    category: "Hat",
    name: "Hat",
    image_url: getImage("jacket") as string,
    brand: "Brand",
    price: 100,
    color: "Red",
  },
];

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
        source={getImage("jacket")}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
        cachePolicy="memory"
      />
    </Card>
  );

  return (
    <View paddingHorizontal="$4">
      <FlashList
        data={ITEMS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        estimatedItemSize={150}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default ClothesItemStack;
