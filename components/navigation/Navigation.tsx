import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "tamagui";

import { colors } from "../../styles/preset-styles";

export default function AppNavigation() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: "absolute",
          bottom: 30,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "#ffffff",
          borderRadius: 15,
          height: 70,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          paddingTop: 10,
          paddingBottom: 10,
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === "index") iconName = "home";
          else if (route.name === "outfits") iconName = "shirt";
          else if (route.name === "wardrobe") iconName = "albums";
          else if (route.name === "profile") iconName = "person-circle";
          else if (route.name === "create") iconName = "add-circle";
          return (
            <Ionicons
              name={iconName}
              size={30}
              color={color}
              style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
            />
          );
        },
        tabBarButton: (props) => {
          if (route.name === "create") {
            return (
              <View {...props}>
                <Ionicons name="add-circle" size={50} color={colors.primary} />
              </View>
            );
          } else if (route.name === "login") return null;
          else if (route.name === "settings") return null;
          else if (route.name === "bookmarks") return null;
          return <View {...props} />;
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="outfits" />
      <Tabs.Screen name="create" />
      <Tabs.Screen name="wardrobe" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
