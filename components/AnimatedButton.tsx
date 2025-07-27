import React, { useRef, useState } from "react";
import { Pressable, Animated, Dimensions, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useColorScheme } from "react-native";

const AnimatedButton = ({
  onPress,
  label = "Chat",
}: {
  onPress?: () => void;
  label?: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorScheme = useColorScheme();

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 1.2,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.Btn,
          {
            width: scaleAnim.interpolate({
              inputRange: [1, 1.2],
              outputRange: [screenWidth * 0.6, screenWidth * 0.72],
            }),
          },
        ]}
      >
        <ThemedText style={styles.buttonText}>{label}</ThemedText>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  Btn: {
    backgroundColor: "#EF7A2A",
    padding: 12,
    textAlign: "center",
    borderRadius: 35,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AnimatedButton;
