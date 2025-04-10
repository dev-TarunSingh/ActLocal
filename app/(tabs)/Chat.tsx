import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, RefreshControl, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AuthContext from "@/contexts/AuthContext";
import io from "socket.io-client";
import NavBar from "@/components/NavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChat } from "@/contexts/ChatContext";
import navigation from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const socket = io("https://actlocal-server.onrender.com");

const ChatListScreen = () => {
  const { chatrooms, fetchChatrooms } = useChat();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchChatrooms(); // Fetch chatrooms when screen is focused
    }, [])
  );

  useEffect(() => {
    console.log("Updated Chatrooms:", chatrooms);
  }, [chatrooms]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchChatrooms()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  return (
    <SafeAreaView>
      <NavBar />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
      >
        <FlatList
          data={chatrooms}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 16,
                margin: 10,
                borderRadius: 10,
                borderBottomColor: "#ccc",
                shadowColor: "#000",
                backgroundColor: "#fff",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatListScreen;
