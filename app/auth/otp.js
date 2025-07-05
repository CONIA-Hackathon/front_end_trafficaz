import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import colors from '../../constants/colors';
import { verifyOtp, sendOtp } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

export default function OtpScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const router = useRouter();
  const { phoneNumber, login, developmentOtp, clearDevelopmentOtp } = useAuth();
  const { t } = useLanguage();

  // Debug: Log OTP screen data
  console.log('=== OTP SCREEN DATA ===');
  console.log('Phone Number:', phoneNumber);
  console.log('Development OTP:', developmentOtp);
  console.log('Current OTP Input:', otp.join(''));

  const validateOtp = () => {
    const otpString = otp.join('');
    if (!otpString || otpString.length !== 4) {
      setError(t('validOtp'));
      return false;
    }
    setError('');
    return true;
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      setFocusedIndex(index + 1);
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      setFocusedIndex(index - 1);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;

    setLoading(true);
    try {
      const otpString = otp.join('');
      console.log('=== OTP VERIFICATION ===');
      console.log('Verifying OTP:', otpString);
      console.log('Phone Number:', phoneNumber);
      console.log('Development OTP available:', developmentOtp);
      
      const response = await verifyOtp(phoneNumber, otpString);
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
        router.replace('/HomeScreen');
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

  const handleAutoFill = () => {
    if (developmentOtp) {
      const otpArray = developmentOtp.split('');
      setOtp(otpArray);
      setError('');
      console.log('=== AUTO-FILL OTP ===');
      console.log('Auto-filling OTP:', developmentOtp);
      console.log('OTP auto-filled successfully');
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.title}>{t('verifyOtp')}</Text>
          <Text style={styles.subtitle}>
            {t('enterOtpCode')}{'\n'}
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          </Text>

          {/* Development OTP Display */}
          {developmentOtp && (
            <View style={styles.devOtpContainer}>
              <Text style={styles.devOtpTitle}>Development OTP</Text>
              <Text style={styles.devOtpCode}>{developmentOtp}</Text>
              <TouchableOpacity 
                style={styles.autoFillButton}
                onPress={handleAutoFill}
                activeOpacity={0.8}
              >
                <Ionicons name="copy-outline" size={16} color={colors.white} />
                <Text style={styles.autoFillText}>Auto-fill OTP</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <Text style={styles.otpLabel}>{t('otpCode')}</Text>
            <View style={styles.otpInputContainer}>
              {otp.map((digit, index) => (
                <View key={index} style={styles.otpInputWrapper}>
                  <TextInput
                    style={[
                      styles.otpInput,
                      focusedIndex === index && styles.otpInputFocused,
                      digit && styles.otpInputFilled
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => setFocusedIndex(index)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* Verify Button */}
          <Button 
            title={t('verifyOtpButton')} 
            onPress={handleVerifyOtp} 
            style={styles.verifyButton}
            loading={loading}
            disabled={loading}
            icon="checkmark-circle"
            iconPosition="right"
            size="large"
          />

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>{t('didntReceiveCode')} </Text>
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendLink}>{t('resend')}</Text>
            </TouchableOpacity>
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  phoneNumber: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  devOtpContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  devOtpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  devOtpCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    letterSpacing: 4,
  },
  autoFillButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  autoFillText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  otpContainer: {
    width: '100%',
    marginBottom: 32,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  otpInputWrapper: {
    width: 60,
    height: 60,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: colors.white,
    color: colors.textPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  otpInputFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  verifyButton: {
    width: '100%',
    marginBottom: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
}); 