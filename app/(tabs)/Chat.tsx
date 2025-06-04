import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, RefreshControl, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AuthContext from "@/contexts/AuthContext";
import io from "socket.io-client";
import NavBar from "@/components/NavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChat } from "@/contexts/ChatContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "react-native";

const socket = io("https://actlocal-server.onrender.com");

const ChatListScreen = () => {
  const { chatrooms, fetchChatrooms } = useChat();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      fetchChatrooms();
    }, [])
  );

  

  const handleRefresh = () => {
    setRefreshing(true);
    fetchChatrooms()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const themecolor = colorScheme === "dark" ? "#333" : "#fff";
  const textColor = colorScheme === "dark" ? "#fff" : "#000";

  return (
    <SafeAreaView>
      <NavBar />
      <FlatList
      data={Array.isArray(chatrooms) ? chatrooms : []}
      keyExtractor={(item) => item._id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={
        <ThemedView style={{ alignItems: "center", marginTop: 20 }}>
        <ThemedText style={{ fontSize: 16, color: textColor }}>
          No chatrooms available. Start a new conversation!
        </ThemedText>
        </ThemedView>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
        style={{
          padding: 16,
          margin: 10,
          borderRadius: 24,
          backgroundColor: themecolor,
          elevation: 3,
        }}
        onPress={() =>
          router.push({
          pathname: "/ChatScreen",
          params: { chatroomId: item._id },
          })
        }
        >
        <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>
          {item.participants?.[0]?.firstName || "Unknown User"}
        </ThemedText>
        <ThemedText style={{ color: "#666" }}>
          {item.lastMessage?.text || "No messages yet"}
        </ThemedText>
        </TouchableOpacity>
      )}
      />
    </SafeAreaView>
  );
};

export default ChatListScreen;
