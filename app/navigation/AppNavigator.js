import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RouteSetupScreen from '../screens/RouteSetupScreen';
import AlertScreen from '../screens/AlertScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ImagesScreen from '../screens/ImagesScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="RouteSetup" component={RouteSetupScreen} />
    <Stack.Screen name="AI" component={ImagesScreen} />
    <Stack.Screen name="Alerts" component={AlertScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    
  </Stack.Navigator>
);

export default AppNavigator; 