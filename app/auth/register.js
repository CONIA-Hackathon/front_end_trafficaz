import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
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
        <Text style={styles.title}>{t('createAccount')}</Text>
        <Text style={styles.subtitle}>{t('joinTrafficAZ')}</Text>

        <View style={styles.form}>
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
            title={loading ? t('creatingAccount') : t('register')} 
            onPress={handleRegister} 
            style={styles.button}
            disabled={loading}
          />
          
          <View style={styles.loginLink}>
            <Text style={styles.loginText}>{t('alreadyHaveAccount')} </Text>
            <Text style={styles.linkText} onPress={() => router.push('/auth/login')}>
              {t('loginHere')}
            </Text>
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
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
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
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
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