import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import colors from '../constants/colors';
import { navigationConfig } from '../utils/navigationConfig';

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const tabs = [
    { label: 'Home', icon: 'home-outline', path: '/Home' },
    { label: 'Map', icon: 'map-outline', path: '/Map' },
    { label: 'Scheduled', icon: 'time-outline', path: '/ScheduledRoutes' },
    { label: 'Alerts', icon: 'notifications-outline', path: '/Alert' },
    { label: 'Me', icon: 'person-outline', path: '/Profile' }
  ];

  // Calculate dynamic height based on device
  const dynamicHeight = Math.max(60, 60 + insets.bottom);
  const dynamicPaddingBottom = Math.max(insets.bottom, 10);

  return (
    <View style={[
      styles.navBar,
      {
        height: dynamicHeight,
        paddingBottom: dynamicPaddingBottom,
        backgroundColor: navigationConfig.bottomNav.backgroundColor,
        elevation: navigationConfig.bottomNav.elevation,
        shadowOpacity: navigationConfig.bottomNav.shadowOpacity,
        shadowRadius: navigationConfig.bottomNav.shadowRadius,
      }
    ]}>
      {tabs.map((tab, index) => {
        const isActive = pathname === tab.path;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(tab.path)}
            style={[styles.tabItem, isActive && styles.activeTab]}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={isActive ? tab.icon.replace('-outline', '') : tab.icon}
                size={24}
                color={isActive ? navigationConfig.bottomNav.activeColor : navigationConfig.bottomNav.inactiveColor}
              />
            </View>
            <Text style={[
              styles.tabLabel, 
              {
                color: isActive ? navigationConfig.bottomNav.activeColor : navigationConfig.bottomNav.inactiveColor,
              },
              isActive && styles.activeLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.primary + '20',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    zIndex: 1000,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 44, // Minimum touch target size for accessibility
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    width: 32,
    height: 32,
  },
  activeTab: {
    // Active state styling
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    fontWeight: '600',
  }
});

export default BottomNav;
