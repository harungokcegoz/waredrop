import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import React from "react";
import { Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, XStack, YStack, ScrollView, H2, H4 } from "tamagui";

import { getImage } from "../../../assets/imagesMap";
import { colors, shadows } from "../../../styles/preset-styles";
import { useItemViewModel } from "../../../viewmodels/ItemViewModel";

export default function ClothesItemDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getItemById, deleteItemById } = useItemViewModel();

  // const item = getItemById(Number(id));
  const item = {
    id: 1,
    user_id: 1,
    category: "Jacket",
    name: "Jacket",
    image_url: getImage("jacket") as string,
    brand: "Brand",
    commercial_link: "https://www.google.com",
    price: 100,
    color: "Red",
    num_of_likes: 2000,
    num_of_bookmarks: 100,
  };

  if (!item) {
    return (
      <SafeAreaView>
        <Text>Item not found</Text>
      </SafeAreaView>
    );
  }

  const handleOpenLink = () => {
    if (item.commercial_link) {
      Linking.openURL(item.commercial_link);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1}>
        <ScrollView>
          <XStack justifyContent="space-between" padding="$4">
            <Button
              icon={<Ionicons name="arrow-back" size={24} color="black" />}
              onPress={() => router.back()}
            />
            <XStack>
              <Button
                icon={
                  <Ionicons name="create-outline" size={24} color="black" />
                }
                onPress={() =>
                  router.push(
                    `/wardrobe/clothes/edit-clothes-item?id=${item.id}`,
                  )
                }
                marginRight="$2"
              />
              <Button
                icon={<Ionicons name="trash-outline" size={24} color="black" />}
                onPress={() => {
                  deleteItemById(item.id);
                  router.back();
                }}
              />
            </XStack>
          </XStack>
          <YStack alignItems="center">
            <Image
              source={item.image_url}
              style={{ width: 300, height: 400 }}
              contentFit="cover"
              cachePolicy="memory"
            />
          </YStack>
          <YStack padding="$4" gap="$4">
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="$10"
              {...shadows}
            >
              <H2 fontFamily="jost" color={colors.textBlack} fontWeight="bold">
                {item.brand}
              </H2>
              <H4 fontFamily="jost" color={colors.textBlack} fontWeight="300">
                {item.category}
              </H4>
              <H4 fontFamily="jost" color={colors.textBlack} fontWeight="600">
                ${item.price}
              </H4>
            </XStack>
            <YStack
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              gap="$2"
            >
              <XStack alignItems="center" justifyContent="center" gap="$1">
                <Ionicons name="heart-outline" size={24} color="black" />
                <Text
                  fontFamily="jost"
                  color={colors.textBlack}
                  fontWeight="600"
                >
                  {item.num_of_likes >= 1000
                    ? (item.num_of_likes / 1000).toFixed(0) + "k"
                    : item.num_of_likes}
                </Text>
              </XStack>
              <XStack alignItems="center" justifyContent="center" gap="$1">
                <Ionicons name="bookmark-outline" size={24} color="black" />
                <Text
                  fontFamily="jost"
                  color={colors.textBlack}
                  fontWeight="600"
                >
                  {item.num_of_bookmarks}
                </Text>
              </XStack>
            </YStack>
            {item.commercial_link && (
              <Button
                icon={
                  <Ionicons
                    name="link-outline"
                    size={24}
                    color={colors.primary}
                  />
                }
                onPress={handleOpenLink}
                marginTop="$4"
              >
                View Product on Web
              </Button>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
