import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Card, Text, XStack, YStack, View } from "tamagui";

import { colors, pressAnimationStyle } from "../styles/preset-styles";

import { Outfit, Item } from "@/model/types";

interface OutfitCardProps {
  outfit: Outfit;
  selectedTags?: string[];
  size?: "small" | "large";
  userId?: number;
}

const OutfitCard: React.FC<OutfitCardProps> = ({
  outfit,
  selectedTags,
  size = "small",
  userId,
}) => {
  const router = useRouter();

  const renderClothingItem = (item: Item, position: string) => {
    const positionStyles: Record<string, object> = {
      tshirts: {
        top: 0,
        left: size === "small" ? 25 : 90,
        width: size === "small" ? 75 : 120,
      },
      jackets: {
        top: 30,
        left: 0,
        width: size === "small" ? 75 : 120,
      },
      shoes: {
        bottom: 0,
        left: size === "small" ? 50 : 200,
        width: size === "small" ? 75 : 100,
      },
      watches: {
        top: 70,
        right: 10,
        width: size === "small" ? 70 : 120,
      },
      bottoms: {
        bottom: size === "small" ? 30 : 20,
        left: size === "small" ? 50 : 80,
        width: size === "small" ? 70 : 150,
        zIndex: 1,
      },
    };

    return (
      <Image
        key={item.id}
        source={{ uri: item.image_url }}
        style={{
          position: "absolute",
          ...positionStyles[position],
          aspectRatio: 1,
        }}
        contentFit="contain"
        cachePolicy="memory"
      />
    );
  };

  const categorizeItems = (items: Record<string, Item>) => {
    const categories: Record<string, Item | null> = {
      tshirts: null,
      jackets: null,
      bottoms: null,
      shoes: null,
      watches: null,
    };

    Object.values(items).forEach((item) => {
      if (item.category.toLowerCase() === "tshirts" && !categories.tshirts)
        categories.tshirts = item;
      else if (item.category.toLowerCase() === "jackets" && !categories.jackets)
        categories.jackets = item;
      else if (item.category.toLowerCase() === "bottoms" && !categories.bottoms)
        categories.bottoms = item;
      else if (item.category.toLowerCase() === "shoes" && !categories.shoes)
        categories.shoes = item;
      else if (item.category.toLowerCase() === "watches" && !categories.watches)
        categories.watches = item;
    });

    return categories;
  };

  const categorizedItems = categorizeItems(outfit.items);

  return (
    <Card
      onPress={() =>
        router.push({
          pathname: "/outfits/[id]",
          params: { id: outfit.id, userId: outfit.user_id },
        })
      }
      backgroundColor="white"
      borderRadius="$4"
      overflow="hidden"
      borderWidth={size === "small" ? 1 : 0}
      borderColor={colors.border}
      {...pressAnimationStyle}
      width={size === "small" ? 150 : "100%"}
      height={size === "small" ? 250 : 350}
      padding="$2"
    >
      <Text fontFamily="jost" fontSize="$2" margin="$1">
        {outfit.name}
      </Text>
      <YStack flex={1}>
        <View flex={1} position="relative">
          {Object.entries(categorizedItems).map(
            ([position, item]) => item && renderClothingItem(item, position),
          )}
        </View>
        <XStack flexWrap="wrap" padding="$2">
          {Object.values(outfit.tags).map((tag) => (
            <Text
              key={tag}
              color={
                selectedTags?.includes(tag)
                  ? colors.secondary
                  : colors.textBlack
              }
              fontFamily="jost"
              fontSize="$1"
              fontWeight={200}
              marginRight="$2"
            >
              #{tag}
            </Text>
          ))}
        </XStack>
      </YStack>
    </Card>
  );
};

export default OutfitCard;
