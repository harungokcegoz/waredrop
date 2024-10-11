import React, { useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  XStack,
  YStack,
  ScrollView,
  Input,
  Label,
  Spacer,
} from "tamagui";

import { colors } from "../styles/preset-styles";

import ClothesItemStack from "./ClothesItemStack";

import { Item } from "@/model/types";

interface OutfitFormProps {
  title: string;
  tags: string;
  setTags: (tags: string) => void;
  wardrobe: Item[];
  selectedItems: Item[];
  toggleItem: (item: Item, category: string) => void;
  onCancel: () => void;
  onSave: () => void;
  saveButtonText: string;
}

const OutfitForm: React.FC<OutfitFormProps> = ({
  title,
  tags,
  setTags,
  wardrobe,
  selectedItems,
  toggleItem,
  onCancel,
  onSave,
  saveButtonText,
}) => {
  const [tagError, setTagError] = useState<string | null>(null);

  const categorizedWardrobe = useMemo(() => {
    const categories: { [key: string]: Item[] } = {};
    wardrobe.forEach((item) => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    return categories;
  }, [wardrobe]);

  const handleTagChange = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= 3) {
      setTags(text);
      setTagError(null);
    } else {
      setTagError("Maximum 3 tags allowed");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <XStack justifyContent="space-between" padding="$4" alignItems="center">
          <TouchableOpacity onPress={onCancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <Text fontSize="$6" fontWeight="bold" fontFamily="jost">
            {title}
          </Text>
          <TouchableOpacity onPress={onSave}>
            <Text color={colors.primary}>{saveButtonText}</Text>
          </TouchableOpacity>
        </XStack>
        <YStack gap="$4">
          <YStack gap="$2" paddingHorizontal="$4">
            <Label htmlFor="tags">Tags (max 3)</Label>
            <Input
              id="tags"
              value={tags}
              onChangeText={handleTagChange}
              placeholder="Enter up to 3 tags separated by commas"
            />
            {tagError && (
              <Text color="red" fontSize="$2">
                {tagError}
              </Text>
            )}
          </YStack>
          <Text
            fontSize="$5"
            fontWeight="bold"
            fontFamily="jost"
            paddingHorizontal="$4"
          >
            Select Items
          </Text>
          {Object.entries(categorizedWardrobe).map(([category, items]) => (
            <YStack key={category} gap="$3">
              <Text
                fontSize="$4"
                fontWeight="bold"
                fontFamily="jost"
                paddingHorizontal="$4"
              >
                {category}
              </Text>
              <ClothesItemStack
                items={items}
                onItemPress={(item) => toggleItem(item, category)}
                selectedItems={selectedItems}
              />
            </YStack>
          ))}
        </YStack>
        <Spacer size="$12" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OutfitForm;
