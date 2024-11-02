import { Image } from "expo-image";
import React from "react";
import { Text, XStack, YStack, H4, Card, View } from "tamagui";

import FeedPost from "@/components/FeedPost";
import { User, Post } from "@/model/types";
import { colors } from "@/styles/preset-styles";

interface UserProfileContentProps {
  user: User;
  posts: Post[];
  showStats?: boolean;
  onPostPress?: (postId: number) => void;
}

export default function UserProfileContent({
  user,
  posts,
  showStats = true,
  onPostPress,
}: UserProfileContentProps) {
  return (
    <YStack padding="$4" gap="$4">
      <YStack alignItems="center" justifyContent="center" gap="$4" padding="$6">
        <Image
          source={{ uri: user.profile_picture_url }}
          style={{ width: 150, height: 150, borderRadius: 10 }}
          contentFit="contain"
          cachePolicy="memory"
        />
        <Text fontFamily="jost" fontSize="$5" fontWeight="bold">
          {user.name}
        </Text>
        <XStack justifyContent="center" gap="$4" marginStart="$4">
          <YStack alignItems="center" gap="$1">
            <Text fontWeight="bold" fontSize="$5" fontFamily="jost">
              {user.userStats.totalPosts}
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
              {user.userStats.followersCount}
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
              {user.userStats.followingCount}
            </Text>
            <Text fontFamily="jost">Following</Text>
          </YStack>
        </XStack>
      </YStack>
      {showStats && user.role === "influencer" && (
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
            <StatItem label="Total Likes" value={user.userStats.totalLikes} />
            <StatItem
              label="Total Bookmarks"
              value={user.userStats.totalBookmarks}
            />
            <StatItem label="Total Shares" value={user.userStats.totalShares} />
          </XStack>
        </Card>
      )}
      <YStack>
        <H4 fontFamily="jost" color={colors.textBlack}>
          Posts
        </H4>
        <YStack gap="$4" paddingTop="$4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <View
                key={post.id}
                onPress={() => onPostPress && onPostPress(post.id)}
                borderRadius="$4"
                borderWidth={1}
                borderColor={colors.border}
              >
                <FeedPost post={post} type="profile" />
              </View>
            ))
          ) : (
            <Text>No posts found</Text>
          )}
        </YStack>
      </YStack>
    </YStack>
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
