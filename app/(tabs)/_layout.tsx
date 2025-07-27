import { Tabs } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";
import BlurTabBarBackground from "@/components/ui/TabBarBackground.ios";
import AuthContext from "@/contexts/AuthContext";
import socket from "@/socket";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { userProfile } = useContext(AuthContext);

  useEffect(() => {
    if (userProfile?._id) {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("join", userProfile._id);
      console.log("🔌 Socket connected and joined:", userProfile._id);
    }

    const handleReconnect = () => {
      if (userProfile?._id) {
        socket.emit("join", userProfile._id);
        console.log("🔁 Re-joined after reconnect:", userProfile._id);
      }
    };

    socket.on("connect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
    };
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile && socket.connected) {
      socket.disconnect();
    }
  }, [userProfile]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            BlurTabBarBackground,

            position: "absolute",
          },
          default: {
            borderRadius: 20,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Post"
        options={{
          title: "Post",
          tabBarIcon: ({ color }) => (
            <Feather size={28} name="upload-cloud" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
