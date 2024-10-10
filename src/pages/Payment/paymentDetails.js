import React from 'react';
import {View, Text, StatusBar, StyleSheet, FlatList} from 'react-native';
import {THEMES} from '../../assets/theme/themes';
import Header from '../../components/Header';
import Strings from '../../constants/strings';
import {moderateScale} from 'react-native-size-matters';
import Download from '../../assets/svg/download.svg';

const paymentData = [
  {
    transactionId: '1234567891',
    Amount: '₹ 300',
    paymentMode: 'UPI',
    subscriptionPeriod: '5 Jun, 2024 to Nov 5 Jun, 2025',
  },
  {
    transactionId: '1234567891',
    Amount: '₹ 300',
    paymentMode: 'UPI',
    subscriptionPeriod: '5 Jun, 2024 to Nov 5 Jun, 2025',
  },
  {
    transactionId: '1234567891',
    Amount: '₹ 300',
    paymentMode: 'UPI',
    subscriptionPeriod: '5 Jun, 2024 to Nov 5 Jun, 2025',
  },
  {
    transactionId: '1234567891',
    Amount: '₹ 300',
    paymentMode: 'UPI',
    subscriptionPeriod: '5 Jun, 2024 to Nov 5 Jun, 2025',
  },
  {
    transactionId: '1234567891',
    Amount: '₹ 300',
    paymentMode: 'UPI',
    subscriptionPeriod: '5 Jun, 2024 to Nov 5 Jun, 2025',
  },
];

const PaymentDetails = () => {
  const renderItem = () => {
    return (
      <View style={styles.mainView}>
        <View style={styles.row}>
          <View style={styles.w80}>
            <Text numberOfLines={1} style={styles.transactionText}>
              {Strings.transactionId}: 1234567891
            </Text>
            <Text style={styles.dateText}>5 June 2024, 9:30 AM</Text>
          </View>

          <View style={styles.downloadIcon}>
            <Download />
          </View>
        </View>

        <View style={styles.secondRow}>
          <View>
            <Text style={styles.amountValue}>₹ XXXX</Text>
            <Text style={styles.amountKey}>{Strings.amount}</Text>
          </View>
          <View style={{marginLeft: moderateScale(32)}}>
            <Text style={styles.upikey}>UPI</Text>
            <Text style={styles.paymentMode}>{Strings.paymentMode}</Text>
          </View>
        </View>

        <View style={{paddingTop: moderateScale(16)}}>
          <Text style={styles.subscribeDate}>
            5 Jun, 2024 to Nov 5 Jun, 2025
          </Text>
          <Text style={styles.subscribeText}>{Strings.subscriptionPeriod}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        title={Strings.paymentDetails}
        showBack
        bgColor="transparent"
        fontColor={THEMES.colors.black}
      />
      <View style={styles.content}>
        <View style={styles.flatlistView}>
          <FlatList
            data={paymentData}
            showsVerticalScrollIndicator={false}
            bounces={false}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
  },
  flatlistView: {
    paddingTop: moderateScale(30),
  },
  mainView: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(20),
    borderColor: THEMES.colors.alto,
    backgroundColor: THEMES.colors.wildSand,
    shadowColor: THEMES.colors.mercury,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: 'hidden',
    marginBottom: moderateScale(20),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  w80: {
    width: '80%',
  },
  transactionText: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font14,
  },
  dateText: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font12,
    paddingTop: moderateScale(2),
  },
  downloadIcon: {
    backgroundColor: THEMES.colors.cyan,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    padding: moderateScale(10),
  },
  secondRow: {
    flexDirection: 'row',
    paddingTop: moderateScale(26),
    alignItems: 'center',
  },
  amountValue: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font12,
  },
  amountKey: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font12,
  },
  upikey: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font12,
  },
  paymentMode: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font12,
  },
  subscribeDate: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font12,
  },
  subscribeText: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font12,
  },
});

export default PaymentDetails;
