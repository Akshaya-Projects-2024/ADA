import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {THEMES} from '../../assets/theme/themes';
import Strings from '../../utils/strings';
import Modal from 'react-native-modal';
import Cross from '../../assets/svg/cross.svg';
import {moderateScale} from 'react-native-size-matters';
import Button from '../../components/Button';

const SubscriptionSuccess = props => {
  const {isVisible, onClose, type} = props;
  return (
    <View style={styles.mainView}>
      <Modal
        isVisible={isVisible}
        backdropOpacity={0.5}
        style={styles.modalView}>
        <View style={styles.content}>
          <View style={styles.row}>
            <View style={styles.w80}>
              <Text style={styles.title}>{Strings.thankYouFor}</Text>
              <Text style={styles.subTitle}>{Strings.subscriping}</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.crossIcon}>
              <Cross />
            </TouchableOpacity>
          </View>
          <View style={{paddingTop: moderateScale(16)}}>
            <Text style={styles.descriptionText}>
              {Strings.successfulSubscription}
            </Text>
          </View>
          {type == '6Month' && (
            <View style={{paddingTop: moderateScale(16)}}>
              <Text style={styles.subscriptionText}>
                {Strings.subscriptionValidation}
              </Text>
            </View>
          )}
          <View
            style={{
              paddingTop: moderateScale(32),
              marginHorizontal:
                type == '6Month' ? moderateScale(0) : moderateScale(60),
            }}>
            <Button
              title={
                type == '6Month' ? Strings.upgradeSubscription : Strings.close
              }
              onPress={onClose}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: THEMES.colors.white,
  },
  modalView: {
    margin: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: moderateScale(43),
  },
  content: {
    padding: 24,
    backgroundColor: THEMES.colors.white,
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
  },
  w80: {
    width: '80%',
  },
  title: {
    fontSize: THEMES.fonts.font22,
    color: THEMES.colors.black,
    lineHeight: moderateScale(24),
    fontFamily: THEMES.fontFamily.bold,
  },
  subTitle: {
    fontSize: THEMES.fonts.font22,
    color: THEMES.colors.black,
    lineHeight: moderateScale(24),
    fontFamily: THEMES.fontFamily.bold,
    paddingTop: moderateScale(5),
  },
  crossIcon: {
    alignItems: 'flex-end',
    width: '20%',
  },
  descriptionText: {
    fontFamily: THEMES.fontFamily.regular,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font16,
    lineHeight: 28,
  },
  subscriptionText: {
    fontFamily: THEMES.fontFamily.bold,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font16,
    lineHeight: 28,
  },
});

export default SubscriptionSuccess;
