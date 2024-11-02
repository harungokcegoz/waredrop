import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useCallback, useState, useRef, memo } from "react";
import { TouchableOpacity, View } from "react-native";
import { Popover, Text, XStack, YStack } from "tamagui";

import { usePostViewModel } from "../viewmodels/PostViewModel";

import OutfitCard from "./OutfitCard";
import SharePopover from "./SharePopover";

import { Post } from "@/model/types";
import { colors, shadows } from "@/styles/preset-styles";

interface FeedPostProps {
  post: Post;
  type?: "feed" | "profile";
  onRefresh?: () => void;
}

const FeedPost = ({ post, type = "feed", onRefresh }: FeedPostProps) => {
  const { likePost, bookmarkPost } = usePostViewModel();
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const feedPostContentRef = useRef<View>(null);

  const handleLike = useCallback(async () => {
    await likePost(post.id);

    if (onRefresh) {
      onRefresh();
    }
  }, [post.id, likePost, onRefresh]);

  const handleBookmark = useCallback(async () => {
    await bookmarkPost(post.id);

    if (onRefresh) {
      onRefresh();
    }
  }, [post.id, bookmarkPost, onRefresh]);

  const handleShare = useCallback(() => {
    setSharePopoverOpen(true);
  }, []);

  return (
    <View
      ref={feedPostContentRef}
      style={{
        backgroundColor: "white",
        gap: 10,
        padding: 10,
        borderRadius: 10,
      }}
      {...shadows}
    >
      <YStack
        borderWidth={1}
        borderColor={colors.border}
        padding="$2"
        borderRadius="$4"
        gap="$2"
        backgroundColor="white"
      >
        <XStack alignItems="center" gap="$2">
          <Image
            source={{
              uri: post.user.profile_picture_url,
            }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            cachePolicy="memory"
            contentFit="cover"
          />
          <Text fontWeight="bold" fontFamily="jost">
            {post.user.name}
          </Text>
        </XStack>

        <OutfitCard outfit={post.outfit} size="large" userId={post.user.id} />

        <XStack justifyContent="space-between" marginTop="$2" padding="$2">
          <XStack gap="$4" alignItems="center" justifyContent="center">
            <XStack alignItems="center" justifyContent="center" gap="$2">
              {type === "feed" && (
                <TouchableOpacity onPress={handleLike}>
                  <Ionicons
                    name={post.is_liked ? "heart" : "heart-outline"}
                    size={24}
                    color={post.is_liked ? "red" : "black"}
                  />
                </TouchableOpacity>
              )}
              <Text fontFamily="jost">{post.likes_count} likes</Text>
            </XStack>

            <Popover open={sharePopoverOpen} onOpenChange={setSharePopoverOpen}>
              <Popover.Trigger asChild>
                <TouchableOpacity onPress={handleShare}>
                  <Ionicons
                    name="paper-plane-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </Popover.Trigger>

              <Popover.Content
                backgroundColor={colors.background}
                borderWidth={1}
                borderColor={colors.border}
                borderRadius="$4"
              >
                <Popover.Arrow
                  size="$4"
                  backgroundColor={colors.background}
                  borderWidth={1}
                  borderColor={colors.border}
                />
                <SharePopover
                  postId={post.id}
                  feedPostRef={feedPostContentRef}
                />
              </Popover.Content>
            </Popover>
          </XStack>

          <TouchableOpacity onPress={handleBookmark}>
            <Ionicons
              name={post.is_bookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </XStack>
      </YStack>
    </View>
  );
};

export default memo(FeedPost);
