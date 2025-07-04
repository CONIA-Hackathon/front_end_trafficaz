import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Button from '../../components/Button';
import AlertCard from '../../components/AlertCard';

const HomeScreen = () => {
  const sampleAlert = {
    title: 'Heavy Traffic Ahead',
    description: 'Congestion reported on Main St. Expect delays.'
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TrafficAZ!</Text>
      <Text style={styles.subtitle}>Your real-time traffic congestion and alert app.</Text>
      <Button title="Go to Profile" onPress={() => {}} style={styles.button} />
      <Link href="/ProfileScreen" style={styles.link}>Or tap here for Profile (expo-router Link)</Link>
      <Text style={styles.sectionTitle}>Latest Alert:</Text>
      <AlertCard alert={sampleAlert} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 24 },
  button: { width: '80%' },
  link: { color: '#007bff', marginVertical: 12 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 32, marginBottom: 8 },
});

export default HomeScreen;

