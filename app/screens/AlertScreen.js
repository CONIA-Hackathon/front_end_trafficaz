import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const AlertScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Congestion Alerts</Text>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24 },
});

export default AlertScreen; 