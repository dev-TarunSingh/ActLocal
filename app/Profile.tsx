import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { SvgUri } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;

const avatarOptions = [
  "https://actlocal-server.onrender.com/avatars/1.svg",
  "https://actlocal-server.onrender.com/avatars/2.svg",
  "https://actlocal-server.onrender.com/avatars/3.svg",
  "https://actlocal-server.onrender.com/avatars/4.svg",
  "https://actlocal-server.onrender.com/avatars/5.svg",
  "https://actlocal-server.onrender.com/avatars/6.svg",
  "https://actlocal-server.onrender.com/avatars/7.svg",
  "https://actlocal-server.onrender.com/avatars/8.svg",
];

type Service = {
  _id: string;
  name: string;
};

const Profile = () => {
  const { userProfile, setUserProfile, logout } = useContext(AuthContext);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(userProfile);
  const colorScheme = useColorScheme();

  const themecolor = colorScheme === "dark" ? "#000000" : "#FFFFFF";
  const themetext = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const bgcolor = colorScheme === "dark" ? "#000000" : "#ffffff";

  useEffect(() => {
    setUpdatedProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://actlocal-server.onrender.com/services/my-services",
          { params: { user: userProfile._id } }
        );
        setServices(response.data.posts);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [userProfile]);

  const handleEditProfile = () => setIsEditing(true);

  const handleChange = (key: string, value: string) => {
    setUpdatedProfile((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        `https://actlocal-server.onrender.com/api/user/${userProfile._id}`,
        updatedProfile
      );
      console.log("Profile updated:", response.data.user);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      setUserProfile(response.data.user);
      Alert.alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setUpdatedProfile(userProfile);
    setIsEditing(false);
  };

  const handleDeleteService = async (serviceId: any) => {
    Alert.alert("Confirm", "Are you sure you want to delete this service?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(
              `https://actlocal-server.onrender.com/services`,
              {
                data: { serviceId },
              }
            );
            setServices((prev) =>
              prev.filter((service) => service._id !== serviceId)
            );
          } catch (error) {
            console.error("Failed to delete service:", error);
          }
        },
      },
    ]);
  };

  const renderAvatar = (uri: string, isSelected: boolean) => (
    <TouchableOpacity
      key={uri}
      onPress={() => handleChange("profilePicture", uri)}
      style={[styles.avatarWrapper, isSelected && styles.selectedAvatarWrapper]}
    >
      <View style={styles.svgContainer}>
        <SvgUri uri={uri} width="100%" height="100%" />
      </View>
    </TouchableOpacity>
  );

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
              source={{ uri: userProfile.profilePicture }}
              style={styles.profileImage}
            />
          )}
          <ThemedText style={[styles.nameText, { color: themetext }]}>
            {userProfile.firstName} {userProfile.lastName}
          </ThemedText>
          <ThemedText style={[styles.emailText, { color: themetext }]}>
            {userProfile.email}
          </ThemedText>
          {userProfile.bio && !isEditing && (
            <ThemedText style={[styles.bioText, { color: themetext }]}>
              {userProfile.bio}
            </ThemedText>
          )}
        </ThemedView>

        {isEditing && (
          <ThemedView style={styles.formContainer}>
            <ThemedText style={[styles.label, { color: themetext }]}>
              Select Avatar
            </ThemedText>
            <View style={styles.avatarRow}>
              {avatarOptions.map((uri) =>
                renderAvatar(uri, updatedProfile.profilePicture === uri)
              )}
            </View>

            {["firstName", "userName", "phone", "address", "bio", "email"].map(
              (key) => (
                <TextInput
                  key={key}
                  style={[
                    styles.input,
                    { backgroundColor: themecolor, color: themetext },
                  ]}
                  value={updatedProfile[key] || ""}
                  onChangeText={(text) => handleChange(key, text)}
                  placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                  placeholderTextColor={
                    colorScheme === "dark" ? "#888888" : "#999999"
                  }
                  keyboardType={
                    key.toLowerCase().includes("phone")
                      ? "phone-pad"
                      : "default"
                  }
                />
              )
            )}

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveProfile}
            >
              <ThemedText style={styles.buttonText}>Save</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancelEdit}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}

        {!isEditing && (
          <>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={handleEditProfile}
            >
              <ThemedText style={styles.buttonText}>Edit Profile</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <ThemedText style={styles.buttonText}>Logout</ThemedText>
            </TouchableOpacity>
          </>
        )}

        <ThemedView style={styles.servicesContainer}>
          <ThemedText style={[styles.sectionTitle, { color: themetext }]}>
            Your Services
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
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteService(item._id)}
                >
                  <ThemedText style={styles.buttonText}>Delete</ThemedText>
                </TouchableOpacity>
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
  saveBtn: {
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 35,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelBtn: {
    backgroundColor: "#DC3545",
    padding: 12,
    borderRadius: 35,
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 35,
    alignItems: "center",
    marginBottom: 10,
  },
  logoutBtn: {
    backgroundColor: "#EF7A2A",
    padding: 12,
    borderRadius: 35,
    alignItems: "center",
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
    padding: 15,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
