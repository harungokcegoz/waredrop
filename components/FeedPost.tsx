import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { Text, XStack, YStack } from "tamagui";

import { usePostViewModel } from "../viewmodels/PostViewModel";

import OutfitCard from "./OutfitCard";

import { Post } from "@/model/types";
import { colors } from "@/styles/preset-styles";
interface FeedPostProps {
  post: Post;
  type?: "feed" | "profile";
}

export default function FeedPost({ post, type = "feed" }: FeedPostProps) {
  const { likePost, unlikePost, sharePost, bookmarkPost, unbookmarkPost } =
    usePostViewModel();
  const router = useRouter();

  const handleLike = useCallback(() => {
    if (post.isLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
    router.push("/");
  }, [post.id, likePost, unlikePost, router]);

  const handleBookmark = useCallback(() => {
    if (post.isBookmarked) {
      unbookmarkPost(post.id);
    } else {
      bookmarkPost(post.id);
    }
    router.push("/");
  }, [post.id, bookmarkPost, unbookmarkPost, router]);

  const handleShare = useCallback(() => {
    sharePost(post.id);
    router.push("/");
  }, [post.id, sharePost, router]);

  return (
    <YStack
      borderWidth={1}
      borderColor={colors.border}
      padding="$3"
      borderRadius="$4"
      gap="$2"
      backgroundColor="white"
    >
      <XStack alignItems="center" gap="$2">
        <Image
          source={{
            uri: "https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg",
          }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
        <Text fontWeight="bold" fontFamily="jost">
          {post.user.name}
        </Text>
      </XStack>

      <OutfitCard outfit={post.outfit} size="large" />

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
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="paper-plane-outline" size={24} color="black" />
            </TouchableOpacity>
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
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="paper-plane-outline" size={24} color="black" />
          </TouchableOpacity>
        )}
      </XStack>
    </YStack>
  );
}
