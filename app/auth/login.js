import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import PhoneInput from '../../components/PhoneInput';
import colors from '../../constants/colors';
import { login, sendOtp } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setPhoneNumberForOtp } = useAuth();
  const { t } = useLanguage();

  const validateForm = () => {
    const newErrors = {};

    // Phone number validation (now includes +237 prefix)
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = t('phoneRequired');
    } else if (!/^\+237\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = t('validPhone');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Login the user
      const loginResponse = await login(formData.phoneNumber, formData.password);
      console.log('Login successful:', loginResponse);

      // Store phone number in context for OTP screen
      setPhoneNumberForOtp(formData.phoneNumber);

      // Send OTP after successful login
      const otpResponse = await sendOtp(formData.phoneNumber);
      console.log('OTP sent:', otpResponse);

      // Navigate to OTP screen
      router.push('/auth/otp');
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Login Failed', error.message || 'Invalid phone number or password. Please try again.');
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
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name="person-circle" size={50} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.title}>{t('welcomeBack')}</Text>
          <Text style={styles.subtitle}>{t('signInToAccount')}</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('phoneNumber')}</Text>
              <PhoneInput
                value={formData.phoneNumber}
                onChangeText={(value) => updateFormData('phoneNumber', value)}
                error={!!errors.phoneNumber}
              />
              {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('password')}</Text>
              <InputField
                icon="lock-closed"
                placeholder={t('password')}
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry
                maxLength={50}
                error={errors.password}
              />
            </View>

            <Button 
              title={t('login')} 
              onPress={handleLogin} 
              style={styles.loginButton}
              loading={loading}
              disabled={loading}
              icon="log-in"
              iconPosition="right"
              size="large"
            />
            
            <View style={styles.registerLink}>
              <Text style={styles.registerText}>{t('dontHaveAccount')} </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.linkText}>{t('registerHere')}</Text>
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
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 32,
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
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
}); 