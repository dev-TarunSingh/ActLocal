import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "@/contexts/AuthContext";
import socket from "@/socket"; // shared socket instance

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { userProfile, loading } = useContext(AuthContext);
  const { showPopup } = usePopup(); // assuming PopupContext is available
  const [chatrooms, setChatrooms] = useState([]);
  const [messages, setMessages] = useState({}); // { chatroomId: [message, ...] }

  useEffect(() => {
    if (loading || !userProfile) return;

    socket.connect(); // manually initiate connection
    socket.emit("join", userProfile._id);

    const handleNewMessage = (message) => {
      if (message?.chatroomId) {
        setMessages((prev) => ({
          ...prev,
          [message.chatroomId]: [...(prev[message.chatroomId] || []), message],
        }));

        showPopup({
          senderName: message.senderName,
          text: message.text,
          chatroomId: message.chatroomId,
        });
      } else {
        console.error("Invalid message received:", message);
      }
    };

    const handleMissedMessages = ({ chatroomId, messages: missed }) => {
      if (chatroomId && Array.isArray(missed)) {
        setMessages((prev) => ({
          ...prev,
          [chatroomId]: [...(prev[chatroomId] || []), ...missed],
        }));
      } else {
        console.error("Invalid missed messages received:", {
          chatroomId,
          missed,
        });
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("missedMessages", handleMissedMessages);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("missedMessages", handleMissedMessages);
    };
  }, [userProfile, loading]);

  const fetchChatrooms = async () => {
    if (!userProfile) return;

    try {
      console.log("Fetching Chatrooms for user:", userProfile._id);

      const res = await axios.get(
        `https://actlocal-server.onrender.com/api/chat/${userProfile._id}`
      );

      if (Array.isArray(res.data)) {
        setChatrooms(res.data);
      } else {
        console.error("Expected array but got:", res.data);
        setChatrooms([]);
      }
    } catch (error) {
      console.error("Error fetching chatrooms:", error);
      setChatrooms([]);
    }
  };

  const getMessages = async (chatroomId) => {
    try {
      const res = await axios.get(
        `https://actlocal-server.onrender.com/api/chat/messages/${chatroomId}`
      );

      const messagesArray = Array.isArray(res.data) ? res.data : [];
      setMessages((prev) => ({
        ...prev,
        [chatroomId]: messagesArray,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = (chatroomId, text) => {
    if (socket && userProfile) {
      socket.emit("sendMessage", {
        chatroomId,
        sender: userProfile._id,
        text,
      });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chatrooms,
        messages,
        fetchChatrooms,
        getMessages,
        sendMessage,
        setMessages,
        socket, // optional if needed outside
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
