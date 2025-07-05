import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import AlertCard from '../../components/AlertCard';
import Toggle from '../../components/Toggle';
import colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const HomeScreen = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const sampleAlert = {
    title: 'Heavy Traffic Ahead',
    description: 'Congestion reported on Main St. Expect delays.',
    time:'2:30pm'
  };

  // Handle long names by truncating if needed
  const getDisplayName = (name) => {
    if (!name) return 'User';
    return name.length > 20 ? name.substring(0, 20) + '...' : name;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>
            <Text style={styles.traffic}>Traffic</Text>
            <Text style={styles.az}>AZ</Text>
          </Text>
          <Text style={styles.subtitle}>{t('realTimeAlerts')}</Text>
        </View>
        <View style={styles.headerRight}>
          <Toggle />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeIcon}>
              <Ionicons name="sunny" size={24} color={colors.primary} />
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{getDisplayName(user?.name)}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="car" size={20} color={colors.primary} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Active Routes</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="alert-circle" size={20} color={colors.warning} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Alerts Today</Text>
            </View>
          </View>
        </View>

        {/* Latest Alert */}
        <View style={styles.alertSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications" size={20} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>{t('latestTrafficAlert')}</Text>
          </View>
          <AlertCard alert={sampleAlert} />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flash" size={20} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>{t('reportTraffic')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons name="map" size={24} color={colors.info} />
              </View>
              <Text style={styles.actionText}>{t('viewMap')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons name="settings" size={24} color={colors.secondary} />
              </View>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons name="help-circle" size={24} color={colors.warning} />
              </View>
              <Text style={styles.actionText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Route saved successfully</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="alert" size={16} color={colors.warning} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Traffic alert received</Text>
                <Text style={styles.activityTime}>15 minutes ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  traffic: {
    color: colors.primary,
  },
  az: {
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100, // Add extra padding for bottom navigation
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  alertSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityList: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default HomeScreen;

