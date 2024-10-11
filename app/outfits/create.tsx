import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, XStack, YStack, ScrollView, Input, Button } from "tamagui";

import { colors } from "../../styles/preset-styles";
import { useItemViewModel } from "../../viewmodels/ItemViewModel";
import { useOutfitViewModel } from "../../viewmodels/OutfitViewModel";

import { Item } from "@/model/types";

export default function CreateOutfit() {
  const router = useRouter();
  const { wardrobe, fetchItems } = useItemViewModel();
  const { addOutfit } = useOutfitViewModel();
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [tags, setTags] = useState<string>("");

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleItem = (item: Item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const handleCreate = async () => {
    await addOutfit({
      name: "New Outfit",
      description: "",
      items: selectedItems,
      tags: tags.split(",").map((tag) => tag.trim()),
    });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <XStack justifyContent="space-between" padding="$4" alignItems="center">
          <TouchableOpacity onPress={() => router.back()}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <Text fontSize="$6" fontWeight="bold" fontFamily="jost">
            Create Outfit
          </Text>
          <TouchableOpacity onPress={handleCreate}>
            <Text color={colors.primary}>Create</Text>
          </TouchableOpacity>
        </XStack>
        <YStack space="$4" padding="$4">
          <Input
            value={tags}
            onChangeText={setTags}
            placeholder="Enter tags (comma-separated)"
          />
          <Text fontSize="$5" fontWeight="bold" fontFamily="jost">
            Select Items
          </Text>
          <XStack flexWrap="wrap" justifyContent="space-around">
            {wardrobe.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => toggleItem(item)}>
                <Image
                  source={{ uri: item.image_url }}
                  style={{
                    width: 100,
                    height: 133,
                    margin: 4,
                    borderWidth: 2,
                    borderColor: selectedItems.some((i) => i.id === item.id)
                      ? colors.secondary
                      : "transparent",
                  }}
                />
              </TouchableOpacity>
            ))}
          </XStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}