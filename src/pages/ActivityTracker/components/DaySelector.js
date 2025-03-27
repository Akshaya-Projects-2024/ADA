import React, { memo, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  Animated,
  View,
  Dimensions,
} from "react-native";
import { THEMES } from "../../../assets/theme/themes";
import { styles } from "./styles";

export const DaySelector = memo(({ selectedDay, index, onDayChange }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const animatePress = (isSelected) => {
    Animated.sequence([
      Animated.spring(scaleAnimation, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
      {days.map((day) => {
        const isSelected = selectedDay?.includes(day);
        return (
          <Animated.View
            key={day}
            style={[{ transform: [{ scale: scaleAnimation }] }]}
          >
            <TouchableOpacity
              onPress={() => {
                onDayChange(day, index, isSelected);
                animatePress(isSelected);
              }}
              style={[
                styles.dayButton,
                {
                  backgroundColor: isSelected
                    ? THEMES.colors.outrageousOrange
                    : THEMES.colors.white,
                  width: (Dimensions.get("window").width - 100) / 7,
                },
              ]}
            >
              <Text
                style={[styles.dayText, styles.getDayTextStyle(isSelected)]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
});
