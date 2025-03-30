import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { useChat } from "@/contexts/ChatContext";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthContext from "@/contexts/AuthContext";

const ChatScreen = () => {
  const { userProfile } = useContext(AuthContext);
  const { chatroomId } = useLocalSearchParams();
  const { getMessages, sendMessage, messages } = useChat();
  const [text, setText] = useState("");
  const [sortedMessages, setSortedMessages] = useState(); // Ensure it's initialized as an array
  

  console.log(messages);

  useEffect(() => {
    getMessages(chatroomId)
      .then((messages) => {
        console.log("Fetched Messages:", messages); // Debugging log
        setSortedMessages(
          [...messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        );
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, [1000]);

  const handleSendMessage = () => {
    if (text.trim()) {
      sendMessage(chatroomId, text);
          setText(""); // Clear input after sending
          getMessages(chatroomId);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 10 }}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id} // Ensure each item has a unique _id
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender === userProfile._id ? styles.userMessage : styles.otherMessage,
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
    backgroundColor: "orange",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "black",
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
