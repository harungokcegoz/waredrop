import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button, Input, YStack, XStack, Image } from "tamagui";

import { useItemViewModel } from "../../../viewmodels/ItemViewModel";

export default function EditClothesItemScreen() {
  const { itemId } = useRouter().params;
  const { getItemById, updateItemById } = useItemViewModel();

  const [item, setItem] = useState(getItemById(itemId));
  const [image, setImage] = useState(item?.image_url);
  const [name, setName] = useState(item?.name || "");
  const [brand, setBrand] = useState(item?.brand || "");
  const [price, setPrice] = useState(item?.price?.toString() || "");
  const [category, setCategory] = useState(item?.category || "");
  const [commercialLink, setCommercialLink] = useState(
    item?.commercial_link || "",
  );

  useEffect(() => {
    if (!item) {
      router.back();
    }
  }, [item, router]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  const handleUpdate = () => {
    if (!image || !name || !brand || !price || !category) {
      alert("Please fill all required fields and add an image");
      return;
    }

    updateItemById(itemId, {
      name,
      brand,
      price: parseFloat(price),
      category,
      image_url: image,
      commercial_link: commercialLink,
    });

    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4">
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <Button
            icon={<Ionicons name="arrow-back" size={24} color="black" />}
            onPress={() => router.back()}
          />
          <Text fontSize="$6" fontWeight="bold">
            Edit Clothes Item
          </Text>
          <Button onPress={handleUpdate}>Update</Button>
        </XStack>
        <View onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} width={400} height={400} />
          ) : (
            <View
              width={400}
              height={400}
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
        <Input
          placeholder="Name"
          value={name}
          onChangeText={setName}
          marginTop="$4"
        />
        <Input
          placeholder="Brand"
          value={brand}
          onChangeText={setBrand}
          marginTop="$2"
        />
        <Input
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          marginTop="$2"
        />
        <Input
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
          marginTop="$2"
        />
        <Input
          placeholder="Commercial Link (optional)"
          value={commercialLink}
          onChangeText={setCommercialLink}
          marginTop="$2"
        />
      </YStack>
    </SafeAreaView>
  );
}
