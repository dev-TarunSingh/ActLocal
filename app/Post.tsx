import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AuthContext from "@/contexts/AuthContext";
import TextInput from "react-native-text-input-interactive";
import { useLocation } from "@/hooks/useLocation";

function Post() {
  const { PermissionGranted, longitude, latitude, errorMsg, getUserLocation } = useLocation();
  const colorScheme = useColorScheme();
  const { userProfile } = useContext(AuthContext);
  const TextInputColor = colorScheme === "light" ? "#000" : "#fff";
  const [loading, setLoading] = useState(false);
  const postedBy = userProfile._id;
  const [description, setDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [name, setName] = useState(""); // Add name field
  const [category, setCategory] = useState(""); // Add category field
  const navigation = useNavigation();

  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (longitude !== null && latitude !== null) {
      setCoordinates([longitude, latitude]);
    }
  }, [longitude, latitude]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getUserLocation();
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    if (!coordinates) {
      Alert.alert("Error", "Location not available");
      return;
    }

    try {
      const response = await axios.post("https://actlocal-server.onrender.com/services", {
        name,
        description,
        category,
        servicePrice: parseFloat(servicePrice),
        location: {
          type: "Point",
          coordinates,
        },
        postedBy: postedBy
      });
      Alert.alert("Success", "Post created successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", `Failed to create Post. check your details and try again`);
    }
  };

  if (!PermissionGranted || !coordinates) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <ThemedText style={styles.loadingText}>Getting location...</ThemedText>
          <Button title="Refresh Location" onPress={handleRefresh} />
          {errorMsg && <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>}
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <ThemedView style={styles.form}>
          <ThemedText style={styles.headerText}>Post a Service</ThemedText>
          <TextInput
            mainColor="#EF7A2A"
            style={styles.input}
            animatedPlaceholderTextColor={TextInputColor}
            onChangeText={setName}
            placeholder="Service Name"
          />
          <TextInput
            mainColor="#EF7A2A"
            style={styles.input}
            animatedPlaceholderTextColor={TextInputColor}
            onChangeText={setDescription}
            placeholder="Description"
          />
          <TextInput
            mainColor="#EF7A2A"
            style={styles.input}
            animatedPlaceholderTextColor={TextInputColor}
            onChangeText={setCategory}
            placeholder="category"
          />
          <TextInput
            mainColor="#EF7A2A"
            style={styles.input}
            animatedPlaceholderTextColor={TextInputColor}
            onChangeText={setServicePrice}
            placeholder="Price"
          />
          
          <Pressable
            style={({ pressed }) => [
              { backgroundColor: pressed ? "#EF7A2A" : "#EF7A2A" },
              { borderRadius: pressed ? 0 : 50 },
              { opacity: pressed ? 0.5 : 1.0 },
              { height: 50, justifyContent: "center", alignItems: "center" },
            ]}
            onPress={() => handleSubmit()}
          >
            <ThemedView>
              <ThemedText
                style={{ backgroundColor: "#EF7A2A", color: "white" }}
              >
                Post
              </ThemedText>
            </ThemedView>
          </Pressable>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

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

export default Post;