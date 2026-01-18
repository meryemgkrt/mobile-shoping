import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import ProfileScreen from '../screen/ProfileScreen';
import CartScreen from '../screen/CartScreen';
import { TabNavigationParamList } from '../types';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator<TabNavigationParamList>();

const tabData = [
  { label: 'Home', route: 'Home', name: 'Home' as const },

  { label: 'Cart', route: 'Cart', name: 'Cart' as const },

  { label: 'Profile', route: 'Profile', name: 'Profile' as const },
];

const MainTabsNavigation = () => {
  return (
    <Tab.Navigator
      tabBar={props => (
        <CustomTabBar
          {...props}
          data={tabData}
          cartCount={1}
          onChange={index => console.log('Tab:', index)}
        />
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabsNavigation;
