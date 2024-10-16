import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useCallback } from "react";

import { googleLogin, setAuthToken } from "../services/api";
import { useStore } from "../stores/useStore";

export const useAuthViewModel = () => {
  const { setUser } = useStore();

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
      const { access_token, user: loggedInUser } = response.data;

      setAuthToken(access_token);
      setUser(loggedInUser);

      console.log("Successfully signed in");
      return loggedInUser;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Google Sign-In cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Google Sign-In already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play Services not available");
      } else {
        console.error("Google Sign-In error:", error);
      }
      return null;
    }
  }, [setUser]);

  const signOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
      setAuthToken("");
      console.log("Successfully signed out");
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
