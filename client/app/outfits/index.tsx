import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState, useMemo } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Circle, XStack, View, YStack, H5 } from "tamagui";

import OutfitCard from "../../components/OutfitCard";
import { useStore } from "../../stores/useStore";
import { colors, pressAnimationStyle } from "../../styles/preset-styles";
import { useOutfitViewModel } from "../../viewmodels/OutfitViewModel";
export default function OutfitsScreen() {
  const { outfits } = useStore();
  const { fetchOutfits } = useOutfitViewModel();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchOutfits();
  }, []);

  useEffect(() => {
    const tags = outfits.flatMap((outfit) => outfit.tags);
    setAllTags([...new Set(tags)]);
  }, [outfits]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filteredOutfits = useMemo(
    () =>
      outfits.filter(
        (outfit) =>
          selectedTags.length === 0 ||
          selectedTags.some((tag) => outfit.tags.includes(tag)),
      ),
    [outfits, selectedTags],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <XStack padding="$4" justifyContent="space-between" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" fontFamily="jost">
            Outfits
          </Text>
          <Circle width={40} height={40} backgroundColor={colors.primary}>
            <Link href="/outfits/create">
              <Ionicons name="add" size={24} color="white" />
            </Link>
          </Circle>
        </XStack>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 16 }}
        >
          <XStack gap="$3">
            {allTags.map((tag) => (
              <View
                key={tag}
                backgroundColor={
                  selectedTags.includes(tag)
                    ? colors.secondary
                    : colors.background
                }
                onPress={() => toggleTag(tag)}
                borderWidth={1}
                borderColor={colors.secondary}
                borderRadius="$8"
                padding="$2"
                paddingHorizontal="$3"
                {...pressAnimationStyle}
              >
                <Text
                  color={
                    selectedTags.includes(tag) ? "white" : colors.secondary
                  }
                  fontFamily="jost"
                >
                  #{tag}
                </Text>
              </View>
            ))}
          </XStack>
        </ScrollView>
        <YStack gap="$2">
          <H5 fontFamily="jost" padding="$4">
            Results: {filteredOutfits.length}
          </H5>
          {filteredOutfits.length === 0 ? (
            <View padding="$4">
              <Text>No outfits found</Text>
            </View>
          ) : (
            <XStack
              flexWrap="wrap"
              justifyContent="space-between"
              paddingHorizontal="$6"
              gap="$5"
            >
              {filteredOutfits.map((outfit) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  selectedTags={selectedTags}
                  size="small"
                />
              ))}
            </XStack>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
