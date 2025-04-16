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

  useEffect(() => {
    console.log("Updated Chatrooms:", chatrooms);
  }, [chatrooms]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchChatrooms()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("Received message:", message);
      // Update chatrooms or messages state here if necessary
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const themecolor = colorScheme === "dark" ? "#333" : "#fff";
  const textColor = colorScheme === "dark" ? "#fff" : "#000";

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
                borderRadius: 24,
                backgroundColor: themecolor,
                shadowColor: "#000",
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
