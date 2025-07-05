import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const Button = ({ title, onPress, style, textStyle, variant = 'primary', disabled = false }) => (
  <TouchableOpacity 
    style={[
      styles.button, 
      styles[variant], 
      disabled && styles.disabled,
      style
    ]} 
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.buttonPrimary,
  },
  secondary: {
    backgroundColor: colors.buttonSecondary,
  },
  disabled: {
    backgroundColor: colors.buttonDisabled,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: colors.textLight,
  },
  secondaryText: {
    color: colors.textLight,
  },
});

export default Button; 