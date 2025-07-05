import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const PhoneInput = ({ 
  value, 
  onChangeText, 
  placeholder = "Enter your phone number", 
  error = false, 
  style,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Remove +237 prefix from display value
  const getDisplayValue = (phoneNumber) => {
    if (!phoneNumber) return '';
    return phoneNumber.replace(/^\+237/, '');
  };

  // Add +237 prefix when updating the actual value
  const handleChangeText = (text) => {
    // Remove any non-digit characters
    const cleanText = text.replace(/\D/g, '');
    
    // Add +237 prefix
    const fullNumber = cleanText ? `+237${cleanText}` : '';
    
    onChangeText(fullNumber);
  };

  const displayValue = getDisplayValue(value);

  return (
    <View style={[styles.container, style]}>
      {/* Country Code Display */}
      <View style={styles.countryCodeContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>+237</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </View>
      </View>

      {/* Phone Number Input */}
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError
      ]}>
        <Ionicons 
          name="call" 
          size={20} 
          color={isFocused ? colors.primary : colors.textSecondary} 
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={displayValue}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          maxLength={9} // Cameroon numbers are typically 9 digits
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>

      {/* Helper Text */}
      <Text style={styles.helperText}>
        Enter your 9-digit phone number (e.g., 612345678)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  countryCodeContainer: {
    marginBottom: 8,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainerError: {
    borderColor: colors.danger,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    padding: 0,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default PhoneInput; 