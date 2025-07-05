import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { AlertProvider } from '../context/AlertContext';
import { useAppFonts } from '../constants/fonts';
import LoadingSpinner from '../components/LoadingSpinner';
import BottomNav from '../components/BottomNav'; // Import your BottomNav

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <AuthProvider>
      <AlertProvider>
        <View style={styles.container}>
          <Stack />
          <BottomNav /> {/* This shows up at the bottom */}
        </View>
      </AlertProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
