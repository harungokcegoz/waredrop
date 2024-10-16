import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";

import Navigation from "../components/navigation/Navigation";
import config from "../tamagui.config";

import LoginScreen from "./login";

import { useStore } from "@/stores/useStore";
import { useAuthViewModel } from "@/viewmodels/AuthViewModel";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { user } = useStore();
  const { initializeGoogleSignIn } = useAuthViewModel();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    initializeGoogleSignIn();
  }, [initializeGoogleSignIn]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      {user ? <Navigation /> : <LoginScreen />}
    </TamaguiProvider>
  );
}
