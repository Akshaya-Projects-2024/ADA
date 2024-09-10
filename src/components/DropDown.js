import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {THEMES} from '../assets/theme/themes';

const DropDown = props => {
  const {dropdownData, width} = props;
  const [value, setValue] = useState(dropdownData[0]);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[
          styles.dropdown,
          {width: width ? width : 100},
          isFocus && {borderColor: '#007bff'},
        ]}
        placeholderStyle={styles.placeholderStyle}
        itemTextStyle={{
          fontSize: THEMES.fonts.font12,
          padding: 0,
          fontFamily: THEMES.fontFamily.medium,
        }}
        itemContainerStyle={{padding: 0}}
        containerStyle={{borderRadius: 16, padding: 0}}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={dropdownData}
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select item' : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  dropdown: {
    height: 30,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: THEMES.colors.bgColor,
  },
  placeholderStyle: {
    fontSize: THEMES.fonts.font12,
    color: '#aaa',
    fontFamily: THEMES.fontFamily.medium,
  },
  selectedTextStyle: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  icon: {
    marginRight: 10,
  },
});

export default DropDown;
