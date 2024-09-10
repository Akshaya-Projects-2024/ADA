import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';

import Home from '../assets/svg/home.svg';
import TrendingTopics from '../assets/svg/openCheck.svg';
import PetAdoption from '../assets/svg/heart.svg';
import Chat from '../assets/svg/msgSquare.svg';
import Profile from '../assets/svg/vector.svg';

import {THEMES} from '../assets/theme/themes';

const BottomTabBarItem = ({navigation, state}) => {
  const currentIndex = state.index;

  const Tab = ({icon, index, route, label}) => {
    const active = currentIndex === index;
    let Icon = icon;

    return (
      <TouchableOpacity
        style={styles.tabBarStyle}
        activeOpacity={active ? 1 : 0.5}
        onPress={() => navigation.navigate(route)}>
        <View style={styles.iconStyle}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: active ? 84 : 0,
              height: active ? 40 : 0,
              backgroundColor: active
                ? THEMES.colors.hintGreen
                : THEMES.colors.white,
              borderColor: active
                ? THEMES.colors.bottomBarGreen
                : THEMES.colors.white,
              borderRadius: active ? 19 : 0,
              borderWidth: active ? 1.4 : 0,
            }}>
            {Icon == 'home' ? (
              <Home
                stroke={
                  active ? THEMES.colors.chateauGreen : THEMES.colors.doveGray
                }
              />
            ) : Icon == 'bookOpenCheck' ? (
              <TrendingTopics
                stroke={
                  active ? THEMES.colors.chateauGreen : THEMES.colors.doveGray
                }
              />
            ) : Icon == 'heart' ? (
              <PetAdoption
                stroke={
                  active ? THEMES.colors.chateauGreen : THEMES.colors.doveGray
                }
              />
            ) : Icon == 'chat' ? (
              <Chat
                stroke={
                  active ? THEMES.colors.chateauGreen : THEMES.colors.doveGray
                }
              />
            ) : (
              <Profile
                stroke={
                  active ? THEMES.colors.chateauGreen : THEMES.colors.doveGray
                }
              />
            )}
            {active && <Text style={styles.textStyle}>{label}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainView}>
      <Tab index={0} route="home" label="Home" icon={'home'} />
      <Tab
        index={1}
        route="trendingTopics"
        label="Topics"
        icon={'bookOpenCheck'}
      />
      <Tab index={2} route="petAdoption" label="Adoption" icon={'heart'} />
      <Tab index={3} route="chat" label="Chat" icon={'chat'} />
      <Tab index={4} route="myAccount" label="Profile" icon={'vector'} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    borderTopWidth: 1,
    flexDirection: 'row',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderColor: THEMES.colors.bgColor,
    backgroundColor: THEMES.colors.white,
    shadowColor: THEMES.colors.black,
    elevation: 8,
    paddingHorizontal: 7,
  },
  tabBarStyle: {
    flex: 1 / 2,
    height: '100%',
    alignItems: 'center',
  },
  iconStyle: {
    height: 72,
    justifyContent: 'center',
  },
  textStyle: {
    paddingLeft: 3,
    fontSize: THEMES.fonts.font9,
    color: THEMES.colors.bottomBarGreen,
    fontFamily: THEMES.fontFamily.medium,
  },
});

export default BottomTabBarItem;
