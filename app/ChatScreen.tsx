import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ChatContext } from "@/contexts/ChatContext";
import { useRoute } from "@react-navigation/native";

type ChatScreenRouteParams = {
  chatId: string;
  receiverId: string;
};

const ChatScreen = () => {
  const { messages, joinRoom, sendMessage } = useContext(ChatContext);
  const route = useRoute();
  const { chatId, receiverId } = route.params || { chatId: "", receiverId: "" };
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    joinRoom(chatId);
  }, [chatId]);

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(chatId, chatId, receiverId, newMessage);
      setNewMessage("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ThemedView
            style={[
              styles.messageContainer,
              item.sender === chatId ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <ThemedText style={styles.messageText}>{item.content}</ThemedText>
          </ThemedView>
        )}
        inverted
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    maxWidth: "80%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  messageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
  },
});

export default ChatScreen;
