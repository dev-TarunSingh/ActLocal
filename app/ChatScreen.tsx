import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, RefreshControl, ScrollView } from "react-native";
import { useChat } from "@/contexts/ChatContext";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AuthContext from "@/contexts/AuthContext";

interface ChatScreenProps {
  chatroomId?: string;
}

const ChatScreen = ({ chatroomId: propChatroomId }: ChatScreenProps) => {
  const { userProfile } = useContext(AuthContext);
  const { chatroomId } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const { getMessages, sendMessage, messages, setMessages } = useChat();
  const [text, setText] = useState("");
  const [sortedMessages, setSortedMessages] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      console.log("Gettimng messages for chatroomId:", chatroomId);
      getMessages(chatroomId || propChatroomId)
        
    }, [chatroomId])
  );

  const handleSendMessage = () => {
    if (text.trim()) {
      const newMessage = {
        _id: Math.random().toString(), // Temporary ID until server response
        chatroomId: chatroomId || propChatroomId,
        sender: { _id: userProfile._id }, 
        text,
        timestamp: new Date().toISOString(), // Local timestamp
      };
  
      // Optimistically update UI
      setMessages((prev) => ({
        ...prev,
        [chatroomId]: [...(prev[chatroomId] || []), newMessage],
      }));
  
      sendMessage(chatroomId, text);
      setText("");
    }
  };

  function handleRefresh(): void {
    getMessages(chatroomId)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
            >
      <View style={{ flex: 1, padding: 10 }}>
        <FlatList
          data={messages[chatroomId] || []}
          keyExtractor={(item) => item._id} // Ensure each item has a unique _id
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender._id === userProfile._id ? styles.userMessage : styles.otherMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === userProfile._id ? styles.userMessageText : styles.otherMessageText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
        />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          style={styles.input}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#EF7A2A",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    margin: 8,
    borderRadius: 4,
  },
});

export default ChatScreen;
