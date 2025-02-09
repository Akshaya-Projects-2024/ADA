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
import Icon from "react-native-vector-icons/MaterialIcons";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import { moderateScale, ms } from "react-native-size-matters";
import SearchIcon from "../../assets/svg/search.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { contextValue } from "../../components/Loader";
import { search } from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { useDebounce } from "../../hooks/useDebounce";
import { findDifferenceByDays, showToast, validArray } from "../../utils/utils";
import { getBase64Obj } from "../../utils/documentUtils";

const Chip = ({ item, onPress, selected }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        borderWidth: 0.5,
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(8),
        borderRadius: 20,
        margin: 4,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() => onPress(item)}
    >
      <Text style={styles.chipText}>{item.label}</Text>
    </TouchableOpacity>
  );
};
const TrendingChip = ({ item, onPress, selected }) => {
  return (
    <TouchableOpacity
      style={[
        styles.trendingChip,
        selected ? styles.trendingChipSelected : null,
      ]}
      onPress={() => onPress(item)}
    >
      <Icon
        name={"trending-up"}
        size={16}
        color={selected ? "#ffffff" : "#000000"}
      />
      <Text style={selected ? styles.selectedchipText : styles.chipText}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

const SearchedChip = ({ item, onPress, selected }) => {
  return (
    <TouchableOpacity style={styles.chip}>
      <Icon
        name={"search"}
        size={20}
        color={selected ? "#ffffff" : "#000000"}
      />
      <Text
        style={{
          fontSize: THEMES.fonts.font12,
          paddingHorizontal: moderateScale(5),
          paddingVertical: moderateScale(4),
        }}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

const TopicsCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
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
        <Text numberOfLines={2} style={styles.titleStyle}>{item?.subject}</Text>
        <View style={styles.authorContainer}>
          <Text style={styles.authorStyle}>{item?.author}</Text>
          <Text style={styles.dateStyle}>
            {`${findDifferenceByDays(item?.createdon)}` > 50
              ? "Few days ago"
              : `${findDifferenceByDays(item?.createdon)}d`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Search = ({ navigation }) => {
  const { colors, fontFamily, fonts } = THEMES;

  const [data, setData] = useState();

  const [searchText, setSearchText] = useState("");
  const [selectedChips, setSelectedChips] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchQuery = useDebounce(searchText);

  useEffect(() => {
    contextValue?.setLoader(true);
  }, []);

  useEffect(() => {
    initData();
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
      const response = res?.data?.data;
      if (validArray(response)) {
        setData(response);
      } else {
        setData([]);
      }
      contextValue?.setLoader(false);
    } catch (error) {
      setData([]);
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  // Handle search input change
  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleChipPress = (item) => {
    setSelectedChips((prevSelected) => {
      if (prevSelected.includes(item.id)) {
        return prevSelected.filter((id) => id !== item.id);
      } else {
        // Add the selected item to recent searches if it's not already present
        setRecentSearches((prev) => {
          if (!prev.find((recentItem) => recentItem.id === item.id)) {
            return [...prev, item];
          }
          return prev;
        });
        return [...prevSelected, item.id];
      }
    });
    setSearchText("");
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleCardPressed = (item) => {
    navigation.navigate("trendDetail", { selectedData: item });
  };
  // Filter trending topics and recent searches
  // const trendingTopics = data.filter((item) => item.trending);
  // const filteredData = data.filter((item) =>
  //   item.label.toLowerCase().includes(searchText.toLowerCase())
  // );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          showBack
          title={"Search"}
          bgColor="transparent"
          fontColor={THEMES.colors.black}
        />
        <View style={{ paddingHorizontal: moderateScale(20) }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: moderateScale(8),
              borderColor: "#bebebd",
              borderWidth: 1.5,
              borderRadius: 25,
              marginBottom: ms(5),
              backgroundColor: "#f5f5f5",
              elevation: 1,
              alignItems: "center",
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
        {validArray(data) ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TopicsCard item={item} onPress={handleCardPressed} />
            )}
            contentContainerStyle={styles.topicsContainer}
          />
        ) : Array.isArray(data) && data?.length <= 0 ? (
          <View style={styles.emptyView}>
            <Text>No data found!</Text>
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
    fontFamily:"Inter-SemiBold"
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
  },
});

export default Search;
