import React from "react";
import { View, StyleSheet, Image, Text, useColorScheme, ActivityIndicator } from "react-native";
import { ThemedView } from "./ThemedView"; // Assuming you’re using this for theme consistency
import { StatusBar } from "expo-status-bar";

export default function Spinner() {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  return (
    <ThemedView style={[styles.container, isLight ? styles.light : styles.dark]}>
      <StatusBar style={isLight ? "dark" : "light"} />
      <ActivityIndicator size="large" color="#EF7A2A" />
      
      <Text style={[styles.loadingText, isLight ? styles.lightText : styles.darkText]}>
        Loading, please wait...
      </Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  spinner: {
    height: 100,
    width: 100,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  light: {
    backgroundColor: "#F4F4F4",
  },
  dark: {
    backgroundColor: "#1E1E1E",
  },
  lightText: {
    color: "#333",
  },
  darkText: {
    color: "#EEE",
  },
});
