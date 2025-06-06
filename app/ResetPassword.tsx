// app/ResetPassword.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";

const ResetPassword = () => {
  const { token } = useLocalSearchParams(); // token comes from URL
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      await axios.post("https://actlocal-server.onrender.com/api/user/reset-password", {
        token,
        newPassword,
      });
      Alert.alert("Success", "Password has been reset. You can now login.");
    } catch (err: any) {
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
  container: { padding: 20, marginTop: 100 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { backgroundColor: "#eee", borderRadius: 10, padding: 12, marginBottom: 20 },
  button: { backgroundColor: "#ffaa00", padding: 15, borderRadius: 10 },
  buttonText: { textAlign: "center", fontWeight: "bold", color: "#fff" },
});
