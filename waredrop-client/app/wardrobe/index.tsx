import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Circle } from "tamagui";

import ClothesItemStack from "../../components/ClothesItemStack";
import { colors } from "../../styles/preset-styles";
import { useItemViewModel } from "../../viewmodels/ItemViewModel";

export default function WardrobeScreen() {
  const { items, fetchItems } = useItemViewModel();

  useEffect(() => {
    fetchItems();
  }, []);

  const categories = [...new Set(items.map((item) => item.category))];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        padding="$4"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="$6" fontWeight="bold">
          Wardrobe
        </Text>
        <Circle width={40} height={40} backgroundColor={colors.primary}>
          <Link href="/wardrobe/add-clothes-item">
            <Ionicons name="add" size={24} color="white" />
          </Link>
        </Circle>
      </View>
      <ScrollView>
        {/* {categories.map((category) => ( */}
        <View marginBottom="$4">
          <Text
            fontSize="$5"
            fontWeight="bold"
            marginLeft="$4"
            marginBottom="$2"
          >
            {/* {category} */}
            Jackets
          </Text>
          <ClothesItemStack
            items={items.filter((item) => item.category === "Jackets")}
          />
          <Text
            fontSize="$5"
            fontWeight="bold"
            marginLeft="$4"
            marginBottom="$2"
          >
            {/* {category} */}
            Jackets
          </Text>
          <ClothesItemStack
            items={items.filter((item) => item.category === "Jackets")}
          />
          <Text
            fontSize="$5"
            fontWeight="bold"
            marginLeft="$4"
            marginBottom="$2"
          >
            {/* {category} */}
            Jackets
          </Text>
          <ClothesItemStack
            items={items.filter((item) => item.category === "Jackets")}
          />
          <Text
            fontSize="$5"
            fontWeight="bold"
            marginLeft="$4"
            marginBottom="$2"
          >
            {/* {category} */}
            Jackets
          </Text>
          <ClothesItemStack
            items={items.filter((item) => item.category === "Jackets")}
          />
        </View>
        {/* ))} */}
      </ScrollView>
    </SafeAreaView>
  );
}
