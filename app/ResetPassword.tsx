// app/ResetPassword.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("ResetToken");
      console.log("Loaded token:", storedToken);
      setToken(storedToken);
    };
    getToken();
  }, []);

  const handleResetPassword = async () => {
    if (!token || typeof token !== "string") {
      Alert.alert("Error", "Invalid or missing token. Please try again.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    try {
       const response = await axios.post("https://actlocal-server.onrender.com/api/user/reset-password", {
        token,
        newPassword,
      });

      const userName = response.data.username;
      console.log("Password reset successful:", response.data.username);

      Alert.alert("Success", `Password has been reset. You can now login. with user name: ${userName}`, [
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.removeItem("ResetToken");
            router.push("/Login");
          },
        },
      ]);
    } catch (err: any) {
      if (err.response?.data?.message === "Invalid or expired token.") {
        await AsyncStorage.removeItem("ResetToken");
      }
      Alert.alert("Error", err.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Reset Your Password</ThemedText>
      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
        <ThemedText style={styles.buttonText}>Reset Password</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: { padding: 20,  flex: 1 },
  title: { fontSize: 28, fontWeight: "bold", padding:10, marginTop: 20, marginBottom: 20 },
  input: {
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  button: { backgroundColor: "#ffaa00", padding: 15, borderRadius: 10 },
  buttonText: { textAlign: "center", fontWeight: "bold", color: "#fff" },
});
