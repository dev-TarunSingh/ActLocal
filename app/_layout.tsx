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
import * as Updates from "expo-updates";
import { Pressable } from "react-native";

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

      const { status: mediaLibraryStatus } =
        await MediaLibrary.requestPermissionsAsync();
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();

      if ( locationStatus === "granted" && mediaLibraryStatus === "granted") {
        setPermissionsGranted(true);
      } else {
        console.warn("Some permissions not granted");
        setPermissionsGranted(true);
      }
    } catch (err) {
      console.error("Permission error:", err);
      setPermissionsGranted(true);
    }
  };

  useEffect(() => {
    const updateApp = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        console.log("Is update available?", update.isAvailable);
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync(); // restarts app
        }
      
      } catch (e) {
        console.log("Update check failed:", e);
      }
    };
    requestAllPermissions();
    updateApp();
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

  if (!loaded) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText>Loading app... Please wait</ThemedText>
      </ThemedView>
    );
  }

  if (!permissionsGranted) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText>
          Permissions Missing... Please Allow all reuired permissions and try
          again
        </ThemedText>
        <Pressable onPress={() => requestAllPermissions()}>
          <ThemedView
            style={{
              backgroundColor: "#EF7A2A",
              borderRadius: 50,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ThemedText style={{ color: "white" }}>Retry</ThemedText>
          </ThemedView>
        </Pressable>
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
              <Stack.Screen
                name="ForgotCredentials"
                options={{ headerShown: false }}
              />
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
