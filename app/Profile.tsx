import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AuthContext from "@/contexts/AuthContext";
import axios from "axios"; // Icons for UI enhancement

const Profile = () => {
  const { userProfile } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ ...userProfile });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://actlocal-server.onrender.com/services",
          { params: { userId: userProfile._id } }
        );
        setServices(response.data);
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
      const response = await axios.put(
        `https://actlocal-server.onrender.com/users/${userProfile._id}`,
        updatedProfile
      );
      // setUserProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleChange = (key: any, value: any) => {
    setUpdatedProfile({ ...updatedProfile, [key]: value });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ThemedView style={{ alignItems: "center", padding: 20 }}>
          <Image
            source={{ uri: userProfile.avatar }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <ThemedText style={{ fontSize: 20, marginTop: 10 }}>
            {userProfile.firstName} {userProfile.lastName}
          </ThemedText>
          <ThemedText style={{ fontSize: 16, marginTop: 10 }}>
            {userProfile.email}
          </ThemedText>
          {isEditing ? (
            <View style={{ width: "100%", padding: 20 }}>
              <ThemedText style={{ fontSize: 16 }}>First Name</ThemedText>
              <TextInput
                style={{
                  backgroundColor: "#f1f1f1",
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                value={updatedProfile.firstName}
                onChangeText={(text) => handleChange("firstName", text)}
              />
              <ThemedText style={{ fontSize: 16 }}>Last Name</ThemedText>
              <TextInput
                style={{
                  backgroundColor: "#f1f1f1",
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                value={updatedProfile.lastName}
                onChangeText={(text) => handleChange("lastName", text)}
              />
              <ThemedText style={{ fontSize: 16 }}>Email</ThemedText>
              <TextInput
                style={{
                  backgroundColor: "#f1f1f1",
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                value={updatedProfile.email}
                onChangeText={(text) => handleChange("email", text)}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: "blue",
                  padding: 10,
                  borderRadius: 5,
                  alignItems: "center",
                  marginTop: 20,
                }}
                onPress={handleSaveProfile}
              >
                <ThemedText style={{ color: "#fff" }}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: "blue",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                marginTop: 20,
              }}
              onPress={handleEditProfile}
            >
              <ThemedText style={{ color: "#fff" }}>Edit Profile</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  form: {
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
  },
  input: {
    borderRadius: 50,
    marginVertical: 8,
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
});

export default Profile;
