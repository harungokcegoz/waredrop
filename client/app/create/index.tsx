import { useNavigation } from "@react-navigation/native";
import React from "react";

import ClothesItemForm from "../../components/ClothesItemForm";
import { useItemViewModel } from "../../viewmodels/ItemViewModel";

export default function CreateScreen() {
  const navigation = useNavigation();
  const { addItem } = useItemViewModel();

  const handleUpload = (values) => {
    addItem(values);
    navigation.goBack();
  };

  return (
    <ClothesItemForm
      onSubmit={handleUpload}
      onCancel={() => navigation.goBack()}
      title="Upload Clothes"
      icon="cloud-upload"
    />
  );
}
