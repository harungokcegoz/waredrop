import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  XStack,
  YStack,
  H4,
  Card,
  Spacer,
  ScrollView,
  View,
} from "tamagui";

import { colors, pressAnimationStyle } from "../../styles/preset-styles";
import { useUserViewModel } from "../../viewmodels/UserViewModel";

import FeedPost from "@/components/FeedPost";
import { Post, User } from "@/model/types";

export default function ProfileScreen() {
  const { getUserProfile, getUserStats, getUserPosts } = useUserViewModel();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const profile = await getUserProfile();
    const stats = await getUserStats();
    const posts = await getUserPosts();
    if (profile && stats) {
      profile.userStats = stats;
    }
    setUserProfile(profile);
    setUserPosts(posts);
  };

  return (
    userProfile && (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" gap="$4">
            <H4 fontFamily="jost" color={colors.textBlack}>
              Profile
            </H4>

            <YStack
              alignItems="center"
              justifyContent="center"
              gap="$4"
              padding="$6"
            >
              <Image
                source={{ uri: userProfile.profile_picture_url }}
                style={{ width: 150, height: 150, borderRadius: 10 }}
                contentFit="contain"
                cachePolicy="memory"
              />
              <Text fontFamily="jost" fontSize="$5" fontWeight="bold">
                {userProfile.name}
              </Text>
              <XStack justifyContent="center" gap="$4">
                <YStack alignItems="center" gap="$1">
                  <Text fontWeight="bold" fontSize="$5" fontFamily="jost">
                    {userProfile.userStats.followersCount}
                  </Text>
                  <Text fontFamily="jost">Posts</Text>
                </YStack>
                <Text
                  color={colors.textGray}
                  fontSize="$9"
                  fontFamily="jost"
                  fontWeight={100}
                >
                  |
                </Text>
                <YStack alignItems="center" gap="$1">
                  <Text fontWeight="bold" fontSize="$5" fontFamily="jost">
                    {userProfile.userStats.totalPosts}
                  </Text>
                  <Text fontFamily="jost">Followers</Text>
                </YStack>
                <Text
                  color={colors.textGray}
                  fontSize="$9"
                  fontFamily="jost"
                  fontWeight={100}
                >
                  |
                </Text>
                <YStack alignItems="center" gap="$1">
                  <Text fontWeight="bold" fontSize="$5" fontFamily="jost">
                    {userProfile.userStats.followingCount}
                  </Text>
                  <Text fontFamily="jost">Following</Text>
                </YStack>
              </XStack>
            </YStack>
            <Card
              borderWidth={1}
              borderColor={colors.border}
              borderRadius="$4"
              padding="$4"
              gap="$4"
            >
              <H4 fontFamily="jost" color={colors.textBlack}>
                Stats
              </H4>
              <XStack flexWrap="wrap" justifyContent="space-between" gap="$2">
                <StatItem
                  label="Total Likes"
                  value={userProfile.userStats.totalLikes}
                />
                <StatItem
                  label="Total Bookmarks"
                  value={userProfile.userStats.totalBookmarks}
                />
                <StatItem
                  label="Total Views"
                  value={userProfile.userStats.totalViews || 0}
                />
                <StatItem
                  label="Total Shares"
                  value={userProfile.userStats.totalShares}
                />
              </XStack>
            </Card>
            <YStack>
              <H4 fontFamily="jost" color={colors.textBlack}>
                Posts
              </H4>
              <YStack gap="$4" paddingTop="$4">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <View
                      key={post.id}
                      onPress={() => {
                        router.push({
                          pathname: "/outfits/[id]",
                          params: { id: post.id },
                        });
                      }}
                      borderRadius="$4"
                      borderWidth={1}
                      borderColor={colors.border}
                      {...pressAnimationStyle}
                    >
                      <FeedPost post={post} type="profile" />
                    </View>
                  ))
                ) : (
                  <Text>No posts found</Text>
                )}
              </YStack>
              <Spacer size="$12" />
            </YStack>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    )
  );
}

interface StatItemProps {
  label: string;
  value: number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <YStack width="48%" marginBottom="$2">
    <Text fontFamily="jost">{label}</Text>
    <Text fontFamily="jost" fontWeight="bold">
      {value}
    </Text>
  </YStack>
);
