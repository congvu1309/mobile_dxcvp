import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './components/screens/HomeScreen';
import TripScreen from './components/screens/TripScreen';
import ProfileScreen from './components/screens/ProfileScreen';

type TabParamList = {
  HomeScreen: undefined;
  TripScreen: undefined;
  ProfileScreen: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

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
        <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Trang chủ' }} />
        <Tab.Screen name="TripScreen" component={TripScreen} options={{ title: 'Chuyến đi' }} />
        <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Trang cá nhân' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;