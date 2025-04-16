import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import { useColorScheme } from "react-native";
import { setStatusBarBackgroundColor } from "expo-status-bar";

const Profile = () => {
  const { userProfile, logout } = useContext(AuthContext);
  const [services, setServices] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ ...userProfile });
  const colorScheme = useColorScheme();

  const themecolor = colorScheme === "dark" ? "#333" : "#fff";
  const themetext = colorScheme === "dark" ? "#fff" : "#000";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://actlocal-server.onrender.com/services/my-services",
          { params: { user: userProfile._id } }
        );
        console.log("Fetched Services:", response.data.posts);
        setServices(response.data.posts);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [userProfile._id]);

  const handleEditProfile = () => setIsEditing(true);

  const handleSaveProfile = async () => {
    try {
      await axios.put(
        `https://actlocal-server.onrender.com/users/${userProfile._id}`,
        updatedProfile
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleChange = (key: string, value: string) => {
    setUpdatedProfile({ ...updatedProfile, [key]: value });
  };

  const handleCancelEdit = () => {
    setUpdatedProfile({ ...userProfile }); // Reset changes
    setIsEditing(false); // Exit editing mode
  };

  const handleDeleteService = async (serviceId: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this service?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          console.log("Deleting service with ID:", serviceId);
          try {
            await axios.delete(
              `http://192.168.1.8:3000/services`,
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.profileContainer}>
        <Image
          source={{
            uri:
              userProfile.profilePicture || "https://via.placeholder.com/100",
          }}
          style={styles.profileImage}
        />
        <ThemedText style={styles.profileName}>
          {userProfile.firstName} {userProfile.lastName}
        </ThemedText>
        <ThemedText style={styles.profileEmail}>{userProfile.email}</ThemedText>
      </ThemedView>

      {isEditing ? (
        <ThemedView style={styles.formContainer}>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: themecolor, color: themetext },
            ]}
            value={updatedProfile.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
            placeholder="First Name"
          />
          <TextInput
            style={[
              styles.input,
              { backgroundColor: themecolor, color: themetext },
            ]}
            value={updatedProfile.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
            placeholder="Last Name"
          />
          <TextInput
            style={[
              styles.input,
              { backgroundColor: themecolor, color: themetext },
            ]}
            value={updatedProfile.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="Email"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
          >
            <ThemedText style={styles.buttonText}>Save</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelEdit}
          >
            <ThemedText style={styles.buttonText}>Cancel</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <>
          <ThemedView>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <ThemedText style={styles.buttonText}>Edit Profile</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <ThemedText style={styles.buttonText}>Logout</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </>
      )}

      <ThemedView style={styles.servicesContainer}>
        <ThemedText style={styles.sectionTitle}>Your Services</ThemedText>
        {loading ? (
          <ActivityIndicator size="large" color="#EF7A2A" />
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ThemedView
                style={[
                  styles.serviceCard,
                  {
                    backgroundColor: themecolor,
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  },
                ]}
              >
                <ThemedText style={styles.serviceTitle}>{item.name}</ThemedText>
                <TouchableOpacity
                  onPress={() => handleDeleteService(item._id)}
                  style={styles.deleteButton}
                >
                  <ThemedText style={styles.buttonText}>Delete</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileContainer: { alignItems: "center", padding: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  profileName: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  profileEmail: { fontSize: 16, color: "gray" },
  formContainer: { padding: 20 },
  input: { padding: 10, borderRadius: 5, marginBottom: 10 },
  saveButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    margin: 20,
  },
  servicesContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  serviceCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceTitle: { fontSize: 16, fontWeight: "bold" },
  deleteButton: { backgroundColor: "#DC3545", padding: 5, borderRadius: 50 },
  logoutButton: {
    backgroundColor: "#EF7A2A",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    margin: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default Profile;
