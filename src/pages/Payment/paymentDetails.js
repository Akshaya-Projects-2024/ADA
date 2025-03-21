import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  Platform,
  Linking,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Strings from "../../constants/strings";
import { moderateScale } from "react-native-size-matters";
import Download from "../../assets/svg/download.svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { contextValue } from "../../components/Loader";
import {
  getInvoiceApi,
  getSubscriptionDetailsApi,
} from "../../redux-store/actions/payment";
import { useSelector } from "react-redux";
import { decryptService } from "../../utils/storageFunc";
import moment from "moment";
import RNFS from "react-native-fs";
import Dialog from "../../components/Dialog";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";

const PaymentDetails = () => {
  const [paymentDetailsData, setPaymentDetailsData] = useState([]);
  const { loggedInModule } = useSelector((state) => state?.register);
  const [successDownload, setSuccessDownload] = useState(false);

  useEffect(() => {
    getSubscriptionDetails();
  }, []);

  const getSubscriptionDetails = async () => {
    try {
      contextValue?.setLoader(true);
      const obj = {
        userId: await decryptService("userId"),
        usertype: loggedInModule,
      };
      let res = await getSubscriptionDetailsApi(obj);
      if (res?.length !== 0) {
        setPaymentDetailsData(res);
      } else {
        setPaymentDetailsData([]);
      }
      contextValue?.setLoader(false);
    } catch (error) {
      console.log("err11", error);
      contextValue?.setLoader(false);
    }
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === "android") {
        const permission =
          Platform.Version >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        const result = await check(permission);
        if (result === RESULTS.GRANTED) {
          return true;
        } else {
          const requestResult = await request(permission);
          return requestResult === RESULTS.GRANTED;
        }
      }
      return true;
    } catch (error) {
      console.error("Permission error:", error);
      return false;
    }
  };

  const downloadPDF = async (base64PDF, id) => {
    try {
      const hasPermission = await requestStoragePermission();
      console.log("has", hasPermission);
      if (hasPermission) {
        const path = `${RNFS.DownloadDirectoryPath}/${id}.pdf`;
        await RNFS.writeFile(path, base64PDF, "base64");
        setSuccessDownload(true);
      } else {
        Linking.openSettings();
      }
      contextValue.setLoader(false);
    } catch (error) {
      setSuccessDownload(false);
      contextValue.setLoader(false);
      console.log("Download Error:", error);
    }
  };

  const getInvoice = async (id) => {
    try {
      contextValue.setLoader(true);
      const obj = {
        userId: await decryptService("userId"),
        usertype: loggedInModule,
        invoicetype: "subscription",
        id: id,
      };
      let res = await getInvoiceApi(obj);
      if (res?.status_code == 200) {
        downloadPDF(res?.data, id);
      } else {
        contextValue.setLoader(false);
      }
    } catch (error) {
      contextValue.setLoader(false);
    }
  };

  const renderItem = ({ item, index }) => {
    const paymentItem = item?.paymentdetails;
    const subscriptionItem = item?.subscription;
    console.log("ss", paymentItem, subscriptionItem);
    return (
      <View style={styles.mainView}>
        <View style={styles.row}>
          <View style={styles.w80}>
            <Text numberOfLines={2} style={styles.transactionText}>
              {Strings.transactionId}: {paymentItem?.paymentid}
            </Text>
            <Text style={styles.dateText}>
              {moment(subscriptionItem?.startdate).format("DD MMM YYYY h:mm A")}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => getInvoice(subscriptionItem?.id)}
            style={styles.downloadIcon}
          >
            <Download />
          </TouchableOpacity>
        </View>

        <View style={styles.secondRow}>
          <View>
            <Text style={styles.amountValue}>
              ₹ {subscriptionItem?.finalamt}
            </Text>
            <Text style={styles.amountKey}>{Strings.amount}</Text>
          </View>
          <View style={{ marginLeft: moderateScale(32) }}>
            <Text style={styles.upikey}>{paymentItem?.method}</Text>
            <Text style={styles.paymentMode}>{Strings.paymentMode}</Text>
          </View>
        </View>
        <View style={styles.secondRow}>
          <View>
            <Text style={styles.amountValue}>
              {subscriptionItem?.subscriptioncode}
            </Text>
            <Text style={styles.amountKey}>Subscription</Text>
          </View>
          <View style={{ marginLeft: moderateScale(32) }}>
            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.bold,
                fontSize: THEMES.fonts.font12,
              }}
            >
              {subscriptionItem?.promocode}
            </Text>
            <Text style={styles.paymentMode}>Promo code</Text>
          </View>
        </View>

        <View style={{ paddingTop: moderateScale(16) }}>
          <Text style={styles.subscribeDate}>
            {moment(subscriptionItem?.startdate).format("DD MMM YYYY")} to{" "}
            {moment(subscriptionItem?.enddate).format("DD MMM YYYY")}
          </Text>
          <Text style={styles.subscribeText}>{Strings.subscriptionPeriod}</Text>
        </View>
      </View>
    );
  };

  const EmptyContentView = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: "#000",
            fontSize: moderateScale(16),
            fontWeight: 500,
          }}
        >
          Oops! No information available.
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={Strings.paymentDetails}
          showBack
          bgColor="transparent"
          fontColor={THEMES.colors.black}
        />
        <View style={styles.content}>
          {paymentDetailsData?.length ? (
            <View style={styles.flatlistView}>
              <FlatList
                data={paymentDetailsData}
                showsVerticalScrollIndicator={false}
                bounces={false}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </View>
          ) : (
            EmptyContentView()
          )}
        </View>
      </View>
      <Dialog
        flag={successDownload}
        title={"Download Complete "}
        description={
          "Your invoice has been successfully downloaded. You can find it in your Downloads folder."
        }
        rightButtonText="Close"
        rightButtonPressed={() => {
          setSuccessDownload(false);
        }}
        onClose={() => {
          setSuccessDownload(false);
        }}
      />
    </SafeAreaView>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    marginBottom: moderateScale(20),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  w80: {
    width: "90%",
  },
  transactionText: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font12,
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
    flexDirection: "row",
    paddingTop: moderateScale(15),
    alignItems: "center",
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
    textTransform: "capitalize",
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
