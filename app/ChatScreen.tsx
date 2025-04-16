import React, { useState, useContext, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useChat } from "@/contexts/ChatContext";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AuthContext from "@/contexts/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

interface ChatScreenProps {
  chatroomId?: string;
}

const ChatScreen = ({ chatroomId: propChatroomId }: ChatScreenProps) => {
  const { userProfile } = useContext(AuthContext);
  const { chatroomId: chatroomIdParam } = useLocalSearchParams();
  const chatroomId = Array.isArray(chatroomIdParam)
    ? chatroomIdParam[0]
    : chatroomIdParam;
  const [refreshing, setRefreshing] = useState(false);
  const { getMessages, sendMessage, messages, setMessages } = useChat();
  const [text, setText] = useState("");
  const [sendingMessageIds, setSendingMessageIds] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      getMessages(chatroomId || propChatroomId);
    }, [chatroomId])
  );

  const handleSendMessage = () => {
    if (text.trim()) {
      const newMessage = {
        _id: Math.random().toString(),
        chatroomId: chatroomId || propChatroomId,
        sender: { _id: userProfile._id },
        text,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev: { [x: string]: any }) => ({
        ...prev,
        [(chatroomId || propChatroomId) as string]: [
          ...(prev[(chatroomId || propChatroomId) as string] || []),
          newMessage,
        ],
      }));

      setSendingMessageIds((prev) => [...prev, newMessage._id]);

      sendMessage(chatroomId, text);

      setText("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  function handleRefresh() {
    getMessages(chatroomId);
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <FlatList
                ref={flatListRef}
                data={messages[chatroomId] || []}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <ThemedView
                    style={[
                      styles.messageContainer,
                      item.sender._id === userProfile._id
                        ? styles.userMessage
                        : styles.otherMessage,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.messageText,
                        item.sender._id === userProfile._id
                          ? styles.userMessageText
                          : styles.otherMessageText,
                      ]}
                    >
                      {item.text}
                    </ThemedText>
                  </ThemedView>
                )}
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                onLayout={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                contentContainerStyle={{ paddingBottom: 110 }}
              />

              {/* Input Section - Always Visible */}
              <View style={styles.inputContainer}>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Type a message..."
                  style={styles.input}
                />
                <Pressable onPress={() => handleSendMessage()}>
                  <View
                    style={{
                      backgroundColor: "#EF7A2A",
                      borderRadius: 50,
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white" }}>Send</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginHorizontal: 10,
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#EF7A2A",
    borderRadius: 24,
    minWidth: 30,
    elevation: 10,
    shadowColor: "#000",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E0E0E0",
    borderRadius: 24,
    minWidth: 20,
    elevation: 10,
    shadowColor: "#000",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 50,
    marginRight: 10,
  },
});

export default ChatScreen;
