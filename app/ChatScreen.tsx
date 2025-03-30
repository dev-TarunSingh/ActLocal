import React, { useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { useChat } from "@/contexts/ChatContext";

const ChatScreen = ({ route }) => {
  const { chatroomId } = route.params;
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
