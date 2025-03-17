import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Strings from "../../constants/strings";
import { moderateScale, ms } from "react-native-size-matters";
import Plus from "../../assets/svg/plus.svg";
import { getAdoption } from "../../redux-store/actions/auth";
import { showToast, validArray } from "../../utils/utils";
import { decryptService } from "../../utils/storageFunc";
import { useIsFocused } from "@react-navigation/native";
import CrossIcon from "../../assets/svg/CrossIcon";
import { useSelector } from "react-redux";
import { ApprovalStatus, LoginModules } from "../../constants/enums";
import { contextValue } from "../../components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchIcon from "../../assets/svg/search.svg";
import { useDebounce } from "../../hooks/useDebounce";
import ProfileDummy from "../../assets/svg/user.svg";
import Dialog from "../../components/Dialog";
import TouchableButtonWithPermission from "../../components/TouchableButtonWithPermission";

const PetAdoption = (props) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [petCategories, setPetCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const isFocused = useIsFocused();
  const { loggedInModule, guestUser } = useSelector((state) => state?.register);
  const [searchText, setSearchText] = useState("");
  const [paymentModal, setPaymentModal] = useState(false);
  const searchQuery = useDebounce(searchText);
  const profile = useSelector((state) => state?.commonReducer);

  const paymentCompleted = useMemo(() => {
    if (
      profile?.providerProfile?.subscription?.status === "active" &&
      profile?.logindetails?.isprovider === ApprovalStatus.approved
    ) {
      return { flag: true };
    } else if (
      profile?.providerProfile?.subscription?.status === "active" &&
      profile?.logindetails?.isprovider !== ApprovalStatus.approved
    ) {
      return { flag: false, message: Strings.approvaltError };
    }
    return { flag: false, message: Strings.paymentErrorForAdoption };
  }, [
    profile?.logindetails?.isprovider,
    profile?.providerProfile?.subscription?.status,
  ]);

  useEffect(() => {
    if (isFocused) {
      initData();
    }
  }, [isFocused]);

  useEffect(() => {
    if (filterCategory && validArray(data)) {
      const filteredPets = data?.filter((it) => {
        return it.category === filterCategory;
      });
      setFilteredData(validArray(filteredPets) ? filteredPets : []);
    }
  }, [data, filterCategory]);

  useEffect(() => {
    if (validArray(data)) {
      const filteredPets = data?.filter((it) => {
        return it?.name
          ?.toLowerCase()
          ?.includes(searchQuery?.trim()?.toLowerCase());
      });
      setFilteredData(validArray(filteredPets) ? filteredPets : []);
    }
  }, [data, searchQuery]);

  const initData = async () => {
    contextValue?.setLoader(true);
    try {
      const userId = await decryptService("userId");
      const params = {
        process: "getAll",
        createdby: userId,
      };
      const response = await getAdoption(params);
      if (response?.status === 200) {
        const output = response?.data?.data;
        if (validArray(output)) {
          setData(output);
          const result = new Set(
            output.map((adoptionData) => adoptionData.category)
          );
          setPetCategories([...result]);
        }
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const handleSearchChange = (text) => {
    setFilterCategory();
    setSearchText(text);
  };

  const handlePremiumActionPressed = (item) => {
    // if (loggedInModule === LoginModules.parent || paymentCompleted?.flag) {
    props.navigation.navigate("auth", {
      screen: "adoptionDetail",
      params: {
        selectedData: item,
      },
    });
    // } else {
    //   setPaymentModal(true);
    // }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableButtonWithPermission
        customMsgForRegistration={
          "Get Registered and subscribe to enjoy all exciting features of ADA app."
        }
        onPress={() => handlePremiumActionPressed(item)}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          shadowColor: THEMES.colors.lightGrey,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
          overflow: "hidden",
          borderRadius: 12,
          marginBottom: moderateScale(10),
          backgroundColor: THEMES.colors.white,
          paddingVertical: moderateScale(10),
          paddingHorizontal: moderateScale(15),
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 48 / 2,
            borderWidth: 1,
            borderColor: "transparent",
          }}
        >
          {Boolean(item?.document?.[0]?.url) ? (
            <Image
              resizeMode="contain"
              style={{ width: 48, height: 48, borderRadius: 48 / 2 }}
              source={{
                uri: item?.document?.[0]?.url,
              }}
            />
          ) : (
            <View
              style={{
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 48 / 2,
              }}
            >
              <ProfileDummy width={30} />
            </View>
          )}
        </View>
        <View style={{ marginHorizontal: moderateScale(15), width: "80%" }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              fontSize: THEMES.fonts.font14,
              color: THEMES.colors.black,
            }}
          >
            {item.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: THEMES.fontFamily.regular,
              paddingTop: moderateScale(3),
              fontSize: THEMES.fonts.font12,
              color: THEMES.colors.black,
            }}
          >
            {item.breed} | {item.location}
          </Text>
        </View>
      </TouchableButtonWithPermission>
    );
  };

  const EmptyContentView = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: "#000",
            fontSize: moderateScale(16),
            marginHorizontal: moderateScale(10),
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Hey, No pet for adoption.Hope everyone got their home
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          noBack
          title={Strings.petAdoption}
          bgColor="transparent"
          fontColor={"#ed65a5"}
        />
        <View style={{ flex: 1, paddingHorizontal: moderateScale(20) }}>
          {filteredData?.length || data?.length ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderColor: "#bebebd",
                      borderRadius: 25,
                      borderWidth: 1.5,
                      backgroundColor: "#f5f5f5",
                      paddingHorizontal: 10, // Spacing around the text and icons
                      height: 45,
                    }}
                  >
                    <View style={{ paddingRight: 10 }}>
                      <SearchIcon />
                    </View>

                    <TextInput
                      style={styles.searchBar}
                      placeholder="Search..."
                      placeholderTextColor={"#000"}
                      value={searchText}
                      onChangeText={handleSearchChange}
                    />
                  </View>
                  {/* <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("auth", {
                      screen: "search",
                    })
                  }
                  style={{
                    padding: moderateScale(8),
                    borderRadius: 25,
                    borderWidth: 1.5,
                    backgroundColor: "#f5f5f5",
                    borderColor: "#bebebd",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Search />
                  <Text
                    style={{
                      paddingLeft: moderateScale(8),
                      fontSize: THEMES.fonts.font12,
                      color: THEMES.colors.darkGrey,
                    }}
                  >
                    Search
                  </Text>
                </TouchableOpacity> */}
                </View>

                {loggedInModule === LoginModules.parent && !guestUser ? (
                  <TouchableButtonWithPermission
                    onPress={() =>
                      props.navigation.navigate("auth", {
                        screen: "addAdoption",
                      })
                    }
                    style={{
                      marginLeft: moderateScale(13),
                      backgroundColor: THEMES.colors.white,
                      padding: moderateScale(11),
                      alignItems: "center",
                      justifyContent: "center",
                      borderColor: "#EC559C",
                      borderWidth: 1,
                      borderRadius: moderateScale(8),
                      borderBottomLeftRadius: moderateScale(0),
                    }}
                  >
                    <Plus stroke={"#EC559C"} />
                  </TouchableButtonWithPermission>
                ) : null}
              </View>

              <View
                style={{
                  paddingVertical: moderateScale(28),
                  flexDirection: "row",
                }}
              >
                <ScrollView
                  horizontal={true}
                  style={{ flex: 1 }}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                >
                  {filterCategory ? ( // Show "Clear" only when a filter is applied
                    <Pressable
                      onPress={() => {
                        setFilterCategory("");
                        setSearchText("");
                        setFilteredData(data); // Reset data to original
                      }}
                      style={{
                        paddingHorizontal: moderateScale(10),
                        paddingVertical: moderateScale(5),
                        borderWidth: 1,
                        borderColor: THEMES.colors.red,
                        borderRadius: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: moderateScale(10),
                      }}
                    >
                      <CrossIcon
                        width={moderateScale(15)}
                        height={moderateScale(15)}
                        color={THEMES.colors.red}
                        style={{ marginRight: moderateScale(5) }}
                      />
                      <Text
                        style={{
                          fontFamily: THEMES.fontFamily.semiBold,
                          color: THEMES.colors.red,
                        }}
                      >
                        Clear
                      </Text>
                    </Pressable>
                  ) : null}
                  {petCategories?.map((item, index) => {
                    return (
                      <Pressable
                        key={`${item}_${index}`}
                        onPress={() => {
                          setSearchText("");
                          setFilterCategory(item);
                        }}
                        style={{
                          paddingHorizontal: moderateScale(12),
                          marginLeft: index === 0 ? 0 : moderateScale(10),
                          paddingVertical: moderateScale(6),
                          borderWidth: 1,
                          borderColor:
                            index === 0
                              ? THEMES.colors.silver
                              : filterCategory === item
                              ? THEMES.colors.adoptionPink
                              : THEMES.colors.silver,
                          borderRadius: 20,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: THEMES.fontFamily.semiBold,
                            color:
                              index === 0
                                ? THEMES.colors.black
                                : filterCategory === item
                                ? THEMES.colors.adoptionPink
                                : THEMES.colors.black,
                            fontSize: THEMES.fonts.font12,
                          }}
                        >
                          {item}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={{ flex: 1 }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={validArray(filteredData) ? filteredData : data}
                  bounces={false}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
            </>
          ) : (
            EmptyContentView()
          )}
        </View>
      </SafeAreaView>

      <Dialog
        flag={paymentModal}
        title={Strings.attention}
        description={paymentCompleted?.message}
        leftButtonText="Cancel"
        rightButtonText="OK"
        leftButtonPressed={() => {
          setPaymentModal(false);
        }}
        rightButtonPressed={() => {
          if (profile?.providerProfile?.subscription?.status === "active") {
            setPaymentModal(false);
          } else if (guestUser) {
            props?.navigation.replace("auth");
          } else {
            props.navigation.navigate("auth", {
              screen: "paymentsSubscription",
            });
          }
        }}
        onClose={() => {
          setPaymentModal(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
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
  iconStyle: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(5),
  },
  searchBar: {
    height: 42,
    flex: 1,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.darkGrey,
  },
});

export default PetAdoption;
