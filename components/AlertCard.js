import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlertCard = ({ alert }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{alert.title}</Text>
    <Text style={styles.description}>{alert.description}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
});

export default AlertCard; 