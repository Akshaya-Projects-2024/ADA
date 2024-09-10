import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  Keyboard,
  Image,
  FlatList,
} from 'react-native';
import {THEMES} from '../../assets/theme/themes';
import Strings from '../../utils/strings';
import Header from '../../components/Header';
import {moderateScale, scale} from 'react-native-size-matters';

const Chat = () => {
  return (
    <View>
      <Text style={{color:'#000'}}>Chat</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  labelContainer: {
    backgroundColor: '#E0BBE4', // Light purple background for label
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  labelText: {
    color: '#6A0DAD', // Darker purple text color
    fontWeight: 'bold',
    paddingHorizontal: moderateScale(10),
  },
  imageContainer: {
    flexDirection: 'row',
  },
  circularImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // This makes the image circular
    marginLeft: -10, // Overlapping effect
    borderWidth: 2,
    borderColor: '#fff', // White border for better appearance
  },
});

export default Chat;
