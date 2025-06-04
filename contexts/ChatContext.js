import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import AuthContext from "@/contexts/AuthContext";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { userProfile, loading } = useContext(AuthContext);
  const [chatrooms, setChatrooms] = useState([]);
  const [messages, setMessages] = useState({}); // Initialize as an empty object
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (loading || !userProfile) return; // Wait for userProfile to load

    const newSocket = io("https://actlocal-server.onrender.com");
    setSocket(newSocket);

    newSocket.emit("join", userProfile._id);

    // Handle new incoming messages
    newSocket.on("newMessage", (message) => {
      if (message && message.chatroomId) {
        setMessages((prev) => ({
          ...prev,
          [message.chatroomId]: [...(prev[message.chatroomId] || []), message], // Append new messages
        }));
      } else {
        console.error("Invalid message received:", message);
      }
    });

    // Handle missed messages when user reconnects
    newSocket.on("missedMessages", ({ chatroomId, messages: missed }) => {
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
    });

    return () => newSocket.disconnect();
  }, [userProfile, loading]);

  const fetchChatrooms = async () => {
    if (!userProfile) return; // Ensure userProfile is available

    try {
      console.log("Fetching Chatrooms for user:", userProfile._id);

      const res = await axios.get(
        `https://actlocal-server.onrender.com/api/chat/${userProfile._id}`
      );

      if (Array.isArray(res.data)) {
        setChatrooms(res.data); // Only set state if it's a valid array
      } else {
        console.error("Error: Expected an array but got:", res.data);
        setChatrooms([]); // Prevent app from breaking
      }
    } catch (error) {
      console.error("Error fetching chatrooms:", error);
      setChatrooms([]); // Handle errors gracefully
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
        [chatroomId]: messagesArray, // Replace with the fetched messages
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Ensure chatroomId key exists even on error
    }
  };

  const sendMessage = (chatroomId, text) => {
    if (socket && userProfile) {
      console.log("sending msg");
      socket.emit("sendMessage", { chatroomId, sender: userProfile._id, text });
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
