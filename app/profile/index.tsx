import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, H4 } from "tamagui";

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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const profile = await getUserProfile(user.id);
    const stats = await getUserStats(user.id);
    const posts = await getUserPosts(user.id);
    if (profile && stats) {
      profile.userStats = stats;
    }
    setUserProfile(profile);
    setUserPosts(posts);
  };

  const handlePostPress = (postId: number) => {
    router.push({
      pathname: "/outfits/[id]",
      params: { id: postId },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <H4 fontFamily="jost" color={colors.textBlack} padding="$4">
          Profile
        </H4>
        {userProfile && (
          <UserProfileContent
            user={userProfile}
            posts={userPosts}
            showStats={true}
            onPostPress={handlePostPress}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
