import React, { memo, useState, useEffect } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { THEMES } from '../../../assets/theme/themes';
import { TimeButton } from './TimeButton';
import { styles } from './styles';

export const TimeSelector = ({ item, index, onTimeFormatChange, onTimeFieldClick }) => {
  const { time, timeFormat } = item;
  const [amAnimation] = useState(new Animated.Value(1));
  const [pmAnimation] = useState(new Animated.Value(1));
  const slideAmAnim = useState(new Animated.Value(-50))[0];
  const slidePmAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAmAnim, {
        toValue: 0,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(slidePmAnim, {
        toValue: 0,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handlePress = (period) => {
    const animation = period === 'AM' ? amAnimation : pmAnimation;
    
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onTimeFormatChange(period);
  };

  return (
    <View style={styles.timeContainer}>
      <TimeButton
        time={time}
        index={index}
        style={{ width: 79, marginLeft: 20 }}
        onPress={onTimeFieldClick}
      />
      <View style={styles.amPmContainer}>
        {["AM", "PM"].map((period) => (
          <Animated.View
            key={period}
            style={{
              transform: [
                { scale: period === 'AM' ? amAnimation : pmAnimation },
                { 
                  translateX: period === 'AM' ? slideAmAnim : slidePmAnim 
                }
              ]
            }}
          >
            <Pressable
              onPress={() => handlePress(period)}
              style={[
                styles.amPmButton,
                {
                  backgroundColor: timeFormat?.includes(period)
                    ? "#4AB5C3"
                    : THEMES.colors.white,
                },
              ]}
            >
              <Text style={styles.getAmPmTextStyle(timeFormat?.includes(period))}>
                {period}
              </Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};