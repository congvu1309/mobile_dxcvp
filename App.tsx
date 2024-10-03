import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './components/screens/HomeScreen';
import TripScreen from './components/screens/TripScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import ProductByAddress from './components/search/ProductByAddress';
import AllCategory from 'components/category/AllCategory';
import ProductByCategory from 'components/category/ProductByCategory';
import DetailProduct from 'components/product/DetailProduct';

type TabParamList = {
  HomeScreen: undefined;
  TripScreen: undefined;
  ProfileScreen: undefined;
};

type HomeStackParamList = {
  HomeStackScreen: undefined;
  ProductByAddress: undefined;
  AllCategory: undefined;
  ProductByCategory: undefined;
  DetailProduct: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeStackScreen" component={HomeScreen} />
      <HomeStack.Screen name="ProductByAddress" component={ProductByAddress} />
      <HomeStack.Screen name="AllCategory" component={AllCategory} />
      <HomeStack.Screen name="ProductByCategory" component={ProductByCategory} />
      <HomeStack.Screen name="DetailProduct" component={DetailProduct} />
    </HomeStack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home-outline';

            if (route.name === 'HomeScreen') {
              iconName = 'home-outline';
            } else if (route.name === 'TripScreen') {
              iconName = 'airplane-outline';
            } else if (route.name === 'ProfileScreen') {
              iconName = 'person-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#ff0000',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            height: 70,
            paddingBottom: 5,
          },
          tabBarLabelStyle: {
            fontSize: 16,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="HomeScreen" component={HomeStackScreen} options={{ title: 'Trang chủ' }} />
        <Tab.Screen name="TripScreen" component={TripScreen} options={{ title: 'Chuyến đi' }} />
        <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Trang cá nhân' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
