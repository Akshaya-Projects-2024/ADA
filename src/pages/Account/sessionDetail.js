import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  Keyboard,
} from 'react-native';
import InputField from '../../components/InputField';
import {THEMES} from '../../assets/theme/themes';
import Header from '../../components/Header';
import Checked from '../../assets/svg/checked.svg';
import UnChecked from '../../assets/svg/unchecked.svg';
import Strings from '../../utils/strings';
import Button from '../../components/Button';
import {moderateScale} from 'react-native-size-matters';
import CheckBox from 'react-native-check-box';
import TimeTracker from '../../components/TimeTracker';

const SessionDetail = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [homeVisit, setHomeVisit] = useState(false);
  const [centerService, setCenterService] = useState(false);
  const [onlineConsultation, setOnlineConsultation] = useState(false);

  const [perSession, setPerSession] = useState(true);
  const [perMonth, setPerMonth] = useState(false);

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
      <Header title={Strings.sessionDetails} showBack bgColor="transparent" />
      <View style={{flex: 1, paddingHorizontal: moderateScale(20)}}>
        <ScrollView
          style={{flex: 1}}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View style={styles.contentView}>
            <Text style={styles.availableText}>
              {Strings.howYouWillBeAvailable}{' '}
            </Text>
          </View>
          <View style={styles.contentValueView}>
            <CheckBox
              checkedImage={<Checked />}
              unCheckedImage={<UnChecked />}
              onClick={() => setHomeVisit(!homeVisit)}
              isChecked={homeVisit}
              style={{flex: 1}}
              rightTextStyle={{
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font12,
                fontFamily: THEMES.fontFamily.semiBold,
              }}
              rightText={'Home Visit'}
            />
            <CheckBox
              checkedImage={<Checked />}
              unCheckedImage={<UnChecked />}
              onClick={() => setCenterService(!centerService)}
              isChecked={centerService}
              style={{flex: 1}}
              rightText={'At Center Service'}
              rightTextStyle={{
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font12,
                fontFamily: THEMES.fontFamily.semiBold,
              }}
            />
          </View>
          <View style={{paddingTop: moderateScale(25)}}>
            <CheckBox
              checkedImage={<Checked />}
              unCheckedImage={<UnChecked />}
              onClick={() => setOnlineConsultation(!onlineConsultation)}
              isChecked={onlineConsultation}
              style={{flex: 1}}
              rightTextStyle={{
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font12,
                fontFamily: THEMES.fontFamily.semiBold,
              }}
              rightText={'Online Consultation'}
            />
          </View>
          <View style={styles.contentView}>
            <Text style={styles.availableText}>
              {Strings.howYouWillBeAvailable}{' '}
            </Text>
          </View>
          <View style={styles.contentValueView}>
            <CheckBox
              checkedImage={<Checked />}
              unCheckedImage={<UnChecked />}
              onClick={() => setPerSession(!perSession)}
              isChecked={perSession}
              style={{flex: 1}}
              rightTextStyle={{
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font12,
                fontFamily: THEMES.fontFamily.semiBold,
              }}
              rightText={'Per Session'}
            />
            <CheckBox
              checkedImage={<Checked />}
              unCheckedImage={<UnChecked />}
              onClick={() => setPerMonth(!perMonth)}
              isChecked={perMonth}
              style={{flex: 1}}
              rightText={'Per Month'}
              rightTextStyle={{
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font12,
                fontFamily: THEMES.fontFamily.semiBold,
              }}
            />
          </View>
          {perSession && (
            <>
              <View style={styles.contentView}>
                <Text style={styles.availableText}>
                  {Strings.perSessionCharges}{' '}
                </Text>
              </View>
              <View style={{paddingTop: moderateScale(16)}}>
                <InputField
                  label={Strings.chargesPerSession}
                  placeholderText={Strings.enterPrice}
                />
              </View>
              <View style={{paddingTop: moderateScale(16)}}>
                <InputField
                  label={Strings.perDaySessionInMin}
                  placeholderText={Strings.perDaySession}
                />
              </View>
            </>
          )}
          {perMonth && (
            <>
              <View style={styles.contentView}>
                <Text style={styles.availableText}>
                  {Strings.perMonthSession}{' '}
                </Text>
              </View>
              <View style={{paddingTop: moderateScale(16)}}>
                <InputField
                  label={Strings.chargesPerSession}
                  placeholderText={Strings.enterPrice}
                />
              </View>
              <View style={{paddingTop: moderateScale(16)}}>
                <InputField
                  label={Strings.perDaySessionInMin}
                  placeholderText={Strings.perDaySession}
                />
              </View>
            </>
          )}

          <TimeTracker />
          <View
            style={{
              paddingBottom: moderateScale(25),
            }}>
            <Button title={'Submit'} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  contentView: {
    paddingTop: moderateScale(27),
  },
  availableText: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
  },
  contentValueView: {
    paddingTop: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SessionDetail;
