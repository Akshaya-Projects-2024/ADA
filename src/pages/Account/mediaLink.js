import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Keyboard,
} from 'react-native';
import InputField from '../../components/InputField';
import {THEMES} from '../../assets/theme/themes';
import Header from '../../components/Header';
import ClipboardPaste from '../../assets/svg/clipboardPaste.svg';
import Strings from '../../utils/strings';
import Button from '../../components/Button';
import {moderateScale} from 'react-native-size-matters';


const MediaLink = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title={Strings.mediaLinks} showBack bgColor="transparent" />
      <View style={{flex: 1}}>
        <ScrollView
          style={{flex: 1}}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View style={styles.headerView}>
            <Text style={styles.headerText}>{Strings.onlineConsultation}</Text>
          </View>

          <View style={styles.contentView}>
            <View style={styles.w20}>
              <Image
                resizeMode="contain"
                source={require('../../assets/images/addLink.png')}
              />
            </View>
            <View style={styles.w80}>
              <InputField
                label={Strings.addLink}
                placeholderText={Strings.pasteLink}
                rightIcon={<ClipboardPaste stroke={THEMES.colors.darkGrey} />}
              />
            </View>
          </View>

          <View style={styles.secondContentHeading}>
            <Text style={styles.secondContent}>{Strings.socialMediaLink}</Text>
          </View>

          <View style={styles.secondImgView}>
            <View style={styles.w20}>
              <Image
                resizeMode="contain"
                source={require('../../assets/images/instagram.png')}
              />
            </View>
            <View style={styles.w80}>
              <InputField
                label={Strings.instaLink}
                placeholderText={Strings.pasteLink}
                rightIcon={<ClipboardPaste stroke={THEMES.colors.red} />}
              />
            </View>
          </View>

          <View style={styles.secondaryContentView}>
            <View style={styles.w20}>
              <Image
                resizeMode="contain"
                source={require('../../assets/images/facebook.png')}
              />
            </View>
            <View style={styles.w80}>
              <InputField
                label={Strings.fbLink}
                placeholderText={Strings.pasteLink}
                rightIcon={<ClipboardPaste stroke={THEMES.colors.darkGrey} />}
              />
            </View>
          </View>

          <View style={styles.secondaryContentView}>
            <View style={styles.w20}>
              <Image
                resizeMode="contain"
                source={require('../../assets/images/websiteLink.png')}
              />
            </View>
            <View style={styles.w80}>
              <InputField
                label={Strings.websiteLink}
                placeholderText={Strings.pasteLink}
                rightIcon={<ClipboardPaste stroke={THEMES.colors.darkGrey} />}
              />
            </View>
          </View>
        </ScrollView>
        {!isKeyboardVisible && (
          <View style={styles.submitButton}>
            <Button title={Strings.submit} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  headerView: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(20),
  },
  headerText: {
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  contentView: {
    paddingTop: moderateScale(40),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(14),
  },
  w20: {
    width: '20%',
  },
  w80: {
    width: '80%',
  },
  secondContentHeading: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(63),
  },
  secondContent: {
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  secondImgView: {
    paddingTop: moderateScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(14),
  },
  secondaryContentView: {
    paddingTop: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(14),
  },
  submitButton: {
    marginHorizontal: moderateScale(27),
    marginBottom: moderateScale(22),
  },
});

export default MediaLink;
