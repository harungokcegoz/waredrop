import React, { useState, useEffect, useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { Sheet, ScrollView, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

import UserProfileContent from "./UserProfileContent";

import { User, Post } from "@/model/types";
import { useUserViewModel } from "@/viewmodels/UserViewModel";
import { useStore } from "@/stores/useStore";

interface UserProfileSheetProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileSheet({
  userId,
  isOpen,
  onClose,
}: UserProfileSheetProps) {
  const { getUserProfile, getUserStats, getUserPosts, followUser, unfollowUser, isFollowingUser } = useUserViewModel();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user: currentUser } = useStore();

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen, userId]);

  const fetchUserData = async () => {
    const userProfile = await getUserProfile(userId);
    const stats = await getUserStats(userId);
    const userPosts = await getUserPosts(userId);
    if (userProfile && stats) {
      userProfile.userStats = stats;
    }
    setUser(userProfile);
    setPosts(userPosts);

    if (currentUser && currentUser.id !== userId) {
      const following = await isFollowingUser(userId);
      setIsFollowing(following);
    }
  };

  const handleFollowToggle = useCallback(async () => {
    if (!user || !currentUser) return;

    try {
      if (isFollowing) {
        await unfollowUser(user.id);
      } else {
        await followUser(user.id);
      }
      setIsFollowing(!isFollowing);
      fetchUserData(); // Refresh user data after follow/unfollow
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  }, [user, currentUser, isFollowing, followUser, unfollowUser]);

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      snapPoints={[85]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay />
      <Sheet.Frame>
        <Sheet.Handle />
        <TouchableOpacity
          onPress={onClose}
          style={{ position: "absolute", top: 15, right: 20, zIndex: 1000 }}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <ScrollView>
          {user && (
            <>
              <UserProfileContent user={user} posts={posts} showStats={false} />
              {currentUser && currentUser.id !== userId && (
                <Button onPress={handleFollowToggle}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </>
          )}
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
