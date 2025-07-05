import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import colors from '../constants/colors';
import { fontFamily, fontSizes } from '../constants/fonts';
import { useLanguage } from '../context/LanguageContext';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
];

// Replace this with your actual remote GIF URL
const REMOTE_GIF_URL = 'https://i.pinimg.com/originals/08/a4/67/08a467875def4f8c3cda15bb693263ee.gif';

export default function OnboardingScreen() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { language, changeLanguage, t } = useLanguage();

  // HTML content for the WebView to display the GIF without borders
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border: none;
            outline: none;
          }
        </style>
      </head>
      <body>
        <img src="${REMOTE_GIF_URL}" alt="TrafficAZ GIF" />
      </body>
    </html>
  `;

  const handleLanguageChange = (newLanguage) => {
    console.log('Language changed to:', newLanguage);
    changeLanguage(newLanguage);
    setDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.gifContainer}>
          <WebView
            source={{ html: htmlContent }}
            style={styles.gif}
            originWhitelist={['*']}
            useWebKit
            scrollEnabled={false}
            javaScriptEnabled={false}
            allowsInlineMediaPlayback
            backgroundColor="transparent"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
          />
        </View>
        <Text style={styles.title}>
          <Text style={styles.traffic}>Traffic</Text>
          <Text style={styles.az}>AZ</Text>
        </Text>
      </View>
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownOpen(!dropdownOpen)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownText}>
            {languages.find(l => l.value === language)?.label || t('selectLanguage')}
          </Text>
          <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        {dropdownOpen && (
          <View style={styles.dropdownList}>
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.value}
                style={styles.dropdownItem}
                onPress={() => handleLanguageChange(lang.value)}
              >
                <Text style={styles.dropdownItemText}>{lang.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/auth/login')}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-forward" size={28} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
  },
  centerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gifContainer: {
    width: 220,
    height: 220,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  gif: {
    width: 220,
    height: 220,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  traffic: {
    fontFamily: fontFamily.bold,
    color: colors.white
  },
  az: {
    color: colors.textPrimary,
  },
  dropdownWrapper: {
    width: '50%',
    minWidth: 220,
    alignItems: 'center',
    marginBottom: 0,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: 220,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  dropdownText: {
    color: colors.textPrimary,
    fontSize: fontSizes.base,
    fontFamily: fontFamily.medium,
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 3,
    zIndex: 10,
    paddingVertical: 4,
    marginTop: 2,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  dropdownItemText: {
    fontSize: fontSizes.base,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

