import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import Header from "../../components/Header";
import { moderateScale, s } from "react-native-size-matters";
import ReviewComponent from "../../components/ReviewComponent";
import Dropdown from "../../components/DropDown";
import StarRating from "react-native-star-rating";
import Modal from "react-native-modal";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    addReview,
  getAllReviews,
  replyReviewApi,
  reviewGiven,
} from "../../redux-store/actions/reviews";
import { findDifferenceByDays, showToast } from "../../utils/utils";
import { decryptService } from "../../utils/storageFunc";
import { useSelector } from "react-redux";

const ParentReviews = () => {
  const [reviewList, setReviewList] = useState([]);
  const [review, setReview] = useState([]);
  const { providerProfile, profileData,logindetails } = useSelector(
    ({ commonReducer }) => commonReducer
  );
  const { guestUser, loggedInModule } = useSelector(({ register }) => register);
  const [modalData, setModalData] = useState();
  const [comment, setComment] = useState();
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const profileServices = useMemo(
    () =>
      profileData?.providerBusiness?.services?.reduce(
        (accumulator, currentValue) =>
          accumulator + `${currentValue?.service} `,
        ""
      ),
    [profileData?.providerBusiness?.services]
    
  );

  const initData = async () => {
    let obj = {
      createdby: await decryptService("userId"),
    };
    let res = await reviewGiven(obj);
    if (res?.data?.length) {
      setReviewList(res?.data);
    }
  };



  const replyReviewBtn = async () => {
    const userId = await decryptService("userId");
    let obj = {
      provider: "9769487604",
      "rating": "2",
      reply: comment,
    };
    console.log(obj)
    let res = await addReview(obj);
    if (res?.data?.status_code !== 200) {
      setModalVisible(false);
      showToast("success", res?.data?.message);
    } else {
      setModalVisible(false);
    }
  };

  const renderItem = (item) => {
    console.log("ite", item)
    return (
      <>
        <View style={styles.flatlistView}>
          <View style={styles.flatlistContent}>
            <View style={styles.flatListRow}>
              <View style={styles.flatListImgView}>
                <Image
                  style={styles.img}
                  source={{ uri: item.item.parentprofile }}
                />
              </View>
              <View style={{ marginLeft: moderateScale(8) }}>
                <View style={styles.flatListNameRow}>
                  <Text style={styles.name}>{item.item.parentname}</Text>
                  <View>
                    <StarRating
                      starStyle={{ paddingHorizontal: moderateScale(1.5) }}
                      disabled={true} // Disable interaction
                      maxStars={5}
                      rating={item?.item?.rating} // Set the rating value
                      fullStarColor={THEMES.colors.orange} // Customize star color
                      starSize={16} // Customize star size
                    />
                  </View>
                </View>

                <Text style={styles.profileTypeText}>{item.item.patname}</Text>
              </View>
            </View>
          </View>
          <View>
            <Text numberOfLines={2} style={styles.description}>
              {item.item.remark}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>
              {`${findDifferenceByDays(item.item.createdon)}` > 50
                ? "Few days ago"
                : `${findDifferenceByDays(item.item.createdon)}d`}{" "}
              {}
            </Text>

            {!item?.item?.reply && (
              <Text
                onPress={() => {
                  setModalData(item);
                  setComment(item?.item?.reply);
                  setModalVisible(true);
                }}
                style={styles.replyText}
              >
                {Strings.reply}{" "}
              </Text>
            )}
          </View>
          {item?.item?.reply && (
            <View style={{ paddingTop: moderateScale(12) }}>
              <View style={styles.replyMainView}>
                <View style={styles.replyRow}>
                  <View style={styles.profileImg}>
                    <Image
                      style={{ width: 52, height: 52, borderRadius: 52 / 2 }}
                      source={{
                        uri: profileData?.providerDocument?.[0]?.url,
                      }}
                    />
                  </View>
                  <View style={{ marginLeft: moderateScale(8) }}>
                    <Text style={styles.replyName}>
                      {guestUser
                        ? Strings.guest
                        : profileData?.providerBusiness?.name}
                    </Text>
                    {profileServices && (
                      <Text numberOfLines={2} style={styles.replyProfile}>
                        {profileServices}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.replyComment}>
                  <Text numberOfLines={2} style={styles.replyCommentText}>
                    {item?.item?.reply}
                  </Text>
                  <Text
                    onPress={() => {
                      setModalData(item);
                      setComment(item?.item?.reply);
                      setModalVisible(true);
                    }}
                    style={styles.editText}
                  >
                    {Strings.edit}{" "}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={"Reviews"}
          showBack
          bgColor="transparent"
          fontColor={THEMES.colors.black}
        />
        <View
          style={{
            flex: 1,
            paddingTop: moderateScale(20),
            paddingHorizontal: moderateScale(20),
          }}
        >
          {reviewList?.length == 0 && (
            <InputField
              label={"Review"}
              placeholderText={"Please give your review"}
              multiline={true}
              value={review}
              onChange={setReview}
            />
          )}

          <View style={styles.mainView}>
            <FlatList
              data={reviewList}
              showsVerticalScrollIndicator={false}
              bounces={false}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>

          <Modal
            animationType="none"
            onBackButtonPress={toggleModal}
            isVisible={isModalVisible}
            style={styles.modal}
          >
            <ScrollView
              contentContainerStyle={{
                justifyContent: "flex-end",
                flexGrow: 1,
              }}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalView}>
                  <View style={styles.modalRow}>
                    <View style={styles.row}>
                      <View style={styles.imgView}>
                        <Image
                          style={styles.img}
                          source={{ uri: modalData?.item?.parentprofile }}
                        />
                      </View>
                      <View style={{ marginLeft: moderateScale(8) }}>
                        <View style={styles.nameRow}>
                          <Text style={styles.nameText}>
                            {modalData?.item?.parentname}
                          </Text>
                          <View>
                            <StarRating
                              starStyle={{
                                paddingHorizontal: moderateScale(1.5),
                              }}
                              disabled={true} // Disable interaction
                              maxStars={5}
                              rating={modalData?.item?.rating} // Set the rating value
                              fullStarColor={THEMES.colors.orange} // Customize star color
                              starSize={16} // Customize star size
                            />
                          </View>
                        </View>

                        <Text style={styles.profileTypeText}>
                          {modalData?.item?.patname}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.commentText}>
                      {modalData?.item?.remark}
                    </Text>
                  </View>
                  <View style={styles.commentDaysView}>
                    <Text style={styles.commentDayText}>
                      {`${findDifferenceByDays(modalData?.item?.createdon)}` >
                      50
                        ? "Few days ago"
                        : `${findDifferenceByDays(
                            modalData?.item?.createdon
                          )}d`}{" "}
                      {}
                    </Text>
                  </View>
                </View>
                <View style={styles.commentView}>
                  <InputField
                    label={Strings.comments}
                    placeholderText={Strings.enterYourCommentHere}
                    multiline={true}
                    value={comment}
                    onChange={setComment}
                  />
                </View>
                <View style={styles.btnView}>
                  <Button
                    title={Strings.reply}
                    onPress={() => replyReviewBtn()}
                  />
                </View>
              </View>
            </ScrollView>
          </Modal>
        </View>
        <View
          style={{
            marginHorizontal: moderateScale(16),
            marginBottom: moderateScale(10),
          }}
        >
          <Button title={"Submit"} onPress={() => replyReviewBtn()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  mainView: {
    flex: 1,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: THEMES.colors.bgColor,
    paddingTop: moderateScale(40),
    paddingHorizontal: moderateScale(24),
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginBottom: 0,
  },
  modalView: {
    backgroundColor: THEMES.colors.white,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#ddd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: moderateScale(10),
    paddingVertical: moderateScale(15),
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  imgView: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  img: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
  },
  nameRow: {
    flexDirection: "row",
    width: "88%",
    alignItems: "center",
    justifyContent: "space-between",
    textTransform: "capitalize",
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
    color: "#323232",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    borderColor: "#ddd",
    shadowColor: "#ddd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  w25: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewCount: {
    fontFamily: THEMES.fontFamily.bold,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font32,
  },
  reviewsText: {
    fontFamily: THEMES.fontFamily.regular,
    color: "#b4b4b4",
    fontSize: THEMES.fonts.font12,
  },
  line: {
    width: 1,
    height: 58,
    backgroundColor: "#D9D9D9",
    marginVertical: moderateScale(54),
  },
  w70: {
    width: "70%",
  },
  dropdownMainView: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  dropDownRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  w35: {
    width: "35%",
  },
  w40: {
    width: "40%",
    marginRight: moderateScale(5),
    alignSelf: "flex-end",
  },
  flatlistView: {
    backgroundColor: THEMES.colors.white,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#ddd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: moderateScale(10),
    paddingVertical: moderateScale(15),
  },
  flatlistContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  flatListRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flatListImgView: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  flatListNameRow: {
    flexDirection: "row",
    width: "88%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
    textTransform: "capitalize",
  },
  profileTypeText: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: "#323232",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    backgroundColor: "#DEFFF3",
    paddingHorizontal: moderateScale(12),
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 12,
    marginHorizontal: moderateScale(8),
  },
  replyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(15),
  },
  profileImg: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  replyName: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  replyProfile: {
    fontSize: THEMES.fonts.font13,
    color: "#323232",
    fontFamily: THEMES.fontFamily.regular,
    paddingTop: moderateScale(5),
    width: "80%",
  },
  replyComment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: moderateScale(15),
  },
  replyCommentText: {
    width: "80%",
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

export default ParentReviews;
