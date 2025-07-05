import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Link, usePathname } from 'expo-router';

const BottomNav = () => {
  const pathname = usePathname();

  const tabs = [
    { label: 'Home', icon: 'home-outline', path: '/' },
    { label: 'Map', icon: 'map-outline', path: '/map' },
    { label: 'Alerts', icon: 'notifications-outline', path: '/notifications' },
    { label: 'Me', icon: 'person-outline', path: '/profile' }
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab, index) => {
        const isActive = pathname === tab.path;

        return (
          <Link key={index} href={tab.path} asChild>
            <View style={[styles.tabItem, isActive && styles.activeTab]}>
              <Icon
                name={tab.icon}
                size={24}
                color={isActive ? '#4cc9f0' : '#fff'}
              />
              <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
            </View>
          </Link>
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
    borderColor: '#2e3a80',
    elevation: 10,
    zIndex: 100
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
    borderTopColor: '#4cc9f0' // Light cyan indicator
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
