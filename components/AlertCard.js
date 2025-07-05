import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const AlertCard = ({ alert }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{alert.title}</Text>
    <Text style={styles.description}>{alert.description}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.alertBackground,
    borderColor: colors.alertBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    color: colors.alertText,
  },
  description: {
    fontSize: 14,
    color: colors.alertText,
  },
});

export default AlertCard; 