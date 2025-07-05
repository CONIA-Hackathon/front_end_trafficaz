import { Platform, Dimensions } from 'react-native';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Check if device has notch or home indicator
export const hasNotch = () => {
  if (Platform.OS === 'ios') {
    // iPhone X and newer have notches
    return height >= 812;
  }
  return false;
};

// Check if device has gesture navigation (Android 10+)
export const hasGestureNavigation = () => {
  if (Platform.OS === 'android') {
    // This is a simplified check - in production you might want to use
    // react-native-device-info or similar library for more accurate detection
    return Platform.Version >= 29; // Android 10+
  }
  return false;
};

// Get safe area insets for different devices
export const getSafeAreaInsets = () => {
  const baseInsets = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  if (Platform.OS === 'ios') {
    if (hasNotch()) {
      return {
        ...baseInsets,
        top: 44, // Status bar + notch area
        bottom: 34, // Home indicator
      };
    } else {
      return {
        ...baseInsets,
        top: 20, // Status bar only
        bottom: 0, // No home indicator
      };
    }
  } else if (Platform.OS === 'android') {
    if (hasGestureNavigation()) {
      return {
        ...baseInsets,
        top: 24, // Status bar
        bottom: 16, // Gesture navigation area
      };
    } else {
      return {
        ...baseInsets,
        top: 24, // Status bar
        bottom: 0, // No gesture navigation
      };
    }
  }

  return baseInsets;
};

// Get bottom navigation height including safe area
export const getBottomNavHeight = () => {
  const insets = getSafeAreaInsets();
  const baseHeight = 60; // Base navigation height
  return baseHeight + insets.bottom;
};

// Check if device is in landscape mode
export const isLandscape = () => {
  return width > height;
};

// Get device type
export const getDeviceType = () => {
  if (Platform.OS === 'ios') {
    if (width >= 768) {
      return 'tablet';
    }
    return 'phone';
  } else {
    // Android device type detection
    const pixelDensity = width * height;
    if (pixelDensity >= 2073600) { // 1920x1080 and above
      return 'tablet';
    }
    return 'phone';
  }
};

// Navigation bar configuration
export const navigationConfig = {
  // Bottom navigation settings
  bottomNav: {
    height: getBottomNavHeight(),
    backgroundColor: '#FF3951',
    activeColor: '#FFFFFF',
    inactiveColor: '#FFFFFF80',
    elevation: 8,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  
  // Safe area settings
  safeArea: {
    insets: getSafeAreaInsets(),
    backgroundColor: '#F8F9FA',
  },
  
  // Status bar settings
  statusBar: {
    backgroundColor: '#FF3951',
    barStyle: 'light-content',
    translucent: false,
  },
  
  // Device specific settings
  device: {
    type: getDeviceType(),
    hasNotch: hasNotch(),
    hasGestureNavigation: hasGestureNavigation(),
    isLandscape: isLandscape(),
  },
};

export default navigationConfig; 