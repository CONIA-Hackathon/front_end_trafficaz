import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const OtpScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <TextInput placeholder="Enter OTP" style={styles.input} keyboardType="number-pad" />
      <Button title="Verify" onPress={() => navigation.navigate('HomeScreen')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 16 },
});

export default OtpScreen; 