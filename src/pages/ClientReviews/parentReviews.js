import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import Header from "../../components/Header";
import { moderateScale, s } from "react-native-size-matters";
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
import {
  findDifferenceByDays,
  findDifferenceByDaysAndTime,
  showToast,
} from "../../utils/utils";
import { decryptService } from "../../utils/storageFunc";
import { useSelector } from "react-redux";
import { contextValue } from "../../components/Loader";
import { AirbnbRating } from "react-native-ratings";
import { normalize, vh } from "../../utils/dimensions";
import ProviderFallback from "../../assets/svg/ProviderFallback";
import { getBase64Obj } from "../../utils/documentUtils";
import CrossIcon from "../../assets/svg/CrossIcon";
import DropDown from "../../components/DropDown";
import DropDownField from "../../components/DropDown";

const ParentReviews = (props) => {
  const vendorId =
    props?.route?.params?.selectedService?.profile?.providerBusiness?.userid;
  const selectedItem = props?.route?.params?.selectedItem;

  const [reviewList, setReviewList] = useState([]);
  const [review, setReview] = useState("");
  const { providerProfile, profileData, logindetails } = useSelector(
    ({ commonReducer }) => commonReducer
  );
  const [rating, setRating] = useState(0);

  const profile = useSelector((state) => state?.commonReducer);

  const { guestUser, loggedInModule } = useSelector(({ register }) => register);
  const [modalData, setModalData] = useState();
  const [comment, setComment] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [filterParams, setFilterParams] = useState({
    sortBy: "newest",
    rating: "5",
    pageNum: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const dataFetched = useRef(false);

  useEffect(() => {
    initData();
  }, [filterParams]);

  useEffect(() => {
    showLoader();
  }, []);

  const showLoader = () => {
    contextValue?.setLoader(true);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (!isModalVisible) {
      initData();
    }
  }, [isModalVisible]);

  const initData = async () => {
    const res = await reviewGiven({
      createdby: await decryptService("userId"),
    });
    if (res.status_code == 200) {
      const filteredReviews = res?.data?.filter(
        (review) => review?.provider === selectedItem?.provider_id
      );
      setReviewList(filteredReviews);
      dataFetched.current = true;
      setLoading(false);
      setTimeout(() => {
        contextValue?.setLoader(false);
      }, 200);
    }
  };

  const renderListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Reviews found.</Text>
    </View>
  );

  const replyReviewBtn = async () => {
    let payload = {
      provider: selectedItem?.provider_id,
      rating: rating.toString(),
      remark: comment,
      createdby: await decryptService("userId"),
    };

    let res = await addReview(payload);
    if (res?.status_code == 200) {
      setModalVisible(false);
      showToast("success", res?.data?.message);
    } else {
      setModalVisible(false);
    }
  };

  const renderItem = (item) => {
    return (
      <>
        <View style={styles.flatlistView}>
          <View>
            <View style={styles.replyMainView}>
              <View style={styles.replyRow}>
                <View style={styles.profileImg}>
                  {selectedItem?.providerPhoto ? (
                    <Image
                      style={{ width: 52, height: 52, borderRadius: 52 / 2 }}
                      source={getBase64Obj(selectedItem?.providerPhoto)}
                    />
                  ) : (
                    <ProviderFallback
                      width={moderateScale(52)}
                      height={moderateScale(55)}
                    />
                  )}
                </View>
                <View style={{ marginLeft: moderateScale(8) }}>
                  <Text style={styles.replyName}>
                    {selectedItem?.providername?.trim()
                      ? selectedItem?.providername?.trim()
                      : guestUser}
                  </Text>
                  <Text
                    style={[
                      styles.replyName,
                      {
                        fontFamily: THEMES.fontFamily.medium,
                        fontSize: THEMES.fonts.font12,
                      },
                    ]}
                  >
                    {selectedItem?.servicedetails?.service
                      ? selectedItem?.servicedetails?.service
                      : ""}
                  </Text>
                </View>
              </View>
              {item?.item?.reply && (
                <View style={styles.replyComment}>
                  <Text numberOfLines={2} style={styles.replyCommentText}>
                    {item?.item?.reply}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {item?.item?.reply && (
            <>
              <View style={styles.flatlistContent}>
                <View style={styles.flatListRow}>
                  <View style={styles.flatListImgView}>
                    <Image
                      style={styles.img}
                      source={{ uri: logindetails?.parentphoto }}
                    />
                  </View>
                  <View style={{ marginLeft: moderateScale(8) }}>
                    <View style={styles.flatListNameRow}>
                      <Text style={styles.name}>{profileData?.name}</Text>
                      <View>
                        <StarRating
                          starStyle={{
                            paddingHorizontal: moderateScale(1.5),
                          }}
                          disabled={true} // Disable interaction
                          maxStars={5}
                          rating={item?.item?.rating} // Set the rating value
                          fullStarColor={THEMES.colors.orange} // Customize star color
                          starSize={16} // Customize star size
                        />
                      </View>
                    </View>
                    <Text style={styles.profileTypeText}>
                      {item?.item?.patname}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <Text numberOfLines={2} style={styles.description}>
                  {item?.item?.remark}
                </Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateText}>
                  {findDifferenceByDaysAndTime(item?.item?.createdon)}
                </Text>
                {item?.item?.parentname === profileData?.name && (
                  <Text
                    onPress={() => {
                      setModalData(item);
                      setComment(item?.item?.remark);
                      setModalVisible(true);
                      setRating(item?.item?.rating);
                    }}
                    style={styles.editText}
                  >
                    {Strings.edit}{" "}
                  </Text>
                )}
              </View>
            </>
          )}

          {item?.item?.remark && item?.item?.reply == "" && (
            <>
              <View style={styles.flatlistContent}>
                <View style={styles.flatListRow}>
                  <View style={styles.flatListImgView}>
                    <Image
                      style={styles.img}
                      source={{ uri: logindetails?.parentphoto }}
                    />
                  </View>
                  <View style={{ marginLeft: moderateScale(8) }}>
                    <View style={styles.flatListNameRow}>
                      <Text style={styles.name}>
                        {selectedItem?.parentdetails?.name}
                      </Text>
                      <View>
                        <StarRating
                          starStyle={{
                            paddingHorizontal: moderateScale(1.5),
                          }}
                          disabled={true} // Disable interaction
                          maxStars={5}
                          rating={item?.item?.rating} // Set the rating value
                          fullStarColor={THEMES.colors.orange} // Customize star color
                          starSize={16} // Customize star size
                        />
                      </View>
                    </View>
                    <Text style={styles.profileTypeText}>
                      {item?.item?.patname}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <Text numberOfLines={2} style={styles.description}>
                  {item?.item?.remark}
                </Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateText}>
                  {findDifferenceByDaysAndTime(item?.item?.createdon)}
                </Text>
                <Text
                  onPress={() => {
                    setRating(item?.item?.rating);
                    setModalData(item);
                    setComment(item?.item?.remark);
                    setModalVisible(true);
                  }}
                  style={styles.editText}
                >
                  {Strings.edit}{" "}
                </Text>
              </View>
            </>
          )}
        </View>
      </>
    );
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const onSubmitReview = async () => {
    try {
      if (!rating) {
        showToast("error", "Please provide rating");
      } else if (!review) {
        showToast("error", "Please enter review");
      } else {
        contextValue?.setLoader(true);
        api();
      }

      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
    }
  };

  const api = async () => {
    try {
      let payload = {
        provider: selectedItem?.provider_id,
        rating: rating.toString(),
        remark: review,
        createdby: await decryptService("userId"),
      };
      let res = await addReview(payload);
      if (res?.status_code == 200) {
        showToast("success", res?.data?.message);
        initData();
      }
    } catch (error) {}
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="large" color={THEMES.colors.cinderella} />
      </View>
    );
  };

  const loadMoreData = () => {
    if (!loading && hasMore) {
      setLoading(true);
      setFilterParams((prev) => ({
        ...prev,
        pageNum: prev.pageNum + 1,
      }));
    }
  };

  const renderModal = () => (
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
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={{ marginBottom: 20, alignItems: "flex-end" }}
          >
            <CrossIcon width={24} height={24} />
          </TouchableOpacity>
          <View style={styles.modalView}>
            <View style={styles.modalRow}>
              <View style={styles.row}>
                <View style={styles.imgView}>
                  {selectedItem?.providerPhoto ? (
                    <Image
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 52 / 2,
                      }}
                      source={getBase64Obj(selectedItem?.providerPhoto)}
                    />
                  ) : (
                    <ProviderFallback
                      width={moderateScale(52)}
                      height={moderateScale(52)}
                    />
                  )}
                </View>
                <View style={{ marginLeft: moderateScale(8) }}>
                  <View>
                    <Text numberOfLines={1} style={styles.nameText}>
                      {selectedItem?.providername?.trim()}
                    </Text>
                    <Text
                      style={[
                        styles.replyName,
                        {
                          fontFamily: THEMES.fontFamily.medium,
                          fontSize: THEMES.fonts.font12,
                        },
                      ]}
                    >
                      {selectedItem?.servicedetails?.service
                        ? selectedItem?.servicedetails?.service
                        : ""}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <Text style={styles.commentText}>{modalData?.item?.reply}</Text>
            </View>
            <View style={styles.commentDaysView}>
              <Text style={styles.commentDayText}>
                {findDifferenceByDaysAndTime(modalData?.item?.createdon)}
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: moderateScale(20),
              }}
            >
              <Text
                style={{
                  fontSize: normalize(14),
                  fontFamily: "Inter-SemiBold",
                  color: "#000",
                }}
              >
                Rate Your Experience
              </Text>
              <AirbnbRating
                count={5} // Number of stars
                defaultRating={rating}
                size={20}
                showRating={false} // Hide numeric value below stars
                onFinishRating={handleRating}
              />
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
              disabled={!comment}
              title={Strings.reply}
              onPress={() => replyReviewBtn()}
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={"Reviews"}
          fontColor="#EC559C"
          showBack
          bgColor="transparent"
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: moderateScale(20),
          }}
        >
          {dataFetched?.current && (
            <>
              {Boolean(reviewList?.length) ? (
                <View style={styles.mainView}>
                  <FlatList
                    data={reviewList}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={
                      !dataFetched.current ? null : renderListEmpty
                    }
                    contentContainerStyle={
                      reviewList?.length === 0 ? styles.flatListContainer : null
                    }
                    onEndReached={loadMoreData}
                  />
                </View>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingBottom: moderateScale(20),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: normalize(14),
                        fontFamily: "Inter-SemiBold",
                        color: "#000",
                      }}
                    >
                      Rate Your Experience
                    </Text>
                    <AirbnbRating
                      count={5} // Number of stars
                      defaultRating={rating}
                      size={20}
                      showRating={false} // Hide numeric value below stars
                      onFinishRating={handleRating}
                    />
                  </View>

                  <InputField
                    label={"Write review"}
                    placeholderText={"Enter review"}
                    value={review}
                    multiline={true}
                    onChange={setReview}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      alignSelf: "center",
                      marginBottom: vh(20),
                    }}
                  >
                    <Button
                      disabled={!review}
                      onPress={onSubmitReview}
                      title={"Submit"}
                    />
                  </View>
                </>
              )}
            </>
          )}

          {renderModal()}
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
    paddingTop: moderateScale(20),
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
    width: "80%",
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
    marginTop: moderateScale(20),
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
    width: "90%",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: "#000",
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  flatListContainer: {
    flexGrow: 1, // Occupies available space
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ParentReviews;
