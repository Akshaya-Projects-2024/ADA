import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home/home';
import TrendingTopics from '../pages/TrendingTopics/trendingTopics';
import PetAdoption from '../pages/PetAdoption/petAdoption';
import MyAccount from '../pages/Account/myAccount';
import BottomTabBarItem from './BottomTabBarItem';
import Chat from '../pages/Chat/chat';

const Tab = createBottomTabNavigator();

const navOptionHandler = () => ({
  headerShown: false,
  gestureEnabled: false,
});

export default function BottomTabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      tabBar={props => <BottomTabBarItem {...props} />}>
      <Tab.Screen name="home" component={Home} options={navOptionHandler} />

      <Tab.Screen
        name="trendingTopics"
        component={TrendingTopics}
        options={navOptionHandler}
      />
      <Tab.Screen
        name="petAdoption"
        component={PetAdoption}
        options={navOptionHandler}
      />
      <Tab.Screen name="chat" component={Chat} options={navOptionHandler} />
      <Tab.Screen
        name="myAccount"
        component={MyAccount}
        options={navOptionHandler}
      />
    </Tab.Navigator>
  );
}
