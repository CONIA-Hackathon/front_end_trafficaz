import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';

const ScheduledRoutesScreen = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  
  // Mock data for scheduled routes
  const [scheduledRoutes, setScheduledRoutes] = useState([
    {
      id: '1',
      name: 'Home to School',
      startLocation: 'Home',
      endLocation: 'University of Yaoundé',
      startLat: 3.848033,
      startLng: 11.502075,
      endLat: 3.844119,
      endLng: 11.501346,
      time: '07:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      isActive: true,
      lastCheck: '2 hours ago',
      trafficLevel: 'Medium',
      estimatedTime: 25,
      distance: 2.5
    },
    {
      id: '2',
      name: 'Work Commute',
      startLocation: 'Home',
      endLocation: 'Central Business District',
      startLat: 3.848033,
      startLng: 11.502075,
      endLat: 3.850000,
      endLng: 11.504000,
      time: '08:30',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      isActive: true,
      lastCheck: '1 hour ago',
      trafficLevel: 'High',
      estimatedTime: 35,
      distance: 3.2
    },
    {
      id: '3',
      name: 'Weekend Shopping',
      startLocation: 'Home',
      endLocation: 'Central Market',
      startLat: 3.848033,
      startLng: 11.502075,
      endLat: 3.846000,
      endLng: 11.500000,
      time: '10:00',
      days: ['Sat'],
      isActive: false,
      lastCheck: '3 days ago',
      trafficLevel: 'Low',
      estimatedTime: 15,
      distance: 1.8
    }
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    startLocation: '',
    endLocation: '',
    time: '07:00',
  });

  const daysOfWeek = [
    { key: 'Mon', label: 'Mon' },
    { key: 'Tue', label: 'Tue' },
    { key: 'Wed', label: 'Wed' },
    { key: 'Thu', label: 'Thu' },
    { key: 'Fri', label: 'Fri' },
    { key: 'Sat', label: 'Sat' },
    { key: 'Sun', label: 'Sun' },
  ];

  const getTrafficLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getTrafficLevelIcon = (level) => {
    switch (level.toLowerCase()) {
      case 'high': return 'alert-circle';
      case 'medium': return 'warning';
      case 'low': return 'checkmark-circle';
      default: return 'information-circle';
    }
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const openAddModal = () => {
    setEditingRoute(null);
    setFormData({
      name: '',
      startLocation: '',
      endLocation: '',
      time: '07:00',
    });
    setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setModalVisible(true);
  };

  const openEditModal = (route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      time: route.time,
    });
    setSelectedDays(route.days);
    setModalVisible(true);
  };

  const saveRoute = () => {
    if (!formData.name || !formData.startLocation || !formData.endLocation || selectedDays.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newRoute = {
      id: editingRoute ? editingRoute.id : Date.now().toString(),
      name: formData.name,
      startLocation: formData.startLocation,
      endLocation: formData.endLocation,
      startLat: 3.848033, // Mock coordinates
      startLng: 11.502075,
      endLat: 3.844119,
      endLng: 11.501346,
      time: formData.time,
      days: selectedDays,
      isActive: true,
      lastCheck: 'Just now',
      trafficLevel: 'Medium',
      estimatedTime: 25,
      distance: 2.5
    };

    if (editingRoute) {
      setScheduledRoutes(prev => 
        prev.map(route => route.id === editingRoute.id ? newRoute : route)
      );
    } else {
      setScheduledRoutes(prev => [...prev, newRoute]);
    }

    setModalVisible(false);
    Alert.alert('Success', `Route ${editingRoute ? 'updated' : 'added'} successfully!`);
  };

  const deleteRoute = (routeId) => {
    Alert.alert(
      'Delete Route',
      'Are you sure you want to delete this scheduled route?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setScheduledRoutes(prev => prev.filter(route => route.id !== routeId));
          }
        }
      ]
    );
  };

  const toggleRouteStatus = (routeId) => {
    setScheduledRoutes(prev =>
      prev.map(route =>
        route.id === routeId
          ? { ...route, isActive: !route.isActive }
          : route
      )
    );
  };

  const checkRouteNow = (route) => {
    // Mock traffic check
    const trafficLevels = ['Low', 'Medium', 'High'];
    const randomLevel = trafficLevels[Math.floor(Math.random() * trafficLevels.length)];
    
    setScheduledRoutes(prev =>
      prev.map(r =>
        r.id === route.id
          ? { 
              ...r, 
              lastCheck: 'Just now',
              trafficLevel: randomLevel,
              estimatedTime: Math.floor(Math.random() * 30) + 10
            }
          : r
      )
    );

    Alert.alert(
      'Traffic Check',
      `Route: ${route.name}\nTraffic Level: ${randomLevel}\nEstimated Time: ${Math.floor(Math.random() * 30) + 10} minutes`
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scheduled Routes</Text>
        <TouchableOpacity onPress={openAddModal}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {scheduledRoutes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Scheduled Routes</Text>
            <Text style={styles.emptySubtitle}>
              Create your first scheduled route to get daily traffic alerts
            </Text>
            <TouchableOpacity style={styles.addFirstButton} onPress={openAddModal}>
              <Text style={styles.addFirstButtonText}>Add Your First Route</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.routesList}>
            {scheduledRoutes.map((route) => (
              <View key={route.id} style={styles.routeCard}>
                {/* Route Header */}
                <View style={styles.routeHeader}>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeName}>{route.name}</Text>
                    <Text style={styles.routeLocation}>
                      {route.startLocation} → {route.endLocation}
                    </Text>
                  </View>
                  <View style={styles.routeActions}>
                    <Switch
                      value={route.isActive}
                      onValueChange={() => toggleRouteStatus(route.id)}
                      trackColor={{ false: colors.border, true: colors.primary + '40' }}
                      thumbColor={route.isActive ? colors.primary : colors.textSecondary}
                    />
                  </View>
                </View>

                {/* Route Details */}
                <View style={styles.routeDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{route.time}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{route.days.join(', ')}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="car-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{route.distance} km</Text>
                    </View>
                  </View>

                  {/* Traffic Status */}
                  <View style={styles.trafficStatus}>
                    <View style={styles.trafficInfo}>
                      <Ionicons 
                        name={getTrafficLevelIcon(route.trafficLevel)} 
                        size={16} 
                        color={getTrafficLevelColor(route.trafficLevel)} 
                      />
                      <Text style={[
                        styles.trafficLevel, 
                        { color: getTrafficLevelColor(route.trafficLevel) }
                      ]}>
                        {route.trafficLevel} Traffic
                      </Text>
                    </View>
                    <Text style={styles.lastCheck}>Last: {route.lastCheck}</Text>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => checkRouteNow(route)}
                    >
                      <Ionicons name="refresh" size={16} color={colors.primary} />
                      <Text style={styles.actionButtonText}>Check Now</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => openEditModal(route)}
                    >
                      <Ionicons name="pencil" size={16} color={colors.secondary} />
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => deleteRoute(route.id)}
                    >
                      <Ionicons name="trash" size={16} color={colors.danger} />
                      <Text style={[styles.actionButtonText, { color: colors.danger }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingRoute ? 'Edit Route' : 'Add New Route'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Route Name (e.g., Home to School)"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              />

              <TextInput
                style={styles.input}
                placeholder="Start Location"
                value={formData.startLocation}
                onChangeText={(text) => setFormData(prev => ({ ...prev, startLocation: text }))}
              />

              <TextInput
                style={styles.input}
                placeholder="End Location"
                value={formData.endLocation}
                onChangeText={(text) => setFormData(prev => ({ ...prev, endLocation: text }))}
              />

              <TextInput
                style={styles.input}
                placeholder="Time (HH:MM)"
                value={formData.time}
                onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
              />

              <Text style={styles.sectionTitle}>Select Days</Text>
              <View style={styles.daysContainer}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day.key}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day.key) && styles.dayButtonActive
                    ]}
                    onPress={() => toggleDay(day.key)}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      selectedDays.includes(day.key) && styles.dayButtonTextActive
                    ]}>
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveRoute}
              >
                <Text style={styles.saveButtonText}>
                  {editingRoute ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  addFirstButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  routesList: {
    gap: 16,
  },
  routeCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 4,
  },
  routeLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  routeActions: {
    alignItems: 'center',
  },
  routeDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  trafficStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  trafficInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trafficLevel: {
    fontSize: 14,
    fontWeight: '600',
  },
  lastCheck: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  deleteButton: {
    backgroundColor: colors.danger + '10',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalBody: {
    maxHeight: 400,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  dayButtonTextActive: {
    color: colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default ScheduledRoutesScreen; 