import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import CrossCircle from "../../assets/svg/crossCircle.svg";
import { moderateScale, s } from "react-native-size-matters";
import UploadImageModal from "../../components/UploadImageModal";
import Strings from "../../utils/strings";
import Button from "../../components/Button";
import Stepper from "../../components/Stepper";

const UploadImagesDocs = (props) => {
  const route = props?.route?.params?.route;
  const [visible, setVisible] = useState(false);
  const [photo, setPhoto] = useState();
  const [businessImg, setBusinessImg] = useState([]);
  const [businessVisible, setBusinessVisible] = useState(false);
  const [documentImg, setDocumentImg] = useState([]);
  const [documentVisible, setDocumentVisible] = useState(false);



  const getBase64Obj = (url) => {
    if (url) {
      return {
        uri: url.includes("https") ? url : `data:image/jpg;base64,${url}`,
      };
    }
  };

  const handleBusinessImg = (image) => {
    var temp = [...businessImg];
    temp.push(image);
    setBusinessImg(temp);
  };

  const handleDocumentImg = (image) => {
    var data = [...documentImg];
    data.push(image);
    setDocumentImg(data);
  };

  const renderItem = (item, index) => {
    const photo = item?.item.fileData;
    return (
      <View style={styles.imgContent}>
        <Image
          style={styles.img}
          resizeMode="contain"
          source={getBase64Obj(photo)}
        />
        <TouchableOpacity
          onPress={() => {
            const removeItemById = businessImg.filter(
              (item) => item?.fileData !== photo
            );
            setBusinessImg(removeItemById);
          }}
          style={styles.crossView}
        >
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDocumentItem = (item, index) => {
    const photo = item?.item.fileData;
    return (
      <View style={styles.imgContent}>
        <Image
          style={styles.img}
          resizeMode="contain"
          source={getBase64Obj(photo)}
        />
        <TouchableOpacity
          onPress={() => {
            const removeItemById = businessImg.filter(
              (item) => item?.fileData !== photo
            );
            setDocumentImg(removeItemById);
          }}
          style={styles.crossView}
        >
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title={Strings.uploadImagesDoc} showBack bgColor="transparent" />
      {route !== "myprofile" && (
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#B8B8B8",
          borderBottomColor: "#B8B8B8",
          borderBottomWidth: 1,
          backgroundColor: "#fff",
        }}
      >
        <Stepper currentStep={3} totalSteps={5} />
      </View>
      )}
      <View style={{ flex: 1 }}>
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View style={[styles.padding, { paddingTop: moderateScale(route !== "myprofile" ? 18 : 30) }]}>
            <View style={styles.businessContainer}>
              <Text style={styles.businessLogoText}>
                {Strings.businessLogo}
              </Text>
              <TouchableOpacity
                disabled={photo && true}
                onPress={() => setVisible(true)}
              >
                <Text
                  style={[
                    styles.addBtnTextStyle,
                    {
                      color: photo
                        ? THEMES.colors.doveGray
                        : THEMES.colors.cyan,
                      opacity: photo ? 0.5 : 1,
                    },
                  ]}
                >
                  {Strings.add}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.logoBoxView}>
              {photo ? (
                <View style={styles.logoImgView}>
                  <Image
                    style={styles.logoImg}
                    resizeMode="contain"
                    source={getBase64Obj(photo?.filepath ?? photo?.fileData)}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setPhoto();
                    }}
                    style={styles.crossView}
                  >
                    <CrossCircle
                      stroke={THEMES.colors.black}
                      style={styles.crossImg}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptyView}>
                  <Text style={styles.emptyText}>{Strings.pleaseAddLogo}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.secondaryView}>
            <View style={styles.secondaryFlex}>
              <Text style={styles.titleText}>
                {Strings.businessPlaceImages}
              </Text>
              <TouchableOpacity onPress={() => setBusinessVisible(true)}>
                <Text style={styles.addText}>{Strings.add}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.flatlistView,
                {
                  alignItems:
                    businessImg?.length == 0 ? "center" : "flex-start",
                },
              ]}
            >
              <FlatList
                horizontal={true}
                contentContainerStyle={{
                  justifyContent: businessImg?.length ? "flex-start" : "center",
                  alignItems: "center",
                  padding: businessImg?.length
                    ? moderateScale(0)
                    : moderateScale(16),
                  borderColor: THEMES.colors.darkGrey,
                  borderRadius: 10,
                }}
                showsHorizontalScrollIndicator={false}
                data={businessImg}
                renderItem={renderItem}
                ListHeaderComponent={() =>
                  businessImg?.length == 0 ? (
                    <Text style={styles.imgPlaceholder}>
                      {Strings.pleaseAddImg}
                    </Text>
                  ) : null
                }
              />
            </View>
          </View>

          <View style={styles.certificationView}>
            <View style={styles.certificationFlex}>
              <Text style={styles.certificationText}>
                {Strings.certificationDocuments}
              </Text>
              <TouchableOpacity onPress={() => setDocumentVisible(true)}>
                <Text style={styles.addText}>{Strings.add}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.certificationList,
                {
                  alignItems:
                    documentImg?.length == 0 ? "center" : "flex-start",
                },
              ]}
            >
              <FlatList
                horizontal={true}
                contentContainerStyle={{
                  justifyContent: documentImg?.length ? "flex-start" : "center",
                  alignItems: "center",
                  padding: documentImg?.length
                    ? moderateScale(0)
                    : moderateScale(16),
                  borderColor: THEMES.colors.darkGrey,
                  borderRadius: 10,
                }}
                showsHorizontalScrollIndicator={false}
                data={documentImg}
                renderItem={renderDocumentItem}
                ListHeaderComponent={() =>
                  documentImg?.length == 0 ? (
                    <Text style={styles.imgPlaceholder}>
                      {Strings.pleaseAddImg}
                    </Text>
                  ) : null
                }
              />
            </View>
          </View>

          <UploadImageModal
            isVisible={visible}
            onClose={() => setVisible(false)}
            handleSelectedImage={(image) => setPhoto(image)}
          />

          <UploadImageModal
            isVisible={businessVisible}
            onClose={() => setBusinessVisible(false)}
            handleSelectedImage={(image) => handleBusinessImg(image)}
          />
          <UploadImageModal
            isVisible={documentVisible}
            onClose={() => setDocumentVisible(false)}
            handleSelectedImage={(image) => handleDocumentImg(image)}
          />
        </ScrollView>
      </View>
      <View style={styles.submitButton}>
        <Button
           title={route !== "myprofile" ? Strings.next : Strings.submit}
          onPress={() => props.navigation.navigate("sessionDetail")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  headerView: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(20),
  },
  headerText: {
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  submitButton: {
    marginHorizontal: moderateScale(20),
    marginBottom: moderateScale(22),
  },
  padding: {
    paddingHorizontal: moderateScale(24),
  },
  businessContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  businessLogoText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
    width: "80%",
  },
  addBtnTextStyle: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  logoBoxView: {
    marginTop: moderateScale(5),
    borderWidth: 1,
    borderColor: THEMES.colors.iron,
    borderRadius: 8,
    backgroundColor: THEMES.colors.white,
  },
  logoImgView: {
    width: 60,
    height: 60,
    borderColor: THEMES.colors.darkGrey,
    borderRadius: 10,
    margin: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEMES.colors.darkGrey,
  },
  crossView: {
    position: "absolute",
    width: 60,
    height: 60,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    left: 5,
    bottom: 5,
  },
  crossImg: {
    width: moderateScale(15),
    height: moderateScale(15),
  },
  emptyView: {
    width: "100%",
    padding: moderateScale(16),
    borderColor: THEMES.colors.darkGrey,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.medium,
  },
  secondaryView: {
    paddingTop: moderateScale(40),
    paddingHorizontal: moderateScale(24),
  },
  secondaryFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
  },
  addText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.cyan,
  },
  flatlistView: {
    marginTop: moderateScale(5),
    borderWidth: 1,
    borderColor: THEMES.colors.iron,
    borderRadius: 8,
    backgroundColor: THEMES.colors.white,
  },
  imgPlaceholder: {
    width: "100%",
    textAlign: "center",
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
  },
  certificationView: {
    paddingTop: moderateScale(40),
    paddingHorizontal: moderateScale(24),
    width: "100%",
  },
  certificationFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  certificationText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
    width: "80%",
  },
  certificationList: {
    marginTop: moderateScale(5),
    borderWidth: 1,
    borderColor: THEMES.colors.iron,
    borderRadius: 8,
    backgroundColor: THEMES.colors.white,
  },
  imgContent: {
    width: 60,
    height: 60,
    borderColor: THEMES.colors.darkGrey,
    borderRadius: 10,
    marginLeft: 16,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: moderateScale(16),
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEMES.colors.darkGrey,
  },
});

export default UploadImagesDocs;
