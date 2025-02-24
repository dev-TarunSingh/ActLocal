import NavBar from "@/components/NavBar";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ChatScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
      />
      <NavBar />
      <View style={styles.container}>
        <Text style={styles.text}>Chat Screen</Text>
      </View>
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
