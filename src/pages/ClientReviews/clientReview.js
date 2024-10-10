import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import {THEMES} from '../../assets/theme/themes';
import Strings from '../../constants/strings';
import Header from '../../components/Header';
import {moderateScale, s} from 'react-native-size-matters';
import ReviewComponent from '../../components/ReviewComponent';
import Dropdown from '../../components/DropDown';
import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const Data = [
  {
    id: 1,
    profile: '../../assets/images/profileImg.png',
    name: 'Rajneesh',
    profileType: 'Cocos Parent',
    description: 'Had a wonderful experience with Ket.Extremely wise trainer.',
    date: '5 days ago',
    rating: 5,
    reply: [
      {
        id: 1,
        profile: '../../assets/images/profileImg.png',
        name: 'Ket',
        profileType: 'Pet Trainer',
        comment: 'Thank you!!! for the kind words...',
      },
    ],
  },
  {
    id: 2,
    profile: '../../assets/images/profileImg.png',
    name: 'Rajneesh',
    profileType: 'Cocos Parent1',
    rating: 4.5,
    description: 'Had a wonderful experience with Ket.Extremely wise trainer.',
    date: '5 days ago',
  },
];

const ClientReview = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderItem = item => {
    return (
      <>
        <View style={styles.flatlistView}>
          <View style={styles.flatlistContent}>
            <View style={styles.flatListRow}>
              <View style={styles.flatListImgView}>
                <Image
                  style={{width: 52, height: 52, borderRadius: 52 / 2}}
                  source={require('../../assets/images/profileImg.png')}
                />
              </View>
              <View style={{marginLeft: moderateScale(8)}}>
                <View style={styles.flatListNameRow}>
                  <Text style={styles.name}>{item.item.name}</Text>
                  <View>
                    <StarRating
                      starStyle={{paddingHorizontal: moderateScale(1.5)}}
                      disabled={true} // Disable interaction
                      maxStars={5}
                      rating={item.item.rating} // Set the rating value
                      fullStarColor={THEMES.colors.orange} // Customize star color
                      starSize={16} // Customize star size
                    />
                  </View>
                </View>

                <Text style={styles.profileTypeText}>
                  {item.item.profileType}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.description}>{item.item.description}</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>{item.item.date}</Text>

            {!item?.item?.reply?.[0] && (
              <Text
                onPress={() => setModalVisible(true)}
                style={styles.replyText}>
               {Strings.reply}{' '}
              </Text>
            )}
          </View>

          {item?.item?.reply?.[0] && (
            <View style={{paddingTop: moderateScale(12)}}>
              <View style={styles.replyMainView}>
                <View style={styles.replyRow}>
                  <View style={styles.profileImg}>
                    <Image
                      style={{width: 52, height: 52, borderRadius: 52 / 2}}
                      source={require('../../assets/images/profileImg.png')}
                    />
                  </View>
                  <View style={{marginLeft: moderateScale(8)}}>
                    <Text style={styles.replyName}>
                      {item?.item?.reply?.[0]?.name}
                    </Text>

                    <Text style={styles.replyProfile}>
                      {item?.item?.reply?.[0]?.profileType}
                    </Text>
                  </View>
                </View>
                <View style={styles.replyComment}>
                  <Text style={styles.replyCommentText}>
                    {item?.item?.reply?.[0]?.comment}
                  </Text>
                  <Text
                    onPress={() => setModalVisible(true)}
                    style={styles.editText}>
                    {Strings.edit}{' '}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </>
    );
  };

  const listHeader = () => {
    return (
      <>
        <View style={styles.headerView}>
          <View style={styles.headerRow}>
            <View style={styles.w25}>
              <Text style={styles.reviewCount}>4.8</Text>
              <Text style={styles.reviewsText}>10 Reviews</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.w70}>
              <ReviewComponent
                reviewData={[
                  {stars: 5, count: 5},
                  {stars: 4, count: 3},
                  {stars: 3, count: 2},
                  {stars: 2, count: 0},
                  {stars: 1, count: 0},
                ]}
                totalReviews={5}
              />
            </View>
          </View>
        </View>
        <View style={styles.dropdownMainView}>
          <View style={styles.dropDownRow}>
            <View style={styles.w35}>
              <Dropdown
                dropdownData={[
                  {label: 'All Rating', value: '1'},
                  {label: '1 Star', value: '2'},
                  {label: '2 Star', value: '3'},
                  {label: '3 Star', value: '4'},
                  {label: '4 Star', value: '5'},
                  {label: '5 Star', value: '6'},
                ]}
              />
            </View>
            <View style={styles.w40}>
              <Dropdown
                width={120}
                dropdownData={[
                  {label: 'Most Recent', value: '1'},
                  {label: 'Most Relevant', value: '2'},
                  {label: 'Filter by Service', value: '3'},
                ]}
              />
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        title={Strings.clientReviews}
        showBack
        bgColor="transparent"
        fontColor={THEMES.colors.black}
      />
      <View style={styles.mainView}>
        <FlatList
          data={Data}
          showsVerticalScrollIndicator={false}
          bounces={false}
          ListHeaderComponent={listHeader}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.modalView}>
            <View style={styles.modalRow}>
              <View style={styles.row}>
                <View style={styles.imgView}>
                  <Image
                    style={styles.img}
                    source={require('../../assets/images/profileImg.png')}
                  />
                </View>
                <View style={{marginLeft: moderateScale(8)}}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nameText}>Rajneesh</Text>
                    <View>
                      <StarRating
                        starStyle={{paddingHorizontal: moderateScale(1.5)}}
                        disabled={true} // Disable interaction
                        maxStars={5}
                        rating={4} // Set the rating value
                        fullStarColor={THEMES.colors.orange} // Customize star color
                        starSize={16} // Customize star size
                      />
                    </View>
                  </View>

                  <Text style={styles.profileTypeText}>Coco’s Parent</Text>
                </View>
              </View>
            </View>
            <View>
              <Text style={styles.commentText}>
                {Strings.hadWonderFulExperience}
              </Text>
            </View>
            <View style={styles.commentDaysView}>
              <Text style={styles.commentDayText}>5 days ago</Text>
            </View>
          </View>
          <View style={styles.commentView}>
            <InputField
              label={Strings.comments}
              placeholderText={Strings.enterYourCommentHere}
              multiline={true}
            />
          </View>
          <View style={styles.btnView}>
            <Button title={Strings.reply} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  mainView: {
    flex: 1,
    paddingTop: moderateScale(30),
    paddingHorizontal: moderateScale(20),
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: THEMES.colors.bgColor,
    paddingTop: moderateScale(100),
    paddingHorizontal: moderateScale(24),
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginBottom: 0,
  },
  modalView: {
    backgroundColor: THEMES.colors.white,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#ddd',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: moderateScale(10),
    paddingVertical: moderateScale(15),
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgView: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  img: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
  },
  nameRow: {
    flexDirection: 'row',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  profileTypeText: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: '#323232',
    fontFamily: THEMES.fontFamily.regular,
  },
  commentText: {
    lineHeight: 24,
    paddingTop: moderateScale(2),
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    paddingHorizontal: moderateScale(20),
  },
  commentDaysView: {
    paddingTop: moderateScale(17),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
  },
  commentDayText: {
    fontSize: THEMES.fonts.font12,
    lineHeight: 24,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  btnView: {
    paddingTop: moderateScale(22),
    paddingBottom: moderateScale(20),
  },
  commentView: {
    paddingTop: moderateScale(13),
  },
  headerView: {
    backgroundColor: THEMES.colors.white,
    paddingHorizontal: moderateScale(15),
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#ddd',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: 'hidden',
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  w25: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewCount: {
    fontFamily: THEMES.fontFamily.bold,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font32,
  },
  reviewsText: {
    fontFamily: THEMES.fontFamily.regular,
    color: '#b4b4b4',
    fontSize: THEMES.fonts.font12,
  },
  line: {
    width: 1,
    height: 58,
    backgroundColor: '#D9D9D9',
    marginVertical: moderateScale(54),
  },
  w70: {
    width: '70%',
  },
  dropdownMainView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  dropDownRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  w35: {
    width: '35%',
  },
  w40: {
    width: '40%',
    marginRight: moderateScale(5),
    alignSelf: 'flex-end',
  },
  flatlistView: {
    backgroundColor: THEMES.colors.white,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#ddd',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: moderateScale(10),
    paddingVertical: moderateScale(15),
  },
  flatlistContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  flatListRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatListImgView: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  flatListNameRow: {
    flexDirection: 'row',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  profileTypeText: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: '#323232',
    fontFamily: THEMES.fontFamily.regular,
    paddingTop: moderateScale(5),
  },
  description: {
    lineHeight: 24,
    paddingTop: moderateScale(2),
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(5),
  },
  dateRow: {
    paddingTop: moderateScale(17),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
  },
  dateText: {
    fontSize: THEMES.fonts.font12,
    lineHeight: 24,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.regular,
  },
  replyText: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: THEMES.colors.cyan,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  replyMainView: {
    backgroundColor: '#DEFFF3',
    paddingHorizontal: moderateScale(12),
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
    marginHorizontal: moderateScale(8),
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(15),
  },
  profileImg: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  replyName: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  replyProfile: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: '#323232',
    fontFamily: THEMES.fontFamily.regular,
    paddingTop: moderateScale(5),
  },
  replyComment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: moderateScale(15),
  },
  replyCommentText: {
    width: '80%',
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
  },
  editText: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: THEMES.colors.cyan,
    fontFamily: THEMES.fontFamily.semiBold,
  },
});

export default ClientReview;
