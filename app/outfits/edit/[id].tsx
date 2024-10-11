import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";

import OutfitForm from "../../../components/OutfitForm";
import { useItemViewModel } from "../../../viewmodels/ItemViewModel";
import { useOutfitViewModel } from "../../../viewmodels/OutfitViewModel";

import { Item, Outfit } from "@/model/types";

export default function EditOutfit() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { wardrobe, fetchItems } = useItemViewModel();
  const { getOutfitById, updateOutfitById } = useOutfitViewModel();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [tags, setTags] = useState<string>("");

  useEffect(() => {
    const fetchOutfitAndItems = async () => {
      await fetchItems();
      if (id) {
        const fetchedOutfit = await getOutfitById(Number(id));
        if (fetchedOutfit) {
          setOutfit(fetchedOutfit);
          setSelectedItems(fetchedOutfit.items);
          setTags(fetchedOutfit.tags.join(", "));
        }
      }
    };
    fetchOutfitAndItems();
  }, [id, fetchItems, getOutfitById]);

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

  const handleSave = async () => {
    if (outfit) {
      await updateOutfitById(outfit.id, {
        items: selectedItems,
        tags: tags.split(",").map((tag) => tag.trim()),
      });
      router.back();
    }
  };

  return (
    <OutfitForm
      title="Edit Outfit"
      tags={tags}
      setTags={setTags}
      wardrobe={wardrobe}
      selectedItems={selectedItems}
      toggleItem={toggleItem}
      onCancel={() => router.back()}
      onSave={handleSave}
      saveButtonText="Save"
    />
  );
}
