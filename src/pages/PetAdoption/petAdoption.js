import React from 'react';
import {View, Text} from 'react-native';
import {THEMES} from '../../assets/theme/themes';

const PetAdoption = () => {
  const {colors, fontFamily, fonts} = THEMES;
  return (
    <View style={{margin: 30}}>
      <Text
        style={{
          fontFamily: fontFamily.bold,
          fontSize: fonts.font20,
          color: colors.red,
        }}>
        PetAdoption
      </Text>
    </View>
  );
};

export default PetAdoption;
