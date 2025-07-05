import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import BottomNav from '../components/BottomNav';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const pathname = usePathname();

  // Screens where BottomNav should be hidden
  const hideBottomNavOn = [
    '/auth/login',
    '/auth/otp',
    '/auth/register',
    '/onboarding',
    '/'
  ];

  const showBottomNav = !hideBottomNavOn.includes(pathname);

  useEffect(() => {
    // Hide splash screen after a short delay
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    
    // Hide splash screen after 1 second
    setTimeout(hideSplash, 1000);
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Let expo-router handle the routing automatically */}
          </Stack>
          {showBottomNav && <BottomNav />}
        </View>
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
