import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/colors';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user has completed onboarding (you can store this in AsyncStorage)
      // For now, we'll assume they need to go through onboarding
      const checkOnboardingStatus = async () => {
        try {
          // You can add AsyncStorage check here for onboarding completion
          // const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
          
          if (isAuthenticated) {
            // User is authenticated, go to home
            router.replace('/Home');
          } else {
            // User is not authenticated, go to onboarding
            router.replace('/onboarding');
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          // Default to onboarding on error
          router.replace('/onboarding');
        }
      };

      checkOnboardingStatus();
    }
  }, [isAuthenticated, loading, router]);

  // Show loading screen while checking authentication
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

