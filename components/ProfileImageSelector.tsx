import React, { useState } from "react";
import { View, Image, Pressable, StyleSheet, Text } from "react-native";

const avatars = [
  { id: 1, uri: "https://i.pravatar.cc/150?img=1" },
  { id: 2, uri: "https://i.pravatar.cc/150?img=2" },
  { id: 3, uri: "https://i.pravatar.cc/150?img=3" },
  { id: 4, uri: "https://i.pravatar.cc/150?img=4" },
];

const ProfileImageSelector = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    // You can store the selected image in global context or backend
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose Your Avatar</Text>
      <View style={styles.grid}>
        {avatars.map((avatar) => (
          <Pressable
            key={avatar.id}
            onPress={() => handleSelect(avatar.id)}
            style={[
              styles.avatarWrapper,
              selectedId === avatar.id && styles.selected,
            ]}
          >
            <Image source={{ uri: avatar.uri }} style={styles.avatar} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 50,
    padding: 4,
  },
  selected: {
    borderColor: "#EF7A2A",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

export default ProfileImageSelector;
