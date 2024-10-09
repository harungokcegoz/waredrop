import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Circle, Spacer, XStack } from "tamagui";

import ClothesItemStack from "../../components/ClothesItemStack";
import { colors } from "../../styles/preset-styles";
import { useItemViewModel } from "../../viewmodels/ItemViewModel";

export default function WardrobeScreen() {
  const { wardrobe, fetchItems } = useItemViewModel();

  useEffect(() => {
    fetchItems();
  }, []);

  const categories = [...new Set(wardrobe.map((item) => item.category))];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
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
              items={wardrobe.filter((item) => item.category === category)}
            />
          </View>
        ))}
        <Spacer size="$10" />
      </ScrollView>
    </SafeAreaView>
  );
}
