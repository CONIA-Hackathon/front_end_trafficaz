import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const VoiceCommandGuide = ({ visible, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('traffic');

  const commandCategories = {
    traffic: {
      title: 'Traffic Queries',
      icon: 'car',
      commands: [
        {
          phrase: 'Hey TrafficAZ, what\'s the traffic situation between my current location and Melen?',
          description: 'Check traffic conditions to a specific destination'
        },
        {
          phrase: 'Hey TrafficAZ, how is traffic on my route to work?',
          description: 'Check traffic on your scheduled routes'
        },
        {
          phrase: 'Hey TrafficAZ, is there heavy traffic ahead?',
          description: 'Check for traffic congestion in your direction'
        }
      ]
    },
    reporting: {
      title: 'Traffic Reporting',
      icon: 'radio-button-on',
      commands: [
        {
          phrase: 'Hey TrafficAZ, report traffic in my area',
          description: 'Report traffic congestion in your current location'
        },
        {
          phrase: 'Hey TrafficAZ, there\'s an accident ahead',
          description: 'Report emergency traffic situations'
        },
        {
          phrase: 'Hey TrafficAZ, road is blocked',
          description: 'Report road closures or blockages'
        }
      ]
    },
    alerts: {
      title: 'Alerts & Notifications',
      icon: 'notifications',
      commands: [
        {
          phrase: 'Hey TrafficAZ, check my traffic alerts',
          description: 'Get your latest traffic notifications'
        },
        {
          phrase: 'Hey TrafficAZ, read my alerts',
          description: 'Listen to your traffic alerts'
        },
        {
          phrase: 'Hey TrafficAZ, any new notifications?',
          description: 'Check for new traffic alerts'
        }
      ]
    },
    navigation: {
      title: 'Navigation & Maps',
      icon: 'map',
      commands: [
        {
          phrase: 'Hey TrafficAZ, open the traffic map',
          description: 'Launch the interactive traffic map'
        },
        {
          phrase: 'Hey TrafficAZ, show me the best route',
          description: 'Get optimal route suggestions'
        },
        {
          phrase: 'Hey TrafficAZ, navigate to work',
          description: 'Start navigation to a saved destination'
        }
      ]
    },
    general: {
      title: 'General Commands',
      icon: 'help-circle',
      commands: [
        {
          phrase: 'Hey TrafficAZ, what can you do?',
          description: 'Learn about available voice commands'
        },
        {
          phrase: 'Hey TrafficAZ, stop listening',
          description: 'Deactivate voice recognition temporarily'
        },
        {
          phrase: 'Hey TrafficAZ, help',
          description: 'Get voice command assistance'
        }
      ]
    },
    weather: {
      title: 'Weather Commands',
      icon: 'partly-sunny',
      commands: [
        {
          phrase: 'Hey TrafficAZ, how is the weather?',
          description: 'Get current weather conditions'
        },
        {
          phrase: 'Hey TrafficAZ, how is weather affecting traffic?',
          description: 'Check weather impact on traffic'
        },
        {
          phrase: 'Hey TrafficAZ, what\'s the weather forecast?',
          description: 'Get weather predictions for the day'
        },
        {
          phrase: 'Hey TrafficAZ, will it rain during my commute?',
          description: 'Check rain probability for travel time'
        }
      ]
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      traffic: 'car',
      reporting: 'radio-button-on',
      alerts: 'notifications',
      navigation: 'map',
      general: 'help-circle',
      weather: 'partly-sunny'
    };
    return icons[category] || 'help-circle';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="mic" size={24} color={colors.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Voice Commands</Text>
              <Text style={styles.headerSubtitle}>Say "Hey TrafficAZ" to activate</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {Object.keys(commandCategories).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.categoryTabActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Ionicons 
                name={getCategoryIcon(category)} 
                size={16} 
                color={selectedCategory === category ? colors.white : colors.textSecondary} 
              />
              <Text style={[
                styles.categoryTabText,
                selectedCategory === category && styles.categoryTabTextActive
              ]}>
                {commandCategories[category].title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Commands List */}
        <ScrollView style={styles.commandsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.categoryHeader}>
            <Ionicons 
              name={getCategoryIcon(selectedCategory)} 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.categoryTitle}>{commandCategories[selectedCategory].title}</Text>
          </View>

          {commandCategories[selectedCategory].commands.map((command, index) => (
            <View key={index} style={styles.commandCard}>
              <View style={styles.commandHeader}>
                <View style={styles.commandIcon}>
                  <Ionicons name="mic" size={16} color={colors.primary} />
                </View>
                <Text style={styles.commandNumber}>Command {index + 1}</Text>
              </View>
              
              <Text style={styles.commandPhrase}>"{command.phrase}"</Text>
              <Text style={styles.commandDescription}>{command.description}</Text>
              
              <View style={styles.commandExample}>
                <Ionicons name="information-circle" size={14} color={colors.textSecondary} />
                <Text style={styles.exampleText}>
                  Example: {command.phrase.replace('Hey TrafficAZ, ', '')}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color={colors.warning} />
            <Text style={styles.tipsTitle}>Voice Tips</Text>
          </View>
          
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.tipText}>Speak clearly and at a normal pace</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.tipText}>Wait for the "I'm listening" response</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.tipText}>Use specific locations for better results</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.tipText}>Voice activation works best in quiet environments</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  closeButton: {
    padding: 8,
  },
  categoryTabs: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryTabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  categoryTabTextActive: {
    color: colors.white,
  },
  commandsContainer: {
    flex: 1,
    padding: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  commandCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  commandIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commandNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  commandPhrase: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  commandDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  commandExample: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  exampleText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  tipsContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
});

export default VoiceCommandGuide; 