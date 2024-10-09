import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

import ClothesItemForm from "../../../components/ClothesItemForm";
import { useItemViewModel } from "../../../viewmodels/ItemViewModel";
export default function EditClothesItemScreen() {
  const { itemId } = useLocalSearchParams();
  const { getItemById, updateItemById } = useItemViewModel();
  const item = getItemById(Number(itemId));

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
        imageUrl: item.imageUrl,
        commercialLink: item.commercialLink,
      }}
      onSubmit={handleUpdate}
      onCancel={() => router.back()}
      title="Edit Clothes Item"
      icon="save"
    />
  );
}
