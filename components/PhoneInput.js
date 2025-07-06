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
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError
      ]}>
        {/* Country Code Section */}
        <View style={styles.countryCodeSection}>
          <Text style={styles.countryCodeText}>+237</Text>
          <View style={styles.separator} />
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputSection}>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
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
  countryCodeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 8,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  inputSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    marginTop: 8,
    marginLeft: 4,
  },
});

export default PhoneInput; 