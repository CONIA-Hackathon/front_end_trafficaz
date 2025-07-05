import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [developmentOtp, setDevelopmentOtp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stored authentication data on app start
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setPhoneNumber(storedPhoneNumber);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, authToken) => {
    try {
      // Store authentication data
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('phoneNumber', userData.phoneNumber || '');

      setToken(authToken);
      setUser(userData);
      setPhoneNumber(userData.phoneNumber || '');
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear stored authentication data
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('phoneNumber');

      setToken(null);
      setUser(null);
      setPhoneNumber(null);
      setDevelopmentOtp(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const setPhoneNumberForOtp = (phone) => {
    setPhoneNumber(phone);
    AsyncStorage.setItem('phoneNumber', phone).catch(console.error);
  };

  const setDevelopmentOtpCode = (otp) => {
    console.log('=== AUTH CONTEXT: STORING OTP ===');
    console.log('Storing development OTP:', otp);
    setDevelopmentOtp(otp);
    console.log('Development OTP stored in context');
  };

  const clearDevelopmentOtp = () => {
    console.log('=== AUTH CONTEXT: CLEARING OTP ===');
    console.log('Clearing development OTP');
    setDevelopmentOtp(null);
    console.log('Development OTP cleared from context');
  };

  const value = {
    user,
    token,
    phoneNumber,
    developmentOtp,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    setPhoneNumberForOtp,
    setDevelopmentOtpCode,
    clearDevelopmentOtp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 