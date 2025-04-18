import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ChatProvider } from "@/contexts/ChatContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { Alert } from "react-native";

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
        setPermissionsGranted(true); // Still allow app to render
      }
    } catch (err) {
      console.error("Permission error:", err);
      setPermissionsGranted(true); // Prevent lock
    }
  };

  useEffect(() => {
    requestAllPermissions();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync(); // Always hide eventually
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
  // const [loaded] = useFonts({
  //   SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  // });
  // const [permissionsGranted, setPermissionsGranted] = useState(false);

  // const requestAllPermissions = async () => {
  //   try {
  //     const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
  //     const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

  //     if (mediaStatus === 'granted' || locationStatus === 'granted') {
  //       setPermissionsGranted(true);
  //     } else {
  //       console.warn("Some permissions not granted");
  //       setPermissionsGranted(true); // Proceed anyway
  //     }
  //   } catch (err) {
  //     console.error("Permission error", err);
  //     setPermissionsGranted(true); // Proceed on error
  //   }
  // };

  // useEffect(() => {
  //   requestAllPermissions();
  // }, []);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     SplashScreen.hideAsync(); // Fallback hide
  //   }, 5000); // Adjust as needed

  //   if (loaded && permissionsGranted) {
  //     SplashScreen.hideAsync();
  //   }

  //   return () => clearTimeout(timeout);
  // }, [loaded, permissionsGranted]);

  // if (!loaded || !permissionsGranted) {
  //   return null; // Keep the splash screen visible
  // }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <ChatProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="Login" options={{ headerShown: false }} />
            <Stack.Screen name="Signup" options={{ headerShown: false }} />
            <Stack.Screen name="Profile" options={{ headerShown: false }} />
            <Stack.Screen name="Post" />
            <Stack.Screen name="ChatScreen" />
            <Stack.Screen name="Chat" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
