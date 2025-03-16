import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import { moderateScale, ms } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { contextValue } from "../../components/Loader";
import { search } from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { useDebounce } from "../../hooks/useDebounce";
import { findDifferenceByDays, showToast, validArray } from "../../utils/utils";
import { getBase64Obj } from "../../utils/documentUtils";
import SearchImg from "../../assets/svg/search.svg";
import TrendingTopicIc from "../../assets/svg/trendingTopics.svg";
import { clearKeywordApi } from "../../redux-store/actions/topics";
import TouchableButtonWithPermission from "../../components/TouchableButtonWithPermission";

const TopicsCard = ({ item, onPress }) => {
  return (
    <TouchableButtonWithPermission
      style={styles.topicsCard}
      onPress={() => {
        onPress(item);
      }}
    >
      <Image
        height={ms(48)}
        width={ms(48)}
        style={styles.coverImage}
        source={getBase64Obj(item?.cover)}
      />
      <View style={styles.contentContainer}>
        <Text numberOfLines={2} style={styles.titleStyle}>
          {item?.subject}
        </Text>
        <View style={styles.authorContainer}>
          <Text style={styles.authorStyle}>{item?.author}</Text>
          <Text style={styles.dateStyle}>
            {`${findDifferenceByDays(item?.createdon)}` > 50
              ? "Few days ago"
              : `${findDifferenceByDays(item?.createdon)}d`}
          </Text>
        </View>
      </View>
    </TouchableButtonWithPermission>
  );
};

const defaultSearchData = {
  Keywords: [],
  SearchResult: [],
  TrendingTopics: [],
};

const Search = ({ navigation }) => {
  const { colors, fontFamily, fonts } = THEMES;

  const [data, setData] = useState(defaultSearchData);

  const [searchText, setSearchText] = useState("");
  const [selectedChipsId, setSelectedChipsId] = useState([]);
  const searchQuery = useDebounce(searchText);
  const [selectedChip, setSelectedChip] = useState();

  useEffect(() => {
    contextValue?.setLoader(true);
    initData();
  }, []);

  const Chip = ({ item, onPress, selected, isTrending }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isTrending
            ? item?.keyword == selectedChip
              ? "#00BBC8"
              : "#EAFFF6"
            : "#ffffff",
          borderColor: "#000000",
          borderWidth: 0.5,
          paddingHorizontal: moderateScale(12),
          paddingVertical: moderateScale(5),
          borderRadius: 20,
          margin: 4,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
        onPress={() => {
          onPress(item);
        }}
      >
        {isTrending ? (
          <TrendingTopicIc
            width={ms(19)}
            height={ms(19)}
            stroke={item?.keyword == selectedChip ? "#fff" : "#000"}
          />
        ) : (
          <SearchImg width={ms(15)} height={ms(15)} />
        )}
        <Text
          style={[
            styles.chipText,
            {
              color:
                isTrending && item?.keyword == selectedChip
                  ? colors.white
                  : colors.black,
            },
          ]}
        >
          {item.keyword}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    contextValue?.setLoader(true);
    if (searchQuery.length >= 3) {
      initData();
    } else if (searchQuery.length === 0) {
      initData(); // Restore initial data when search is cleared
    }
  }, [searchQuery]);

  const initData = async () => {
    try {
      const userId = await decryptService("userId");
      const params = {
        userId: userId,
        searchtype: "topics",
        keyword: searchQuery,
      };
      const res = await search(params);
      if (validArray(res?.data?.data?.SearchResult)) {
        setData(res?.data?.data);
      } else {
        setData(defaultSearchData);
      }
      contextValue?.setLoader(false);
    } catch (error) {
      setData(defaultSearchData);
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  // Handle search input change
  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleChipPress = (item) => {
    setSearchText(item?.keyword);
    setSelectedChipsId([item?.keyword]);
    setSelectedChip(item?.keyword);
  };

  const handleCardPressed = (item) => {
    navigation.navigate("trendDetail", { selectedData: item });
  };

  const clearRecentSearches = async () => {
    try {
      contextValue?.setLoader(true);
      const obj = {
        userId: await decryptService("userId"),
      };
      let res = await clearKeywordApi(obj);
      if (res?.status_code == 200) {
        setSelectedChipsId([]);
        setSearchText("");
        setData((prevData) => ({
          ...prevData,
          Keywords: [],
          SearchResult: [],
        }));
        contextValue?.setLoader(true);
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          showBack
          title={"Search"}
          bgColor="transparent"
          fontColor={"#fda208"}
        />
        <View style={{ paddingHorizontal: moderateScale(20) }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: moderateScale(8),
              borderRadius: 25,
              borderWidth: 0.9,
              backgroundColor: "#f5f5f5",
              borderColor: "#bebebd",
              marginBottom: ms(5),
              backgroundColor: "#f5f5f5",
              borderColor: "#bebebd",
              elevation: 1,
              alignItems: "center",
            }}
          >
            <View style={{ paddingRight: 10 }}>
              <SearchImg />
            </View>

            <TextInput
              style={styles.searchBar}
              placeholder="Search"
              placeholderTextColor={THEMES.colors.darkGrey}
              value={searchText}
              onChangeText={handleSearchChange}
            />
          </View>
          {data?.Keywords?.length !== 0 && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: moderateScale(20),
                  paddingBottom: moderateScale(5),
                }}
              >
                <Text style={styles.selectTimeText}>Trending Topics</Text>
              </View>
              <FlatList
                data={data?.Keywords}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Chip
                    item={item}
                    onPress={handleChipPress}
                    selected={selectedChipsId.includes(item.id)}
                    isTrending={true}
                  />
                )}
                contentContainerStyle={styles.chipContainer}
              />
            </>
          )}
          {data?.Keywords?.length !== 0 && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: moderateScale(20),
                  paddingBottom: moderateScale(5),
                }}
              >
                <Text style={styles.selectTimeText}>Recent Searches</Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={data?.Keywords}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Chip
                    item={item}
                    onPress={handleChipPress}
                    selected={selectedChipsId.includes(item.id)}
                  />
                )}
                contentContainerStyle={styles.chipContainer}
              />
            </>
          )}

          {/* TODO Show search results only when searchText is not empty */}
          {/* {searchText !== "" && (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Chip
                  item={item}
                  onPress={handleChipPress}
                  selected={selectedChips.includes(item.id)}
                />
              )}
              contentContainerStyle={styles.chipContainer}
            />
          )} 

          <View style={styles.sectionHeader}>
            <Text style={styles.selectTimeText}>Trending Topics</Text>
          </View>
          {/* TODO */}
          {/* <FlatList
            data={trendingTopics}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TrendingChip
                item={item}
                onPress={handleChipPress}
                selected={selectedChips.includes(item.id)}
              />
            )}
            contentContainerStyle={styles.chipContainer}
          /> */}
          {/* TODO */}
          {/* <View style={styles.sectionHeader}>
            <Text style={styles.selectTimeText}>Recent Searches</Text>
            <Pressable onPress={clearRecentSearches}>
              <Text style={styles.sameTimeForDayText}>Clear</Text>
            </Pressable>
          </View>
          <FlatList
            data={recentSearches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SearchedChip
                item={item}
                // onPress={handleChipPress}
                // selected={selectedChips.includes(item.id)}
              />
            )}
            contentContainerStyle={styles.chipContainer}
          />*/}
        </View>
        {validArray(data?.SearchResult) ? (
          <>
            <FlatList
              data={data?.SearchResult}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TopicsCard item={item} onPress={handleCardPressed} />
              )}
              contentContainerStyle={styles.topicsContainer}
            />
          </>
        ) : Array.isArray(data?.SearchResult) &&
          data?.SearchResult?.length <= 0 ? (
          <View style={styles.emptyView}>
            <Text
              style={{
                color: "#000",
                fontSize: moderateScale(16),
                marginHorizontal: moderateScale(20),
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Oops! No information available!
            </Text>
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  searchBar: {
    height: 42,
    flex: 1,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: "Inter-SemiBold",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: moderateScale(5),
  },
  chip: {
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    borderWidth: 0.5,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(3),
    borderRadius: 20,
    margin: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  trendingChip: {
    backgroundColor: "#EAFFF6",
    borderColor: THEMES.colors.darkGrey,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  chipSelected: {
    backgroundColor: "#6200EE",
    // Selected color
  },
  trendingChipSelected: {
    backgroundColor: "#06bac8",
    borderColor: "none",
    borderWidth: 0, // Selected color
  },
  chipText: {
    fontSize: 13,
    color: "#000",
    fontFamily: THEMES.fontFamily.medium,
    paddingLeft: moderateScale(5),
  },
  selectedchipText: {
    fontSize: 13,
    color: "#ffffff",
    fontFamily: THEMES.fontFamily.medium,
    paddingLeft: moderateScale(5),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(8),
  },
  selectTimeText: {
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  sameTimeForDayText: {
    fontFamily: THEMES.fontFamily.medium,
    color: "#323232",
    fontSize: THEMES.fonts.font14,
  },
  topicsContainer: {
    flexGrow: 1,
    marginHorizontal: ms(20),
    paddingBottom: ms(5),
    paddingTop: ms(10),
  },
  topicsCard: {
    backgroundColor: THEMES.colors.white,
    borderRadius: ms(12),
    borderWidth: ms(1),
    borderColor: THEMES.colors.searchBorderColor,
    marginVertical: ms(5),
    flexDirection: "row",
    padding: ms(10),
  },
  coverImage: { borderRadius: ms(24) },
  contentContainer: { flex: 1, marginLeft: ms(15) },
  titleStyle: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontWeight: "600",
  },
  authorContainer: {
    marginTop: ms(5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorStyle: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.topicAuthorText,
    fontWeight: "500",
  },
  dateStyle: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.dateColor,
    fontWeight: "500",
  },
  emptyView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  clearText: {
    fontFamily: THEMES.fontFamily.medium,
    color: "#323232",
    fontSize: THEMES.fonts.font14,
  },
});

export default Search;
