import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  error = false,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  style,
  textStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus && onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur && onBlur();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input];
    
    if (isFocused) {
      baseStyle.push(styles.inputFocused);
    }
    
    if (error) {
      baseStyle.push(styles.inputError);
    }
    
    if (disabled) {
      baseStyle.push(styles.inputDisabled);
    }
    
    if (multiline) {
      baseStyle.push(styles.inputMultiline);
    }
    
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    if (isFocused) {
      baseStyle.push(styles.containerFocused);
    }
    
    if (error) {
      baseStyle.push(styles.containerError);
    }
    
    if (disabled) {
      baseStyle.push(styles.containerDisabled);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  return (
    <View style={getContainerStyle()}>
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={
              error ? colors.danger : 
              isFocused ? colors.primary : 
              colors.textSecondary
            } 
          />
        </View>
      )}
      
      <TextInput
        style={getInputStyle()}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        keyboardType={keyboardType}
        maxLength={maxLength}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      
      {secureTextEntry && (
        <TouchableOpacity 
          style={styles.passwordToggle}
          onPress={togglePasswordVisibility}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={showPassword ? 'eye-off' : 'eye'} 
            size={20} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  containerFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.02 }],
  },
  containerError: {
    borderColor: colors.danger,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  containerDisabled: {
    backgroundColor: colors.grayLight,
    borderColor: colors.grayLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  iconContainer: {
    marginRight: 12,
    width: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 0,
    minHeight: 24,
  },
  inputFocused: {
    color: colors.textPrimary,
  },
  inputError: {
    color: colors.textPrimary,
  },
  inputDisabled: {
    color: colors.gray,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  passwordToggle: {
    marginLeft: 12,
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginLeft: 4,
  },
});

export default InputField; 