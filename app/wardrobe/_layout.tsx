import { Stack } from "expo-router";

export default function WardrobeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="clothes/[id]" />
      <Stack.Screen name="clothes/edit-clothes/[itemId]" />
      <Stack.Screen name="add-clothes-item" />
    </Stack>
  );
}
