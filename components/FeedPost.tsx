import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useState, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { Popover, Text, XStack, YStack } from "tamagui";

import { usePostViewModel } from "../viewmodels/PostViewModel";

import OutfitCard from "./OutfitCard";
import SharePopover from "./SharePopover";

import { Post } from "@/model/types";
import { colors } from "@/styles/preset-styles";

interface FeedPostProps {
  post: Post;
  type?: "feed" | "profile";
  onRefresh?: () => void;
}

export default function FeedPost({
  post,
  type = "feed",
  onRefresh,
}: FeedPostProps) {
  const { likePost, unlikePost, bookmarkPost, unbookmarkPost } =
    usePostViewModel();
  const router = useRouter();
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const feedPostContentRef = useRef<View>(null);

  const handleLike = useCallback(async () => {
    if (post.isLiked) {
      await unlikePost(post.id);
    } else {
      await likePost(post.id);
    }
    if (onRefresh) {
      onRefresh();
    }
  }, [post.id, likePost, unlikePost, onRefresh]);

  const handleBookmark = useCallback(() => {
    if (post.isBookmarked) {
      unbookmarkPost(post.id);
    } else {
      bookmarkPost(post.id);
    }
    router.push("/");
  }, [post.id, bookmarkPost, unbookmarkPost, router]);

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
                    name={post.isLiked ? "heart" : "heart-outline"}
                    size={24}
                    color={post.isLiked ? "red" : "black"}
                  />
                </TouchableOpacity>
              )}
              <Text fontFamily="jost">{post.likes_count} likes</Text>
            </XStack>

            {type === "feed" && (
              <Popover
                open={sharePopoverOpen}
                onOpenChange={setSharePopoverOpen}
              >
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
            )}
          </XStack>
          {type === "feed" ? (
            <TouchableOpacity onPress={handleBookmark}>
              <Ionicons
                name={post.isBookmarked ? "bookmark" : "bookmark-outline"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          ) : (
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
          )}
        </XStack>
      </YStack>
    </View>
  );
}
