import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Input,
  YStack,
  XStack,
  Circle,
  Label,
  ScrollView,
  Button,
  Popover,
} from "tamagui";

import { colors } from "../styles/preset-styles";

interface ClothesItemFormProps {
  initialValues?: {
    name: string;
    brand: string;
    price: string;
    category: string;
    image_url: string;
    commercial_link?: string;
  };
  onSubmit: (values: {
    name: string;
    brand: string;
    price: number;
    category: string;
    image_url: string;
    commercial_link?: string;
  }) => void;
  onCancel: () => void;
  title: string;
  icon: "cloud-upload" | "save";
}

export default function ClothesItemForm({
  initialValues,
  onSubmit,
  onCancel,
  title,
  icon,
}: ClothesItemFormProps) {
  const [image, setImage] = useState<string | null>(
    initialValues?.image_url || null,
  );
  const [name, setName] = useState(initialValues?.name || "");
  const [brand, setBrand] = useState(initialValues?.brand || "");
  const [price, setPrice] = useState(initialValues?.price || "");
  const [category, setCategory] = useState(initialValues?.category || "");
  const [commercial_link, setcommercial_link] = useState(
    initialValues?.commercial_link || "",
  );
  const [popoverOpen, setPopoverOpen] = useState(false);

  const resetForm = () => {
    setImage(null);
    setName("");
    setBrand("");
    setPrice("");
    setCategory("");
    setcommercial_link("");
  };

  const pickImage = async (sourceType: "gallery" | "camera") => {
    setPopoverOpen(false);
    let result;

    if (sourceType === "gallery") {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    } else {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return;
      }

      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled && result.assets[0].uri) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imageBase64 = `data:image/png;base64,${base64}`;
      setImage(imageBase64);
    }
  };

  const handleSubmit = () => {
    if (!image || !name || !brand || !price || !category) {
      alert("Please fill all required fields and add an image");
      return;
    }

    onSubmit({
      name,
      brand,
      price: parseFloat(price),
      category,
      image_url: image,
      commercial_link: commercial_link,
    });
    resetForm();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView flex={1}>
        <YStack flex={1} padding="$4" gap="$2">
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$4"
          >
            <Circle
              width={35}
              height={35}
              backgroundColor={colors.primary}
              onPress={onCancel}
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </Circle>

            <Text fontSize="$6" fontWeight="bold">
              {title}
            </Text>

            <Circle
              width={35}
              height={35}
              backgroundColor={colors.primary}
              onPress={handleSubmit}
            >
              <Ionicons name={icon} size={20} color="white" />
            </Circle>
          </XStack>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <Popover.Trigger asChild>
              <View alignItems="center" justifyContent="center">
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 300, height: 300 }}
                    contentFit="contain"
                    cachePolicy="memory"
                  />
                ) : (
                  <View
                    width={300}
                    height={300}
                    borderWidth={2}
                    borderStyle="dashed"
                    borderColor="$gray8"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text>Tap to add photo</Text>
                  </View>
                )}
              </View>
            </Popover.Trigger>
            <Popover.Content
              borderWidth={1}
              borderColor={colors.border}
              enterStyle={{ y: -10, opacity: 0 }}
              exitStyle={{ y: -10, opacity: 0 }}
              elevate
              animation={[
                "quick",
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
            >
              <Popover.Arrow
                size={10}
                borderWidth={1}
                borderColor={colors.border}
              />
              <YStack gap="$3" padding="$3">
                <Button
                  onPress={() => pickImage("gallery")}
                  backgroundColor={colors.primary}
                >
                  <Ionicons name="images" size={20} color="white" />
                  <Text color="white"> Gallery</Text>
                </Button>
                <Button
                  onPress={() => pickImage("camera")}
                  backgroundColor={colors.primary}
                >
                  <Ionicons name="camera" size={20} color="white" />
                  <Text color="white"> Camera</Text>
                </Button>
              </YStack>
            </Popover.Content>
          </Popover>

          <YStack>
            <YStack>
              <Label fontWeight="bold">Name</Label>
              <Input
                placeholder="e.g My lovely blue jacket"
                value={name}
                onChangeText={setName}
              />
            </YStack>
            <YStack>
              <Label fontWeight="bold">Brand</Label>
              <Input
                placeholder="e.g LV, Off-White, etc."
                value={brand}
                onChangeText={setBrand}
              />
            </YStack>
            <YStack>
              <Label fontWeight="bold">Price</Label>
              <Input
                placeholder="e.g 1000"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </YStack>
            <YStack>
              <Label fontWeight="bold">Category</Label>
              <Input
                placeholder="e.g Jacket, Pants, etc."
                value={category}
                onChangeText={setCategory}
              />
            </YStack>
            <YStack>
              <Label fontWeight="bold">Commercial Link (optional)</Label>
              <Input
                placeholder="e.g https://example.com/product"
                value={commercial_link}
                onChangeText={setcommercial_link}
              />
            </YStack>
          </YStack>
        </YStack>
        <View flex={1} height={100} />
      </ScrollView>
    </SafeAreaView>
  );
}
