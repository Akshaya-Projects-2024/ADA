import React, { memo } from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";
import moment from "moment";

export const TimeButton = memo(({ onPress, time, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.commonTimeButton, style]}>
    <Text style={styles.timeText}>
      {time ? moment(time, "HH:mm").format("HH:mm") : ""}
    </Text>
  </TouchableOpacity>
));
