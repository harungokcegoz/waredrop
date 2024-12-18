/* eslint-disable @typescript-eslint/no-require-imports */
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React, { useEffect, useState, useCallback } from "react";
import { RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, YStack, H4, Spacer, Text } from "tamagui";

import FeedPost from "@/components/FeedPost";
import UserAvatar from "@/components/UserAvatar";
import UserProfileSheet from "@/components/UserProfileSheet";
import { Post, User } from "@/model/types";
import { colors, shadows } from "@/styles/preset-styles";
import { usePostViewModel } from "@/viewmodels/PostViewModel";
import { useUserViewModel } from "@/viewmodels/UserViewModel";

export default function HomeScreen() {
  const { getUserFeed } = usePostViewModel();
  const { getUserFollowing } = useUserViewModel();
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    const [posts, following] = await Promise.all([
      getUserFeed(),
      getUserFollowing(),
    ]);
    setFeedPosts(posts);
    setFollowingUsers(following);
  }, [getUserFeed, getUserFollowing]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleUserAvatarPress = (userId: number) => {
    setSelectedUserId(userId);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        padding="$4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <YStack
          alignItems="center"
          {...shadows}
          backgroundColor="$colorTransparent"
        >
          <Image
            source={require("@/assets/images/header-logo.png")}
            style={{ width: "60%", height: 50 }}
            contentFit="cover"
            cachePolicy="memory"
          />
        </YStack>
        {followingUsers.length > 0 && (
          <YStack gap="$4">
            <H4 fontFamily="jost">Following</H4>
            <FlashList
              data={followingUsers}
              renderItem={({ item }) => (
                <UserAvatar
                  user={item}
                  onPress={() => handleUserAvatarPress(item.id)}
                />
              )}
              estimatedItemSize={80}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </YStack>
        )}
        <YStack gap="$4" paddingTop="$4">
          <H4 fontFamily="jost">Feed</H4>
          {feedPosts.length > 0 ? (
            feedPosts.map((post) => (
              <FeedPost key={post.id} post={post} onRefresh={handleRefresh} />
            ))
          ) : (
            <Text>No posts found</Text>
          )}
        </YStack>
        <Spacer size="$12" />
      </ScrollView>
      <UserProfileSheet
        userId={selectedUserId}
        isOpen={selectedUserId !== null}
        onClose={() => setSelectedUserId(null)}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
}
