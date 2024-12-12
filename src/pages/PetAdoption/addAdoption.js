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
import { addAdoption } from "../../redux-store/actions/auth";

const categoryData = [
  { id: "1", label: "Training" },
  { id: "2", label: "ABC" },
  { id: "3", label: "XYZ" },
  { id: "4", label: "MNO" },
];

const AddAdoption = (props) => {
  const { navigation } = props;
  const [loading, setLoading] = useState(false);
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
  const hideDatePickerCancel = () => {
    setDateVisibility(false);
  };

  const handleDateConfirm = (date) => {
    const formattedDate = moment(date).format("DD/MM/YYYY");
    selectedDate(formattedDate);
    hideDatePickerCancel();
  };

  const handlePetImg = (image) => {
    var temp = [...petImage];
    temp.push(image);
    setPetImage(temp);
  };

  const getBase64Obj = (url) => {
    if (url) {
      return {
        uri: url.includes("https") ? url : `data:image/jpg;base64,${url}`,
      };
    }
  };

  const onSubmitPressed = async () => {
    setLoading(true);
    try {
      const userId = await decryptService("userId");
      const params = {
        category: selectedCategory?.label,
        breed: breed,
        age: Number(age),
        location: location,
        reason: reason,
        medicalcondition: medicalCondition,
        name: name,
        gender: selectedGender,
        documentid: 2, //TODO
        contactnumber: contactNumber,
        createdby: userId,
      };
      const response = await addAdoption(params);
      if (response?.status === 200) {
        showToast("success", "Data Added");
        navigation.goBack();
      }
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ initData ~ error:", error);
      setLoading(false);
      showToast("error", error?.message);
    }
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
            const removeItemById = petImage.filter(
              (item) => item?.fileData !== photo
            );
            setPetImage(removeItemById);
          }}
          style={styles.crossView}
        >
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEMES.colors.white }}>
      <StatusBar backgroundColor={THEMES.colors.white} />
      <Header title="Add Pet Adoption" fontColor="#000" showBack />

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
              data={CATEGORIES}
              title={"Select category"}
              setSelectedValue={setSelectedCategory}
              selectedValue={selectedCategory}
              multiSelect={false}
            />
          </View>
          <View
            style={{
              paddingTop: moderateScale(16),
              paddingHorizontal: moderateScale(20),
            }}
          >
            <InputField
              label={"Breed*"}
              placeholderText={"Enter Breed"}
              value={breed}
              onChange={setBreed}
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
              <Text style={styles.titleText}>Photo of the pet</Text>
              <TouchableOpacity onPress={() => setPetImageVisible(true)}>
                <Text style={styles.addText}>{Strings.add}</Text>
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
              Do you want to share this alert on Facebook with details to reach
              out common people
            </Text>

            <View style={styles.contentValueView}>
              <CheckBox
                checkedImage={<Checked />}
                unCheckedImage={<UnChecked />}
                onClick={() => setFacebook(!facebook)}
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
                onClick={() => setInstagram(!instagram)}
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
                onClick={() => setWhatsup(!whatsup)}
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
                onClick={() => setWhatsup(!whatsup)}
                isChecked={whatsup}
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
      {loading && (
        <View style={styles.loadingView}>
          <View style={styles.loadingBox}>
            <ActivityIndicator color={THEMES.colors.white} />
          </View>
        </View>
      )}
    </View>
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
