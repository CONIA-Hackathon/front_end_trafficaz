import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { AlertProvider } from '../context/AlertContext';
import { useAppFonts } from '../constants/fonts';
import LoadingSpinner from '../components/LoadingSpinner';
import BottomNav from '../components/BottomNav';

export default function RootLayout() {
  const fontsLoaded = useAppFonts();
  const pathname = usePathname();

  // Screens where BottomNav should be hidden
  const hideBottomNavOn = [
    '/auth/login',
    '/auth/otp',
    '/auth/register',
    '/'
  ];

  const showBottomNav = !hideBottomNavOn.includes(pathname);

  if (!fontsLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <AuthProvider>
      <AlertProvider>
        <View style={styles.container}>
          <Stack />
          {showBottomNav && <BottomNav />}
        </View>
      </AlertProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
