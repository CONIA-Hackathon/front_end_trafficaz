import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';
import colors from '../constants/colors';
import realVoiceRecognitionService from '../services/RealVoiceRecognitionService';
import VoiceCommandGuide from './VoiceCommandGuide';

const Toggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('inactive'); // inactive, listening, processing
  const speechTimeoutRef = useRef(null);
  const [showGuide, setShowGuide] = useState(false);

  // Voice activation states
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');

  // Initialize voice activation service
  useEffect(() => {
    // Set up callbacks
    realVoiceRecognitionService.setOnWakeWordCallback(() => {
      setWakeWordDetected(true);
      setVoiceStatus('processing');
    });

    realVoiceRecognitionService.setOnCommandCallback((action, data) => {
      console.log('Voice command action:', action, data);
      // Handle navigation or other actions
    });

    return () => {
      // Cleanup
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      // Cleanup voice service
      realVoiceRecognitionService.destroy();
    };
  }, []);

  const toggleSwitch = async () => {
    const newState = !enabled;
    setEnabled(newState);
    
    if (newState) {
      // Enable voice activation
      const success = await realVoiceRecognitionService.start();
      if (success) {
        setVoiceStatus('listening');
        setIsListening(true);
      } else {
        setEnabled(false); // Revert if failed
      }
    } else {
      // Disable voice activation
      realVoiceRecognitionService.stop();
      setVoiceStatus('inactive');
      setIsListening(false);
      setWakeWordDetected(false);
      setCurrentCommand('');
    }
  };

  const getStatusColor = () => {
    if (wakeWordDetected) return colors.warning;
    
    switch (voiceStatus) {
      case 'listening': return colors.primary;
      case 'processing': return colors.warning;
      case 'inactive': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = () => {
    if (wakeWordDetected) {
      return 'Processing...';
    }
    
    switch (voiceStatus) {
      case 'listening': return 'Listening';
      case 'processing': return 'Processing';
      case 'inactive': return 'Voice Off';
      default: return 'Voice Off';
    }
  };

  const getStatusIcon = () => {
    if (wakeWordDetected) {
      return 'radio-button-on';
    }
    
    switch (voiceStatus) {
      case 'listening': return 'mic';
      case 'processing': return 'radio-button-on';
      case 'inactive': return 'mic-off';
      default: return 'mic-off';
    }
  };

  const testVoiceActivation = () => {
    if (enabled) {
      realVoiceRecognitionService.testVoiceActivation();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
            <Ionicons 
              name={getStatusIcon()} 
              size={16} 
              color={colors.white} 
            />
          </View>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
        
        <Switch
          value={enabled}
          onValueChange={toggleSwitch}
          trackColor={{ false: colors.border, true: colors.primary + '40' }}
          thumbColor={enabled ? colors.primary : colors.textSecondary}
        />
      </View>
      
      {enabled && (
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Say "Hey TrafficAZ" to activate voice commands
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.testButton}
              onPress={testVoiceActivation}
            >
              <Ionicons name="play-circle" size={16} color={colors.primary} />
              <Text style={styles.testButtonText}>Test</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.helpButton}
              onPress={() => setShowGuide(true)}
            >
              <Ionicons name="help-circle" size={16} color={colors.info} />
              <Text style={styles.helpButtonText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {wakeWordDetected && currentCommand && (
        <View style={styles.commandContainer}>
          <Text style={styles.commandText}>"{currentCommand}"</Text>
        </View>
      )}

      <VoiceCommandGuide 
        visible={showGuide} 
        onClose={() => setShowGuide(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  helpContainer: {
    marginTop: 4,
  },
  helpText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
  },
  testButtonText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '500',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.info + '15',
    borderRadius: 12,
  },
  helpButtonText: {
    fontSize: 10,
    color: colors.info,
    fontWeight: '500',
  },
  commandContainer: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  commandText: {
    fontSize: 10,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
});

export default Toggle;
