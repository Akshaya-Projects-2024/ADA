// Assuming this is a React Native component with TypeScript or JavaScript

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { THEMES } from "../assets/theme/themes";
import { ms } from "react-native-size-matters";

const groupSlotsByTime = (data) => {
  const slotMap = new Map();

  Object.entries(data).forEach(([date, slots]) => {
    slots.forEach((slot) => {
      const start_time = slot.start_time;
      const end_time = slot.end_time;
      const hour = parseInt(start_time.split(":")[0], 10);
      const group = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

      if (!slotMap.has(start_time)) {
        slotMap.set(start_time, {
          available: 0,
          booked: 0,
          total: 0,
          group,
          dates: [],
          unavailable: 0,
          end_time,
        });
      }
      const entry = slotMap.get(start_time);
      entry.total++;
      if (slot.isavailable && !slot.isbooked) {
        entry.dates.push(date);
        entry.available++;
      }
      if (!slot.isavailable && slot.isbooked) entry.booked++;
      if (!slot.isavailable && !slot.isbooked) entry.unavailable++;
    });
  });

  const result = [];
  slotMap.forEach((value, start_time) => {
    const { available, booked, total, group, dates, unavailable, end_time } =
      value;
    let status = "mixed";
    if (available === total) status = "available";
    else if (booked === total) status = "booked";
    else if (unavailable === total) status = "unavailable";

    result.push({ start_time, status, group, dates, end_time });
  });

  return result;
};

const formatDates = (dates) => {
  const days = dates.map((d) => parseInt(d.split("-")[2]));
  const ranges = [];
  let start = days[0];
  let end = days[0];

  for (let i = 1; i < days.length; i++) {
    if (days[i] === end + 1) {
      end = days[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = days[i];
      end = days[i];
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(", ");
};

const TimeSlotUI = ({ data, setSelectedSlot, selectedSlot,isrequestedbyProvider }) => {
  const [slots, setSlots] = useState({
    morning: [],
    afternoon: [],
    evening: [],
  });
  const [mixedSlots, setMixedSlots] = useState([]);

  useEffect(() => {
    const transformed = groupSlotsByTime(data);
    const grouped = { morning: [], afternoon: [], evening: [] };
    const mixed = [];
    transformed
      .sort((a, b) => {
        const timeA = a.start_time.split(":").map(Number);
        const timeB = b.start_time.split(":").map(Number);
        return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
      })
      .forEach((slot) => {
        grouped[slot.group].push(slot);
        if (slot.status === "mixed") mixed.push(slot);
      });

    setSlots(grouped);
    setMixedSlots(mixed);
  }, [data]);

  const renderSlot = (slot) => (
    <TouchableOpacity
      key={slot.start_time}
      style={[
        styles.slot,
        slot.status === "available" && styles.white,
        slot.status === "booked" && styles.bookedSlot,
        slot.status === "unavailable" && styles.grey,
        slot.status === "mixed" && styles.orangeBorder,
        selectedSlot?.start_time === slot.start_time && {
          backgroundColor: THEMES.colors.cyan,
          borderWidth: 0,
        },
      ]}
      disabled={slot.status === "booked" || slot.status === "unavailable"}
      onPress={() => {
        setSelectedSlot(slot);
      }}
    >
      <Text
        style={[
          styles.slotText,
          {
            color:
              selectedSlot?.start_time === slot.start_time
                ? THEMES.colors.white
                : slot.status === "unavailable"
                ? "#AAAAAA"
                : slot.status == "mixed"
                ? THEMES.colors.outrageousOrange
                : THEMES.colors.black,
          },
        ]}
      >
        {slot.start_time}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: isrequestedbyProvider ? 0 : 16 },
      ]}
    >
      {slots.morning.length !== 0 && (
        <>
          <Text style={styles.heading}>Morning</Text>
          <View style={styles.row}>{slots.morning.map(renderSlot)}</View>
        </>
      )}
      {slots.afternoon.length !== 0 && (
        <>
          <Text style={styles.heading}>Afternoon</Text>
          <View style={styles.row}>{slots.afternoon.map(renderSlot)}</View>
        </>
      )}
      {slots.evening.length !== 0 && (
        <>
          <Text style={styles.heading}>Evening</Text>
          <View style={styles.row}>{slots.evening.map(renderSlot)}</View>
        </>
      )}
      {mixedSlots?.length !== 0 && (
        <View
          style={{
            borderWidth: 0.2,
            borderColor: THEMES.colors.lightGrey,
            marginTop: ms(10),
          }}
        />
      )}
      {mixedSlots?.map((slot) => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: ms(20),
          }}
        >
          <View
            style={{
              width: ms(58),
              height: ms(30),
              alignItems: "center",
              justifyContent: "center",
              borderRadius: ms(12),
              borderWidth: ms(1),
              borderColor: THEMES.colors.outrageousOrange,
              marginHorizontal: 5,
            }}
          >
            <Text style={styles.mixedTimeSlot}>{slot.start_time}</Text>
          </View>
          <Text style={{ color: THEMES.colors.black }}>
            {"  "} - {"  "}{" "}
          </Text>
          <View style={{ width: "70%" }}>
            <Text key={slot.start_time} style={styles.summaryText}>
              Available on{" "}
              <Text style={styles.availableDateText}>
                {formatDates(slot.dates)}
              </Text>{" "}
              of selected date range
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 16,
    marginBottom: ms(12),
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  slot: {
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    width: ms(58),
    height: ms(30),
    alignItems: "center",
    justifyContent: "center",
  },
  white: {
    backgroundColor: "white",
    borderColor: "lightgrey",
  },
  grey: {
    backgroundColor: "#D9D9D9",
    borderColor: "#D9D9D9",
  },
  bookedSlot: {
    backgroundColor: "#F88379",
    borderColor: THEMES.colors.red,
    opacity: 0.5,
  },
  orangeBorder: {
    backgroundColor: "white",
    borderColor: THEMES.colors.outrageousOrange,
  },
  summaryText: {
    fontSize: 14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
  },
  mixedTimeSlot: {
    color: THEMES.colors.outrageousOrange,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: ms(12),
  },
  availableDateText: {
    color: THEMES.colors.outrageousOrange,
    fontFamily: THEMES.fontFamily.medium,
    fontSize: ms(12),
  },
  slotText: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: ms(12),
  },
});

export default TimeSlotUI;
