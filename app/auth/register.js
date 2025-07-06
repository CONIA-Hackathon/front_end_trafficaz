import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import PhoneInput from '../../components/PhoneInput';
import colors from '../../constants/colors';
import { register, sendOtp } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setPhoneNumberForOtp, setDevelopmentOtpCode } = useAuth();
  const { language, t, loading: languageLoading } = useLanguage();

  // Debug: Log current language state
  console.log('Current language in register screen:', language);
  console.log('Language loading:', languageLoading);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    }

    // Phone number validation (now includes +237 prefix)
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = t('phoneRequired');
    } else if (!/^\+237\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = t('validPhone');
    }

    // Email validation (optional but if provided, must be valid)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validEmail');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordLength');
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordsDontMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Debug: Log the language being sent
      console.log('Selected language for registration:', language);
      
      // Register the user with fallback to 'en' if language is not set
      const registerResponse = await register({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        language: language || 'en' // Include the selected language with fallback
      });

      console.log('=== REGISTRATION SUCCESS ===');
      console.log('Full registration response:', registerResponse);
      console.log('Registration data sent:', {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: '***hidden***',
        language: language || 'en'
      });

      // Store phone number in context for OTP screen
      setPhoneNumberForOtp(formData.phoneNumber);

      // Extract OTP from registration response for development
      const otpCode = registerResponse.data?.otpCode;
      console.log('=== OTP EXTRACTION ===');
      console.log('OTP Code found:', otpCode);
      console.log('OTP Expires at:', registerResponse.data?.expiresAt);
      
      if (otpCode) {
        console.log('Development OTP Code:', otpCode);
        console.log('Storing OTP in context...');
        setDevelopmentOtpCode(otpCode);
        console.log('OTP stored successfully, navigating to OTP screen...');
        // Navigate to OTP screen
        router.push('/auth/otp');
      } else {
        console.log('No OTP in response, falling back to sendOtp...');
        // Fallback: Send OTP after successful registration
        const otpResponse = await sendOtp(formData.phoneNumber);
        console.log('OTP sent:', otpResponse);
        
        // Extract OTP from sendOtp response
        const sendOtpCode = otpResponse.data?.otpCode;
        if (sendOtpCode) {
          console.log('Development OTP from sendOtp:', sendOtpCode);
          console.log('Storing OTP in context...');
          setDevelopmentOtpCode(sendOtpCode);
          console.log('OTP stored successfully, navigating to OTP screen...');
        }
        
        router.push('/auth/otp');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Registration Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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
          {/* Brand Section */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Ionicons name="car-sport" size={48} color={colors.primary} />
              </View>
            </View>
            <Text style={styles.brandName}>TrafficAZ</Text>
            <Text style={styles.brandTagline}>Join the Smart Traffic Revolution</Text>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.title}>{t('createAccount')}</Text>
            <Text style={styles.subtitle}>{t('joinTrafficAZ')}</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <InputField
                icon="person"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                error={!!errors.name}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <PhoneInput
                value={formData.phoneNumber}
                onChangeText={(value) => updateFormData('phoneNumber', value)}
                error={!!errors.phoneNumber}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (Optional)</Text>
              <InputField
                icon="mail"
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                error={!!errors.email}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <InputField
                icon="lock-closed"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry
                maxLength={50}
                error={!!errors.password}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <InputField
                icon="lock-closed"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry
                maxLength={50}
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <Button 
              title={loading ? "Creating Account..." : t('register')} 
              onPress={handleRegister} 
              style={styles.registerButton}
              loading={loading}
              disabled={loading}
              icon="person-add"
              iconPosition="right"
              size="large"
            />
            
            <View style={styles.loginLink}>
              <Text style={styles.loginText}>{t('alreadyHaveAccount')} </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.linkText}>{t('loginHere')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    paddingBottom: 40,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  formSection: {
    width: '100%',
    maxWidth: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  registerButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
}); 