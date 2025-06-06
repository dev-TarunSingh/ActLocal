import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
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
import Spinner from "@/components/Spinner";

function Post() {
  const { PermissionGranted, longitude, latitude, getUserLocation } =
    useLocation();
  const colorScheme = useColorScheme();
  const { userProfile } = useContext<any>(AuthContext);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const themetext = colorScheme === "dark" ? "#fff" : "#000";
  const themecolor = colorScheme === "dark" ? "#1a1a1a" : "#f9f9f9";

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

    if (!name || !description || !category || !servicePrice) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (isNaN(parseFloat(servicePrice))) {
      Alert.alert("Error", "Price must be a valid number");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://actlocal-server.onrender.com/services", {
        name,
        description,
        category,
        servicePrice: parseFloat(servicePrice),
        location: {
          type: "Point",
          coordinates,
        },
        postedBy: userProfile._id,
      });
      Alert.alert("Success", "Post created successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to create Post. Check your details and try again"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!PermissionGranted || !coordinates || loading) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    style={{ flex: 1 }}
  >
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
        <ThemedText style={styles.headerText}>Post a Service</ThemedText>

        <View style={styles.inputWrapper}>
          <TextInput
            mainColor="#EF7A2A"
            style={styles.inputText}
            onChangeText={setName}
            value={name}
            placeholder="Service Name"
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            mainColor="#EF7A2A"
            style={styles.inputText}
            onChangeText={setDescription}
            value={description}
            placeholder="Description"
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            mainColor="#EF7A2A"
            style={styles.inputText}
            onChangeText={setCategory}
            value={category}
            placeholder="Category"
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            mainColor="#EF7A2A"
            style={styles.inputText}
            onChangeText={setServicePrice}
            value={servicePrice}
            placeholder="Price"
            keyboardType="numeric"
          />
        </View>

        <Pressable style={styles.button} onPress={handleSubmit}>
          <ThemedText style={styles.buttonText}>Post</ThemedText>
        </Pressable>
    </ScrollView>
  </KeyboardAvoidingView>
</SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    alignItems: "center",
  },
  
  headerText: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    color: "#EF7A2A",
    padding: 10,
  },
  inputWrapper: {
    width: "100%",
    marginVertical: 8,
    borderRadius: 50,
  },
  inputText: {
    width: "100%",
    borderRadius: 50,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#EF7A2A",
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Post;
