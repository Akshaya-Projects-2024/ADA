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
      {/* Fixed Selected Pet */}
      <View
        style={[
          pets?.length > 1 ? styles.fixedPetContainer : styles.singleView,
        ]}
      >
        <Text
          style={[
            styles.petText,
            styles.selectedText,
            { textTransform: "capitalize" },
          ]}
        >
          {selectedPet.name}
        </Text>
      </View>

      {/* Scrollable Pet List (Excluding Selected Pet) */}
      {pets?.length > 1 && (
        <FlatList
          data={pets.filter((pet) => pet.id !== selectedPet.id)} // Exclude selected pet
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectPet(item)}
              activeOpacity={0.7}
            >
              <View style={styles.petItem}>
                <Text style={styles.petText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
  },
  fixedPetContainer: {
    width: "50%",
    alignItems: "flex-end",
    paddingRight: 20,
  },
  petItem: { alignItems: "center", marginHorizontal: 10 },
  petText: {
    color: "#000000",
    fontWeight: "400",
    opacity: 0.2,
    fontSize: THEMES.fonts.font14,
    fontWeight: THEMES.fontFamily.semiBold,
  },
  selectedText: {
    fontSize: THEMES.fonts.font18,
    fontWeight: THEMES.fontFamily.semiBold,
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
