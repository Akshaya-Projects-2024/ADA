import React, { memo, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import CheckedIcon from "../../../assets/svg/checked.svg";
import UnCheckedIcon from "../../../assets/svg/unchecked.svg";
import { styles } from "./styles";

export const FrequencySelector = ({ frequency, index, onCheckboxChange }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(frequency ? 1 : 0)).current;

  const animatePress = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeAnim, {
        toValue: frequency ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    frequency && animatePress();
  }, [frequency]);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Frequency</Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={() => {
            onCheckboxChange(frequency ? "" : "Daily", index);
            animatePress();
          }}
          style={styles.frequencyButton}
        >
          {frequency ? (
            <CheckedIcon width={20} height={20} />
          ) : (
            <UnCheckedIcon width={18} height={18} />
          )}
          <Text style={styles.frequencyText}> Daily</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
