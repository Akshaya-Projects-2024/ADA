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
import Pencil from "../../assets/svg/pencil.svg";
import UploadImageModal from "../../components/UploadImageModal";
import CrossCircle from "../../assets/svg/crossCircle.svg";
import Cross from "../../assets/svg/cross.svg";
import { THEMES } from "../../assets/theme/themes";
import { decryptService } from "../../utils/storageFunc";
import { showToast, validArray } from "../../utils/utils";
import {
  deletePet,
  deletePetDocumentApi,
  savePetDetails,
} from "../../redux-store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackActions } from "@react-navigation/native";
import { useUser } from "../../api/UserContext";
import ProfileDummy from "../../assets/svg/user.svg";
import { getAdoptionCategory } from "../../redux-store/actions/commonApis";
import { getBase64Obj } from "../../utils/documentUtils";
import { contextValue } from "../../components/Loader";
import {
  isValidName,
  isValidNumber,
  validatePetAge,
} from "../../utils/validation";
import PetCarousel from "../../components/PetCarousel";
import Plus from "../../assets/svg/plus.svg";
import Delete from "../../assets/svg/delete.svg";
import Dialog from "../../components/Dialog";
import { goBack } from "../../navigations/rootNavigationRef";
import { updateProfileData } from "../../redux-store/actions/registerAction";

const GENDER = { male: "Male", female: "Female" };

export const IMAGE_TYPE = { photo: "photo", certificate: "certificate" };

const PetDetail = (props) => {
  const route = props?.route?.params?.route;
  const addNew = props?.route?.params?.addNew;
  const redirectFunc = props?.route?.params?.redirectFunc;
  const [petImage, setPetImage] = useState();
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
  const { apiInitCall } = useUser();
  const [breedList, setBreedList] = useState([]);
  const [selectPetBreed, setSelectedPetBreed] = useState(); // breed

  const [medicalVisible, setMedicalVisible] = useState(false);
  const [petAllImages, setPetAllImages] = useState([]);
  const [petCertificates, setPetCertificates] = useState([]);
  const [petProfilePhoto, setPetProfilePhoto] = useState();
  const [registerModal, setRegisterModal] = useState(false);
  const { parentProfie } = useSelector((state) => state?.commonReducer);
  const { petDetails } = parentProfie;
  const [selectedPet, setSelectedPet] = useState();
  const [deleteModal, setDeleteModal] = useState(false);

  const [submitDocumentData, setSubmitDocumentData] = useState([]);
  const dispatch = useDispatch();
  const isURL = (str) => /^(https?:\/\/|file:\/\/)/.test(str);

  const isBase64 = (str) =>
    /^data:(image|application)\/[a-zA-Z]+;base64,/.test(str);

  // Example Usage
  const checkType = (input) => {
    if (isURL(input)) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const getPetData = () => {
    if (validArray(petDetails)) {
      const firstPet = { ...selectedPet };
      if (firstPet?.about) {
        setPetDescription(firstPet?.about);
      }
      if (firstPet?.age) {
        setPetAge(firstPet?.age?.toString());
      }

      if (firstPet?.type) {
        const selectedType = petTypeData?.filter(
          (it) => it.label == firstPet?.type
        );
        if (selectedType) {
          setSelectedPetType(selectedType);
        }
      }

      if (firstPet?.breed) {
        const selectedType = petTypeData?.filter(
          (it) => it.label == firstPet?.type
        );
        const selectedData = petData?.find(
          (item) => item.category == selectedType?.[0]?.label
        );

        const result1 = selectedData?.breeds?.map((item, index) => ({
          id: index,
          label: item,
        }));

        setBreedList(result1 ? result1 : []);

        const selectedTypeBreed = result1?.filter(
          (it) => it.label == firstPet?.breed
        );

        if (selectedTypeBreed) {
          setSelectedPetBreed(selectedTypeBreed);
        }
      }

      if (firstPet?.gender) {
        setSelectedGender(firstPet?.gender);
      }
      if (firstPet?.name) {
        setPetName(firstPet?.name);
      }

      if (firstPet?.weight) {
        setPetWeight(firstPet?.weight);
      }

      if (firstPet?.documents) {
        const profilePhoto = firstPet?.documents?.filter(
          (item) => item.documenttype === "profilePhoto"
        );

        const petImages = firstPet?.documents?.filter(
          (item) => item.documenttype === "photo"
        );
        const certificates = firstPet?.documents?.filter(
          (item) => item.documenttype === "certificate"
        );

        setPetProfilePhoto(profilePhoto);
        setPetImage(profilePhoto?.[0]?.url);
        setPetAllImages(petImages);
        setPetCertificates(certificates);
        setSubmitDocumentData([...petImages, ...certificates]);
      }
    }
  };

  useEffect(() => {
    if (selectedPet && petData?.length && petTypeData?.length) {
      getPetData();
    }
  }, [selectedPet, petData, petTypeData]);

  const initData = async () => {
    try {
      contextValue?.setLoader(true);
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
      !addNew && setSelectedPet(petDetails[0]);
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
    }
  };

  const handleSelectedCategory = (value) => {
    setSelectedPetType(value);
    setSelectedPetBreed([]);
    const selectedData = petData?.find(
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
    let payload = [
      {
        userid: userId,
        documenttype: "profilePhoto",
        extention: extension,
        document: image?.fileData,
      },
    ];
    setPetImage(image?.fileData);
    setPetProfilePhoto(payload);
  };

  const deleteDocumentMethod = async (documentId) => {
    try {
      const userId = await decryptService("userId");
      let obj = {
        petid: petDetails?.[0]?.id,
        id: documentId,
        userid: userId,
      };
      let res = await deletePetDocumentApi(obj);
    } catch (error) {}
  };

  const handlePetDocuments = async (image) => {
    const extension = image?.uri?.split(".").pop();
    let payload = {
      documenttype: "photo",
      extention: extension,
      document: image?.fileData,
      url: image?.uri,
    };
    let obj = {
      documenttype: "photo",
      extention: extension,
      document: image?.fileData,
      url: "",
    };

    setSubmitDocumentData((prevImages) => [...prevImages, obj]);
    setPetAllImages((prevImages) => [...prevImages, payload]);
  };

  const handleCertificates = async (image) => {
    const extension = image?.uri?.split(".").pop();
    let payload = {
      documenttype: "certificate",
      extention: extension,
      document: image?.fileData,
      url: image?.uri,
    };
    let obj = {
      documenttype: "certificate",
      extention: extension,
      document: image?.fileData,
      url: "",
    };
    setSubmitDocumentData((prevImages) => [...prevImages, obj]);
    setPetCertificates((pre) => [...pre, payload]);
  };

  const onCancelPetImages = async (selectedImage) => {
    try {
      deleteDocumentMethod(selectedImage?.item?.id);
      setPetAllImages(
        petAllImages?.filter((img) => img.url !== selectedImage?.item?.url)
      );
      setSubmitDocumentData([...petAllImages, ...petCertificates]);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const onCancelDocument = async (selectedImage) => {
    try {
      deleteDocumentMethod(selectedImage?.item?.id);
      setPetCertificates(
        petCertificates?.filter((img) => img.url !== selectedImage?.item?.url)
      );
      setSubmitDocumentData([...petAllImages, ...petCertificates]);
    } catch (error) {
      showToast("error", error.message);
    }
  };
  const onSubmit = async () => {
    if (!petImage) {
      showToast("error", "Please select pet image");
    } else if (!petName) {
      showToast("error", "Please enter pet name");
    } else if (!isValidName(petName)) {
      showToast("error", "Please enter valid pet name");
    } else if (!selectedPetType || !selectedPetType[0]?.label) {
      showToast("error", "Please select pet type");
    } else if (!selectPetBreed || !selectPetBreed[0]?.label) {
      showToast("error", "Please select pet breed");
    } else if (!petAge) {
      showToast("error", "Please enter pet age");
    } else if (validatePetAge(petAge) == "invalid") {
      showToast("error", "Please enter valid pet age");
    } else if (!selectedGender) {
      showToast("error", "Please select pet gender");
    } else {
      try {
        contextValue?.setLoader(true);
        const userId = await decryptService("userId");
        const params = {
          userid: userId,
          name: petName,
          type: selectedPetType[0]?.label || null,
          age: Number(petAge),
          gender: selectedGender,
          about: petDescription ? petDescription : "",
          documents: submitDocumentData.concat(petProfilePhoto),
          breed: selectPetBreed[0]?.label,
          weight: petWeight,
        };
        if (!addNew) {
          params.id = selectedPet?.id;
        }
        const res = await savePetDetails(params);
        if (res?.data?.status_code == 200) {
          showToast("success", res?.data?.message);
          if (route === "parentAccount") {
            if (redirectFunc) {
              redirectFunc();
            } else {
              props.navigation.dispatch(StackActions.pop(addNew ? 2 : 1));
            }
          } else {
            setRegisterModal(true);
          }
        } else {
          showToast("error", res?.data?.message);
        }
        apiInitCall();
        contextValue?.setLoader(false);
      } catch (error) {
        contextValue?.setLoader(false);
        showToast("error", error?.message);
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
    return (
      <View style={[styles.imgContent]}>
        {photo ? (
          <Image
            style={styles.img}
            resizeMode="contain"
            source={getBase64Obj(photo)}
          />
        ) : (
          <Image
            style={styles.img}
            resizeMode="contain"
            source={{ uri: item?.item?.url }}
          />
        )}

        <TouchableOpacity
          style={styles.crossView}
          onPress={() => onCancelPetImages(item)}
        >
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  const deletePetData = async () => {
    try {
      const userId = await decryptService("userId");
      let obj = {
        id: selectedPet?.id,
        userid: userId,
      };
      let res = await deletePet(obj);
      setDeleteModal(false);
      if (res?.status_code == 200) {
        showToast("success", res?.data?.message);
        dispatch(updateProfileData());
        goBack();
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      console.log(error, "wdwd");
    }
  };

  const renderDocumentItem = (item, index) => {
    const photo = item?.item.document;
    return (
      <View style={styles.imgContent}>
        {photo ? (
          <Image
            style={styles.img}
            resizeMode="contain"
            source={getBase64Obj(photo)}
          />
        ) : (
          <Image
            style={styles.img}
            resizeMode="contain"
            source={{ uri: item?.item?.url }}
          />
        )}

        <TouchableOpacity
          style={styles.crossView}
          onPress={() => onCancelDocument(item)}
        >
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={"Pet details"}
          showBack
          bgColor="transparent"
          right={
            !addNew && validArray(petDetails) ? (
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 6,
                    marginRight: 3,
                  }}
                  onPress={() => {
                    props.navigation.replace("petDetail", {
                      addNew: true,
                      route: "parentAccount",
                    });
                  }}
                >
                  <Plus stroke={THEMES.colors.cyan} strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 6,
                    paddingRight: 0,
                  }}
                  onPress={() => setDeleteModal(true)}
                >
                  <Delete />
                </TouchableOpacity>
              </View>
            ) : (
              <></>
            )
          }
        />
        {route !== "parentAccount" && !addNew && (
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
        {Boolean(selectedPet) && (
          <View style={{ marginLeft: petDetails?.length === 1 ? "50%" : "30%" }}>
            <PetCarousel
              pets={petDetails}
              onSelectPet={(pet) => setSelectedPet(pet)}
              selectedPet={selectedPet}
            />
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
                {Boolean(petImage) ? (
                  checkType(petImage) ? (
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
                      source={{ uri: petImage }}
                    />
                  ) : (
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
                  )
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
                maxLength={2}
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
                maxLength={2}
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
                    padding: moderateScale(16),
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
                    padding: moderateScale(16),
                    borderColor: THEMES.colors.darkGrey,
                    borderRadius: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  data={petCertificates}
                  renderItem={renderDocumentItem}
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
        <Dialog
          flag={Boolean(deleteModal)}
          title={"Delete"}
          description={`Are u sure you want to delete the pet?`}
          leftButtonText="No"
          rightButtonText="Yes"
          rightButtonPressed={deletePetData}
          leftButtonPressed={() => {
            setDeleteModal(false);
          }}
          onClose={() => {
            setDeleteModal(false);
          }}
        />
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
