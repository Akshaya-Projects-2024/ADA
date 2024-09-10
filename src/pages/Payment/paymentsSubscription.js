import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {THEMES} from '../../assets/theme/themes';
import Header from '../../components/Header';
import Strings from '../../utils/strings';
import {moderateScale} from 'react-native-size-matters';
import ArrowRight from '../../assets/svg/arrowRight.svg';
import Tick from '../../assets/svg/tick.svg';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../components/Button';
import Modal from 'react-native-modal';
import SubscriptionSuccess from './subscriptionSuccess';

const listItems = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
  'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
];

const PaymentsSubscription = props => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [subscriptionModal, setSubscription] = useState(false);
  const [month, setMonth] = useState('12Month');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        title={Strings.paymentSubScription}
        showBack
        bgColor="transparent"
        fontColor={THEMES.colors.black}
      />
      <View style={styles.mainContent}>
        <ScrollView
          style={{flex: 1}}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View style={styles.paymentDetailsView}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('paymentDetails')}
              style={styles.paymentDetailsBtn}>
              <Text style={styles.paymentDetailsText}>
                {Strings.paymentDetails}
              </Text>
              <ArrowRight />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.joinTheFunText}>{Strings.joinTheFun}</Text>
          </View>
          <View style={styles.gradientRow}>
            <LinearGradient
              colors={['#fd3a77', '#fc699f', '#fd9f9f']}
              style={styles.gradientView}>
              <Text
                onPress={() => {
                  setMonth('12Month');
                  setSubscription(true);
                }}
                style={styles.discountText}>
                20% Off
              </Text>
              <Text style={styles.month}>12</Text>
              <Text style={styles.monthText}>{Strings.months}</Text>
              <View style={styles.tickIcon}>
                <Tick />
              </View>
            </LinearGradient>
            <LinearGradient
              colors={['#f2e2f4', '#f2e2f4', '#f2e2f4']}
              style={styles.deSelectGradient}>
              <Text
                onPress={() => {
                  setMonth('6Month');
                  setSubscription(true);
                }}
                style={styles.discount2}>
                15% Off
              </Text>
              <Text style={styles.month2}>6</Text>
              <Text style={styles.monthText2}>{Strings.months}</Text>
            </LinearGradient>
          </View>
          <View style={styles.unlockView}>
            <Text style={styles.unlockText}>
              {Strings.unlockPremiumFeature}
            </Text>
          </View>
          <View style={styles.descriptionView}>
            {listItems.map((item, index) => (
              <View key={index} style={styles.listItem}>
                {/* Bullet Point */}
                <View style={styles.bullet}>
                  <Text style={styles.bulletText}>{'\u2022'}</Text>
                </View>
                {/* List Text */}
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.subscriptionView}>
            <Text style={styles.subscriptionText}>
              {Strings.subscriptionCost}:{' '}
              <Text style={styles.subscriptionCost}>₹ 999 </Text>
            </Text>
          </View>
          <View style={{paddingTop: moderateScale(7)}}>
            <Text onPress={toggleModal} style={styles.viewBreakupText}>
              {Strings.viewBreakup}
            </Text>
          </View>
          <View style={styles.btnView}>
            <Button title={Strings.payNow} />
          </View>
        </ScrollView>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          style={styles.modal}
          swipeDirection="down">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{Strings.viewBreakup}</Text>
            <View style={styles.modalSubscription}>
              <Text style={styles.modalSubscriptionCost}>
                {Strings.subscriptionCost}:
              </Text>
              <Text numberOfLines={1} style={styles.subscriptionPrice}>
                ₹ XXX
              </Text>
            </View>

            <View style={styles.TaxView}>
              <Text style={styles.TaxText}>{Strings.tax}:</Text>
              <Text numberOfLines={1} style={styles.TaxPrice}>
                ₹ XXX
              </Text>
            </View>
            <View style={[styles.dottedLine, {marginTop: moderateScale(21)}]} />

            <View style={styles.totalRow}>
              <Text style={styles.totalText}>{Strings.total}:</Text>
              <Text numberOfLines={1} style={styles.totalPrice}>
                ₹ XXX
              </Text>
            </View>
            <View style={[styles.dottedLine, {marginTop: moderateScale(14)}]} />
          </View>
        </Modal>
        {subscriptionModal && (
          <SubscriptionSuccess
            isVisible={subscriptionModal}
            onClose={() => setSubscription(false)}
            type={month}
          />
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
  mainContent: {
    flex: 1,
    paddingHorizontal: moderateScale(25),
  },
  paymentDetailsView: {
    paddingTop: moderateScale(32),
    paddingBottom: moderateScale(14),
  },
  paymentDetailsBtn: {
    backgroundColor: THEMES.colors.white,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(12),
    shadowColor: THEMES.colors.mercury,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEMES.colors.mercury,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentDetailsText: {
    fontFamily: THEMES.fontFamily.bold,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font12,
  },
  listItem: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'flex-start', // Align bullet and text from top
    marginBottom: moderateScale(5), // Space between list items
  },
  bullet: {
    width: moderateScale(12), // Fixed width for the bullet point
    justifyContent: 'center', // Center the bullet vertically
  },
  bulletText: {
    fontSize: moderateScale(16), // Font size for the bullet
    color: THEMES.colors.black, // Color of the bullet
  },
  listText: {
    flex: 1, // List text takes up the rest of the space
    fontSize: THEMES.fonts.font12, // Font size for the list text
    color: THEMES.colors.black, // Color of the list text
    lineHeight: 24, // Line height for better readability
    fontFamily: THEMES.fontFamily.medium, // Set your font family
  },

  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: THEMES.colors.bgColor,
    paddingTop: moderateScale(37),
    paddingHorizontal: moderateScale(24),
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingBottom: moderateScale(100),
  },
  dottedLine: {
    width: '100%', // Adjust the width as needed
    height: 1,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: THEMES.colors.black, // Change the color as needed
    borderStyle: Platform.OS == 'android' ? 'dotted' : '',
    borderBottomWidth: Platform.OS == 'android' ? 1 : 0.3,
    borderBottomColor: THEMES.colors.darkGrey,
  },
  joinTheFunText: {
    fontFamily: THEMES.fontFamily.bold,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    textAlign: 'center',
  },
  gradientRow: {
    flexDirection: 'row',
    marginHorizontal: moderateScale(20),
    marginTop: moderateScale(27),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradientView: {
    borderRadius: moderateScale(9),
    shadowColor: THEMES.colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  discountText: {
    paddingTop: moderateScale(13),
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.white,
    paddingHorizontal: moderateScale(32),
  },
  month: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font32,
    color: THEMES.colors.white,
  },
  monthText: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.white,
  },
  tickIcon: {
    paddingTop: moderateScale(5),
    paddingBottom: moderateScale(13),
  },
  deSelectGradient: {
    borderRadius: moderateScale(9),
    shadowColor: THEMES.colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEMES.colors.purple,
    alignItems: 'center',
  },
  discount2: {
    paddingTop: moderateScale(13),
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    paddingHorizontal: moderateScale(30),
  },
  month2: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font32,
    color: THEMES.colors.black,
  },
  monthText2: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    paddingBottom: moderateScale(13),
  },
  unlockView: {
    paddingTop: moderateScale(27),
  },
  unlockText: {
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.bold,
  },
  descriptionView: {
    alignItems: 'center',
    paddingTop: moderateScale(7),
  },
  subscriptionView: {
    paddingTop: moderateScale(11),
  },
  subscriptionText: {
    textAlign: 'center',
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
  },
  subscriptionCost: {
    textAlign: 'center',
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
  },
  viewBreakupText: {
    textAlign: 'center',
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.cyan,
    fontFamily: THEMES.fontFamily.medium,
    textDecorationLine: 'underline',
  },
  btnView: {
    paddingVertical: moderateScale(25),
    bottom: 0,
  },
  modalTitle: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.bold,
    color: THEMES.colors.black,
  },
  modalSubscription: {
    flexDirection: 'row',
    paddingTop: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalSubscriptionCost: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: '45%',
  },
  subscriptionPrice: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: '45%',
    textAlign: 'right',
  },
  TaxView: {
    flexDirection: 'row',
    paddingTop: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  TaxText: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: '45%',
  },
  TaxPrice: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: '45%',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    paddingTop: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalText: {
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: '45%',
  },
  totalPrice: {
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: '45%',
    textAlign: 'right',
  },
});

export default PaymentsSubscription;
