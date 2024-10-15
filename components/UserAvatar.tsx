import { Image } from "expo-image";
import React from "react";
import { View, Text, YStack } from "tamagui";

import { User } from "@/model/types";

interface UserAvatarProps {
  user: User;
}

export default function UserAvatar({ user }: UserAvatarProps) {
  return (
    <YStack alignItems="center" width={80} marginHorizontal="$2">
      <View width={64} height={64} borderRadius="$8" overflow="hidden">
        <Image
          source={{
            uri: user.profile_picture_url,
          }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>
      <Text fontSize="$2" fontFamily="jost" marginTop="$1" numberOfLines={1}>
        {user.name}
      </Text>
    </YStack>
  );
}
