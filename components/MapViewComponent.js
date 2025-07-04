import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapViewComponent = () => (
  <View style={styles.container}>
    <Text>Map will be displayed here</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 8,
  },
});

export default MapViewComponent; 