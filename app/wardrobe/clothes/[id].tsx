import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Text,
  XStack,
  YStack,
  ScrollView,
  H4,
  View,
  H3,
  Spinner,
} from "tamagui";

import { colors } from "../../../styles/preset-styles";
import { useItemViewModel } from "../../../viewmodels/ItemViewModel";

import { Item } from "@/model/types";

export default function ClothesItemDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getItemById, deleteItemById } = useItemViewModel();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setError("Item ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        const fetchedItem = await getItemById(Number(id));
        if (fetchedItem) {
          setItem(fetchedItem);
        } else {
          setError("Item not found");
        }
      } catch (err) {
        setError("Error fetching item");
        console.error("Error fetching item:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, getItemById]);

  const handleOpenLink = () => {
    if (item?.commercial_link) {
      Linking.openURL(item.commercial_link);
    }
  };

  const handleDelete = async () => {
    if (item) {
      try {
        await deleteItemById(item.id);
        router.back();
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Something went wrong on deleting item");
      }
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>{error || "Item not found"}</Text>
      </SafeAreaView>
    );
  }
  console.log("hrn", item.commercial_link);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <YStack flex={1}>
        <ScrollView>
          <XStack
            justifyContent="space-between"
            padding="$4"
            alignItems="center"
          >
            <View onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </View>
            <XStack gap="$4">
              <View
                onPress={() =>
                  router.push({
                    pathname: "/wardrobe/clothes/edit-clothes/[itemId]",
                    params: { itemId: item.id },
                  })
                }
                marginRight="$2"
                backgroundColor="white"
              >
                <Ionicons name="create-outline" size={24} color="black" />
              </View>
              <View onPress={handleDelete}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </View>
            </XStack>
          </XStack>
          <YStack alignItems="center" width="100%">
            <Image
              source={{ uri: item.image_url }}
              style={{ width: 300, height: 400 }}
              contentFit="contain"
              cachePolicy="memory"
            />
          </YStack>
          <YStack padding="$4" gap="$3" alignItems="center">
            <H3 fontFamily="jost" color={colors.textBlack} fontWeight="bold">
              {item.brand}
            </H3>
            <XStack justifyContent="space-between" alignItems="center" gap="$3">
              <H4 fontFamily="jost" color={colors.textBlack} fontWeight="300">
                {item.category}
              </H4>
              <H4 fontFamily="jost" color={colors.textBlack} fontWeight="600">
                ${item.price}
              </H4>
            </XStack>

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
