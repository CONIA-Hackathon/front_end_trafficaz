import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { AlertProvider } from '../context/AlertContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Stack />
      </AlertProvider>
    </AuthProvider>
  );
} 