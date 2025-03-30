import React, { useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { useChat } from "@/contexts/ChatContext";
import type { RouteProp } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

type ChatScreenRouteProp = RouteProp<{ params: { chatroomId: string } }, "params">;

const ChatScreen = ({ route } : any) => {
  const { chatroomId } = useLocalSearchParams() as { chatroomId: string };
  const { messages, getMessages, sendMessage } = useChat();
  const [text, setText] = React.useState("");

  useEffect(() => {
    getMessages(chatroomId);
  }, []);

  return (
    <View>
      <FlatList
        data={messages[chatroomId] || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text>{item.text}</Text>}
      />
      <TextInput value={text} onChangeText={setText} />
      <Button title="Send" onPress={() => sendMessage(chatroomId, text)} />
    </View>
  );
};

export default ChatScreen;
