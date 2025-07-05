import { 
  useFonts, 
  Mulish_300Light,
  Mulish_400Regular,
  Mulish_500Medium,
  Mulish_600SemiBold,
  Mulish_700Bold,
  Mulish_800ExtraBold,
  Mulish_900Black
} from '@expo-google-fonts/mulish';

export const fontFamily = {
  light: 'Mulish_300Light',
  regular: 'Mulish_400Regular',
  medium: 'Mulish_500Medium',
  semiBold: 'Mulish_600SemiBold',
  bold: 'Mulish_700Bold',
  extraBold: 'Mulish_800ExtraBold',
  black: 'Mulish_900Black',
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 48,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};

// Hook to load fonts
export const useAppFonts = () => {
  const [fontsLoaded] = useFonts({
    Mulish_300Light,
    Mulish_400Regular,
    Mulish_500Medium,
    Mulish_600SemiBold,
    Mulish_700Bold,
    Mulish_800ExtraBold,
    Mulish_900Black,
  });

  return fontsLoaded;
}; 