import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  Dimensions, 
  TextInput,
  Animated,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/Button';
import colors from '../../constants/colors';
import { verifyOtp, sendOtp } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const { width, height } = Dimensions.get('window');

export default function OtpScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  
  const router = useRouter();
  const { phoneNumber, login, developmentOtp, clearDevelopmentOtp } = useAuth();
  const { t } = useLanguage();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Debug: Log OTP screen data
  console.log('=== OTP SCREEN DATA ===');
  console.log('Phone Number:', phoneNumber);
  console.log('Development OTP:', developmentOtp);
  console.log('Current OTP Input:', otp.join(''));

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Start pulse animation for OTP display
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Start resend timer
    if (resendTimer === 0) {
      setResendTimer(30);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validateOtp = () => {
    const otpString = otp.join('');
    if (!otpString || otpString.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
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
        router.replace('/screens/HomeScreen');
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
        router.replace('/screens/HomeScreen');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      Alert.alert('Verification Failed', error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    try {
      setLoading(true);
      const response = await sendOtp(phoneNumber);
      console.log('OTP resent:', response);
      
      // Reset timer
      setResendTimer(30);
      
      Alert.alert('OTP Resent', 'A new OTP has been sent to your phone number.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
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
      
      // Show success feedback
      Alert.alert(
        'OTP Auto-filled!',
        'The OTP has been automatically filled. You can now verify.',
        [{ text: 'OK' }]
      );
    }
  };

  const toggleOtpVisibility = () => {
    setShowOtp(!showOtp);
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
      <LinearGradient
        colors={[colors.primary + '20', colors.background]}
        style={styles.gradient}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
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
            {/* Icon */}
            <Animated.View 
              style={[
                styles.iconContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <View style={styles.iconBackground}>
                <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
              </View>
            </Animated.View>

            <Text style={styles.title}>Verify Your Phone</Text>
            <Text style={styles.subtitle}>
              Enter the 4-digit code sent to{'\n'}
              <Text style={styles.phoneNumber}>{phoneNumber}</Text>
            </Text>

            {/* Development OTP Display */}
            {developmentOtp && (
              <View style={styles.devOtpContainer}>
                <View style={styles.devOtpHeader}>
                  <Ionicons name="code-slash" size={20} color={colors.warning} />
                  <Text style={styles.devOtpTitle}>Development OTP</Text>
                  <TouchableOpacity onPress={toggleOtpVisibility}>
                    <Ionicons 
                      name={showOtp ? "eye-off" : "eye"} 
                      size={20} 
                      color={colors.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
                
                {showOtp && (
                  <Animated.View style={styles.devOtpCodeContainer}>
                    <Text style={styles.devOtpCode}>{developmentOtp}</Text>
                    <Text style={styles.devOtpExpiry}>Expires in 5 minutes</Text>
                  </Animated.View>
                )}
                
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
              <Text style={styles.otpLabel}>Enter OTP Code</Text>
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
                    {digit && (
                      <View style={styles.otpDot}>
                        <Text style={styles.otpDotText}>{digit}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            {/* Verify Button */}
            <Button 
              title="Verify OTP" 
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
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity 
                onPress={handleResendOtp}
                disabled={resendTimer > 0}
                style={resendTimer > 0 && styles.resendDisabled}
              >
                <Text style={[
                  styles.resendLink,
                  resendTimer > 0 && styles.resendLinkDisabled
                ]}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
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
    borderWidth: 2,
    borderColor: colors.warning + '30',
    borderStyle: 'dashed',
  },
  devOtpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  devOtpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginHorizontal: 10,
  },
  devOtpCodeContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.warning + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warning + '20',
  },
  devOtpCode: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.warning,
    letterSpacing: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  devOtpExpiry: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
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
    position: 'relative',
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
  otpDot: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: [{ translateX: -10 }],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDotText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
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
  resendDisabled: {
    opacity: 0.7,
  },
  resendLinkDisabled: {
    color: colors.textSecondary,
  },
}); 