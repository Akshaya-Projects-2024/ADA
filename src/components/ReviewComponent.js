import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {THEMES} from '../assets/theme/themes';

const ReviewComponent = props => {
  const {reviewData, totalReviews} = props;
  
  return (
    <View style={styles.container}>
      <View style={styles.reviewBreakdown}>
        {reviewData.map((review, index) => (
          <View key={index} style={styles.reviewRow}>
            <Text style={styles.starCount}>{review.stars}</Text>
            <FontAwesome name="star" size={14} color={THEMES.colors.gallery} />
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: review?.bgColor ? review?.bgColor : 'orange',
                    width: `${(review.count / totalReviews) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.reviewNumber}>{review.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEMES.colors.white,
    borderRadius: 8,
    marginLeft: moderateScale(10),
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(15),
  },
  reviewBreakdown: {
    marginTop: 8,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starCount: {
    fontSize: moderateScale(10),
    marginRight: moderateScale(10),
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.regular,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
  
    borderRadius: 4,
  },
  reviewNumber: {
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.regular,
  },
});

export default ReviewComponent;
