import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import Share from "react-native-share";
import { captureRef } from "react-native-view-shot";
import { YStack, Button } from "tamagui";

interface SharePopoverProps {
  postId: number;
  feedPostRef: React.RefObject<View>;
}

export default function SharePopover({ feedPostRef }: SharePopoverProps) {
  const [showInstagramStory, setShowInstagramStory] = useState(false);

  useEffect(() => {
    if (Platform.OS === "ios") {
      Linking.canOpenURL("instagram://")
        .then((val) => setShowInstagramStory(val))
        .catch((err) => console.error(err));
    } else {
      Share.isPackageInstalled("com.instagram.android")
        .then(({ isInstalled }) => setShowInstagramStory(isInstalled))
        .catch((err) => console.error(err));
    }
  }, []);

  const handleShare = async () => {
    try {
      const uri = await captureRef(feedPostRef, {
        format: "png",
        quality: 1,
      });

      if (showInstagramStory) {
        await Share.shareSingle({
          stickerImage: uri,
          text: "Check out this post on Waredrop",
          attributionURL: "https://waredrop.com",
          social: Share.Social.INSTAGRAM_STORIES,
          backgroundBottomColor: "#feba6c",
          backgroundTopColor: "#fbf3cd",
          appId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
        });
      } else {
        await Share.open({ url: uri });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <YStack padding="$2" gap="$2">
      <Button
        onPress={handleShare}
        icon={<Ionicons name="logo-instagram" size={24} color="#E1306C" />}
      >
        {showInstagramStory ? "Share to Instagram Story" : "Share"}
      </Button>
    </YStack>
  );
}
