import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

import ClothesItemForm from "../../../components/ClothesItemForm";
import { useItemViewModel } from "../../../viewmodels/ItemViewModel";
export default function EditClothesItemScreen() {
  const { itemId } = useLocalSearchParams();
  const { getItemById, updateItemById } = useItemViewModel();

  // const item = getItemById(Number(itemId));
  const item = {
    id: 1,
    user_id: 1,
    category: "Jacket",
    name: "Jacket",
    image_url: "jacket",
    brand: "Brand",
    commercial_link: "https://www.google.com",
    price: 100,
    color: "Red",
    num_of_likes: 2000,
    num_of_bookmarks: 100,
  };

  useEffect(() => {
    if (!item) {
      router.back();
    }
  }, [item]);

  const handleUpdate = (values) => {
    updateItemById(Number(itemId), values);
    router.back();
  };

  if (!item) return null;

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
