import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/colors';
import SplashScreen from './screens/SplashScreen';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!loading && !showSplash) {
      const checkOnboardingStatus = async () => {
        try {
          if (isAuthenticated) {
            router.replace('/Home');
          } else {
            router.replace('/onboarding');
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          router.replace('/onboarding');
        }
      };
      checkOnboardingStatus();
    }
  }, [isAuthenticated, loading, showSplash, router]);

  if (loading || showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});


