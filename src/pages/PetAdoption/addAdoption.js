import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Checked from "../../assets/svg/checked.svg";
import UnChecked from "../../assets/svg/unchecked.svg";

import { moderateScale } from "react-native-size-matters";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import Modal from "react-native-modal";
import UploadImageModal from "../../components/UploadImageModal";
import CrossCircle from "../../assets/svg/crossCircle.svg";
import Strings from "../../constants/strings";
import Calendars from "../../assets/svg/calendar.svg";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import ModalDropdown from "../../components/ModalDropdown";
import CheckBox from "react-native-check-box";
import Location from "../../assets/svg/location.svg";
import { useSelector } from "react-redux";
import { CATEGORIES } from "../../constants/mockData";
import { showToast } from "../../utils/utils";
import { decryptService } from "../../utils/storageFunc";
import {
  addAdoption,
  deleteDocument,
  uploadDocument,
} from "../../redux-store/actions/auth";
import { getAdoptionCategory } from "../../redux-store/actions/commonApis";
import { contextValue } from "../../components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";
import Share from "react-native-share";
import {
  isValidName,
  isValidNumber,
  validateInput,
  validatePetAge,
} from "../../utils/validation";

const AddAdoption = (props) => {
  const { navigation } = props;
  const [breed, setBreed] = useState();
  const [age, setAge] = useState();
  const [location, setLocation] = useState();
  const [reason, setReason] = useState();
  const [medicalCondition, setMedicalCondition] = useState();
  const [name, setName] = useState();
  const [contactNumber, setContactNumber] = useState();
  const [selectedGender, setSelectedGender] = useState(null);
  const [petImage, setPetImage] = useState([]);
  const [petImagesVisible, setPetImageVisible] = useState(false);
  const [isDateVisible, setDateVisibility] = useState(false);
  const [date, selectedDate] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [facebook, setFacebook] = useState();
  const [instagram, setInstagram] = useState();
  const [whatsup, setWhatsup] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [petData, setPetData] = useState([]);
  const [breedList, setBreedList] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState([]);
  const [agree, setAgree] = useState();
  const [weight, setWeight] = useState();
  const [description, setDescription] = useState();
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    let obj = {
      category: "",
    };
    const data = await getAdoptionCategory(obj);
    setPetData(data);
    const result = data.map((item, index) => ({
      id: index,
      label: item.category,
    }));
    if (result?.length) {
      setCategoryList(result);
    }
  };

  const hideDatePickerCancel = () => {
    setDateVisibility(false);
  };

  const handleDateConfirm = (date) => {
    const formattedDate = moment(date).format("DD/MM/YYYY");
    selectedDate(formattedDate);
    hideDatePickerCancel();
  };

  const handleSelection = (platform, isChecked) => {
    if (isChecked) {
      setSelectedPlatforms((prev) => [...prev, platform]); // Add to array
    } else {
      setSelectedPlatforms((prev) => prev.filter((p) => p !== platform)); // Remove from array
    }
  };

  const handlePetImg = async (image) => {
    const extension = image?.uri?.split(".").pop();
    const userId = await decryptService("userId");
    let payload = {
      userid: userId,
      documenttype: "photo",
      extention: extension,
      document: image?.fileData,
    };
    apiCall(payload, "photo", image);
  };

  const getBase64Obj = (url) => {
    if (url) {
      return {
        uri: url.includes("https") ? url : `data:image/jpg;base64,${url}`,
      };
    }
  };
  const apiCall = async (postData, type, item) => {
    try {
      const res = await uploadDocument(postData);
      if (res?.status === 200) {
        const data = [...petImage];
        data.push({ ...item, id: res?.data?.data?.reqId });
        setPetImage(data);
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const shareImageBase64 = async (image, platforms = []) => {
    try {
      for (const platform of platforms) {
        if (platform == "FACEBOOK") {
          const shareData = {
            title: "Share on Facebook",
            message: "Check out this image!",
            url: `data:image/jpeg;base64,${image}`, // Base64 encoded image
          };
          await Share.open(shareData);
        }

        if (platform == "INSTAGRAM") {
          const shareData = {
            title: "Share on instagram",
            message: "Check out this image!",
            url: `data:image/jpeg;base64,${image}`, // Base64 encoded image
          };
          await Share.open(shareData);
        }

        if (platform == "WHATSUP") {
          const shareData = {
            title: "Share on instagram",
            message: "Check out this image!",
            url: `data:image/jpeg;base64,${image}`, // Base64 encoded image
            social: Share.Social.WHATSAPP,
          };
          await Share.open(shareData);
        }
      }
    } catch (error) {
      console.log("Error sharing image:", error);
    }
  };

  const onSubmitPressed = async () => {
    try {
      if (!selectedCategory) {
        showToast("error", "Please select category");
      } else if (!selectedBreed) {
        showToast("error", "Please select breed");
      } else if (!age) {
        showToast("error", "Please enter age");
      } else if (validatePetAge(age) == "invalid") {
        showToast("error", "Please enter valid age");
      } else if (!weight) {
        showToast("error", "Please enter weight");
      } else if (!isValidNumber(weight)) {
        showToast("error", "Please enter valid weight");
      } else if (!location) {
        showToast("error", "Please enter location");
      } else if (!description) {
        showToast("error", "Please enter description");
      } else if (!reason) {
        showToast("error", "Please enter Reason");
      } else if (!medicalCondition) {
        showToast("error", "Please enter medical condition");
      } else if (!name) {
        showToast("error", "Please enter pet name");
      } else if (!isValidName(name)) {
        showToast("error", "Please enter valid pet name");
      } else if (!selectedGender) {
        showToast("error", "Please select gender");
      } else if (!petImage?.length) {
        showToast("error", "Please add pet images");
      } else if (!contactNumber) {
        showToast("error", "Please enter contact Number");
      } else if (validateInput(contactNumber) == "invalid") {
        showToast("error", "Please enter valid contact number");
      } else if (!agree) {
        showToast("error", "Please select terms and conditions");
      } else {
        contextValue?.setLoader(true);
        const userId = await decryptService("userId");
        const params = {
          category: selectedCategory[0]?.label,
          breed: selectedBreed[0]?.label,
          age: Number(age),
          location: location,
          reason: reason,
          medicalcondition: medicalCondition,
          name: name,
          gender: selectedGender,
          documentid: petImage.map((item) => item.id).join(","), //TODO
          contactnumber: contactNumber,
          createdby: userId,
          weight: weight,
          description: description,
        };
        const response = await addAdoption(params);

        if (response?.status === 200) {
          if (selectedPlatforms) {
            await shareImageBase64(response?.data?.data, selectedPlatforms);
          }
          showToast("success", "Data Added Successfully");
          navigation.goBack();
        }
        contextValue?.setLoader(false);
      }
    } catch (error) {
      console.log("er", error);
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const onCancel = async (doc) => {
    try {
      const userId = await decryptService("userId");
      const postData = {
        userid: userId,
        id: doc?.id,
      };
      const res = await deleteDocument(postData);
      if (res?.status === 200) {
        const removeItemById = petImage?.filter((it) => it?.id !== doc?.id);
        setPetImage(removeItemById);
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const renderItem = (item) => {
    const photoItem = item?.item.fileData;
    return (
      <View style={styles.imgContent}>
        <Image
          style={styles.img}
          resizeMode="contain"
          source={getBase64Obj(photoItem)}
        />
        <TouchableOpacity
          onPress={() => {
            onCancel(item?.item);
          }}
          style={styles.crossView}
        >
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };
  // const renderItem = (item, index) => {
  //   const photo = item?.item.fileData;
  //   return (
  //     <View style={styles.imgContent}>
  //       <Image
  //         style={styles.img}
  //         resizeMode="contain"
  //         source={getBase64Obj(photo)}
  //       />
  //       <TouchableOpacity
  //         onPress={() => {
  //           const removeItemById = petImage.filter(
  //             (item) => item?.fileData !== photo
  //           );
  //           setPetImage(removeItemById);
  //         }}
  //         style={styles.crossView}
  //       >
  //         <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  const handleSelectedCategory = (value) => {
    setSelectedCategory(value);
    setSelectedBreed([]);
    const selectedData = petData.find(
      (item) => item.category == value?.[0]?.label
    );
    const result = selectedData?.breeds?.map((item, index) => ({
      id: index,
      label: item,
    }));
    setBreedList(result ? result : []);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: THEMES.colors.white }}>
        <StatusBar backgroundColor={THEMES.colors.white} />
        <Header title="Add Pet Adoption" fontColor="#ed65a5" showBack />
        <ScrollView style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
          <View
            style={{
              flex: 1,
              backgroundColor: THEMES.colors.bgColor,
              marginBottom: moderateScale(24),
            }}
          >
            <View style={{ paddingTop: moderateScale(24) }}>
              <ModalDropdown
                placeholder="Category*"
                data={categoryList}
                title={"Select category"}
                setSelectedValue={(value) => handleSelectedCategory(value)}
                selectedValue={selectedCategory}
                multiSelect={false}
              />
            </View>
            <View
              style={{
                paddingTop: moderateScale(16),
              }}
            >
              <ModalDropdown
                placeholder="Breed*"
                data={breedList}
                title={"Select breed"}
                setSelectedValue={setSelectedBreed}
                selectedValue={selectedBreed}
                multiSelect={false}
                customMsg="Please select category first"
              />
            </View>

            <View
              style={{
                paddingTop: moderateScale(16),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <InputField
                label={"Age*"}
                placeholderText={"Enter age"}
                value={age}
                onChange={setAge}
                maxLength={2}
                keyboardType="phone-pad"
              />
            </View>
            <View
              style={{
                paddingTop: moderateScale(16),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <InputField
                label={"Weight*"}
                placeholderText={"Enter weight"}
                value={weight}
                onChange={setWeight}
                maxLength={2}
                keyboardType="phone-pad"
              />
            </View>
            <View
              style={{
                paddingTop: moderateScale(16),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <InputField
                label={"Location*"}
                placeholderText={"Enter location"}
                rightIcon={<Location stroke={THEMES.colors.darkGrey} />}
                value={location}
                onChange={setLocation}
              />
            </View>
            <View
              style={{
                paddingTop: moderateScale(16),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <InputField
                label={"About pet*"}
                placeholderText={"Enter description about the pet"}
                multiline={true}
                value={description}
                onChange={setDescription}
              />
            </View>
            <View
              style={{
                paddingTop: moderateScale(16),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <InputField
                label={"Reason For Adoption*"}
                placeholderText={"Enter reason"}
                multiline={true}
                value={reason}
                onChange={setReason}
              />
            </View>
            <View
              style={{
                paddingTop: moderateScale(16),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <InputField
                label={"Medical Condition*"}
                placeholderText={"Enter conditions"}
                multiline={true}
                value={medicalCondition}
                onChange={setMedicalCondition}
              />
            </View>
            <View
              style={{
                paddingTop: moderateScale(16),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <InputField
                label={"Pet Name*"}
                placeholderText={"Enter pet name"}
                value={name}
                onChange={setName}
              />
            </View>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor:
                      selectedGender === "Male"
                        ? THEMES.colors.cyan
                        : THEMES.colors.white,
                  },
                ]}
                onPress={() => setSelectedGender("Male")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    {
                      color:
                        selectedGender === "Male"
                          ? THEMES.colors.white
                          : THEMES.colors.cyan,
                    },
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor:
                      selectedGender === "Female"
                        ? THEMES.colors.cyan
                        : THEMES.colors.white,
                  },
                ]}
                onPress={() => setSelectedGender("Female")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    {
                      color:
                        selectedGender === "Female"
                          ? THEMES.colors.white
                          : THEMES.colors.cyan,
                    },
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                paddingHorizontal: moderateScale(20),
                paddingTop: moderateScale(24),
              }}
            >
              <View style={styles.secondaryFlex}>
                <Text style={styles.titleText}>Photo of the pet*</Text>
                <TouchableOpacity
                  disabled={petImage?.length == 1 ? true : false}
                  onPress={() => setPetImageVisible(true)}
                >
                  <Text
                    style={[
                      styles.addText,
                      {
                        color:
                          petImage?.length == 1
                            ? "#d0d0d0"
                            : THEMES.colors.cyan,
                      },
                    ]}
                  >
                    {Strings.add}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.flatlistView,
                  {
                    alignItems: petImage?.length == 0 ? "center" : "flex-start",
                  },
                ]}
              >
                <FlatList
                  horizontal={true}
                  contentContainerStyle={{
                    justifyContent: petImage?.length ? "flex-start" : "center",
                    alignItems: "center",
                    padding: petImage?.length
                      ? moderateScale(0)
                      : moderateScale(16),
                    borderColor: THEMES.colors.darkGrey,
                    borderRadius: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  data={petImage}
                  renderItem={renderItem}
                  ListHeaderComponent={() =>
                    petImage?.length == 0 ? (
                      <Text style={styles.imgPlaceholder}>
                        {Strings.pleaseAddImg}
                      </Text>
                    ) : null
                  }
                />
              </View>
            </View>

            <View
              style={{
                paddingTop: moderateScale(24),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.semiBold,
                  color: THEMES.colors.darkGrey,
                  fontSize: THEMES.fonts.font12,
                }}
              >
                Do you want to share this alert on Facebook with details to
                reach out common people
              </Text>

              <View style={styles.contentValueView}>
                <CheckBox
                  checkedImage={<Checked />}
                  unCheckedImage={<UnChecked />}
                  onClick={() => {
                    setFacebook(!facebook);
                    handleSelection("FACEBOOK", !facebook);
                  }}
                  isChecked={facebook}
                  style={{ flex: 1 }}
                  rightTextStyle={{
                    color: THEMES.colors.black,
                    fontSize: THEMES.fonts.font12,
                    fontFamily: THEMES.fontFamily.medium,
                  }}
                  rightText={"Facebook"}
                />
                <CheckBox
                  checkedImage={<Checked />}
                  unCheckedImage={<UnChecked />}
                  onClick={() => {
                    setInstagram(!instagram);
                    handleSelection("INSTAGRAM", !instagram);
                  }}
                  isChecked={instagram}
                  style={{ flex: 1 }}
                  rightText={"Instagram"}
                  rightTextStyle={{
                    color: THEMES.colors.black,
                    fontSize: THEMES.fonts.font12,
                    fontFamily: THEMES.fontFamily.medium,
                  }}
                />
                <CheckBox
                  checkedImage={<Checked />}
                  unCheckedImage={<UnChecked />}
                  onClick={() => {
                    setWhatsup(!instagram);
                    handleSelection("WHATSUP", !whatsup);
                  }}
                  isChecked={whatsup}
                  style={{ flex: 1 }}
                  rightText={"Whatsup"}
                  rightTextStyle={{
                    color: THEMES.colors.black,
                    fontSize: THEMES.fonts.font12,
                    fontFamily: THEMES.fontFamily.medium,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                paddingTop: moderateScale(24),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <InputField
                label={"Contact number*"}
                placeholderText={"Enter contact number"}
                value={contactNumber}
                onChange={setContactNumber}
                maxLength={10}
                keyboardType="phone-pad"
              />

              <View
                style={{
                  paddingTop: moderateScale(24),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckBox
                  checkedImage={<Checked />}
                  unCheckedImage={<UnChecked />}
                  onClick={() => setAgree(!agree)}
                  isChecked={agree}
                  style={{ flex: 1 }}
                  rightText={"Agree terms and conditions"}
                  rightTextStyle={{
                    color: THEMES.colors.black,
                    fontSize: THEMES.fonts.font12,
                    fontFamily: THEMES.fontFamily.medium,
                  }}
                />
              </View>

              <View
                style={{
                  paddingTop: moderateScale(30),
                }}
              >
                <Button onPress={onSubmitPressed} title="Submit" />
              </View>
            </View>
          </View>
        </ScrollView>

        <UploadImageModal
          isVisible={petImagesVisible}
          onClose={() => setPetImageVisible(false)}
          handleSelectedImage={(image) => handlePetImg(image)}
        />
        <DateTimePicker
          isVisible={isDateVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePickerCancel}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: moderateScale(15),
    paddingTop: moderateScale(24),
  },
  toggleButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 10,
    width: "45%",
    alignItems: "center",
    borderColor: THEMES.colors.cyan,
    borderBottomLeftRadius: 0,
  },
  toggleText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.cyan,
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
  secondaryFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
  },
  addText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
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
  dateContainer: {
    borderWidth: 1,
    borderColor: "#CFD3D4",
    borderRadius: 8,
    borderEndStartRadius: 0,
    alignItems: "center ",
    justifyContent: "space-between",
    paddingVertical: moderateScale(10),
    backgroundColor: "#fff",
  },
  dateValue: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  datePlaceholderText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  contentValueView: {
    paddingTop: moderateScale(20),
    flexDirection: "row",
    alignItems: "center",
  },
  loadingView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingBox: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "transparent",
    borderRadius: 10,
    backgroundColor: THEMES.colors.cyan,
    borderWidth: 1,
  },
});

export default AddAdoption;
