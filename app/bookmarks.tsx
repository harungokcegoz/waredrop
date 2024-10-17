import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, YStack, H4, XStack, View } from "tamagui";

import { colors } from "@/styles/preset-styles";

export default function bookmarks() {
  return (
    <SafeAreaView>
      <ScrollView>
        <YStack gap="$4" padding="$4">
          <XStack gap="$2" alignItems="center">
            <View onPress={() => router.push("/profile")}>
              <Ionicons name="arrow-back" size={24} color={colors.textGray} />
            </View>
            <H4>Bookmarks</H4>
          </XStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
