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
  Dialog,
  Button,
} from "tamagui";

import { colors } from "../styles/preset-styles";

import ClothesItemStack from "./ClothesItemStack";

import { Item } from "@/model/types";

interface OutfitFormProps {
  title: string;
  name: string;
  setName: (name: string) => void;
  tags: string;
  setTags: (tags: string) => void;
  wardrobe: Item[];
  selectedItems: Item[];
  toggleItem: (item: Item, category: string) => void;
  onCancel: () => void;
  onSave: (name: string) => void;
  saveButtonText: string;
}

const OutfitForm: React.FC<OutfitFormProps> = ({
  title,
  name,
  setName,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempName, setTempName] = useState(name);

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

  const handleSave = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmSave = () => {
    setName(tempName);
    onSave(tempName);
    setIsDialogOpen(false);
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
          <TouchableOpacity onPress={handleSave}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content padding="$5" gap="$4" width="80%">
            <Dialog.Title>Name Your Outfit</Dialog.Title>
            <Dialog.Description>
              Please enter a name for your outfit.
            </Dialog.Description>
            <Input
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter outfit name"
            />
            <XStack justifyContent="space-between" marginTop="$4">
              <Dialog.Close asChild>
                <Button variant="outlined">Cancel</Button>
              </Dialog.Close>
              <Button
                onPress={handleConfirmSave}
                backgroundColor={colors.cta}
                color="white"
              >
                Save
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </SafeAreaView>
  );
};

export default OutfitForm;
