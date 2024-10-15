import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Sheet, ScrollView } from "tamagui";

import UserProfileContent from "./UserProfileContent";

import { User, Post } from "@/model/types";
import { useUserViewModel } from "@/viewmodels/UserViewModel";

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
  const { getUserProfile, getUserStats, getUserPosts } = useUserViewModel();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

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
  };

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
            <UserProfileContent user={user} posts={posts} showStats={false} />
          )}
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
