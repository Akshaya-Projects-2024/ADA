import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { THEMES } from "../assets/theme/themes";
import { moderateScale, verticalScale } from "react-native-size-matters";

const InputField = (props) => {
  const { label, placeholderText, rightIcon, multiline } = props;
  return (
    <View style={styles.mainView}>
      <View style={styles.flexRow}>
        <View
          style={{
            width: rightIcon ? "85%" : "100%",
            height: multiline && 150,
            maxHeight: multiline && 174,
          }}
        >
          {label && <Text style={styles.labelText}>{label}</Text>}

          <TextInput
            multiline={multiline || false}
            style={[
              styles.inputStyle,
              {
                height: multiline ? 125 : verticalScale(20),
              },
            ]}
            placeholder={placeholderText}
            placeholderTextColor={THEMES.colors.silver}
          />
        </View>
        {rightIcon && <View>{rightIcon}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    borderWidth: 1,
    borderColor: THEMES.colors.silver,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    backgroundColor: THEMES.colors.white,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  labelText: {
    fontSize: THEMES.fonts.font10,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.darkGrey,
    paddingBottom: 3,
  },
  inputStyle: {
    padding: 0,
    margin: 0,
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.medium,
    color: THEMES.colors.black,
    textAlignVertical: "top",
  },
});

export default InputField;
