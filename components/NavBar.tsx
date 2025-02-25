import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MagnifyingGlassIcon, UserCircleIcon } from "react-native-heroicons/outline";
import { useColorScheme } from "react-native";
import { ThemedView } from "./ThemedView";
import { router } from "expo-router";



function NavBar() {
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;
  const iconColor = colorScheme === "light" ? "#000" : "#fff";
  return (
    <ThemedView style={styles.navbarContainer}>
      <StatusBar />
      <ThemedView style={styles.navbar}>
        <TouchableOpacity>
          <MagnifyingGlassIcon style={[styles.icon, themeTextStyle]} />
        </TouchableOpacity>
        <Image
          style={styles.logo}
          source={require("../assets/images/ActLocal-text.png")}
        />
        <TouchableOpacity>
          <UserCircleIcon onPress={() => router.push('/Profile')} style={[styles.icon, themeTextStyle]} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
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
  logo: {
    height: 20,
    width: 100,
    color: "#FFFFFF",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    height: 24,
    width: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});

export default NavBar;
