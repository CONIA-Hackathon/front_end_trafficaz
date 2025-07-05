import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, usePathname } from 'expo-router';

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: 'Home', icon: 'home-outline', path: '/Home' },
    { label: 'Map', icon: 'map-outline', path: '/Map' },
    { label: 'Alerts', icon: 'notifications-outline', path: '/Alert' },
    { label: 'Me', icon: 'person-outline', path: '/Profile' }
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab, index) => {
        const isActive = pathname === tab.path;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(tab.path)}
            style={[styles.tabItem, isActive && styles.activeTab]}
          >
            <Icon
              name={tab.icon}
              size={24}
              color={isActive ? '#4cc9f0' : '#fff'}
            />
            <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>
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
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    backgroundColor: '#FF3951',
    paddingVertical: 10,
    justifyContent: 'space-around',
    borderTopWidth: 0,
    elevation: 10,
    zIndex: 100,
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 2,
    borderTopWidth: 2,
    borderTopColor: 'transparent'
  },
  activeTab: {
    borderTopColor: '#4cc9f0'
  },
  tabLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4
  },
  activeLabel: {
    fontWeight: 'bold',
    color: '#4cc9f0'
  }
});

export default BottomNav;
