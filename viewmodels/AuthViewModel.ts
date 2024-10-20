import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useCallback } from "react";

import { googleLogin, setAuthToken } from "../services/api";
import { useStore } from "../stores/useStore";

export const useAuthViewModel = () => {
  const { setUser, setToken } = useStore();

  const initializeGoogleSignIn = useCallback(async () => {
    try {
      await GoogleSignin.configure({
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      });
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
    }
  }, []);

  const googleSignIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const responseSignIn = await GoogleSignin.signIn();
      const idToken = responseSignIn.data?.idToken;

      if (!idToken) {
        throw new Error("Failed to get ID token from Google Sign-In");
      }

      const response = await googleLogin(idToken);
      const { token, user: loggedInUser } = response.data;
      setAuthToken(token);
      setToken(token);
      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      console.error("Google Sign-In error:", error);
      return null;
    }
  }, [setUser]);

  const signOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [setUser]);

  return {
    initializeGoogleSignIn,
    googleSignIn,
    signOut,
  };
};
