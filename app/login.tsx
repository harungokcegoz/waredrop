/* eslint-disable @typescript-eslint/no-require-imports */
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { YStack, Button, Text } from "tamagui";

import { useAuthViewModel } from "@/viewmodels/AuthViewModel";

export default function LoginScreen() {
  const { googleSignIn } = useAuthViewModel();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const user = await googleSignIn();
    if (user) {
      router.replace("/");
    }
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      space="$4"
      backgroundColor="$background"
    >
      <Image
        source={require("@/assets/images/header-logo.png")}
        style={{ width: 200, height: 100 }}
        contentFit="contain"
        cachePolicy="memory"
      />
      <Text fontSize="$8" fontFamily="jost" fontWeight="bold">
        Welcome to Waredrop
      </Text>
      <Button
        size="$5"
        theme="active"
        icon={
          <Image
            source={require("@/assets/images/google-logo.png")}
            style={{ width: 24, height: 24 }}
          />
        }
        onPress={handleGoogleLogin}
      >
        Sign in with Google
      </Button>
    </YStack>
  );
}
