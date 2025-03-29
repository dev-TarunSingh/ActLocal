import React, { useEffect, useState, useContext } from "react";
import { TouchableOpacity, FlatList } from "react-native";
import axios from "axios";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";

const ChatListScreen = ({ navigation, route }) => {
    console.log(route.params);
    const { userProfile } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const userId = userProfile._id; 

    useEffect(() => {
        axios.get(`http://192.168.210.178:3000/receivers/${userId}`)
            .then(res => setChats(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <ThemedView>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.chatroomId}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("ChatScreen", { chatroomId: item.chatroomId })}>
                        <ThemedText>{item.receiver}</ThemedText>
                        <ThemedText>{item.lastMessage}</ThemedText>
                    </TouchableOpacity>
                )}
            />
        </ThemedView>
    );
};

export default ChatListScreen;
