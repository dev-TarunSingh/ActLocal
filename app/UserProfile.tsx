import React, { useContext, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Alert,
  Dimensions,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import { useColorScheme } from "react-native";
import { SvgUri } from "react-native-svg";
import { useLocalSearchParams } from "expo-router";
import AnimatedButton from "@/components/AnimatedButton";

type Service = {
  _id: string;
  name: string;
};

const Profile = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [otherUserProfile, setotherUserProfile] = useState<any>({});
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currPostChatRoom, setCurrPostChatRoom] = useState("");
  const colorScheme = useColorScheme();
  const { userProfile } = useContext<any>(AuthContext);

  const themecolor = colorScheme === "dark" ? "#000000" : "#FFFFFF";
  const themetext = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const bgcolor = colorScheme === "dark" ? "#000000" : "#ffffff";

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://10.32.142.207:3000/api/user/profile",
        {
          id: userId,
        }
      );

      const data = response.data;

      console.log("User Profile:", data.profile);
      setotherUserProfile(data.profile);
      console.log("User Services:", data.posts);
      setServices(data.posts || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data || error.message);

        Alert.alert(
          "Error",
          error.response?.data?.message || "Failed to fetch user profile",
          [
            {
              text: "OK",
              onPress: () => {
                router.back(); // This ensures it only goes back after user taps OK
              },
            },
          ]
        );
      } else {
        console.error("Unexpected error:", error);

        Alert.alert("Error", "Something went wrong. Please try again.", [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile(userId as string);
  }, [userId]);

  const onChatPress = async () => {
    console.log("inside chat press");
    try {
      const res = await axios.post(
        "https://actlocal-server.onrender.com/api/chat/chatrooms",
        {
          user1: userProfile._id,
          user2: userId,
        }
      );

      if (res.data?.chatroomId) {
        const roomId = res.data.chatroomId;
        router.push({
          pathname: "/ChatScreen",
          params: { chatroomId: roomId },
        });
      } else {
        alert("Failed to fetch or create chatroom. Please try again.");
      }
    } catch (error: any) {
      console.error(
        "Error creating or fetching chatroom:",
        error.response?.data || error.message
      );
      // alert("Failed to fetch or create chatroom. Please try again.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bgcolor }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#EF7A2A" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgcolor }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.profileHeader}>
          {userProfile.profilePicture?.endsWith(".svg") ? (
            <View style={styles.avatarCircle}>
              <SvgUri
                uri={userProfile.profilePicture}
                width="100%"
                height="100%"
              />
            </View>
          ) : (
            <Image
              source={{ uri: otherUserProfile.profilePicture }}
              style={styles.profileImage}
            />
          )}
          <ThemedText style={[styles.nameText, { color: themetext }]}>
            {otherUserProfile.firstName}
          </ThemedText>
          <ThemedText style={[styles.emailText, { color: themetext }]}>
            {otherUserProfile.bio}
          </ThemedText>
          <AnimatedButton label="Chat" onPress={onChatPress} />
        </ThemedView>

        <ThemedView style={styles.servicesContainer}>
          <ThemedText style={[styles.sectionTitle, { color: themetext }]}>
            Services
          </ThemedText>
          {loading ? (
            <ActivityIndicator size="large" color="#EF7A2A" />
          ) : services.length > 0 ? (
            services.map((item) => (
              <View
                key={item._id}
                style={[styles.serviceCard, { backgroundColor: themecolor }]}
              >
                <ThemedText style={[styles.serviceName, { color: themetext }]}>
                  {item.name}
                </ThemedText>
                <ThemedText>
                  {item.description || "No description available"}
                </ThemedText>
              </View>
            ))
          ) : (
            <ThemedText style={{ color: themetext }}>
              No services found.
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { padding: 20 },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    borderRadius: 34,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  nameText: { fontSize: 22, fontWeight: "bold" },
  emailText: { fontSize: 14, marginBottom: 4 },
  bioText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
  },
  formContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 34,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  avatarRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  avatarWrapper: {
    padding: 4,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatarWrapper: {
    borderColor: "#007BFF",
    backgroundColor: "#E3F2FD",
  },
  svgContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden", // KEY PART FOR CIRCULAR MASKING
    backgroundColor: "#fff",
  },
  Btn: {
    backgroundColor: "#EF7A2A",
    padding: 12,
    width: 100,
    textAlign: "center",
    borderRadius: 35,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  servicesContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 34,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  serviceCard: {
    padding: 20,
    borderRadius: 32,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    elevation: 3,
  },
  serviceName: { fontSize: 16, fontWeight: "600" },
  deleteBtn: {
    backgroundColor: "#DC3545",
    elevation: 10,
    padding: 6,
    borderRadius: 50,
  },
});

export default Profile;
