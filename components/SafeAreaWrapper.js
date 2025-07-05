import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../constants/colors';

const SafeAreaWrapper = ({ 
  children, 
  style, 
  backgroundColor = colors.background,
  paddingTop = true,
  paddingBottom = false,
  paddingHorizontal = true
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor,
        paddingTop: paddingTop ? Math.max(insets.top, 20) : 0,
        paddingBottom: paddingBottom ? Math.max(insets.bottom, 20) : 0,
        paddingHorizontal: paddingHorizontal ? 20 : 0,
      },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeAreaWrapper; 