import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";

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
          styles.fixedPetContainer,
          {
            justifyContent: !pets?.length <= 1 ? "center" : "flex-start",
            width: pets?.length <= 1 ? "100%" : "auto",
          },
        ]}
      >
        <Text style={[styles.petText, styles.selectedText]}>
          {selectedPet.name}
        </Text>
      </View>

      {/* Scrollable Pet List (Excluding Selected Pet) */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 20,
  },
  fixedPetContainer: { alignItems: "center", marginRight: 15 },
  petItem: { alignItems: "center", marginHorizontal: 10 },
  petText: { fontSize: 18, color: "gray", fontWeight: "400" },
  selectedText: { fontSize: 20, fontWeight: "bold", color: "black" },
  underline: {
    height: 2,
    backgroundColor: "blue",
    width: "100%",
    marginTop: 2,
  },
});

export default PetCarousel;
