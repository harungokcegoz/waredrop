import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, YStack, H4, XStack, View, Spinner, Spacer } from "tamagui";

import FeedPost from "@/components/FeedPost";
import { Post } from "@/model/types";
import { colors } from "@/styles/preset-styles";
import { usePostViewModel } from "@/viewmodels/PostViewModel";

export default function Bookmarks() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { getBookmarkedPosts } = usePostViewModel();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookmarkedPosts();
  }, []);

  const fetchBookmarkedPosts = async () => {
    setLoading(true);
    const posts = await getBookmarkedPosts();
    setBookmarkedPosts(posts);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookmarkedPosts();
    setRefreshing(false);
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner size="large" color={colors.primary} />;
    }

    if (bookmarkedPosts.length === 0) {
      return (
        <View padding="$4" alignItems="center">
          <H4>No bookmarked posts yet</H4>
        </View>
      );
    }

    return (
      <YStack gap="$4">
        {bookmarkedPosts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
            type="profile"
            onRefresh={fetchBookmarkedPosts}
          />
        ))}
      </YStack>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <YStack gap="$4" padding="$4">
          <XStack gap="$2" alignItems="center">
            <View onPress={() => router.push("/profile")}>
              <Ionicons name="arrow-back" size={24} color={colors.textGray} />
            </View>
            <H4>Bookmarks</H4>
          </XStack>
          {renderContent()}
        </YStack>
        <Spacer size="$12" />
      </ScrollView>
    </SafeAreaView>
  );
}
