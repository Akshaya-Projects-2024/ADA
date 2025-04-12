import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Strings from "../../constants/strings";
import { moderateScale } from "react-native-size-matters";
import ArrowRight from "../../assets/svg/arrowRight.svg";
import LinearGradient from "react-native-linear-gradient";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import SubscriptionSuccess from "./subscriptionSuccess";
import {
  acknowledgeSubscription,
  getSubscriptionPlan,
  getSubscriptionDetailsApi,
  validatePromocodeApi,
  postSubscription,
} from "../../redux-store/actions/payment";
import { decryptService } from "../../utils/storageFunc";
import RazorpayCheckout from "react-native-razorpay";
import { getProfile } from "../../redux-store/actions/auth";
import {
  dispatchUserData,
  fetchUserProfileData,
} from "../../redux-store/actions/registerAction";
import {
  validateParentProfile,
  validateParentProfileUsingStatus,
  validateServiceProfile,
} from "../../utils/userUtils";
import {
  calcuateTotal,
  calculateDiscount,
  calculatePercentage,
  calculateTax,
  validArray,
  validObject,
} from "../../utils/utils";
import SubscriptionError from "./subscriptionError";
import { SafeAreaView } from "react-native-safe-area-context";
import { contextValue } from "../../components/Loader";
import Logo from "../../assets/images/roundIcon.png";
import TouchableButtonWithPermission from "../../components/TouchableButtonWithPermission";
import { useFocusEffect } from "@react-navigation/native";
import { navigateToParent } from "../../navigations/rootNavigationRef";
import InputField from "../../components/InputField";
import CheckCircle from "../../assets/svg/check.svg";
import { useUser } from "../../api/UserContext";

const PaymentsSubscription = (props) => {
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [subscriptionModal, setSubscription] = useState(false);
  const [errorModal, setError] = useState(false);
  const [month, setMonth] = useState("12Month");
  const [selectedCard, setSelectedCard] = useState(null); // State to track selected card
  const [subscriptionData, setSubscriptionData] = useState();
  const [subscriptionDetails, setSubscriptionDetails] = useState();
  const profile = useSelector((state) => state?.commonReducer);
  const { profileData } = useSelector(({ commonReducer }) => commonReducer);
  const { loggedInModule } = useSelector((state) => state?.register);
  const [refresh, setRefresh] = useState(false);
  const userKey =
    loggedInModule === "parent" ? "parentProfie" : "providerProfile";
  const [userAlreadySubscribed, setAlreadySubscribed] = useState(false);
  const [promocodeModal, setPromoCodeModal] = useState(false);
  const [promocode, setPromoCode] = useState("");
  const [validation, setValidation] = useState("");
  const [successPromocode, setSuccessPromocode] = useState("");
  const [promocodeDetails, setPromoCodeDetails] = useState("");
  const { userData, apiInitCall } = useUser();

  useEffect(() => {
    initData();
  }, [initData]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const togglePromoCodeModal = () => {
    setPromoCodeModal(!promocodeModal);
    setValidation("");
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchUserProfileData());
    }, [])
  );

  const handlePromoCodeSubmit = () => {
    if (!promocode) {
      setValidation("Promo code is required");
    } else {
      validatePromocode();
    }
  };

  const handleRemovePromoCode = () => {
    setPromoCodeDetails("");
    setSuccessPromocode("");
    setValidation("");
    setPromoCode("");
  };

  const validatePromocode = async () => {
    try {
      contextValue?.setLoader(true);
      let payload = {
        userId: await decryptService("userId"),
        promocode: promocode,
      };
      const res = await validatePromocodeApi(payload);
      if (!Boolean(res?.error)) {
        const message = "Promo code has been applied successfully";
        setPromoCodeDetails(res);
        setSuccessPromocode(message);
        setPromoCodeModal(false);
      } else {
        const message = res?.message;
        setValidation(message);
        setPromoCode("");
      }

      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
    }
  };

  const getSubscriptionApi = async () => {
    try {
      let obj = {
        userId: await decryptService("userId"),
        usertype: loggedInModule,
        subscriptioncode: selectedCard?.code,
        promocode: promocode,
      };
      let res = await postSubscription(obj);
      if (Boolean(res?.data)) {
        const options = {
          image: res?.data?.logo, //roundIcon.png
          currency: res?.data?.currency,
          key: "rzp_test_PECnHmfOdkRLhw", // Replace with your Razorpay Key ID
          amount: selectedCard?.amount,
          name: "ADA",
          order_id: res?.data?.id, //Replace this with an order_id created using Orders API.
          theme: { color: "#53a20e" },
          usertype: loggedInModule,
        };

        const paymentResponse = await RazorpayCheckout.open({
          ...options,
        });
        if (
          paymentResponse?.razorpay_order_id &&
          paymentResponse?.razorpay_payment_id &&
          paymentResponse?.razorpay_signature
        ) {
          const params = {
            userid: await decryptService("userId"),
            razorpay_order_id: paymentResponse?.razorpay_order_id,
            success: {
              razorpay_signature: paymentResponse?.razorpay_signature,
              razorpay_payment_id: paymentResponse?.razorpay_payment_id,
            },
          };
          const acknowledgeResponse = await acknowledgeSubscription(params);
          if (acknowledgeResponse?.status === 200) {
            await fetchUserProfile();
            await apiInitCall();
            setSubscription(true);
          }
        }
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
    }
  };

  useEffect(() => {
    setAlreadySubscribed(
      Boolean(
        profile?.[userKey]?.subscription?.subscriptioncode &&
          profile?.[userKey]?.subscription?.status === "active"
      )
    );
  }, [profile]);

  const getUserData = useCallback(() => {
    return new Promise(async (resolve) => {
      try {
        let userData = {};
        const response = await fetchUserProfile();
        if (response?.flag) {
          userData = response?.data;
        } else {
          const validProviderProfile = validateServiceProfile(profile, true);
          const validProfile = validateParentProfileUsingStatus(profile);
          if (loggedInModule === "provider") {
            if (validProviderProfile?.flag) {
              userData = validProviderProfile?.data;
            }
          }
          if (loggedInModule === "parent") {
            if (validProfile?.flag) {
              userData = validProfile?.data;
            }
          }
        }
        if (validObject(userData)) {
          if (loggedInModule === "provider") {
            resolve({
              flag: true,
              description: "Pet Service Provider Payment",
              prefill: {
                ...(userData?.providerProfile?.providerContact?.email
                  ? {
                      email: userData?.providerProfile?.providerContact?.email,
                    }
                  : {}),
                ...(userData?.providerProfile?.providerContact?.mobile
                  ? {
                      contact:
                        userData?.providerProfile?.providerContact?.mobile,
                    }
                  : {}),
                ...(userData?.providerProfile?.providerBusiness?.name
                  ? {
                      name: userData?.providerProfile?.providerBusiness?.name,
                    }
                  : {}),
              },
            });
          } else {
            resolve({
              flag: true,
              description: "Pet Parent Payment",
              prefill: {
                ...(userData?.parentProfie?.parentContact?.email
                  ? {
                      email: userData?.parentProfie?.parentContact?.email,
                    }
                  : {}),
                ...(userData?.parentProfie?.parentContact?.mobile
                  ? {
                      contact: userData?.parentProfie?.parentContact?.mobile,
                    }
                  : {}),
                ...(userData?.parentProfie?.parentProfile?.name
                  ? {
                      name: userData?.parentProfie?.parentProfile?.name,
                    }
                  : {}),
              },
            });
          }
        }
        resolve({ flag: false });
      } catch (error) {
        console.log("err111", error?.message);
        resolve({ flag: false });
      }
    });
  }, [fetchUserProfile, profile]);

  const fetchUserProfile = useCallback(() => {
    return new Promise(async (resolve) => {
      try {
        const obj = {
          userid: await decryptService("userId"),
        };
        const response = await getProfile(obj);
        if (response?.data?.status_code === 200) {
          dispatch(dispatchUserData(response?.data?.data));
        }
        resolve({ flag: true, data: response?.data?.data });
      } catch (error) {
        resolve({ flag: false });
      }
    });
  }, [dispatch]);

  const initData = useCallback(async () => {
    try {
      contextValue?.setLoader(true);
      const token = await decryptService("accessToken");
      const obj = {
        userId: await decryptService("userId"),
        usertype: loggedInModule, // parent or provider
      };
      const res = await getSubscriptionPlan(obj);
      if (res.status === 200) {
        const outputArray = res?.data?.data;
        if (validArray(outputArray)) {
          let selectedSub = {};
          setSubscriptionData(outputArray);
          setSubscriptionDetails(outputArray[1]);
          let cardData = {
            ...outputArray[1],
            details: outputArray?.[1]?.details?.split(","),
          };
          setSelectedCard(cardData);
          if (
            profile?.[userKey]?.subscription?.subscriptioncode &&
            profile?.[userKey]?.subscription?.status === "active"
          ) {
            selectedSub = outputArray.find(
              (sub) =>
                sub?.code === profile?.[userKey]?.subscription?.subscriptioncode
            );
          }
        }
        contextValue?.setLoader(false);
      }
    } catch (error) {
      contextValue?.setLoader(false);
    }
  }, [
    profile?.[userKey]?.subscription?.status,
    profile?.[userKey]?.subscription?.subscriptioncode,
  ]);

  const navigateToHome = async () => {
    props.navigation.reset({
      index: 0,
      routes: [
        {
          name: "auth",
          state: {
            routes: [
              {
                name: "home",
              },
            ],
          },
        },
      ],
    });
  };
  const handlePayment = async () => {
    try {
      contextValue?.setLoader(true);
      await getSubscriptionApi();
    } catch (error) {
      console.log("🚀 ~ handlePayment ~ error:", error);
      const params = {
        userid: await decryptService("userId"),
        error: {
          code: error?.error?.code,
          description: error?.error?.description,
          metadata: {},
          reason: "",
          source: "",
          step: "",
        },
      };
    }
  };

  const handleSubscriptionSuccess = () => {
    setSubscription(false);
    loggedInModule === "provider"
      ? navigateToHome()
      : navigateToParent(props?.navigation);
  };

  const handleSubscriptionError = () => {
    setError(false);
    loggedInModule === "provider"
      ? navigateToHome()
      : navigateToParent(props?.navigation);
  };

  const onCardClick = async (plan) => {
    try {
      setSelectedCard({
        ...plan,
        details:
          typeof plan?.details === "string"
            ? plan?.details?.split(",")
            : plan?.details,
      });
      // if (
      //   !profile?.[userKey]?.subscription?.subscriptioncode ||
      //   profile?.[userKey]?.subscription?.status === "inactive"
      // ) {
      //   getSubscriptionApi();
      // }
    } catch (error) {
      console.log("🚀 ~ onCardClick ~ error:", error?.message);
    }
  };

  const checkStatus = () => {
    const validProviderProfile = validateServiceProfile(profile, true);
    const validProfile = validateParentProfileUsingStatus(profile);
    return loggedInModule === "parent"
      ? !validProfile.flag
      : !validProviderProfile.flag;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={Strings.paymentSubScription}
          showBack
          bgColor="transparent"
          fontColor={THEMES.colors.black}
        />
        {Boolean(selectedCard) && (
          <View style={styles.mainContent}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.paymentDetailsView}>
                <TouchableButtonWithPermission
                  customMsgForRegistration={
                    "Registered and Subscribed to enjoy all the exciting features of ADA app."
                  }
                  onPress={() => props.navigation.navigate("paymentDetails")}
                  style={styles.paymentDetailsBtn}
                >
                  <Text style={styles.paymentDetailsText}>
                    {Strings.paymentDetails}
                  </Text>
                  <ArrowRight />
                </TouchableButtonWithPermission>
              </View>
              <Text
                style={[
                  styles.joinTheFunText,
                  {
                    color: userAlreadySubscribed
                      ? THEMES.colors.cyan
                      : THEMES.colors.black,
                  },
                ]}
              >
                {userAlreadySubscribed
                  ? Strings.youAreAlreadySubscribed
                  : Strings.joinTheFun}
              </Text>

              <View style={styles.rowContainer}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{ flex: 1 }}
                  contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {validArray(subscriptionData)
                    ? subscriptionData?.map((plan, index) => {
                        return (
                          <View key={plan?.id}>
                            <TouchableOpacity
                              disabled={userAlreadySubscribed}
                              style={[
                                styles.card,
                                selectedCard?.id === plan?.id
                                  ? { borderWidth: 0, elevation: 5 }
                                  : { borderWidth: 1, borderColor: "#d3d3d3" },
                                ,
                                {
                                  width:
                                    selectedCard?.id === plan?.id ? 130 : 113,
                                  height:
                                    selectedCard?.id === plan?.id ? 127 : 107,
                                  backgroundColor: "#f2e2f4",
                                  borderColor: "#ab47bc",
                                  marginRight:
                                    index !== subscriptionData?.length - 1 &&
                                    moderateScale(20),
                                },
                              ]}
                              onPress={() => onCardClick(plan)}
                            >
                              {selectedCard?.id === plan?.id ? (
                                <LinearGradient
                                  colors={["#fb427c", "#fd6da2", "#fd98a5"]}
                                  style={[
                                    styles.gradientBackground,
                                    {
                                      width:
                                        selectedCard?.id === plan?.id
                                          ? 130
                                          : 113,
                                      height:
                                        selectedCard?.id === plan?.id
                                          ? 127
                                          : 107,
                                    },
                                  ]}
                                >
                                  {plan?.flatdiscount !== 0 && (
                                    <Text style={styles.discountText}>
                                      {plan?.flatdiscount}% Off
                                    </Text>
                                  )}

                                  <Text style={styles.monthText}>
                                    {plan?.name.replace(" MONTH", "")}
                                  </Text>
                                  <Text
                                    style={{
                                      color: "#fff",
                                      fontFamily: THEMES.fontFamily.medium,
                                      fontSize: THEMES.fonts.font12,
                                    }}
                                  >
                                    Months
                                  </Text>
                                  <View style={styles.checkIcon}>
                                    <Text style={styles.checkText}>✔</Text>
                                  </View>
                                </LinearGradient>
                              ) : (
                                <View
                                  style={[
                                    styles.cardContent,
                                    { backgroundColor: "#f2e2f4" },
                                  ]}
                                >
                                  {plan?.flatdiscount !== 0 && (
                                    <Text
                                      style={[
                                        styles.discountText,
                                        { color: "#000" },
                                      ]}
                                    >
                                      {plan?.flatdiscount}% Off
                                    </Text>
                                  )}
                                  <Text
                                    style={[
                                      styles.monthText,
                                      { color: "#000" },
                                    ]}
                                  >
                                    {plan?.name?.replace(" MONTH", "")}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.monthLabel,
                                      { color: "#000" },
                                    ]}
                                  >
                                    Months
                                  </Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          </View>
                        );
                      })
                    : null}
                </ScrollView>
              </View>
              <View style={styles.unlockView}>
                <Text style={styles.unlockText}>
                  {Strings.unlockPremiumFeature}
                </Text>
              </View>
              <View>
                {selectedCard?.details && (
                  <View style={{ marginBottom: moderateScale(5) }}>
                    {selectedCard?.details?.map((item) => (
                      <View style={styles.listItem}>
                        {/* Bullet Point */}
                        <View style={styles.bullet}>
                          <Text style={styles.bulletText}>{"\u2022"}</Text>
                        </View>
                        {/* List Text */}
                        <Text style={styles.listText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <View>
                {subscriptionDetails?.amount && selectedCard?.flatdiscount ? (
                  <View style={styles.subscriptionView}>
                    <Text style={styles.subscriptionText}>
                      {Strings.subscriptionCost}:{" "}
                      <Text
                        style={{
                          fontFamily: "Inter-Medium",
                          color: "#000",
                          fontSize: moderateScale(14),
                          textDecorationLine: "line-through",
                        }}
                      >
                        ₹ {selectedCard?.amount}
                      </Text>{" "}
                      <Text
                        style={[
                          styles.subscriptionCost,
                          { color: THEMES.colors.bottomBarGreen },
                        ]}
                      >
                        ₹ {""}
                        {promocodeDetails?.discount
                          ? `${calcuateTotal(
                              `${selectedCard?.amount}`,
                              `${selectedCard?.flatdiscount}`,
                              `${promocodeDetails?.discount}`
                            )}`
                          : `${calculateDiscount(
                              `${selectedCard?.amount}`,
                              `${selectedCard?.flatdiscount}`
                            )}`}
                        {/* { +
                     calculateDiscount(
                       `${selectedCard?.amount}`,
                       `${selectedCard?.flatdiscount}`
                     )} */}
                      </Text>
                    </Text>
                  </View>
                ) : null}
                {!userAlreadySubscribed ? (
                  <View
                    style={{
                      paddingTop: moderateScale(20),
                      marginHorizontal: moderateScale(50),
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      onPress={togglePromoCodeModal}
                      style={styles.viewBreakupText}
                    >
                      {promocodeDetails ? "View Promocode" : "Apply Promocode"}
                    </Text>
                    <Text onPress={toggleModal} style={styles.viewBreakupText}>
                      {Strings.viewBreakup}
                    </Text>
                  </View>
                ) : (
                  <Text onPress={toggleModal} style={styles.viewBreakupText}>
                    {Strings.viewBreakup}
                  </Text>
                )}
              </View>
            </ScrollView>
            {!userAlreadySubscribed && (
              <View style={[styles.btnView, { paddingTop: moderateScale(30) }]}>
                <TouchableButtonWithPermission
                  customMsgForRegistration={
                    "Registered and Subscribed to enjoy all the exciting features of ADA app."
                  }
                  useButton={true}
                  onPress={handlePayment}
                  title={Strings.payNow}
                  checkPermission={checkStatus()}
                />
              </View>
            )}
            <Modal
              onBackButtonPress={toggleModal}
              isVisible={isModalVisible}
              onBackdropPress={toggleModal}
              style={styles.modal}
              swipeDirection="down"
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{Strings.viewBreakup}</Text>
                <View style={styles.modalSubscription}>
                  <Text style={styles.modalSubscriptionCost}>
                    {Strings.subscriptionCost}:
                  </Text>
                  <Text numberOfLines={1} style={styles.subscriptionPrice}>
                    {"₹ " + selectedCard?.amount}
                  </Text>
                </View>
                <View style={styles.TaxView}>
                  <Text style={styles.TaxText}>
                    Discount ({selectedCard?.flatdiscount + "%"}):
                  </Text>
                  <Text numberOfLines={1} style={styles.TaxPrice}>
                    -{" "}
                    {"₹ " +
                      calculatePercentage(
                        selectedCard?.amount,
                        selectedCard?.flatdiscount
                      )}
                  </Text>
                </View>

                <View style={styles.TaxView}>
                  <Text style={styles.TaxText}>Tax:</Text>
                  <Text numberOfLines={1} style={styles.TaxPrice}>
                    {"₹ " +
                      calculateTax(
                        calculateDiscount(
                          `${selectedCard?.amount}`,
                          `${selectedCard?.flatdiscount}`
                        ),
                        selectedCard?.tax
                      )}
                  </Text>
                </View>

                {promocode && (
                  <View style={styles.TaxView}>
                    <Text style={styles.TaxText}>
                      Promo code: ({promocodeDetails?.discount + "%"})
                    </Text>
                    <Text numberOfLines={1} style={styles.TaxPrice}>
                      -{" "}
                      {"₹ " +
                        calculatePercentage(
                          selectedCard?.amount,
                          promocodeDetails?.discount
                        )}
                    </Text>
                  </View>
                )}

                <View
                  style={[styles.dottedLine, { marginTop: moderateScale(21) }]}
                />

                <View style={styles.totalRow}>
                  <Text style={styles.totalText}>{Strings.total}:</Text>
                  <Text numberOfLines={1} style={styles.totalPrice}>
                    {promocodeDetails?.discount
                      ? `${calcuateTotal(
                          `${selectedCard?.amount}`,
                          `${selectedCard?.flatdiscount}`,
                          `${promocodeDetails?.discount}`
                        )}`
                      : `${calculateDiscount(
                          `${selectedCard?.amount}`,
                          `${selectedCard?.flatdiscount}`
                        )}`}
                  </Text>
                </View>
                <View
                  style={[styles.dottedLine, { marginTop: moderateScale(14) }]}
                />
              </View>
            </Modal>

            <Modal
              isVisible={promocodeModal}
              onBackdropPress={togglePromoCodeModal}
              style={styles.modal}
              onBackButtonPress={togglePromoCodeModal}
              swipeDirection="down"
            >
              <View style={styles.modalContent}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.modalTitle}>Subscription cost</Text>
                  <Text style={styles.modalTitle}>
                    {"₹ " +
                      calculateDiscount(
                        `${selectedCard?.amount}`,
                        `${selectedCard?.flatdiscount}`
                      )}
                  </Text>
                </View>
                <View style={{ paddingTop: moderateScale(20) }}>
                  <InputField
                    label={"Promo code"}
                    placeholderText={"Enter promo code"}
                    value={promocode}
                    maxLength={20}
                    onChange={(text) => {
                      setPromoCode(text);
                      setValidation("");
                    }}
                    rightIcon={successPromocode && <CheckCircle />}
                  />
                  {validation && (
                    <Text
                      style={{
                        color: "red",
                        fontSize: moderateScale(12),
                        paddingTop: 5,
                        paddingHorizontal: 5,
                      }}
                    >
                      {validation}
                    </Text>
                  )}
                  {successPromocode && (
                    <Text
                      style={{
                        color: THEMES.colors.green,
                        fontSize: moderateScale(12),
                        paddingTop: 5,
                        paddingHorizontal: 5,
                      }}
                    >
                      {successPromocode}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    alignSelf: "center",
                  }}
                >
                  {promocodeDetails ? (
                    <Button
                      title="Remove Promo code"
                      onPress={handleRemovePromoCode}
                    ></Button>
                  ) : (
                    <Button
                      title="Apply"
                      onPress={handlePromoCodeSubmit}
                    ></Button>
                  )}
                </View>
              </View>
            </Modal>

            {subscriptionModal && (
              <SubscriptionSuccess
                isVisible={subscriptionModal}
                onClose={handleSubscriptionSuccess}
                type={month}
              />
            )}

            {errorModal && (
              <SubscriptionError
                isVisible={errorModal}
                onClose={handleSubscriptionError}
                type={month}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
  },
  paymentDetailsView: {
    paddingTop: moderateScale(32),
  },
  paymentDetailsBtn: {
    backgroundColor: THEMES.colors.white,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(12),
    shadowColor: THEMES.colors.mercury,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: THEMES.colors.mercury,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentDetailsText: {
    fontFamily: THEMES.fontFamily.bold,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font12,
  },
  listItem: {
    flexDirection: "row", // Align items in a row
    alignItems: "flex-start", // Align bullet and text from top
    paddingTop: moderateScale(10),
  },
  bullet: {
    width: moderateScale(12), // Fixed width for the bullet point
    justifyContent: "center", // Center the bullet vertically
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
    justifyContent: "flex-end",
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
    width: "100%", // Adjust the width as needed
    height: 1,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: THEMES.colors.black, // Change the color as needed
    borderStyle: Platform.OS == "android" ? "dotted" : "",
    borderBottomWidth: Platform.OS == "android" ? 1 : 0.3,
    borderBottomColor: THEMES.colors.darkGrey,
  },
  joinTheFunText: {
    fontFamily: THEMES.fontFamily.bold,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    textAlign: "center",
    paddingTop: moderateScale(30),
  },
  gradientRow: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: moderateScale(20),
    marginTop: moderateScale(27),
    justifyContent: "space-between",
    alignItems: "center",
  },
  gradientView: {
    borderRadius: moderateScale(9),
    shadowColor: THEMES.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
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
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font24,
    color: THEMES.colors.white,
  },
  tickIcon: {
    paddingTop: moderateScale(5),
    paddingBottom: moderateScale(13),
  },
  deSelectGradient: {
    borderRadius: moderateScale(9),
    shadowColor: THEMES.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: THEMES.colors.purple,
    alignItems: "center",
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
    alignItems: "center",
    paddingTop: moderateScale(7),
  },
  subscriptionView: {
    paddingTop: moderateScale(11),
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  subscriptionText: {
    textAlign: "center",
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
  },
  subscriptionCost: {
    textAlign: "center",
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
  },
  viewBreakupText: {
    textAlign: "center",
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.cyan,
    fontFamily: THEMES.fontFamily.medium,
    textDecorationLine: "underline",
    paddingTop: moderateScale(10),
  },
  btnView: {
    paddingVertical: moderateScale(10),
  },
  modalTitle: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.bold,
    color: THEMES.colors.black,
  },
  modalSubscription: {
    flexDirection: "row",
    paddingTop: moderateScale(44),
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalSubscriptionCost: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: "45%",
  },
  subscriptionPrice: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: "45%",
    textAlign: "right",
  },
  TaxView: {
    flexDirection: "row",
    paddingTop: moderateScale(10),
    alignItems: "center",
    justifyContent: "space-between",
  },
  TaxText: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: "45%",
  },
  TaxPrice: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: "45%",
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    paddingTop: moderateScale(14),
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalText: {
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: "45%",
  },
  totalPrice: {
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    width: "45%",
    textAlign: "right",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: moderateScale(20),
    backgroundColor: THEMES.colors.bgColor,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,

    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  checkIcon: {
    marginTop: moderateScale(8),
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PaymentsSubscription;
