import React, { useEffect, useState } from "react";
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
import Tick from "../../assets/svg/tick.svg";
import LinearGradient from "react-native-linear-gradient";
import Button from "../../components/Button";
import Modal from "react-native-modal";
import SubscriptionSuccess from "./subscriptionSuccess";
import {
  getSubscription,
  getSubscriptionPlan,
} from "../../redux-store/actions/payment";
import { decryptService } from "../../utils/storageFunc";
import { useSelector } from "react-redux";
import RazorpayCheckout from "react-native-razorpay";

const PaymentsSubscription = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [subscriptionModal, setSubscription] = useState(false);
  const [month, setMonth] = useState("12Month");
  const [selectedCard, setSelectedCard] = useState(null); // State to track selected card
  const [subscriptionData, setSubscriptionData] = useState();
  const [subscriptionDetails, setSubscriptionDetails] = useState();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    let obj = {
      userId: await decryptService("userId"),
      usertype: "provider", // parent or provider
    };
    let res = await getSubscriptionPlan(obj);
    if (res.status == 200) {
      if (res?.data?.data?.length) {
        setSubscriptionData(res?.data?.data);
        setSelectedCard(res?.data?.data[0]);
      }
    }

    let obj1 = {
      userId: await decryptService("userId"),
      usertype: "provider", // parent or provider
      subscriptioncode: res?.data?.data[0]?.code,
      promocode: "",
    };
    let res1 = await getSubscription(obj1);
    if (res1.status == 200) {
      if (res1?.data?.data) {
        setSubscriptionDetails(res1?.data?.data);
      }
    }
  };

  const handlePayment = async () => {
    var options = {
      description: "Pet Service Provider Payment",
      image: "https://i.imgur.com/3g7nmJC.png",
      currency: subscriptionDetails?.currency,
      key: "rzp_test_PECnHmfOdkRLhw", // Replace with your Razorpay Key ID
      amount: subscriptionDetails?.amount,
      name: "ADA",
      order_id: subscriptionDetails?.id, //Replace this with an order_id created using Orders API.
      prefill: {
        email: "Akshaya.chikane2018@gmail.com",
        contact: "7977276381",
        name: "Akshaya Chikane",
      },
      theme: { color: "#53a20e" },
    };
    console.log("options",options)
    // props.navigation.reset({
    //   index: 0,
    //   routes: [{ name: "home" }],
    // });
    RazorpayCheckout.open(options)
      .then((data) => {
        // Handle success
        console.log(JSON.stringify(data))
        alert(`Success: ${data}`);
      })
      .catch((error) => {
        console.log(error);
        // Handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  onCardClick = async (plan) => {
    setSelectedCard(plan);
    let obj = {
      userId: await decryptService("userId"),
      usertype: "provider", // parent or provider
      subscriptioncode: plan?.code,
      promocode: "",
    };
    let res = await getSubscription(obj);
    if (res.status == 200) {
      if (res?.data?.data) {
        setSubscriptionDetails(res1?.data?.data);
      }
    }
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
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.paymentDetailsView}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("paymentDetails")}
              style={styles.paymentDetailsBtn}
            >
              <Text style={styles.paymentDetailsText}>
                {Strings.paymentDetails}
              </Text>
              <ArrowRight />
            </TouchableOpacity>
          </View>
          <Text style={styles.joinTheFunText}>{Strings.joinTheFun}</Text>

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
              {subscriptionData?.length &&
                subscriptionData?.map((plan, index) => {
                  return (
                    <>
                      <TouchableOpacity
                        key={plan.id}
                        style={[
                          styles.card,
                          selectedCard?.id === plan?.id
                            ? { borderWidth: 0, elevation: 5 }
                            : { borderWidth: 1, borderColor: "#d3d3d3" },
                          ,
                          {
                            width: selectedCard?.id === plan?.id ? 130 : 113,
                            height: selectedCard?.id === plan?.id ? 127 : 107,
                            backgroundColor: "#f2e2f4",
                            borderColor: "#ab47bc",
                            marginRight:
                              index !== subscriptionData?.length - 1 &&
                              moderateScale(20),
                          },
                        ]}
                        onPress={() => onCardClick(plan)}
                      >
                        {selectedCard?.id === plan.id ? (
                          <LinearGradient
                            colors={["#fb427c", "#fd6da2", "#fd98a5"]}
                            style={[
                              styles.gradientBackground,
                              {
                                width:
                                  selectedCard?.id === plan?.id ? 130 : 113,
                                height:
                                  selectedCard?.id === plan?.id ? 127 : 107,
                              },
                            ]}
                          >
                            {plan.flatdiscount !== 0 && (
                              <Text style={styles.discountText}>
                                {plan.flatdiscount}% Off
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
                            {plan.flatdiscount !== 0 && (
                              <Text
                                style={[styles.discountText, { color: "#000" }]}
                              >
                                {plan.flatdiscount}% Off
                              </Text>
                            )}
                            <Text style={[styles.monthText, { color: "#000" }]}>
                              {plan?.name?.replace(" MONTH", "")}
                            </Text>
                            <Text
                              style={[styles.monthLabel, { color: "#000" }]}
                            >
                              Months
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </>
                  );
                })}
            </ScrollView>
          </View>
          <View style={styles.unlockView}>
            <Text style={styles.unlockText}>
              {Strings.unlockPremiumFeature}
            </Text>
          </View>
          <View>
            {selectedCard && (
              <>
                <View style={styles.listItem}>
                  {/* Bullet Point */}
                  <View style={styles.bullet}>
                    <Text style={styles.bulletText}>{"\u2022"}</Text>
                  </View>
                  {/* List Text */}
                  <Text style={styles.listText}>{selectedCard?.details}</Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            flex: 1,
            bottom: 0,
            alignSelf: "center",
            width: "100%",
            marginBottom: moderateScale(20),
          }}
        >
          <View style={styles.subscriptionView}>
            <Text style={styles.subscriptionText}>
              {Strings.subscriptionCost}:{" "}
              <Text style={styles.subscriptionCost}>₹500 </Text>
            </Text>
          </View>
          {/* <View style={{ paddingTop: moderateScale(7) }}>
              <Text onPress={toggleModal} style={styles.viewBreakupText}>
                {Strings.viewBreakup}
              </Text>
            </View> */}
          <View style={[styles.btnView, { paddingTop: moderateScale(20) }]}>
            <Button onPress={() => handlePayment()} title={Strings.payNow} />
          </View>
        </View>
        <Modal
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
                ₹ XXX
              </Text>
            </View>

            <View style={styles.TaxView}>
              <Text style={styles.TaxText}>{Strings.tax}:</Text>
              <Text numberOfLines={1} style={styles.TaxPrice}>
                ₹ XXX
              </Text>
            </View>
            <View
              style={[styles.dottedLine, { marginTop: moderateScale(21) }]}
            />

            <View style={styles.totalRow}>
              <Text style={styles.totalText}>{Strings.total}:</Text>
              <Text numberOfLines={1} style={styles.totalPrice}>
                ₹ XXX
              </Text>
            </View>
            <View
              style={[styles.dottedLine, { marginTop: moderateScale(14) }]}
            />
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
    paddingHorizontal: moderateScale(20),
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
    marginBottom: moderateScale(5), // Space between list items
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
