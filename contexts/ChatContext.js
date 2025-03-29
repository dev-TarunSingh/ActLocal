import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const SERVER_URL = "http://192.168.210.178:3000"; // Replace with your backend URL

    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    const joinRoom = (chatroomId) => {
        if (socket) {
            socket.emit("joinRoom", { chatroomId });
        }
    };

    const sendMessage = async (chatroomId, sender, receiver, text) => {
        if (socket) {
            socket.emit("sendMessage", { chatroomId, sender, receiver, text });
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("newMessage", (newMsg) => {
                setMessages((prev) => [...prev, newMsg]);
            });
        }
    }, [socket]);

    return (
        <ChatContext.Provider value={{ messages, joinRoom, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export { ChatContext, ChatProvider };
