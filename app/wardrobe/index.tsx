import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Circle, Spacer, XStack } from "tamagui";

import ClothesItemStack from "../../components/ClothesItemStack";
import { colors } from "../../styles/preset-styles";
import { useItemViewModel } from "../../viewmodels/ItemViewModel";

import { useStore } from "@/stores/useStore";

export default function WardrobeScreen() {
  const { wardrobe, fetchItems } = useItemViewModel();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  }, [fetchItems]);

  const handleItemPress = useCallback(
    (itemId: number) => {
      router.push({
        pathname: "/wardrobe/clothes/[id]",
        params: { id: itemId, userId: user?.id },
      });
    },
    [router, user],
  );

  const categories = [...new Set(wardrobe.map((item) => item.category))];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <XStack padding="$4" justifyContent="space-between" alignItems="center">
          <Text fontSize="$6" fontWeight="bold">
            Wardrobe
          </Text>
          <Circle width={40} height={40} backgroundColor={colors.primary}>
            <Link href="/wardrobe/add-clothes-item">
              <Ionicons name="add" size={24} color="white" />
            </Link>
          </Circle>
        </XStack>
        {categories.map((category) => (
          <View marginBottom="$4" key={category} gap="$4">
            <Text fontSize="$5" fontWeight="bold" marginLeft="$5">
              {category}
            </Text>
            <ClothesItemStack
              onItemPress={handleItemPress}
              items={wardrobe.filter((item) => item.category === category)}
            />
          </View>
        ))}
        <Spacer size="$10" />
      </ScrollView>
    </SafeAreaView>
  );
}
