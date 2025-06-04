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
import { useLocation } from "@/hooks/useLocation";
import axios from "axios";
import { useChat } from "@/contexts/ChatContext";
import AuthContext from "../../contexts/AuthContext";
import Spinner from "@/components/Spinner";

export default function HomeScreen() {
  const { PermissionGranted, longitude, latitude, getUserLocation, errorMsg } = useLocation();
  const { chatrooms, fetchChatrooms, startChat } = useChat();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { userProfile } = useContext<any>(AuthContext);

  const [showSummary, setShowSummary] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [currPostChatRoom, setCurrPostChatRoom] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);

  const checkInternetConnection = async () => {
    try {
      const response = await fetch("https://www.google.com", { method: "HEAD" });
      if (!response.ok) {
        setLocationError("No internet connection available.");
      }
    } catch (error) {
      setLocationError("No internet connection available.");
    }
  };

  const fetchLocationAndHandleErrors = async () => {
    try {
      await checkInternetConnection();
      await getUserLocation();
      if (longitude === null || latitude === null) {
        setLocationError("Your location is not available. Please enable location services.");
      } else {
        setLocationError(null);
      }
    } catch (error: any) {
      setLocationError(error.message || "An error occurred while fetching location.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    if (longitude !== null && latitude !== null) {
      try {
        const response = await axios.post("https://actlocal-server.onrender.com/services/nearby", {
          longitude,
          latitude,
        });

        const validPosts = Array.isArray(response.data.services)
          ? response.data.services.filter(
              (post: any) =>
                post &&
                typeof post._id === "string" &&
                typeof post.name === "string" &&
                typeof post.description === "string" &&
                typeof post.servicePrice === "number" &&
                post.postedBy &&
                typeof post.postedBy.firstName === "string" &&
                typeof post.postedBy._id === "string"
            )
          : [];

        setPosts(validPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getUserLocation();
    await fetchPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLocationAndHandleErrors();
  }, []);

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
  }, [longitude, latitude, PermissionGranted]);

  const onChatPress = async () => {
    try {
      const res = await axios.post("https://actlocal-server.onrender.com/api/chat/chatrooms", {
        user1: userProfile._id,
        user2: selectedPost.postedBy._id,
      });

      if (res.data?.chatroomId) {
        setCurrPostChatRoom(res.data.chatroomId);
        router.push({
          pathname: "/ChatScreen",
          params: { chatroomId: res.data.chatroomId },
        });
      } else {
        alert("Failed to fetch or create chatroom. Please try again.");
      }
    } catch (error: any) {
      console.error("Error creating or fetching chatroom:", error.response?.data || error.message);
      // alert("Failed to fetch or create chatroom. Please try again.");
    }
  };

  // RENDERING
  if (loading)  {
    return (
      <Spinner />
    );
  }

  if (locationError) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={styles.errorText}>{locationError}</ThemedText>
          <TouchableOpacity onPress={fetchLocationAndHandleErrors}>
            <ThemedText style={styles.errorText}>Retry</ThemedText>
          </TouchableOpacity>
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      <NavBar />

      {showSummary && selectedPost && (
        <ThemedView style={styles.popupOverlay}>
          <ThemedView style={styles.popupContainer}>
            <ThemedText style={styles.popupTitle}>{selectedPost.name}</ThemedText>
            <ThemedText style={styles.popupDescription}>{selectedPost.description}</ThemedText>
            <ThemedText style={styles.popupPrice}>₹ {selectedPost.servicePrice}</ThemedText>
            <ThemedText style={styles.popupPostedBy}>
              Posted by: {selectedPost.postedBy.firstName}
            </ThemedText>
            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={() => setShowSummary(false)}>
                <ThemedText style={styles.closeButton}>Close</ThemedText>
              </TouchableOpacity>
              <Pressable
                style={{
                  backgroundColor: "#EF7A2A",
                  padding: 10,
                  borderRadius: 50,
                  alignItems: "center",
                  width: "80%",
                }}
                onPress={onChatPress}
              >
                <ThemedText style={{ color: "#fff" }}>Chat</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </ThemedView>
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, zIndex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {PermissionGranted === false ? (
          <ThemedText style={{ zIndex: 2 }}>{errorMsg}</ThemedText>
        ) : null}
        {posts.length > 0 ? (
          posts.map((post) => (
            <ThemedView style={[styles.postItem, { zIndex: 2 }]} key={post._id}>
              <Pressable
                onPress={() => {
                  setSelectedPost(post);
                  setShowSummary(true);
                }}
              >
                <ThemedText style={styles.postTitle}>{post.name}</ThemedText>
                <ThemedText style={styles.postDescription}>{post.description}</ThemedText>
                <ThemedText>₹ {post.servicePrice}</ThemedText>
                <ThemedText>{post.postedBy.firstName}</ThemedText>
              </Pressable>
            </ThemedView>
          ))
        ) : (
          <ThemedView
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <ThemedText>A Bug caught us! Don’t worry, rescue team is here!</ThemedText>
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
    shadowRadius: 24,
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
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  popupContainer: {
    padding: 20,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    backgroundColor: "#EF7A2A",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
});
