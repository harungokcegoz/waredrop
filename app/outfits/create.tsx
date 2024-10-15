import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";

import OutfitForm from "../../components/OutfitForm";
import { useItemViewModel } from "../../viewmodels/ItemViewModel";
import { useOutfitViewModel } from "../../viewmodels/OutfitViewModel";

import { Item } from "@/model/types";

export default function CreateOutfit() {
  const router = useRouter();
  const { wardrobe, fetchItems } = useItemViewModel();
  const { addOutfit } = useOutfitViewModel();
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [tags, setTags] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const toggleItem = useCallback((item: Item, category: string) => {
    setSelectedItems((prev) => {
      const filteredItems = prev.filter((i) => i.category !== category);
      if (prev.some((i) => i.id === item.id)) {
        return filteredItems;
      } else {
        return [...filteredItems, item];
      }
    });
  }, []);

  const handleCreate = async (outfitName: string) => {
    await addOutfit({
      name: outfitName,
      itemIds: selectedItems.map((item) => item.id),
      tags: tags.split(",").map((tag) => tag.trim()),
    });
    router.back();
  };

  return (
    <OutfitForm
      title="Create Outfit"
      name={name}
      setName={setName}
      tags={tags}
      setTags={setTags}
      wardrobe={wardrobe}
      selectedItems={selectedItems}
      toggleItem={toggleItem}
      onCancel={() => router.back()}
      onSave={handleCreate}
      saveButtonText="Create"
    />
  );
}
