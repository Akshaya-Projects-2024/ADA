import React, { useRef, useEffect } from "react";
import { Animated, View, StyleSheet } from "react-native";
import Svg, {
  Path,
  Mask,
  G,
  Defs,
  LinearGradient,
  Stop,
  Text,
  Rect,
} from "react-native-svg";
import { Easing } from "react-native";

const HeartAnimation = ({ size = 78, percentage = 0 }) => {
  const fillHeight = useRef(new Animated.Value(71)).current;
  const AnimatedRect = Animated.createAnimatedComponent(Rect);

  useEffect(() => {
    const targetHeight = 71 - (percentage / 100) * 71;
    Animated.timing(fillHeight, {
      toValue: targetHeight,
      duration: 3000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    // return () => {
    //   fillHeight.setValue(71);
    // }
  }, [percentage]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 80 71" fill="none">
        <Defs>
          <LinearGradient
            id="paint0_linear_4781_9886"
            x1="37.3495"
            y1="12.207"
            x2="37.3495"
            y2="73.0013"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#EC559C" />
            <Stop offset="1" stopColor="#E31619" />
          </LinearGradient>
        </Defs>

        {/* Background heart */}
        <Path
          d="M67.3 42.7778C73.111 37.1 79 30.2944 79 21.3889C79 15.7162 76.7401 10.2759 72.7174 6.26466C68.6948 2.25347 63.2389 0 57.55 0C50.686 0 45.85 1.94444 40 7.77778C34.15 1.94444 29.314 0 22.45 0C16.7611 0 11.3052 2.25347 7.28256 6.26466C3.2599 10.2759 1 15.7162 1 21.3889C1 30.3333 6.85 37.1389 12.7 42.7778L40 70L67.3 42.7778Z"
          fill="#f2f2f2"
          stroke="#EC559C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Mask id="heartMask">
          <Path
            d="M67.3 42.7778C73.111 37.1 79 30.2944 79 21.3889C79 15.7162 76.7401 10.2759 72.7174 6.26466C68.6948 2.25347 63.2389 0 57.55 0C50.686 0 45.85 1.94444 40 7.77778C34.15 1.94444 29.314 0 22.45 0C16.7611 0 11.3052 2.25347 7.28256 6.26466C3.2599 10.2759 1 15.7162 1 21.3889C1 30.3333 6.85 37.1389 12.7 42.7778L40 70L67.3 42.7778Z"
            fill="white"
          />
        </Mask>

        <G mask="url(#heartMask)">
          <AnimatedRect
            x="0"
            y={fillHeight}
            width="80"
            height="71"
            fill="url(#paint0_linear_4781_9886)"
          />
        </G>

        <Text
          x="52%"
          y="50%"
          fontSize="16"
          textAnchor="middle"
          fill="#000"
          fontWeight="bold"
        >
          {`${Math.round(percentage)}%`}
        </Text>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HeartAnimation;
