import React, { useState, useEffect, useRef } from 'react'; 
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  Text,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import locationService from '../../services/locationService';

const { width, height } = Dimensions.get('window');

export default function RouteSetupScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [country, setCountry] = useState('Cameroon');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 3.848033, // Default to Yaoundé, Cameroon
    longitude: 11.502075,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [backendUsers, setBackendUsers] = useState([]);
  const mapRef = useRef(null);

  // Sample backend data - replace with actual API calls
  const sampleBackendUsers = [
    // High traffic area 1 - Central Yaoundé (8 users) - RED DOTS
    { id: 'traffic1', latitude: 3.848033, longitude: 11.502075, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic2', latitude: 3.848100, longitude: 11.502150, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic3', latitude: 3.848200, longitude: 11.502200, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic4', latitude: 3.848300, longitude: 11.502100, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic5', latitude: 3.848150, longitude: 11.502300, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic6', latitude: 3.848250, longitude: 11.502050, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic7', latitude: 3.848050, longitude: 11.502250, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic8', latitude: 3.848350, longitude: 11.502180, timestamp: Date.now(), isTraffic: true },
    
    // High traffic area 2 - Market area (6 users) - RED DOTS
    { id: 'traffic9', latitude: 3.846000, longitude: 11.500000, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic10', latitude: 3.846100, longitude: 11.500100, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic11', latitude: 3.846200, longitude: 11.500200, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic12', latitude: 3.846300, longitude: 11.500150, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic13', latitude: 3.846150, longitude: 11.500300, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic14', latitude: 3.846250, longitude: 11.500050, timestamp: Date.now(), isTraffic: true },
    
    // High traffic area 3 - Business district (5 users) - RED DOTS
    { id: 'traffic15', latitude: 3.850000, longitude: 11.504000, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic16', latitude: 3.850100, longitude: 11.504100, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic17', latitude: 3.850200, longitude: 11.504200, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic18', latitude: 3.850300, longitude: 11.504150, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic19', latitude: 3.850150, longitude: 11.504300, timestamp: Date.now(), isTraffic: true },
    
    // Medium traffic area 4 - University area (4 users) - RED DOTS
    { id: 'traffic20', latitude: 3.844119, longitude: 11.501346, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic21', latitude: 3.844200, longitude: 11.501400, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic22', latitude: 3.844300, longitude: 11.501500, timestamp: Date.now(), isTraffic: true },
    { id: 'traffic23', latitude: 3.844400, longitude: 11.501600, timestamp: Date.now(), isTraffic: true },
    
    // Regular users (non-traffic) - GRAY DOTS
    { id: 'user1', latitude: 3.852000, longitude: 11.506000, timestamp: Date.now(), isTraffic: false },
    { id: 'user2', latitude: 3.845000, longitude: 11.503000, timestamp: Date.now(), isTraffic: false },
    { id: 'user3', latitude: 3.849000, longitude: 11.505000, timestamp: Date.now(), isTraffic: false },
    { id: 'user4', latitude: 3.847000, longitude: 11.507000, timestamp: Date.now(), isTraffic: false },
    { id: 'user5', latitude: 3.843000, longitude: 11.508000, timestamp: Date.now(), isTraffic: false },
    { id: 'user6', latitude: 3.851000, longitude: 11.509000, timestamp: Date.now(), isTraffic: false },
  ];

  useEffect(() => {
    initializeMap();
    fetchBackendData();
  }, []);

  const initializeMap = async () => {
    try {
      setLoading(true);
      
      // Get user's current location
      const currentLocation = await locationService.getCurrentLocation();
      setUserLocation(currentLocation);
      
      // Set map region to user's location
      const newRegion = locationService.getMapRegion(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      setRegion(newRegion);
      
      console.log('User location set:', {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
      
    } catch (error) {
      console.error('Error getting user location:', error);
      Alert.alert('Location Error', 'Could not get your current location');
    } finally {
      setLoading(false);
    }
  };

  const fetchBackendData = async () => {
    try {
      // TODO: Replace with actual API calls to your backend
      // const response = await fetch('your-backend-api/users/locations');
      // const data = await response.json();
      
      // For now, using sample data
      setBackendUsers(sampleBackendUsers);
      
      console.log('Backend data loaded:', {
        users: sampleBackendUsers.length
      });
      
    } catch (error) {
      console.error('Error fetching backend data:', error);
    }
  };

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
      mapRef.current?.animateToRegion(newRegion, 1000);
    } else {
      Alert.alert('Error', 'Could not find coordinates for start or end location.');
    }

    setModalVisible(false);
  };

  const centerOnUserLocation = () => {
    if (userLocation) {
      const newRegion = locationService.getMapRegion(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    } else {
      initializeMap();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Search */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.searchContainer} 
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <Text style={styles.searchText}>
            {startLocation && endLocation 
              ? `${startLocation} → ${endLocation}` 
              : 'Search route from current location to destination'
            }
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={centerOnUserLocation}
        >
          <Ionicons name="locate" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView 
        ref={mapRef}
        style={styles.map} 
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        onRegionChangeComplete={setRegion}
        mapType="standard"
      >
        {/* User's current location */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Your Location"
            description="You are here"
          >
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationDot} />
              <View style={styles.userLocationPulse} />
            </View>
          </Marker>
        )}

        {/* Backend users as dots */}
        {backendUsers.map((user) => (
          <Marker 
            key={user.id} 
            coordinate={{ 
              latitude: user.latitude, 
              longitude: user.longitude 
            }}
            title={user.isTraffic ? `Traffic Location ${user.id}` : `User ${user.id}`}
            description={`Last updated: ${new Date(user.timestamp).toLocaleTimeString()}`}
          >
            <View style={user.isTraffic ? styles.trafficDot : styles.userDot} />
          </Marker>
        ))}

        {/* Route markers */}
        {startCoords && (
          <Marker coordinate={startCoords} pinColor="green" title="Start" />
        )}

        {endCoords && (
          <Marker coordinate={endCoords} pinColor="blue" title="End" />
        )}
      </MapView>

      {/* Info Panel */}
      <View style={styles.infoPanel}>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={styles.userLocationDot} />
            <Text style={styles.legendText}>Your Location</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.trafficDot} />
            <Text style={styles.legendText}>Traffic ({backendUsers.filter(u => u.isTraffic).length})</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.userDot} />
            <Text style={styles.legendText}>Other Users ({backendUsers.filter(u => !u.isTraffic).length})</Text>
          </View>
        </View>
      </View>

      {/* Route Search Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Plan Your Route</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              From: {userLocation ? 'Your Current Location' : 'Unknown Location'}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Destination (e.g., Yaoundé Central Market)"
              value={endLocation}
              onChangeText={setEndLocation}
              autoCapitalize="words"
            />
            
            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleRouteSearch}
            >
              <Text style={styles.searchButtonText}>Find Route</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  userLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  userLocationPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + '30',
    borderWidth: 1,
    borderColor: colors.primary + '50',
  },
  userDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.white,
  },
  trafficDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  infoPanel: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  trafficInfo: {
    alignItems: 'center',
  },
  trafficText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  trafficSubtext: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: colors.background,
  },
  searchButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
