import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AuthContext from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import axios from "axios";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "react-native";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const colorScheme = useColorScheme();

  const router = useRouter();

  const handleSubmit = () => {
    setLoading(true);
    axios
      .post("http://192.168.43.178:3000/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        const token = res.data.token; // Extract token from response
        console.log(token);
        if (token) {
          login(token); // Call login with the token
        } else {
          console.error("Token is null or undefined");
          alert("Failed to login: Token is missing");
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response:", error.response.data);
          alert(`Error: ${error.response.data.message}`);
        } else if (error.request) {
          console.error("Error request:", error.request);
          alert("Error: No response from server.");
        } else {
          console.error("Error message:", error.message);
          alert(`Error: ${error.message}`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar />
        <View style={styles.headText}>
          <Text style={styles.header}>Log In</Text>
          <Text style={styles.breif}>Login In to use our Services!</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            style={styles.link}
            onPress={() => router.push("/Signup")}
          >
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
          <ThemedView style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor="black"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={password}
                placeholderTextColor="black"
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[
                styles.btn,
                colorScheme === "light"
                  ? { backgroundColor: "#242c40" }
                  : { backgroundColor: "#FFFF" },
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.btnText,
                    colorScheme === "light"
                      ? { color: "#FFFFFF" }
                      : { color: "#000000" },
                  ]}
                >
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFAA00",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  headText: {
    padding: 20,
    top: 80,
    position: "absolute",
  },
  formContainer: {
    padding: 20,
    paddingTop: 32,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    bottom: 0,
  },
  header: {
    fontSize: 42,
    marginBottom: 16,
    fontWeight: "bold",
  },
  breif: {
    fontSize: 24,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 60,
    textAlign: "left",
    paddingLeft: 8,
    borderRadius: 50,
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#e3e4e5",
    paddingStart: 20,
  },
  btn: {
    backgroundColor: "black",
    padding: 5,
    borderRadius: 50,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20, // Ensure button is not overlapped
  },
  btnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    padding: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    position: "absolute",
    top: 40,
    margin: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 50,
    paddingHorizontal: 20,
    zIndex: 1, // Ensure link is on top
  },
  linkText: {
    color: "#FFAA00",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Register;
