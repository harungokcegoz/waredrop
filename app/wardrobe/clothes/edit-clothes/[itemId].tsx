import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Spinner, Text } from "tamagui";

import ClothesItemForm from "../../../../components/ClothesItemForm";
import { useItemViewModel } from "../../../../viewmodels/ItemViewModel";

import { Item } from "@/model/types";

export default function EditClothesItemScreen() {
  const { itemId } = useLocalSearchParams();
  const { getItemById, updateItemById } = useItemViewModel();
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) {
        setError("Item ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        const fetchedItem = await getItemById(Number(itemId));
        if (fetchedItem) {
          setItem(fetchedItem);
        } else {
          setError("Item not found");
        }
      } catch (err) {
        setError("Error fetching item");
        console.error("Error fetching item:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [itemId, getItemById]);

  const handleUpdate = async (values) => {
    if (!itemId) {
      setError("Item ID is missing");
      return;
    }
    await updateItemById(Number(itemId), values);

    router.push({
      pathname: "/wardrobe/clothes/[id]",
      params: { id: Number(itemId) },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>{error || "Item not found"}</Text>
      </SafeAreaView>
    );
  }

  return (
    <ClothesItemForm
      initialValues={{
        name: item.name,
        brand: item.brand,
        price: item.price.toString(),
        category: item.category,
        image_url: item.image_url,
        commercial_link: item.commercial_link,
      }}
      onSubmit={handleUpdate}
      onCancel={() => router.back()}
      title="Edit Clothes Item"
      icon="save"
    />
  );
}
