import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import React from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import * as Updates from 'expo-updates';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const requestAllPermissions = async () => {
    try {
      const { status: mediaStatus } =
        await MediaLibrary.requestPermissionsAsync();
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (mediaStatus === "granted" || locationStatus === "granted") {
        setPermissionsGranted(true);
      } else {
        console.warn("Some permissions not granted");
        setPermissionsGranted(true); // Allow app to render even if permissions are not granted
      }
    } catch (err) {
      console.error("Permission error:", err);
      setPermissionsGranted(true); // Prevent lock
    }
  };


  useEffect(() => {
    
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync(); 
        }
      } catch (e) {
        console.log("Failed to fetch update:", e);
      }
    };
    requestAllPermissions();
    checkForUpdates();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync(); 
    }, 5000);

    if (loaded && permissionsGranted) {
      SplashScreen.hideAsync();
    }

    return () => clearTimeout(timeout);
  }, [loaded, permissionsGranted]);

  if (!loaded || !permissionsGranted) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText>Loading app...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <React.StrictMode>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <ChatProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              {/* <Stack.Screen name="Post" options={{ headerShown: false }} />
            <Stack.Screen name="Chat" options={{ headerShown: false }} /> */}
              <Stack.Screen name="ChatScreen" options={{ headerShown: true }} />
              <Stack.Screen name="Login" options={{ headerShown: false }} />
              <Stack.Screen name="Signup" options={{ headerShown: false }} />
              <Stack.Screen name="Profile" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
