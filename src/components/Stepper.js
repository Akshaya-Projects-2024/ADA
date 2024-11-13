import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { THEMES } from "../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";

const Stepper = ({ currentStep, totalSteps }) => {
  // Generate steps based on the total number of steps
  const steps = [];
  for (let i = 1; i <= totalSteps; i++) {
    steps.push(i);
  }

  return (
    <View style={styles.container}>
      {/* Step Label */}
      <Text style={styles.stepLabel}>
        Step {currentStep} of {totalSteps}
      </Text>

      {/* Stepper Progress */}
      <View style={[styles.stepContainer,{justifyContent : totalSteps == 5 ? "space-between" : "flex-end"  }]}>
        {steps.map((step) => (
          <View
            key={step}
            style={[
              styles.step,
              step <= currentStep ? styles.activeStep : styles.inactiveStep,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: moderateScale(20),
    marginHorizontal:moderateScale(20)
  },
  stepLabel: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    color: "#0D0B26",
    marginRight:moderateScale(10),

  },
  stepContainer: {
    flexDirection: "row",

    // justifyContent: "space-between",
    alignItems: "center",
    width: "75%",
  },
  step: {
    height: 6,
    width: 27, // Width for each step bar
    borderRadius: 3, // Rounded edges
    marginHorizontal: 2, // Spacing between steps
  },
  activeStep: {
    backgroundColor: "#00BBC8", // Active color (similar to the teal color in the image)
  },
  inactiveStep: {
    backgroundColor: "#D9D9D9", // Inactive color (grey)
  },
});

export default Stepper;
