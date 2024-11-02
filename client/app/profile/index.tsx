import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, H4, Spacer, XStack } from "tamagui";

import UserProfileContent from "@/components/UserProfileContent";
import { Post, User } from "@/model/types";
import { useStore } from "@/stores/useStore";
import { colors } from "@/styles/preset-styles";
import { useUserViewModel } from "@/viewmodels/UserViewModel";

export default function ProfileScreen() {
  const { getUserProfile, getUserStats, getUserPosts } = useUserViewModel();
  const { user } = useStore();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;
    const profile = await getUserProfile(user.id);
    const stats = await getUserStats(user.id);
    const posts = await getUserPosts(user.id);
    if (profile && stats) {
      profile.userStats = stats;
    }
    setUserProfile(profile);
    setUserPosts(posts);
  }, [user, getUserProfile, getUserStats, getUserPosts]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  }, [fetchUserProfile]);

  const handlePostPress = (postId: number) => {
    router.push({
      pathname: "/outfits/[id]",
      params: { id: postId },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <XStack justifyContent="space-between" alignItems="center" padding="$4">
          <H4 fontFamily="jost" color={colors.textBlack}>
            Profile
          </H4>
          <XStack
            alignItems="center"
            gap="$2"
            onPress={() => router.push("/settings")}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.primary}
            />
          </XStack>
        </XStack>
        {userProfile && (
          <UserProfileContent
            user={userProfile}
            posts={userPosts}
            showStats={true}
            onPostPress={handlePostPress}
          />
        )}
        <Spacer size="$12" />
      </ScrollView>
    </SafeAreaView>
  );
}
