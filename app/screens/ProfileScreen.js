import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav';
import Button from '../../components/Button';
import colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import * as userService from '../../services/userService';

const ProfileScreen = () => {
  const { user, token, logout } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const router = useRouter();
  
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Try to fetch real data from API
      if (token) {
        try {
          const [profileData, statsData] = await Promise.all([
            userService.getUserProfile(token),
            userService.getUserStats(token)
          ]);
          
          setUserData(profileData);
          setUserStats(statsData);
        } catch (error) {
          console.log('Using mock data due to API error:', error);
          // Fallback to mock data
          setUserData(userService.getMockUserData());
          setUserStats(userService.getMockUserStats());
        }
      } else {
        // Use mock data if no token
        setUserData(userService.getMockUserData());
        setUserStats(userService.getMockUserStats());
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to mock data
      setUserData(userService.getMockUserData());
      setUserStats(userService.getMockUserStats());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    console.log('=== LOGOUT PROCESS STARTED ===');
    console.log('Current user:', user);
    console.log('Current token:', token);
    
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            console.log('Logout cancelled by user');
          },
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('User confirmed logout, starting logout process...');
              setLogoutLoading(true);
              
              await logout();
              console.log('Logout successful, navigating to login...');
              
              // Navigate to login screen
              router.replace('/auth/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Logout Error', 'There was an error logging out. Please try again.');
            } finally {
              setLogoutLoading(false);
            }
          },
        },
      ]
    );
  };

  const profileOptions = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => {
        Alert.alert(
          'Edit Profile',
          'Profile editing feature will be available soon!',
          [{ text: 'OK' }]
        );
      },
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: userData?.preferences?.notifications ? 'Enabled' : 'Disabled',
      onPress: () => {
        Alert.alert(
          'Notifications',
          'Notification settings will be available soon!',
          [{ text: 'OK' }]
        );
      },
    },
    {
      icon: 'shield-outline',
      title: 'Privacy & Security',
      subtitle: 'Control your privacy settings',
      onPress: () => {
        Alert.alert(
          'Privacy & Security',
          'Privacy settings will be available soon!',
          [{ text: 'OK' }]
        );
      },
    },
    {
      icon: 'language-outline',
      title: 'Language',
      subtitle: language === 'en' ? 'English' : 'Français',
      onPress: () => {
        const newLang = language === 'en' ? 'fr' : 'en';
        changeLanguage(newLang);
        Alert.alert(
          'Language Changed',
          `Language changed to ${newLang === 'en' ? 'English' : 'Français'}`,
          [{ text: 'OK' }]
        );
      },
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => {
        Alert.alert(
          'Help & Support',
          'Contact us at support@trafficaz.com\n\nPhone: +237 612 345 678',
          [{ text: 'OK' }]
        );
      },
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      subtitle: 'App version and information',
      onPress: () => {
        Alert.alert(
          'About TrafficAZ',
          'TrafficAZ v1.0.0\n\nA driver-first, voice-interactive traffic assistant for Cameroon.\n\n© 2025 TrafficAZ Team',
          [{ text: 'OK' }]
        );
      },
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
        <BottomNav />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadUserData(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {userData?.avatar ? (
                  <Image source={{ uri: userData.avatar }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={40} color={colors.white} />
                )}
              </View>
              <TouchableOpacity style={styles.editAvatar}>
                <Ionicons name="camera" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userData?.name || user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{userData?.email || user?.email || 'user@example.com'}</Text>
              <Text style={styles.userPhone}>{userData?.phoneNumber || user?.phoneNumber || '+1234567890'}</Text>
              {userData?.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats?.totalRoutes || 0}</Text>
            <Text style={styles.statLabel}>Routes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats?.totalAlerts || 0}</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats?.totalReports || 0}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <Ionicons name={option.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            variant="danger"
            onPress={handleLogout}
            icon="log-out-outline"
            style={styles.logoutButton}
            loading={logoutLoading}
          />
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>TrafficAZ v1.0.0</Text>
    </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 100, // Extra padding to account for bottom navigation
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 4,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
  optionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logoutContainer: {
    marginBottom: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    width: '100%',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default ProfileScreen;
