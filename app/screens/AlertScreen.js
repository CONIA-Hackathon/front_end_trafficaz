import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import colors from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const AlertScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    notificationType: 'sms',
    isEnabled: true,
    doNotDisturbStart: '22:00',
    doNotDisturbEnd: '07:00',
    radiusKm: 2,
    voiceGender: 'female',
    voiceSpeed: 0.8,
  });

  // Mock notification data (replace with API calls)
  const mockNotifications = [
    {
      id: 1,
      notificationType: 'traffic_alert',
      message: 'Heavy traffic detected on Main Street. Expected delay: 15 minutes.',
      congestionClusterId: 'cluster_001',
      sentAt: '2025-01-06T10:30:00.000Z',
      status: 'delivered',
      priority: 'high',
      location: 'Central Yaoundé'
    },
    {
      id: 2,
      notificationType: 'route_alert',
      message: 'Your scheduled route "Home to School" has moderate traffic.',
      congestionClusterId: 'cluster_002',
      sentAt: '2025-01-06T09:15:00.000Z',
      status: 'delivered',
      priority: 'medium',
      location: 'University Area'
    },
    {
      id: 3,
      notificationType: 'community_alert',
      message: 'Traffic congestion reported by community member near Central Market.',
      congestionClusterId: 'cluster_003',
      sentAt: '2025-01-06T08:45:00.000Z',
      status: 'delivered',
      priority: 'high',
      location: 'Central Market'
    },
    {
      id: 4,
      notificationType: 'route_alert',
      message: 'Clear traffic conditions on your "Work Commute" route.',
      congestionClusterId: 'cluster_004',
      sentAt: '2025-01-06T07:30:00.000Z',
      status: 'delivered',
      priority: 'low',
      location: 'Business District'
    }
  ];

  useEffect(() => {
    loadNotifications();
    loadNotificationSettings();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('https://backend-traffic-detection-production.up.railway.app/api/v1/notifications/history?limit=50');
      // const data = await response.json();
      
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications(mockNotifications); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('https://backend-traffic-detection-production.up.railway.app/api/v1/notifications/subscribe');
      // const data = await response.json();
      
      // Mock settings
      setNotificationSettings({
        id: 1,
        notificationType: 'sms',
        isEnabled: true,
        doNotDisturbStart: '22:00',
        doNotDisturbEnd: '07:00',
        radiusKm: 2,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
      });
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const updateNotificationSettings = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('https://backend-traffic-detection-production.up.railway.app/api/v1/notifications/subscribe', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(settingsForm)
      // });
      // const data = await response.json();

      setNotificationSettings(prev => ({ ...prev, ...settingsForm }));
      setSettingsModalVisible(false);
      Alert.alert('Success', 'Notification settings updated successfully!');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const speakNotification = async (notification) => {
    try {
      if (speaking) {
        // Stop current speech
        await Speech.stop();
        setSpeaking(false);
        setCurrentSpeakingId(null);
        return;
      }

      setSpeaking(true);
      setCurrentSpeakingId(notification.id);

      const speechText = `Traffic Alert: ${notification.message}. Location: ${notification.location}. Priority: ${notification.priority}.`;

      // Voice settings based on user preferences
      const voiceSettings = getVoiceSettings();

      await Speech.speak(speechText, {
        language: voiceSettings.language,
        pitch: voiceSettings.pitch,
        rate: voiceSettings.rate,
        voice: voiceSettings.voice,
        onDone: () => {
          setSpeaking(false);
          setCurrentSpeakingId(null);
        },
        onError: (error) => {
          console.error('Speech error:', error);
          setSpeaking(false);
          setCurrentSpeakingId(null);
        }
      });
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setSpeaking(false);
      setCurrentSpeakingId(null);
    }
  };

  const getVoiceSettings = () => {
    const { voiceGender, voiceSpeed } = settingsForm;
    
    // Voice configurations for Cameroon with African accents
    const voiceConfigs = {
      female: {
        language: 'en-US',
        pitch: 1.1,
        rate: voiceSpeed,
        // Try different voice options for better African accent
        voice: voiceGender === 'female' ? 'com.apple.ttsbundle.Karen-compact' : 'com.apple.ttsbundle.Daniel-compact'
      },
      male: {
        language: 'en-US',
        pitch: 0.9,
        rate: voiceSpeed,
        voice: voiceGender === 'male' ? 'com.apple.ttsbundle.Daniel-compact' : 'com.apple.ttsbundle.Karen-compact'
      }
    };

    const genderConfig = voiceConfigs[voiceGender] || voiceConfigs.female;

    return {
      language: genderConfig.language,
      pitch: genderConfig.pitch,
      rate: genderConfig.rate,
      // For Android and other platforms, use language codes that might have African accents
      voice: genderConfig.voice
    };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'alert-circle';
      case 'medium': return 'warning';
      case 'low': return 'checkmark-circle';
      default: return 'information-circle';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'traffic_alert': return 'Traffic Alert';
      case 'route_alert': return 'Route Update';
      case 'community_alert': return 'Community Report';
      default: return 'Notification';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Traffic Alerts</Text>
          <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
            <Ionicons name="settings" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading alerts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Traffic Alerts</Text>
        <View style={styles.headerActions}>
          {/* <TouchableOpacity 
            style={styles.testVoiceHeaderButton}
            onPress={() => {
              const testMessage = "Traffic alert test for Cameroon. Voice system ready.";
              const voiceSettings = getVoiceSettings();
              Speech.speak(testMessage, voiceSettings);
            }}
          >
            <Ionicons name="volume-high" size={20} color={colors.primary} />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
            <Ionicons name="settings" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="notifications" size={20} color={colors.primary} />
          <Text style={styles.statNumber}>{notifications.length}</Text>
          <Text style={styles.statLabel}>Total Alerts</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="alert-circle" size={20} color={colors.danger} />
          <Text style={styles.statNumber}>
            {notifications.filter(n => n.priority === 'high').length}
          </Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="volume-high" size={20} color={colors.success} />
          <Text style={styles.statNumber}>
            {notificationSettings?.isEnabled ? 'ON' : 'OFF'}
          </Text>
          <Text style={styles.statLabel}>Voice Alerts</Text>
        </View>
      </View>

      {/* Alerts List */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Alerts</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up! No traffic alerts at the moment.
            </Text>
          </View>
        ) : (
          <View style={styles.alertsList}>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.alertCard}>
                {/* Alert Header */}
                <View style={styles.alertHeader}>
                  <View style={styles.alertInfo}>
                    <View style={styles.alertTypeContainer}>
                      <Ionicons 
                        name={getPriorityIcon(notification.priority)} 
                        size={16} 
                        color={getPriorityColor(notification.priority)} 
                      />
                      <Text style={styles.alertType}>
                        {getNotificationTypeLabel(notification.notificationType)}
                      </Text>
                    </View>
                    <Text style={styles.alertTime}>
                      {formatTime(notification.sentAt)}
                    </Text>
                  </View>
                  <View style={styles.priorityBadge}>
                    <Text style={[
                      styles.priorityText, 
                      { color: getPriorityColor(notification.priority) }
                    ]}>
                      {notification.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Alert Message */}
                <View style={styles.alertMessage}>
                  <Text style={styles.messageText}>{notification.message}</Text>
                  <Text style={styles.locationText}>
                    📍 {notification.location}
                  </Text>
                </View>

                {/* Alert Actions */}
                <View style={styles.alertActions}>
                  <TouchableOpacity 
                    style={[
                      styles.actionButton,
                      speaking && currentSpeakingId === notification.id && styles.actionButtonActive
                    ]}
                    onPress={() => speakNotification(notification)}
                  >
                    <Ionicons 
                      name={speaking && currentSpeakingId === notification.id ? "stop" : "volume-high"} 
                      size={16} 
                      color={speaking && currentSpeakingId === notification.id ? colors.danger : colors.primary} 
                    />
                    <Text style={[
                      styles.actionButtonText,
                      speaking && currentSpeakingId === notification.id && styles.actionButtonTextActive
                    ]}>
                      {speaking && currentSpeakingId === notification.id ? 'Stop' : 'Listen'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      // Navigate to map screen
                      router.push('/Map');
                    }}
                  >
                    <Ionicons name="map" size={16} color={colors.info} />
                    <Text style={styles.actionButtonText}>View Map</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      // TODO: Share alert
                      Alert.alert('Share Alert', 'Share this traffic alert with others.');
                    }}
                  >
                    <Ionicons name="share" size={16} color={colors.secondary} />
                    <Text style={styles.actionButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification Settings</Text>
              <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Voice Alerts Toggle */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="volume-high" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Voice Alerts</Text>
                    <Text style={styles.settingSubtitle}>Listen to traffic alerts while driving</Text>
                  </View>
                </View>
                <Switch
                  value={settingsForm.isEnabled}
                  onValueChange={(value) => setSettingsForm(prev => ({ ...prev, isEnabled: value }))}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={settingsForm.isEnabled ? colors.primary : colors.textSecondary}
                />
              </View>

              {/* Notification Type */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="notifications" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Notification Type</Text>
                    <Text style={styles.settingSubtitle}>How you want to receive alerts</Text>
                  </View>
                </View>
                <View style={styles.typeSelector}>
                  {['sms', 'push', 'email'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        settingsForm.notificationType === type && styles.typeButtonActive
                      ]}
                      onPress={() => setSettingsForm(prev => ({ ...prev, notificationType: type }))}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        settingsForm.notificationType === type && styles.typeButtonTextActive
                      ]}>
                        {type.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Do Not Disturb */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="moon" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Do Not Disturb</Text>
                    <Text style={styles.settingSubtitle}>Quiet hours for notifications</Text>
                  </View>
                </View>
                <View style={styles.timeInputs}>
                  <TextInput
                    style={styles.timeInput}
                    value={settingsForm.doNotDisturbStart}
                    onChangeText={(text) => setSettingsForm(prev => ({ ...prev, doNotDisturbStart: text }))}
                    placeholder="22:00"
                  />
                  <Text style={styles.timeSeparator}>to</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={settingsForm.doNotDisturbEnd}
                    onChangeText={(text) => setSettingsForm(prev => ({ ...prev, doNotDisturbEnd: text }))}
                    placeholder="07:00"
                  />
                </View>
              </View>

              {/* Alert Radius */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="location" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Alert Radius</Text>
                    <Text style={styles.settingSubtitle}>Distance for traffic alerts</Text>
                  </View>
                </View>
                <View style={styles.radiusSelector}>
                  {[1, 2, 5, 10].map((radius) => (
                    <TouchableOpacity
                      key={radius}
                      style={[
                        styles.radiusButton,
                        settingsForm.radiusKm === radius && styles.radiusButtonActive
                      ]}
                      onPress={() => setSettingsForm(prev => ({ ...prev, radiusKm: radius }))}
                    >
                      <Text style={[
                        styles.radiusButtonText,
                        settingsForm.radiusKm === radius && styles.radiusButtonTextActive
                      ]}>
                        {radius} km
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Voice Settings */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="mic" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Voice Settings</Text>
                    <Text style={styles.settingSubtitle}>Customize your voice alerts</Text>
                  </View>
                </View>
              </View>

              {/* Voice Gender */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="person" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Voice Gender</Text>
                    <Text style={styles.settingSubtitle}>Choose male or female voice for Cameroon</Text>
                  </View>
                </View>
                <View style={styles.genderSelector}>
                  {[
                    { key: 'female', label: 'Female', icon: 'female' },
                    { key: 'male', label: 'Male', icon: 'male' }
                  ].map((gender) => (
                    <TouchableOpacity
                      key={gender.key}
                      style={[
                        styles.genderButton,
                        settingsForm.voiceGender === gender.key && styles.genderButtonActive
                      ]}
                      onPress={() => setSettingsForm(prev => ({ ...prev, voiceGender: gender.key }))}
                    >
                      <Ionicons 
                        name={gender.icon} 
                        size={16} 
                        color={settingsForm.voiceGender === gender.key ? colors.white : colors.textSecondary} 
                      />
                      <Text style={[
                        styles.genderButtonText,
                        settingsForm.voiceGender === gender.key && styles.genderButtonTextActive
                      ]}>
                        {gender.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Voice Speed */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="speedometer" size={20} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Voice Speed</Text>
                    <Text style={styles.settingSubtitle}>Adjust speaking speed for clear understanding</Text>
                  </View>
                </View>
                <View style={styles.speedSelector}>
                  {[
                    { key: 0.6, label: 'Slow' },
                    { key: 0.8, label: 'Normal' },
                    { key: 1.0, label: 'Fast' },
                    { key: 1.2, label: 'Very Fast' }
                  ].map((speed) => (
                    <TouchableOpacity
                      key={speed.key}
                      style={[
                        styles.speedButton,
                        settingsForm.voiceSpeed === speed.key && styles.speedButtonActive
                      ]}
                      onPress={() => setSettingsForm(prev => ({ ...prev, voiceSpeed: speed.key }))}
                    >
                      <Text style={[
                        styles.speedButtonText,
                        settingsForm.voiceSpeed === speed.key && styles.speedButtonTextActive
                      ]}>
                        {speed.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Test Voice Button */}
              <View style={styles.settingItem}>
                <TouchableOpacity 
                  style={styles.testVoiceButton}
                  onPress={() => {
                    const testMessage = "Hello! This is your traffic alert voice test. The system is working perfectly for Cameroon.";
                    const voiceSettings = getVoiceSettings();
                    Speech.speak(testMessage, voiceSettings);
                  }}
                >
                  <Ionicons name="play-circle" size={20} color={colors.white} />
                  <Text style={styles.testVoiceButtonText}>Test Voice Settings</Text>
                </TouchableOpacity>
                
                <View style={styles.voiceNote}>
                  <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
                  <Text style={styles.voiceNoteText}>
                    Note: Voice accent depends on your device's available voices. For better African accents, consider installing additional voice packages in your device settings.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setSettingsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={updateNotificationSettings}
              >
                <Text style={styles.saveButtonText}>Save Settings</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  testVoiceHeaderButton: {
    padding: 8,
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
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
    paddingHorizontal: 40,
  },
  alertsList: {
    gap: 16,
  },
  alertCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 6,
  },
  alertTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  alertMessage: {
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  actionButtonActive: {
    backgroundColor: colors.danger + '15',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  actionButtonTextActive: {
    color: colors.danger,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
  settingItem: {
    marginBottom: 24,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 8,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: colors.background,
  },
  timeSeparator: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  radiusSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  radiusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radiusButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  radiusButtonTextActive: {
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
  genderSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  genderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  genderButtonTextActive: {
    color: colors.white,
  },
  accentSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: '48%',
  },
  accentButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  accentFlag: {
    fontSize: 16,
  },
  accentButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  accentButtonTextActive: {
    color: colors.white,
  },
  speedSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  speedButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  speedButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  speedButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  speedButtonTextActive: {
    color: colors.white,
  },
  testVoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.success,
    borderRadius: 8,
    marginTop: 8,
  },
  testVoiceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  voiceNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  voiceNoteText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

export default AlertScreen; 