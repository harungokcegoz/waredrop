import { useRouter } from "expo-router";
import React from "react";

import ClothesItemForm from "../../components/ClothesItemForm";
import { useItemViewModel } from "../../viewmodels/ItemViewModel";

export default function UploadClothesScreen() {
  const { addItem } = useItemViewModel();
  const router = useRouter();

  const handleUpload = (values) => {
    addItem(values);
    router.push("/wardrobe");
  };

  return (
    <ClothesItemForm
      onSubmit={handleUpload}
      onCancel={() => router.back()}
      title="Upload Clothes"
      icon="cloud-upload"
    />
  );
}
