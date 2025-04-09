import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { THEMES } from "../assets/theme/themes";

const PetCarousel = ({ pets, onSelectPet, selectedPet }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Animation ref

  const handleSelectPet = (pet) => {
    if (pet.id === selectedPet.id) return; // Prevent re-selection
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    onSelectPet?.(pet);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pets} // Exclude selected pet
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectPet(item)}
            activeOpacity={0.7}
          >
            <View style={styles.petItem}>
              <Text
                style={[
                  item.id === selectedPet.id
                    ? styles.selectedText
                    : styles.petText,
                ]}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          alignItems: "center",
          flexGrow: 1,
          flexDirection: "row",
          justifyContent: "center",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
  },
  petItem: { alignItems: "center", marginHorizontal: 10 },
  petText: {
    color: "#000000",
    fontWeight: "400",
    opacity: 0.2,
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  selectedText: {
    fontSize: THEMES.fonts.font18,
    fontFamily: THEMES.fontFamily.semiBold,
    color: "black",
    opacity: 1,
  },
  underline: {
    height: 2,
    backgroundColor: "blue",
    width: "100%",
    marginTop: 2,
  },
  singleView: {
    alignItems: "center",
    width: "100%",
  },
});

export default PetCarousel;
