import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';
import Button from '../../components/Button';
import AlertCard from '../../components/AlertCard';
import Toggle from '../../components/Toggle';
import colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = () => {
  const { logout, user } = useAuth();
  
  const sampleAlert = {
    title: 'Heavy Traffic Ahead',
    description: 'Congestion reported on Main St. Expect delays.',
    time:'2:30pm'
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by the index screen
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>
            <Text style={styles.traffic}>Traffic</Text>
            <Text style={styles.az}>AZ</Text>
          </Text>
          <Text style={styles.subtitle}>Real-time traffic alerts</Text>
        </View>
        <View style={styles.headerRight}>
          <Toggle />
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome back, {user?.name || 'User'}!
          </Text>
        </View>

        <View style={styles.alertArea}>
          <Text style={styles.sectionTitle}>Latest Traffic Alert:</Text>
          <AlertCard alert={sampleAlert} />
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Button title="Report Traffic" onPress={() => {}} style={styles.actionButton} />
            <Button title="View Map" onPress={() => {}} style={styles.actionButton} />
          </View>
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
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  traffic: {
    color: colors.primary,
  },
  az: {
    color: colors.textPrimary,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  alertArea: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 0,
  },
});

export default HomeScreen;

