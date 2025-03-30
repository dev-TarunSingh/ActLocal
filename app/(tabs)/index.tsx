import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  View,
  Pressable,
} from "react-native";
import NavBar from "../../components/NavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FloatingAction } from "react-native-floating-action";
import {
  ArrowUpOnSquareStackIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { useLocation } from "@/hooks/useLocation";
import axios from "axios";
import { useChat } from "@/contexts/ChatContext";
import AuthContext from "../../contexts/AuthContext";

export default function HomeScreen() {
  const { PermissionGranted, longitude, latitude, getUserLocation, errorMsg } =
    useLocation();
  const { chatrooms, fetchChatrooms, startChat } = useChat();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [currPostChatRoom, setCurrPostChatRoom] = useState("");

  interface Post {
    _id: string;
    name: string;
    description: string;
    servicePrice: number;
    postedBy: {
      firstName: string;
      _id: string;
    };
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const { logout, userProfile } = useContext(AuthContext);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getUserLocation();
    await fetchPosts();
    setRefreshing(false);
  };

  const fetchPosts = async () => {
    if (longitude !== null && latitude !== null) {
      try {
        const response = await axios.post(
          "https://actlocal-server.onrender.com/services/nearby",
          {
            longitude,
            latitude,
          }
        );
        setPosts(response.data.services);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
  };

  useEffect(() => {
    const fetchLocationAndPosts = async () => {
      await getUserLocation();
      await fetchPosts();
      setLoading(false);
    };
    fetchLocationAndPosts();
  }, []);
  

  useEffect(() => {
    if (longitude !== null && latitude !== null) {
      fetchPosts();
    }
  }, [longitude, latitude]);

  const actions = [
    {
      text: "Add Post",
      icon: <ArrowUpOnSquareStackIcon size={24} />,
      name: "AddPost",
      position: 2,
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={styles.errorText}>
            User not logged in. Please log in to continue.
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const onChatPress = async () => {
    try {
      console.log("Fetching chatroom...");
      console.log("User1 (current user):", userProfile?._id);
      console.log("User2 (post owner):", selectedPost?.postedBy?._id);
  
      if (!userProfile || !selectedPost) {
        alert("User or post data is missing. Please try again.");
        return;
      }
  
      const res = await axios.post("http://192.168.124.73:3000/api/chat/chatrooms", {
        user1: userProfile._id,
        user2: selectedPost.postedBy._id,
      });
  
      console.log("Chatroom response:", res.data);
  
      if (res.data?.chatroomId) {
        setCurrPostChatRoom(res.data.chatroomId);
        router.push({
          pathname: "/ChatScreen",
          params: { chatroomId: res.data.chatroomId },
        });
      } else {
        alert("Failed to fetch or create chatroom. Please try again.");
      }
    } catch (error : any) {
      console.error("Error creating or fetching chatroom:", error.response?.data || error.message);
      alert("Failed to fetch or create chatroom. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
      />
      <NavBar />

      {showSummary && selectedPost && (
        <View style={styles.popupOverlay}>
          <ThemedView style={styles.popupContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSummary(false)}
            >
              <XMarkIcon size={24} />
            </TouchableOpacity>
            <ThemedText style={styles.popupTitle}>
              {selectedPost.name}
            </ThemedText>
            <ThemedText style={styles.popupDescription}>
              {selectedPost.description}
            </ThemedText>
            <ThemedText style={styles.popupPrice}>
              ₹ {selectedPost.servicePrice}
            </ThemedText>
            <ThemedText style={styles.popupPostedBy}>
              Posted by: {selectedPost.postedBy.firstName}
            </ThemedText>
            <Pressable
              style={{
                backgroundColor: "#EF7A2A",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                marginTop: 20,
              }}
              onPress={ () =>
                onChatPress()
              }
            >
              <ThemedText style={{ color: "#fff" }}>Chat</ThemedText>
            </Pressable>
          </ThemedView>
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <FloatingAction
          actions={actions}
          onPressItem={(name) => router.push("/Post")}
        />

        {PermissionGranted === false ? (
          <ThemedText>{errorMsg}</ThemedText>
        ) : null}
        {posts.length > 0 ? (
          posts.map((post) => (
            <ThemedView style={styles.postItem} key={post._id}>
              <Pressable
                onPress={() => {
                  setSelectedPost(post);
                  setShowSummary(true);
                }}
              >
                <ThemedText style={styles.postTitle}>{post.name}</ThemedText>
                <ThemedText style={styles.postDescription}>
                  {post.description}
                </ThemedText>
                <ThemedText>₹ {post.servicePrice}</ThemedText>
                <ThemedText>{post.postedBy.firstName}</ThemedText>
              </Pressable>
            </ThemedView>
          ))
        ) : (
          <ThemedView style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}>
            <ThemedText>A Bug caught us! Dont worry rescue team is here!</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  postItem: {
    padding: 16,
    margin: 10,
    borderRadius: 10,
    borderBottomColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postDescription: {
    fontSize: 16,
    color: "#666",
  },
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popupContainer: {
    padding: 20,
    width: "90%",
    height: "80%",
    borderRadius: 10,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  popupDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  popupPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
  },
  popupPostedBy: {
    fontSize: 16,
    fontStyle: "italic",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
