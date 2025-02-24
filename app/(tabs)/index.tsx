import React, { useContext } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import NavBar from "../../components/NavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthContext from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;

  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
      />
      <View>
        <NavBar />
        <TouchableOpacity
          style={themeContainerStyle}
          onPress={() => logout()}
        >
          <Text>Login Out</Text>
        </TouchableOpacity>
        <Text style={themeTextStyle}>username: </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lightContainer: {
    backgroundColor: "#d0d0c0",
  },
  darkContainer: {
    backgroundColor: "#242c40",
  },
  lightThemeText: {
    color: "#242c40",
  },
  darkThemeText: {
    color: "#d0d0c0",
  },
  navbarContainer: {
    padding: 16,
  },
});
