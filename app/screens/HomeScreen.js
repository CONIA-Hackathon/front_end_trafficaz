import React from 'react';
import {useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Button from '../../components/Button';
import AlertCard from '../../components/AlertCard';
import ButtomNav from '../../components/BottomNav';
import Toggle from '../../components/Toggle'

const HomeScreen = () => {
  
  const sampleAlert = {
    title: 'Heavy Traffic Ahead',
    description: 'Congestion reported on Main St. Expect delays.',
    time:'2:30pm'
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TrafficAZ!</Text>
      <Text style={styles.subtitle}>Your real-time traffic congestion and alert app.</Text>
      <Button title="Go to Profile" onPress={() => {}} style={styles.button} />
      <Link href="/ProfileScreen" style={styles.link}>Or tap here for Profile (expo-router Link)</Link>
      <Toggle />
      <View style={styles.alertArea}>
        <Text style={styles.sectionTitle}>Traffic Alert:</Text>
        <AlertCard alert={sampleAlert} />        
      </View>
      <ButtomNav />
    </View>
  );
};

const styles = StyleSheet.create({
   alertArea: {
    flexDirection: 'colomn',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 2,
    alignItems: 'flex-start',
    gap: 2
  },
  container: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 16, backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 24 },
  button: { width: '80%' },
  link: { color: '#007bff', marginVertical: 12 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 3, marginBottom: 8 },
});

export default HomeScreen;

