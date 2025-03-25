import React, { memo } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale } from "react-native-size-matters";
import { ActivityType } from "../../../constants/enums";
import { THEMES } from "../../../assets/theme/themes";
import Calendars from "../../../assets/svg/calendar.svg";
import { styles } from "./styles";
import { ActivityHeader } from "./ActivityHeader";
import { TimeButton } from "./TimeButton";

export const VaccineeActivity = memo(
  ({
    item,
    index,
    onChange,
    onTimeFieldClick,
    onDateFieldClick,
    onTimeFormatChange,
    handleActivityType,
    onRemoveActicty,
    errors,
  }) => {
    const { type, name, iscustomise } = item;
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
          index={index}
          item={item}
          onRemoveActicty={() => onRemoveActicty(index, item)}
        />
        <View style={{ marginTop: 20 }}>
          <TextInput
            style={styles.commonTextInput}
            placeholder="Vaccination Name"
            placeholderTextColor={THEMES.colors.darkGrey}
            value={item.subname}
            onChangeText={(value) => onChange("subname", value)}
          />
        </View>
        <View style={[styles.row, { paddingVertical: 0, paddingTop: 20 }]}>
          <TouchableOpacity
            style={[styles.commonTextInput, { width: "84%" }]}
            onPress={() => onDateFieldClick("date")}
          >
            <TextInput
              style={[styles.commonTextInput, { width: "100%" }]}
              placeholder="Vaccination Date"
              placeholderTextColor={THEMES.colors.darkGrey}
              editable={false}
              value={item.date}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDateFieldClick("date")}
            style={[
              styles.commonTimeButton,
              { width: moderateScale(40), borderBottomLeftRadius: 0 },
            ]}
          >
            <Calendars />
          </TouchableOpacity>
        </View>
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
  }
);
