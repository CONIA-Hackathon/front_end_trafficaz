import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Button from '../../components/Button';
import AlertCard from '../../components/AlertCard';
import Toggle from '../../components/Toggle';
import colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const HomeScreen = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const sampleAlert = {
    title: 'Heavy Traffic Ahead',
    description: 'Congestion reported on Main St. Expect delays.',
    time:'2:30pm'
  };

  // Mock scheduled routes data
  const scheduledRoutes = [
    {
      id: '1',
      name: 'Home to School',
      startLocation: 'Home',
      endLocation: 'University of Yaoundé',
      time: '07:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      isActive: true,
      lastCheck: '2 hours ago',
      trafficLevel: 'Medium'
    },
    {
      id: '2',
      name: 'Work Commute',
      startLocation: 'Home',
      endLocation: 'Central Business District',
      time: '08:30',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      isActive: true,
      lastCheck: '1 hour ago',
      trafficLevel: 'High'
    },
    {
      id: '3',
      name: 'Weekend Shopping',
      startLocation: 'Home',
      endLocation: 'Central Market',
      time: '10:00',
      days: ['Sat'],
      isActive: false,
      lastCheck: '3 days ago',
      trafficLevel: 'Low'
    }
  ];

  // Calculate stats from scheduled routes
  const activeRoutes = scheduledRoutes.filter(route => route.isActive).length;
  const totalRoutes = scheduledRoutes.length;
  const todayAlerts = 3; // Mock data

  // Mock recent activity based on scheduled routes
  const recentActivity = [
    {
      id: '1',
      type: 'route_check',
      icon: 'checkmark-circle',
      color: colors.success,
      text: 'Home to School route checked - Medium traffic',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'traffic_alert',
      icon: 'alert',
      color: colors.warning,
      text: 'High traffic detected on Work Commute route',
      time: '1 hour ago'
    },
    {
      id: '3',
      type: 'route_added',
      icon: 'add-circle',
      color: colors.primary,
      text: 'New route "Weekend Shopping" scheduled',
      time: '3 days ago'
    },
    {
      id: '4',
      type: 'route_updated',
      icon: 'pencil',
      color: colors.info,
      text: 'Work Commute time updated to 8:30 AM',
      time: '1 week ago'
    }
  ];

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

  const getTrafficLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const navigateToScheduledRoutes = () => {
    router.push('/ScheduledRoutes');
  };

  const navigateToMap = () => {
    router.push('/Map');
  };

  const navigateToAlerts = () => {
    router.push('/Alert');
  };

  const navigateToProfile = () => {
    router.push('/Profile');
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
              <Ionicons name="time" size={20} color={colors.primary} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{activeRoutes}</Text>
              <Text style={styles.statLabel}>Active Routes</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="alert-circle" size={20} color={colors.warning} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{todayAlerts}</Text>
              <Text style={styles.statLabel}>Alerts Today</Text>
            </View>
          </View>
        </View>

        {/* Scheduled Routes Section */}
        <View style={styles.scheduledRoutesSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>Scheduled Routes</Text>
            <TouchableOpacity onPress={navigateToScheduledRoutes}>
              <Ionicons name="add-circle" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scheduledRoutesList}>
            {scheduledRoutes.slice(0, 2).map((route) => (
              <View key={route.id} style={styles.scheduledRouteCard}>
                <View style={styles.routeHeader}>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeName}>{route.name}</Text>
                    <Text style={styles.routeLocation}>
                      {route.startLocation} → {route.endLocation}
                    </Text>
                  </View>
                  <View style={styles.routeStatus}>
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: route.isActive ? colors.success : colors.textSecondary }
                    ]} />
                    <Text style={styles.statusText}>
                      {route.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.routeDetails}>
                  <View style={styles.routeTime}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.timeText}>{route.time}</Text>
                    <Text style={styles.daysText}>{route.days.join(', ')}</Text>
                  </View>
                  
                  <View style={styles.routeTraffic}>
                    <Text style={styles.trafficLabel}>Last Check:</Text>
                    <Text style={styles.trafficValue}>{route.lastCheck}</Text>
                    <View style={styles.trafficLevel}>
                      <View style={[
                        styles.trafficDot, 
                        { backgroundColor: getTrafficLevelColor(route.trafficLevel) }
                      ]} />
                      <Text style={styles.trafficLevelText}>{route.trafficLevel}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            
            {scheduledRoutes.length > 2 && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={navigateToScheduledRoutes}
              >
                <Text style={styles.viewAllText}>View All ({scheduledRoutes.length})</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
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
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToScheduledRoutes}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Add Route</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToMap}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="map" size={24} color={colors.info} />
              </View>
              <Text style={styles.actionText}>{t('viewMap')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToAlerts}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="notifications" size={24} color={colors.warning} />
              </View>
              <Text style={styles.actionText}>View Alerts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToProfile}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="person" size={24} color={colors.secondary} />
              </View>
              <Text style={styles.actionText}>Profile</Text>
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
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: activity.color + '15' }]}>
                  <Ionicons name={activity.icon} size={16} color={activity.color} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{activity.text}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
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
  scheduledRoutesSection: {
    marginBottom: 24,
  },
  scheduledRoutesList: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduledRouteCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  routeLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  routeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  routeTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  daysText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  routeTraffic: {
    alignItems: 'flex-end',
  },
  trafficLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  trafficValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  trafficLevel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trafficDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  trafficLevelText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.primary + '05',
    borderRadius: 12,
    marginTop: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default HomeScreen;

