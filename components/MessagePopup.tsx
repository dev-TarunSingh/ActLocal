import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

type MessagePopupProps = {
  visible: boolean;
  message: {
    senderName?: string;
    text?: string;
    chatroomId?: string;
  } | null;
  onPress: () => void;
};

const MessagePopup: React.FC<MessagePopupProps> = ({
  visible,
  message,
  onPress,
}) => {
  if (!visible) return null;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.popup}>
        <Text style={styles.sender}>
          {message?.senderName || "New Message"}
        </Text>
        <Text style={styles.text}>{message?.text}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#EF7A2A",
    padding: 12,
    borderRadius: 10,
    elevation: 5,
    width: "90%",
  },
  sender: {
    fontWeight: "bold",
    color: "#fff",
  },
  text: {
    color: "#fff",
  },
});

export default MessagePopup;
