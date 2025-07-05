import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const Toggle = () => {
  const [enabled, setEnabled] = useState(false);

  const toggleSwitch = () => setEnabled(previous => !previous);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Voice Notifications {enabled ? 'On' : 'Off'}
      </Text>
      <Switch
        value={enabled}
        onValueChange={toggleSwitch}
        thumbColor={enabled ? '#FF3951' : '#ccc'}
        trackColor={{ false: '#aaa', true: '#aaa' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    color: '#333'
  }
});

export default Toggle;
