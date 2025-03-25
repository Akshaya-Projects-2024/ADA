import React from "react";
import { View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ActivityType } from "../../../constants/enums";
import { DaySelector } from "./DaySelector";
import { FrequencySelector } from "./FrequencySelector";
import { styles } from "./styles";
import { ActivityHeader } from "./ActivityHeader";
import { TimeButton } from "./TimeButton";

export const TrainingActivity = ({
  item,
  index,
  onCheckboxChange,
  onDayChange,
  onTimeFormatChange,
  onTimeFieldClick,
  handleActivityType,
  onRemoveActicty,
  errors,
}) => {
  const { type, frequency, name, iscustomise } = item;
  const shiftList = [
    {
      label: "Time",
      value: "time",
    },
  ];

  return (
    <LinearGradient
      colors={ActivityType[type].colors}
      style={[
        styles.card,
        { borderWidth: errors?.[index] ? 1 : 0, borderColor: "red" },
      ]}
    >
      <ActivityHeader
        type={type}
        name={name}
        iscustomise={iscustomise}
        handleActivityType={handleActivityType}
        item={item}
        onRemoveActicty={() => onRemoveActicty(index, item)}
      />
      <FrequencySelector
        frequency={frequency}
        index={index}
        onCheckboxChange={onCheckboxChange}
      />
      <DaySelector
        selectedDay={item?.days}
        index={index}
        onDayChange={onDayChange}
      />
      <View style={{ marginTop: 20 }}>
        {shiftList.map((shift) => (
          <View
            key={shift.value}
            style={[
              styles.row,
              {
                marginBottom: shift.value !== "night" ? 10 : 0,
                paddingVertical: 0,
              },
            ]}
          >
            <Text style={styles.shiftLabel}>{shift.label}</Text>
            <TimeButton
              time={item[shift.value]}
              index={index}
              onPress={() => onTimeFieldClick(shift.value)}
            />
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};
