import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, XStack, YStack, ScrollView, H3, Spinner } from "tamagui";

import { colors } from "../../styles/preset-styles";
import { useOutfitViewModel } from "../../viewmodels/OutfitViewModel";

import { Outfit } from "@/model/types";

export default function OutfitDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getOutfitById } = useOutfitViewModel();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOutfit = async () => {
      if (id) {
        const fetchedOutfit = await getOutfitById(Number(id));
        setOutfit(fetchedOutfit);
        setIsLoading(false);
      }
    };
    fetchOutfit();
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  if (!outfit) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Outfit not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <XStack justifyContent="space-between" padding="$4" alignItems="center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <XStack space="$2">
            {outfit.tags.map((tag) => (
              <Text key={tag} color={colors.secondary} fontFamily="jost">
                {tag}
              </Text>
            ))}
          </XStack>
          <TouchableOpacity
            onPress={() => router.push(`/outfits/edit/${outfit.id}`)}
          >
            <Ionicons name="create-outline" size={24} color="black" />
          </TouchableOpacity>
        </XStack>
        <YStack gap="$4" padding="$4">
          {Object.values(outfit.items).map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/wardrobe/clothes/${item.id}`)}
            >
              <XStack space="$4" alignItems="center">
                <Image
                  source={{ uri: item.image_url }}
                  style={{ width: 300, height: 400 }}
                />
                <YStack>
                  <H3 fontFamily="jost" color={colors.textBlack}>
                    {item.brand}
                  </H3>
                  <Text fontFamily="jost" color={colors.textGray}>
                    {item.category}
                  </Text>
                </YStack>
              </XStack>
            </TouchableOpacity>
          ))}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
