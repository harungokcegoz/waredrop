import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  XStack,
  YStack,
  ScrollView,
  Spinner,
  View,
  Spacer,
  H4,
} from "tamagui";

import { colors } from "../../styles/preset-styles";
import { useOutfitViewModel } from "../../viewmodels/OutfitViewModel";

import { Outfit } from "@/model/types";

export default function OutfitDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getOutfitById, deleteOutfitById } = useOutfitViewModel();
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
  }, [id, getOutfitById]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Outfit",
      "Are you sure you want to delete this outfit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (outfit) {
              await deleteOutfitById(outfit.id);
              router.back();
            }
          },
        },
      ],
    );
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

          <XStack gap="$2">
            {outfit.tags.map((tag) => (
              <Text key={tag} color={colors.secondary} fontFamily="jost">
                #{tag}
              </Text>
            ))}
          </XStack>
          <XStack gap="$4">
            <TouchableOpacity
              onPress={() => router.push(`/outfits/edit/${outfit.id}`)}
            >
              <Ionicons name="create-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </XStack>
        </XStack>
        <YStack gap="$4" padding="$4">
          <H4 fontFamily="jost" color={colors.textBlack}>
            {outfit.name}
          </H4>
          {Object.values(outfit.items).map((item) => (
            <View
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/wardrobe/clothes/[id]",
                  params: { id: item.id },
                })
              }
              height={200}
              justifyContent="center"
            >
              <XStack gap="$4" alignItems="center">
                <Image
                  contentFit="contain"
                  cachePolicy="disk"
                  source={{ uri: item.image_url }}
                  style={{ width: 150, height: 180 }}
                />
                <YStack>
                  <H4 fontFamily="jost" color={colors.textBlack}>
                    {item.brand}
                  </H4>
                  <Text fontFamily="jost" color={colors.textGray}>
                    {item.category}
                  </Text>
                </YStack>
              </XStack>
            </View>
          ))}
        </YStack>
        <Spacer size="$10" />
      </ScrollView>
    </SafeAreaView>
  );
}
