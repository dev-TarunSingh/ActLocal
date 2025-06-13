import React, { useState } from "react";
import { Modal, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";

type CustomAlertProps = {
  visible: boolean;
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, message, onClose, type }) => (
  <Modal visible={visible} transparent animationType="fade">
    <ThemedView style={styles.overlay}>
      <ThemedView style={styles.alertBox}>
        <ThemedText style={styles.title}>{type}</ThemedText>
        <ThemedText style={styles.message}>{message}</ThemedText>
        <TouchableOpacity onPress={onClose} style={styles.button}>
          <ThemedText style={styles.buttonText}>OK</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  alertBox: { backgroundColor: "#fff", borderRadius: 10, padding: 24, alignItems: "center", width: 300 },
  title: { fontWeight: "bold", fontSize: 20, marginBottom: 10 },
  message: { fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: "#ffaa00", padding: 10, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default CustomAlert;