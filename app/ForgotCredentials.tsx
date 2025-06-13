import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ForgotCredentials = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const saveToken = async (token: string) => {
    // Save the token to local storage or context
    await AsyncStorage.setItem("ResetToken", token);
  }

  const handleSendRequest = async () => {
    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://actlocal-server.onrender.com/api/user/forgot-credentials",
        {
          email : email,
        }
      );

      await saveToken(res.data.token);
      Alert.alert(
        "Success",
        res.data.message,
        [
          {
            text: "OK",
            onPress: () => router.push("/ResetPassword"), // Redirect on OK
          },
        ]
      );

    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data || err.message);
        Alert.alert(
          "Error",
          err.response?.data?.message || "Something went wrong."
        );
      } else {
        console.error(err);
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recover Credentials</Text>
      <TextInput
        placeholder="Enter your registered email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSendRequest}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ForgotCredentials;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFAA00",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#242c40",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
