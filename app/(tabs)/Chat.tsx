import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SvgUri } from "react-native-svg";
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
          <ThemedView
            style={{
              alignItems: "center",
              margin: 20,
              padding: 20,
              elevation: 2,
              borderRadius: 35,
            }}
          >
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
              borderRadius: 34,
              backgroundColor: themecolor,
              elevation: 3,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() =>
              router.push({
                pathname: "/ChatScreen",
                params: { chatroomId: item._id },
              })
            }
          >
            <View style={{ marginRight: 10, borderRadius: 25, overflow: "hidden" }}>
              <SvgUri
              uri={
                item.participants?.[0]?.profilePicture ||
                "https://actlocal-server.onrender.com/avatars/1.svg"
              }
              width={50}
              height={50}
            />
            </View>
            <View>
              <ThemedText
                style={{
                  fontSize: 18,
                  marginLeft: 10
                }}
              >
                {item.participants?.[0]?.firstName || "Unknown User"}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 14,
                  marginLeft: 10
                }}
              >
                {item.lastMessage?.text || "No messages yet"}
              </ThemedText>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default ChatListScreen;
