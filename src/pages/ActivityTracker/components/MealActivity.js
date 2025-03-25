import React, { memo } from "react";
import { View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ActivityType } from "../../../constants/enums";
import { TimeButton } from "./TimeButton";
import { styles } from "./styles";
import { ActivityHeader } from "./ActivityHeader";

export const MealActivity = memo(
  ({ item, index, onTimeFieldClick, handleActivityType, onRemoveActicty }) => {
    const { type, name, iscustomise } = item;
    return (
      <LinearGradient colors={ActivityType[type].colors} style={styles.card}>
        <ActivityHeader
          type={type}
          name={name}
          iscustomise={iscustomise}
          handleActivityType={handleActivityType}
          item={item}
          onRemoveActicty={() => onRemoveActicty(index,item)}
          />
        <View style={{ marginTop: 20 }}>
          {["Morning", "Afternoon", "Night"].map((shift) => (
            <View
              key={shift}
              style={[
                styles.row,
                {
                  marginBottom: shift !== "Night" ? 10 : 0,
                  paddingVertical: 0,
                },
              ]}
            >
              <Text style={styles.shiftLabel}>{shift}</Text>
              <TimeButton
                time={item[shift.toLowerCase()]}
                index={index}
                onPress={() => onTimeFieldClick(shift.toLowerCase())}
              />
            </View>
          ))}
        </View>
      </LinearGradient>
    );
  }
);
