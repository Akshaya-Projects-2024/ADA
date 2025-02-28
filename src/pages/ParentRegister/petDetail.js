import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { moderateScale } from "react-native-size-matters";

import Strings from "../../constants/strings";
import Header from "../../components/Header";
import ModalDropdown from "../../components/ModalDropdown";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Stepper from "../../components/Stepper";
import Paw from "../../assets/svg/paw.svg";
import Pencil from "../../assets/svg/pencil.svg";
import UploadImageModal from "../../components/UploadImageModal";
import CrossCircle from "../../assets/svg/crossCircle.svg";
import Cross from "../../assets/svg/cross.svg";
import { THEMES } from "../../assets/theme/themes";
import { decryptService } from "../../utils/storageFunc";
import { BREEDS } from "../../constants/mockData";
import { showToast, validArray } from "../../utils/utils";
import { savePetDetails, uploadDocument } from "../../redux-store/actions/auth";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackActions } from "@react-navigation/native";
import { useUser } from "../../api/UserContext";
import ProfileDummy from "../../assets/svg/user.svg";
import { getAdoptionCategory } from "../../redux-store/actions/commonApis";
import { useDebounce } from "../../hooks/useDebounce";
import { getBase64Obj } from "../../utils/documentUtils";
import { contextValue } from "../../components/Loader";

const petType = [
  { id: "1", label: "Cat" },
  { id: "2", label: "Dog" },
];

const GENDER = { male: "Male", female: "Female" };

export const IMAGE_TYPE = { photo: "photo", certificate: "certificate" };

const PetDetail = (props) => {
  const route = props?.route?.params?.route;
  const [petImage, setPetImage] = useState([]);
  const [petImagesVisible, setPetImageVisible] = useState(false);
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petDescription, setPetDescription] = useState("");
  const [selectedPetType, setSelectedPetType] = useState(); //catgeory
  const [selectedGender, setSelectedGender] = useState(null); //gennder
  const [petTypeData, setPetTypeData] = useState();
  const [petData, setPetData] = useState();
  const [petPhotoVisible, setPetPhotoVisible] = useState();

  const [breedList, setBreedList] = useState([]);
  const [selectPetBreed, setSelectedPetBreed] = useState(); // breed

  const [medicalVisible, setMedicalVisible] = useState(false);
  const [petAllImages, setPetAllImages] = useState([]);
  const [petCertificates, setPetCertificates] = useState([]);

  const [registerModal, setRegisterModal] = useState(false);
  const { parentProfie } = useSelector((state) => state?.commonReducer);
  const { petDetails } = parentProfie;

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      contextValue?.setLoader(true)
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
        setPetTypeData(result);
      }
      contextValue?.setLoader(false) 
    } catch (error) {
      contextValue?.setLoader(false) 
    }
  
  };

  const handleSelectedCategory = (value) => {
    setSelectedPetType(value);
    setSelectedPetBreed([]);
    const selectedData = petData.find(
      (item) => item.category == value?.[0]?.label
    );
    const result = selectedData?.breeds?.map((item, index) => ({
      id: index,
      label: item,
    }));
    setBreedList(result ? result : []);
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
    setPetImage(image?.fileData);
    apiCall(payload);
  };

  const apiCall = async (postData) => {
    try {
      const res = await uploadDocument(postData);
      if (res?.status == 200) {
        showToast("success", "Successfully uploaded the image");
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const handlePetDocuments = async (image) => {
    const extension = image?.uri?.split(".").pop();
    let payload = {
      documenttype: "photo",
      extention: extension,
      document: image?.fileData,
    };
    setPetAllImages((prevImages) => [...prevImages, payload]);
  };

  const onCancel = async (type, doc) => {
    try {
      const userId = await decryptService("userId");
      const postData = {
        userid: userId,
        id: doc?.id,
      };
      const res = await deleteDocument(postData);
      if (res?.status == 200) {
        if (type === DOCUMENT_TYPES.logo) {
          setPhoto(null);
        }
        if (type === DOCUMENT_TYPES.document) {
          const removeItemById = documentImg.filter(
            (it) => it?.fileName !== doc?.fileName
          );
          setDocumentImg(removeItemById);
        }
        if (type === DOCUMENT_TYPES.image) {
          const removeItemById = businessImg.filter(
            (it) => it?.fileData !== doc?.fileData
          );
          setBusinessImg(removeItemById);
        }
        showToast("success", "Successfully deleted the image");
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const handleCertificates = async (image) => {
    const extension = image?.uri?.split(".").pop();
    let payload = {
      documenttype: "certificate",
      extention: extension,
      document: image?.fileData,
    };
    setPetCertificates((pre) => [...pre, payload]);
  };

  const onSubmit = async () => {
    console.log("img");
    if (!petImage) {
      showToast("error", "Please select pet image");
    } else if (!petName) {
      showToast("error", "Please enter pet name");
    } else if (!selectedPetType || !selectedPetType[0]?.label) {
      showToast("error", "Please select pet type");
    } else if (!selectPetBreed || !selectPetBreed[0]?.label) {
      showToast("error", "Please select pet breed");
    } else if (!petAge) {
      showToast("error", "Please enter pet age");
    } else if (!selectedGender) {
      showToast("error", "Please select pet gender");
    } else {
      try {
        contextValue?.setLoader(true)
        const userId = await decryptService("userId");
        const params = {
          userid: userId,
          name: petName,
          type: selectedPetType[0]?.label || null,
          age: Number(petAge),
          gender: selectedGender,
          about: petDescription ? petDescription : "",
          documents: [...petAllImages, ...petCertificates],
          breed: selectPetBreed[0]?.label,
          weight: petWeight,
        };
        const res = await savePetDetails(params);
        if (res?.data?.status_code == 200) {
          if (route === "parentAccount") {
            props.navigation.dispatch(StackActions.pop(1));
          } else {
            setRegisterModal(true);
          }
        } else {
          showToast("error", res?.data?.message);
        }
        contextValue?.setLoader(false)
      } catch (error) {
        contextValue?.setLoader(false)
        showToast("error", "Something went wrong!!!");
      }
    }
  };

  const onSuccess = () => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: "petParentAppStack" }],
    });
  };

  const renderItem = (item, index) => {
    const photo = item?.item.document;
    console.log("index", index);
    return (
      <View style={styles.imgContent}>
        <Image
          style={styles.img}
          resizeMode="contain"
          source={getBase64Obj(photo)}
        />
        <TouchableOpacity style={styles.crossView}>
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMedicalItem = (item) => {
    const photo = item?.item.fileData;
    return (
      <View style={styles.imgContent}>
        <Image
          style={styles.img}
          resizeMode="contain"
          source={getBase64Obj(photo)}
        />
        <TouchableOpacity>
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header title={"Pet details"} showBack bgColor="transparent" />
        {route !== "parentAccount" && (
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#B8B8B8",
              borderBottomColor: "#B8B8B8",
              borderBottomWidth: 1,
              backgroundColor: "#fff",
            }}
          >
            <Stepper currentStep={2} totalSteps={2} />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View
              style={{ alignSelf: "center", paddingTop: moderateScale(32) }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "#ddd",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {petImage?.length ? (
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: "#ddd",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    resizeMode="contain"
                    source={getBase64Obj(petImage)}
                  />
                ) : (
                  <ProfileDummy />
                )}
              </View>
              {/* Edit Icon */}
              <TouchableOpacity
                onPress={() => setPetPhotoVisible(true)}
                style={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  backgroundColor: "#00ACC1",
                  borderRadius: 20,
                  padding: 5,
                }}
              >
                <Pencil />
              </TouchableOpacity>
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
                value={petName}
                onChange={setPetName}
              />
            </View>

            <View style={{ paddingTop: moderateScale(16) }}>
              <ModalDropdown
                placeholder="Pet Type*"
                data={petTypeData}
                title={"Select Pet Type"}
                setSelectedValue={(value) => handleSelectedCategory(value)}
                selectedValue={selectedPetType}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <ModalDropdown
                placeholder="Breed*"
                data={breedList}
                title={"Select pet breed"}
                setSelectedValue={setSelectedPetBreed}
                selectedValue={selectPetBreed}
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
                value={petAge}
                onChange={setPetAge}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor:
                      selectedGender === GENDER.male
                        ? THEMES.colors.cyan
                        : THEMES.colors.white,
                  },
                ]}
                onPress={() => setSelectedGender(GENDER.male)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    {
                      color:
                        selectedGender === GENDER.male
                          ? THEMES.colors.white
                          : THEMES.colors.cyan,
                    },
                  ]}
                >
                  {GENDER.male}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor:
                      selectedGender === GENDER.female
                        ? THEMES.colors.cyan
                        : THEMES.colors.white,
                  },
                ]}
                onPress={() => setSelectedGender(GENDER.female)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    {
                      color:
                        selectedGender === GENDER.female
                          ? THEMES.colors.white
                          : THEMES.colors.cyan,
                    },
                  ]}
                >
                  {GENDER.female}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingTop: moderateScale(16),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <InputField
                label={"Weight"}
                placeholderText={"Enter weight"}
                value={petWeight}
                onChange={setPetWeight}
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
                label={"About Pet"}
                placeholderText={"Enter about Pet"}
                multiline
                value={petDescription}
                onChange={setPetDescription}
              />
            </View>
            <View
              style={{
                paddingTop: moderateScale(16),
                paddingHorizontal: moderateScale(20),
              }}
            ></View>
            <View
              style={{
                paddingHorizontal: moderateScale(20),
                marginBottom: moderateScale(30),
              }}
            >
              <View style={styles.secondaryFlex}>
                <Text style={styles.titleText}>Pet Images</Text>
                <TouchableOpacity onPress={() => setPetImageVisible(true)}>
                  <Text style={styles.addText}>{Strings.add}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.flatlistView,
                  {
                    alignItems:
                      petAllImages?.length == 0 ? "center" : "flex-start",
                  },
                ]}
              >
                <FlatList
                  horizontal={true}
                  contentContainerStyle={{
                    justifyContent: petAllImages?.length
                      ? "flex-start"
                      : "center",
                    alignItems: "center",
                    padding: petImage?.length
                      ? moderateScale(0)
                      : moderateScale(16),
                    borderColor: THEMES.colors.darkGrey,
                    borderRadius: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  data={petAllImages}
                  renderItem={renderItem}
                  ListHeaderComponent={() =>
                    petAllImages?.length == 0 ? (
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
                paddingHorizontal: moderateScale(20),
                marginBottom: moderateScale(30),
              }}
            >
              <View style={styles.secondaryFlex}>
                <Text style={styles.titleText}>Medical Documents</Text>
                <TouchableOpacity onPress={() => setMedicalVisible(true)}>
                  <Text style={styles.addText}>{Strings.add}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.flatlistView,
                  {
                    alignItems:
                      petCertificates?.length == 0 ? "center" : "flex-start",
                  },
                ]}
              >
                <FlatList
                  horizontal={true}
                  contentContainerStyle={{
                    justifyContent: petCertificates?.length
                      ? "flex-start"
                      : "center",
                    alignItems: "center",
                    padding: petImage?.length
                      ? moderateScale(0)
                      : moderateScale(16),
                    borderColor: THEMES.colors.darkGrey,
                    borderRadius: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  data={petCertificates}
                  renderItem={renderItem}
                  ListHeaderComponent={() =>
                    petCertificates?.length == 0 ? (
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
                paddingTop: moderateScale(20),
                paddingBottom: moderateScale(20),
                paddingHorizontal: moderateScale(16),
              }}
            >
              <Button title="Submit" onPress={onSubmit} />
            </View>
          </ScrollView>
        </View>
        <UploadImageModal
          isVisible={petPhotoVisible}
          onClose={() => setPetPhotoVisible(false)}
          handleSelectedImage={(image) => handlePetImg(image)}
        />

        <UploadImageModal
          isVisible={petImagesVisible}
          onClose={() => setPetImageVisible(false)}
          handleSelectedImage={(image) => handlePetDocuments(image)}
        />
        <UploadImageModal
          isVisible={medicalVisible}
          onClose={() => setMedicalVisible(false)}
          handleSelectedImage={(image) => handleCertificates(image)}
        />
        <Modal
          onBackdropPress={() => setRegisterModal(false)}
          transparent={true}
          animationType="none"
          style={{
            margin: 0,
          }}
          visible={registerModal}
          onRequestClose={() => setRegisterModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.semiBold,
                    fontSize: THEMES.fonts.font20,
                    color: THEMES.colors.black,
                    width: "75%",
                    lineHeight: moderateScale(28),
                  }}
                >
                  Registration Complete! 🎉
                </Text>
                <TouchableOpacity onPress={() => setRegisterModal(false)}>
                  <Cross />
                </TouchableOpacity>
              </View>
              <View style={{ paddingTop: moderateScale(16) }}>
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.regular,
                    fontSize: THEMES.fonts.font16,
                    color: THEMES.colors.black,
                    lineHeight: moderateScale(28),
                  }}
                >
                  Thank you for registering on ADA.
                </Text>
              </View>
              <View style={{ paddingTop: moderateScale(10) }}>
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.regular,
                    fontSize: THEMES.fonts.font16,
                    color: THEMES.colors.black,
                    lineHeight: moderateScale(28),
                  }}
                >
                  Happy exploring!
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: moderateScale(31),
                }}
              >
                <View style={{ width: "40%" }}>
                  <Button title="Close" onPress={onSuccess} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  submitButton: {
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(22),
  },
  label: {
    fontSize: 20,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: moderateScale(15),
    paddingTop: moderateScale(16),
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
  secondaryFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.medium,
    color: THEMES.colors.darkGrey,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: moderateScale(20),
  },
  modalContent: {
    margin: 0,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: moderateScale(20),
  },
});

export default PetDetail;
