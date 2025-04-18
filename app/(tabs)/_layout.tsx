import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Feather from '@expo/vector-icons/Feather';
import BlurTabBarBackground from '@/components/ui/TabBarBackground.ios';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            BlurTabBarBackground,

            position: 'absolute',
          },
          default: {
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Post"
        options={{
          title: 'Post',
          tabBarIcon: ({ color }) => <Feather size={28} name="upload-cloud" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { useEffect, useState } from "react";
// import "react-native-reanimated";
// import { ChatProvider } from "@/contexts/ChatContext";
// import { AuthProvider } from "@/contexts/AuthContext";
// import { useColorScheme } from "@/hooks/useColorScheme";
// import * as MediaLibrary from 'expo-media-library';
// import * as Location from 'expo-location';
// import { Alert, View, Text } from "react-native";


// export default function RootLayout() {
//   const colorScheme = useColorScheme();
  

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <AuthProvider>
//         <ChatProvider>
//           <Stack>
//             <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//             <Stack.Screen name="Login" options={{ headerShown: false }} />
//             <Stack.Screen name="Signup" options={{ headerShown: false }} />
//             <Stack.Screen name="Profile" options={{ headerShown: false }} />
//             <Stack.Screen name="Post" />
//             <Stack.Screen name="ChatScreen" />
//             <Stack.Screen name="Chat" />
//             <Stack.Screen name="+not-found" />
//           </Stack>
//           <StatusBar style="auto" />
//         </ChatProvider>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }
