import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import colors from '../../constants/colors';
import { verifyOtp, sendOtp } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { phoneNumber, login, developmentOtp, clearDevelopmentOtp } = useAuth();

  // Debug: Log OTP screen data
  console.log('=== OTP SCREEN DATA ===');
  console.log('Phone Number:', phoneNumber);
  console.log('Development OTP:', developmentOtp);
  console.log('Current OTP Input:', otp);

  const validateOtp = () => {
    if (!otp || otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return false;
    }
    setError('');
    return true;
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;

    setLoading(true);
    try {
      console.log('=== OTP VERIFICATION ===');
      console.log('Verifying OTP:', otp);
      console.log('Phone Number:', phoneNumber);
      console.log('Development OTP available:', developmentOtp);
      
      const response = await verifyOtp(phoneNumber, otp);
      console.log('OTP verification successful:', response);
      console.log('Verification response data:', response.data);

      // Check if we have a token in the response
      const token = response.data?.token;
      if (!token) {
        console.log('No token in verification response, proceeding with login...');
        // If no token, we can still proceed with login using the userId
        const userData = {
          userId: response.data.userId,
          phoneNumber: phoneNumber,
          // Add other user fields as needed
        };

        console.log('User data to store:', userData);
        console.log('No token available, storing user data only...');

        // Store user data without token for now
        await login(userData, 'temp-token-' + Date.now()); // Temporary token
        
        // Clear development OTP after successful verification
        if (developmentOtp) {
          console.log('Clearing development OTP...');
          clearDevelopmentOtp();
        }

        console.log('Login successful, navigating to home...');
        // Navigate to home screen after successful verification
        router.replace('/HomeScreen');
      } else {
        // Store the authentication token and user data
        const userData = {
          userId: response.data.userId,
          phoneNumber: phoneNumber,
          // Add other user fields as needed
        };

        console.log('User data to store:', userData);
        console.log('Token to store:', token);

        // Store the token and user data in context
        await login(userData, token);

        // Clear development OTP after successful verification
        if (developmentOtp) {
          console.log('Clearing development OTP...');
          clearDevelopmentOtp();
        }

        console.log('Login successful, navigating to home...');
        // Navigate to home screen after successful verification
        router.replace('/home');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      Alert.alert('Verification Failed', error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await sendOtp(phoneNumber);
      console.log('OTP resent:', response);
      Alert.alert('OTP Resent', 'A new OTP has been sent to your phone number.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  // Redirect if no phone number is available
  useEffect(() => {
    if (!phoneNumber) {
      router.replace('/auth/login');
    }
  }, [phoneNumber, router]);

  if (!phoneNumber) {
    return null;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 4-digit code sent to{'\n'}
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </Text>

        <View style={styles.form}>
          {/* Development OTP Display */}
          {developmentOtp && (
            <View style={styles.devOtpContainer}>
              <Text style={styles.devOtpTitle}>Development OTP</Text>
              <Text style={styles.devOtpCode}>{developmentOtp}</Text>
              <TouchableOpacity 
                style={styles.autoFillButton}
                onPress={() => {
                  setOtp(developmentOtp);
                  setError('');
                }}
              >
                <Text style={styles.autoFillText}>Auto-fill OTP</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>OTP Code</Text>
            <InputField
              icon="key"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChangeText={(value) => {
                setOtp(value.replace(/[^0-9]/g, '').slice(0, 4));
                if (error) setError('');
              }}
              keyboardType="numeric"
              maxLength={4}
              error={!!error}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <Button 
            title={loading ? "Verifying..." : "Verify OTP"} 
            onPress={handleVerifyOtp} 
            style={styles.button}
            disabled={loading}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <Text style={styles.resendLink} onPress={handleResendOtp}>
              Resend
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  phoneNumber: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    marginTop: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  resendLink: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  devOtpContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  devOtpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  devOtpCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  autoFillButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  autoFillText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 