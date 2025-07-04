import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
];

export default function OnboardingScreen() {
  const [selectedLang, setSelectedLang] = useState('en');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Isometric REDSCAR.gif')} style={styles.gif} resizeMode="contain" />
      <Text style={styles.title}>Welcome to TrafficAZ!</Text>
      <Text style={styles.subtitle}>Get real-time traffic alerts and stay safe on the road.</Text>
      <Text style={styles.label}>Select Language:</Text>
      <View style={styles.dropdownContainer}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.value}
            style={[styles.dropdownItem, selectedLang === lang.value && styles.selectedDropdownItem]}
            onPress={() => setSelectedLang(lang.value)}
          >
            <Text style={styles.dropdownText}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f8f9fa' },
  gif: { width: 200, height: 200, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  dropdownContainer: { flexDirection: 'row', marginBottom: 24 },
  dropdownItem: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginHorizontal: 8, backgroundColor: '#fff' },
  selectedDropdownItem: { borderColor: '#007bff', backgroundColor: '#e6f0ff' },
  dropdownText: { fontSize: 16 },
  button: { backgroundColor: '#007bff', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

