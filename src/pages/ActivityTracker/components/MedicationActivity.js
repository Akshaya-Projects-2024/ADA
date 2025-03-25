import React, { memo } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale } from "react-native-size-matters";
import {
  ActivityType,
  DurationList,
  MedicineQuantityList,
} from "../../../constants/enums";
import { THEMES } from "../../../assets/theme/themes";
import CheckedIcon from "../../../assets/svg/checked.svg";
import UnCheckedIcon from "../../../assets/svg/unchecked.svg";
import Calendars from "../../../assets/svg/calendar.svg";
import ModalDropdown from "../../../components/ModalDropdown";
import { DaySelector } from "./DaySelector";
import { TimeButton } from "./TimeButton";
import { styles } from "./styles";
import { ActivityHeader } from "./ActivityHeader";

export const MedicationActivity = memo(
  ({
    item,
    index,
    onChange,
    onCheckboxChange,
    onDayChange,
    onTimeFieldClick,
    onDateFieldClick,
    handleActivityType,
    onRemoveActicty,
    errors,
  }) => {
    const { type, name, iscustomise } = item;

    const handleDurationChange = (value) => {
      onChange("duration", value);
      onChange("frequency", "");
      onChange("days", "");
      onChange("time", "");
      onChange("timeFormat", "AM");
      onChange("morning", "");
      onChange("afternoon", "");
      onChange("night", "");
      onChange("date", "");
      onChange("startdate", "");
    };

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
            placeholder="Medication Name"
            placeholderTextColor={THEMES.colors.darkGrey}
            value={item.subname}
            onChangeText={(value) => onChange("subname", value)}
          />
        </View>
        <View style={[styles.row, { paddingVertical: moderateScale(16) }]}>
          <View style={{ width: "47%" }}>
            <ModalDropdown
              setSelectedValue={(value) => onChange("quantity", value[0].label)}
              selectedValue={
                item?.quantity
                  ? [{ label: item?.quantity, id: item?.quantity }]
                  : []
              }
              data={MedicineQuantityList}
              noPadding
              customContainerStyle={styles.dropdownContainer}
              title="Select Quantity"
            />
          </View>
          <View style={{ width: "47%" }}>
            <ModalDropdown
              data={DurationList}
              noPadding
              customContainerStyle={styles.dropdownContainer}
              title="Select Duration"
              selectedValue={
                item?.duration
                  ? [{ label: item?.duration, id: item?.duration }]
                  : []
              }
              setSelectedValue={(value) => handleDurationChange(value[0].label)}
            />
          </View>
        </View>
        {item.duration && (
          <>
            {item.duration === "Daily" ? (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Frequency</Text>
                  <TouchableOpacity
                    onPress={() =>
                      onCheckboxChange(item.frequency ? "" : "Daily", index)
                    }
                    style={styles.frequencyButton}
                  >
                    {Boolean(item.frequency) ? (
                      <CheckedIcon />
                    ) : (
                      <UnCheckedIcon width={18} height={18} />
                    )}
                    <Text style={styles.frequencyText}> Daily</Text>
                  </TouchableOpacity>
                </View>
                <DaySelector
                  selectedDay={item?.days}
                  index={index}
                  onDayChange={onDayChange}
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
              </>
            ) : (
              <View style={[styles.row, { paddingVertical: 0, paddingTop: 0 }]}>
                <TouchableOpacity
                  style={[styles.commonTextInput, { width: "84%" }]}
                  onPress={() => onDateFieldClick("startdate")}
                >
                  <TextInput
                    style={[styles.commonTextInput, { width: "100%" }]}
                    placeholder="Medicine Date"
                    placeholderTextColor={THEMES.colors.darkGrey}
                    editable={false}
                    value={item.startdate}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDateFieldClick("startdate")}
                  style={[
                    styles.commonTimeButton,
                    { width: moderateScale(40) },
                  ]}
                >
                  <Calendars />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </LinearGradient>
    );
  }
);
