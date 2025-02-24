import NavBar from "@/components/NavBar";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

function ChatScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <NavBar />
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text}>Chat Screen</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});

export default ChatScreen;
