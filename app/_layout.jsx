import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { AlertProvider } from '../context/AlertContext';
import { useAppFonts } from '../constants/fonts';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <AuthProvider>
      <AlertProvider>
        <Stack />
      </AlertProvider>
    </AuthProvider>
  );
} 