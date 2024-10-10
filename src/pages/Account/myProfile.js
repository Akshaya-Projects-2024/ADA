import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {THEMES} from '../../assets/theme/themes';
import Strings from '../../constants/strings';
import Header from '../../components/Header';
import RightArrow from '../../assets/svg/rightArrow.svg';
import {moderateScale} from 'react-native-size-matters';

const MyProfile = props => {
  const renderItem = (title, addBottom, route, description, showPending) => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate(route, { route: "myprofile" })}
        style={[
          styles.flexRow,
          {
            paddingBottom: addBottom && moderateScale(16),
          },
        ]}>
        <View>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        <View style={styles.flexRowContent}>
          {showPending && <Text style={styles.pendingText}>Pending</Text>}

          <RightArrow stroke={THEMES.colors.boulder} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title={Strings.myProfile} showBack bgColor="transparent" />
      <View style={styles.padding32}>
        <View style={styles.cardView}>
          {renderItem(
            Strings.businessDetails,
            '',
            'businessDetail',
            Strings.businessDescription,
          )}

          {renderItem(
            Strings.contactDetails,
            '',
            'contactDetails',
            Strings.contactDescription,
          )}
          {renderItem(
            Strings.uploadImages,
            '',
            'uploadImagesDocs',
            Strings.uploadImagesDescription,
          )}
          {renderItem(
            Strings.sessionDetails,
            '',
            'sessionDetail',
            Strings.sessionDescriptions,
            true,
          )}
          {renderItem(
            Strings.mediaLinks,
            'addBottom',
            'mediaLink',
            Strings.mediaDescription,
          )}
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
  padding32: {
    paddingTop: moderateScale(32),
    paddingHorizontal: moderateScale(20),
  },
  flexRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardView: {
    backgroundColor: THEMES.colors.white,
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
    shadowColor: THEMES.colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEMES.colors.white,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: moderateScale(16),
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: THEMES.colors.bgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(12),
  },
  titleText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
    lineHeight: moderateScale(23),
  },
  descriptionText: {
    fontSize: THEMES.fonts.font10,
    lineHeight: moderateScale(16),
    fontFamily: THEMES.fontFamily.regular,
    color: '#bbbbbb',
  },
  pendingText: {
    color: '#FF6437',
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.regular,
  },
});

export default MyProfile;
