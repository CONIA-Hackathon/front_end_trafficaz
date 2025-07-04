import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../auth/login';
import RegisterScreen from '../auth/register';
import OtpScreen from '../auth/otp';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="OtpScreen" component={OtpScreen} />
  </Stack.Navigator>
);

export default AuthNavigator; 