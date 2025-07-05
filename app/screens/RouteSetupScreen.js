import React, { useState } from 'react'; 
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  Text
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomNav from '../../components/BottomNav';
import { Ionicons } from '@expo/vector-icons';

export default function MapPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [country, setCountry] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);

  const carPositions = [
    { id: 'car1', latitude: 37.78825, longitude: -122.4324 },
    { id: 'car2', latitude: 37.78925, longitude: -122.4314 },
    { id: 'car3', latitude: 37.78725, longitude: -122.4334 },
  ];

  // Helper: calculate region to fit points with padding
  const getRegionFromPoints = (points) => {
    const latitudes = points.map(p => p.latitude);
    const longitudes = points.map(p => p.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLng + maxLng) / 2;

    // Add padding so markers don't stick to edges
    const latitudeDelta = (maxLat - minLat) * 1.5 || 0.01;
    const longitudeDelta = (maxLng - minLng) * 1.5 || 0.01;

    return {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    };
  };

  const geocodeLocation = async (location, countryContext) => {
    if (!location.trim()) return null;
    try {
      const query = countryContext ? `${location}, ${countryContext}` : location;
      const results = await Location.geocodeAsync(query);
      if (results.length > 0) {
        return results[0];
      }
      return null;
    } catch (e) {
      console.error('Geocode error:', e);
      return null;
    }
  };

  const handleRouteSearch = async () => {
    const startResult = await geocodeLocation(startLocation, country);
    const endResult = await geocodeLocation(endLocation, country);

    if (startResult && endResult) {
      const startPoint = {
        latitude: startResult.latitude,
        longitude: startResult.longitude,
      };
      const endPoint = {
        latitude: endResult.latitude,
        longitude: endResult.longitude,
      };

      setStartCoords(startPoint);
      setEndCoords(endPoint);

      // Calculate and set region to fit start and end locations
      const newRegion = getRegionFromPoints([startPoint, endPoint]);
      setRegion(newRegion);
    } else {
      alert('Could not find coordinates for start or end location.');
    }

    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.searchContainer} onPress={() => setModalVisible(true)}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tap to enter country, start & end locations"
          editable={false}
          pointerEvents="none"
        />
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
      </TouchableOpacity>

      <MapView style={styles.map} region={region}>
        {carPositions.map((car) => (
          <Marker key={car.id} coordinate={{ latitude: car.latitude, longitude: car.longitude }}>
            <View style={styles.dot} />
          </Marker>
        ))}

        {startCoords && (
          <Marker coordinate={startCoords} pinColor="green" title="Start" />
        )}

        {endCoords && (
          <Marker coordinate={endCoords} pinColor="blue" title="End" />
        )}
      </MapView>

      <BottomNav />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Route Details</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Country"
              value={country}
              onChangeText={setCountry}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Start Location"
              value={startLocation}
              onChangeText={setStartLocation}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="End Location"
              value={endLocation}
              onChangeText={setEndLocation}
              autoCapitalize="words"
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleRouteSearch}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    width: '90%',
    alignSelf: 'center',
    zIndex: 999,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 50,
    borderColor: '#ccc',
    borderWidth: 0,
    flex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#fff'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  searchButton: {
    backgroundColor: '#4361ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  }
});
