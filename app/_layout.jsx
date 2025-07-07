import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import { AlertProvider } from '../context/AlertContext';
import BottomNav from '../components/BottomNav';
import colors from '../constants/colors';

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
    // Configure status bar
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primary);
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }

    // Hide splash screen after a short delay
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    
    // Hide splash screen after 1 second
    setTimeout(hideSplash, 1000);
  }, []);

  return (
    <SafeAreaProvider>
      <AlertProvider>
        <LanguageProvider>
          <AuthProvider>
            <View style={styles.container}>
              <StatusBar 
                backgroundColor={colors.primary}
                barStyle="light-content"
                translucent={false}
              />
              <Stack 
                screenOptions={{ 
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background }
                }}
              >
                {/* Let expo-router handle the routing automatically */}
              </Stack>
              {showBottomNav && <BottomNav />}
            </View>
          </AuthProvider>
        </LanguageProvider>
      </AlertProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
