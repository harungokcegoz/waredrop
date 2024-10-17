import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { H4, ScrollView, XStack, YStack, Text, View } from "tamagui";

import { useStore } from "@/stores/useStore";
import { colors } from "@/styles/preset-styles";
import { useAuthViewModel } from "@/viewmodels/AuthViewModel";

export default function Settings() {
  const { signOut } = useAuthViewModel();
  const { setUser } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    signOut();
    router.push("/");
  };

  const settingsItem = (
    title: string,
    icon: string,
    onPress: () => void,
    color: string,
  ) => {
    return (
      <YStack padding="$2" onPress={onPress}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$5" fontFamily="jost" color={colors[color]}>
            {title}
          </Text>
          <Ionicons name={icon} size={20} color={color} />
        </XStack>
      </YStack>
    );
  };

  const divider = () => {
    return <YStack borderBottomWidth={1} borderColor={colors.border} />;
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          backgroundColor: colors.background,
        }}
        showsVerticalScrollIndicator={false}
      >
        <YStack gap="$4" padding="$4">
          <XStack gap="$2" alignItems="center">
            <View onPress={() => router.push("/profile")}>
              <Ionicons name="arrow-back" size={24} color={colors.textGray} />
            </View>
            <H4>Settings</H4>
          </XStack>
          <YStack
            padding="$2"
            borderWidth={1}
            borderColor={colors.border}
            backgroundColor="white"
            borderRadius="$4"
            gap="$1.5"
          >
            {settingsItem(
              "Bookmarks",
              "chevron-forward",
              () => {
                router.push("/bookmarks");
              },
              "black",
            )}
            {divider()}
            {settingsItem("Sign out", "exit-outline", handleLogout, "red")}
            {divider()}
            {settingsItem("Delete Account", "trash-outline", () => {}, "red")}
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
