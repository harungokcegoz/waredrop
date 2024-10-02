import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
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
} from "tamagui";

import { colors } from "../../styles/preset-styles";
import { useItemViewModel } from "../../viewmodels/ItemViewModel";

export default function UploadClothesScreen() {
  const navigation = useNavigation();
  const { addItem } = useItemViewModel();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

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

  const handleUpload = () => {
    if (!image || !name || !brand || !price || !category) {
      alert("Please fill all fields and add an image");
      return;
    }

    addItem({
      name,
      brand,
      price: parseFloat(price),
      category,
      image_url: image,
    });

    navigation.goBack();
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
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </Circle>

            <Text fontSize="$6" fontWeight="bold">
              Upload Clothes
            </Text>
            <Circle
              width={35}
              height={35}
              backgroundColor="black"
              onPress={() => navigation.goBack()}
              onPressIn={() => handleUpload()}
            >
              <Ionicons
                name="cloud-upload"
                size={20}
                color={colors.secondary}
              />
            </Circle>
          </XStack>
          <View onPress={pickImage} alignItems="center" justifyContent="center">
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%" }}
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
          </YStack>
        </YStack>
        <View flex={1} height={100} />
      </ScrollView>
    </SafeAreaView>
  );
}
