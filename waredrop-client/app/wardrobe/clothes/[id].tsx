import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React from "react";
import { Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Image, Text, XStack, YStack } from "tamagui";

import { useItemViewModel } from "../../../viewmodels/ItemViewModel";

export default function ClothesItemDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getItemById, deleteItemById } = useItemViewModel();

  const item = getItemById(Number(id));

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
        <XStack justifyContent="space-between" padding="$4">
          <Button
            icon={<Ionicons name="arrow-back" size={24} color="black" />}
            onPress={() => router.back()}
          />
          <XStack>
            <Button
              icon={<Ionicons name="create-outline" size={24} color="black" />}
              onPress={() =>
                router.push(`/wardrobe/clothes/edit-clothes-item?id=${item.id}`)
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
        <Image
          source={{ uri: item.image_url }}
          width="100%"
          height={400}
          resizeMode="cover"
        />
        <YStack padding="$4">
          <Text fontSize="$6" fontWeight="bold">
            {item.name}
          </Text>
          <Text fontSize="$4" color="$gray10">
            Brand: {item.brand}
          </Text>
          <Text fontSize="$4" color="$gray10">
            Price: ${item.price}
          </Text>
          <Text fontSize="$4" color="$gray10">
            Category: {item.category}
          </Text>
          {item.commercial_link && (
            <Button
              icon={<Ionicons name="link-outline" size={24} color="white" />}
              onPress={handleOpenLink}
              marginTop="$4"
            >
              View Product
            </Button>
          )}
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
