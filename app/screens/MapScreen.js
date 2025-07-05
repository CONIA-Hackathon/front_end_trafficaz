import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import locationService from '../../services/locationService';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 3.848033, // Default to Yaoundé, Cameroon
    longitude: 11.502075,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const mapRef = useRef(null);

  // Sample traffic data - in real app, this would come from your backend
  const trafficMarkers = [
    {
      id: '1',
      coordinate: { latitude: 3.848033, longitude: 11.502075 },
      title: 'Heavy Traffic',
      description: 'Congestion on main road',
      severity: 'high',
      type: 'congestion'
    },
    {
      id: '2',
      coordinate: { latitude: 3.850000, longitude: 11.504000 },
      title: 'Accident',
      description: 'Minor accident reported',
      severity: 'medium',
      type: 'accident'
    },
    {
      id: '3',
      coordinate: { latitude: 3.846000, longitude: 11.500000 },
      title: 'Road Work',
      description: 'Construction in progress',
      severity: 'low',
      type: 'construction'
    }
  ];

  useEffect(() => {
    initializeLocation();
    
    // Cleanup location updates on unmount
    return () => {
      locationService.stopLocationUpdates();
    };
  }, []);

  const initializeLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Check if location services are enabled
      const locationEnabled = await locationService.isLocationEnabled();
      if (!locationEnabled) {
        setErrorMsg('Please enable location services in your device settings');
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await locationService.getCurrentLocation();
      setLocation(currentLocation);
      
      // Set map region to user's location
      const newRegion = locationService.getMapRegion(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      setRegion(newRegion);

      console.log('Map initialized with user location:', {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });

    } catch (error) {
      console.error('Error initializing location:', error);
      setErrorMsg('Could not get your current location. Please check your permissions.');
    } finally {
      setLoading(false);
    }
  };

  const centerOnUserLocation = async () => {
    try {
      if (location) {
        const newRegion = locationService.getMapRegion(
          location.coords.latitude,
          location.coords.longitude
        );
        
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      } else {
        // If no location, try to get it again
        await initializeLocation();
      }
    } catch (error) {
      console.error('Error centering on user location:', error);
      Alert.alert('Error', 'Could not center on your location');
    }
  };

  const getMarkerIcon = (type, severity) => {
    const iconMap = {
      congestion: severity === 'high' ? 'car' : 'car-outline',
      accident: 'warning',
      construction: 'construct',
      roadwork: 'construct-outline'
    };
    
    return iconMap[type] || 'alert-circle';
  };

  const getMarkerColor = (severity) => {
    const colorMap = {
      high: colors.danger,
      medium: colors.warning,
      low: colors.info
    };
    
    return colorMap[severity] || colors.secondary;
  };

  const handleReportTraffic = () => {
    Alert.alert(
      'Report Traffic',
      'This feature will allow you to report traffic incidents. Coming soon!',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Traffic Map</Text>
          <Text style={styles.headerSubtitle}>Real-time traffic alerts</Text>
        </View>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={centerOnUserLocation}
        >
          <Ionicons name="locate" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        showsTraffic={true}
        onRegionChangeComplete={setRegion}
      >
        {/* User location marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
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

        {/* Traffic markers */}
        {trafficMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          >
            <View style={[styles.trafficMarker, { backgroundColor: getMarkerColor(marker.severity) }]}>
              <Ionicons 
                name={getMarkerIcon(marker.type, marker.severity)} 
                size={16} 
                color={colors.white} 
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Bottom Info Panel */}
      <View style={styles.infoPanel}>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>High Traffic</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.info }]} />
            <Text style={styles.legendText}>Low</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.reportButton} onPress={handleReportTraffic}>
          <Ionicons name="add-circle" size={20} color={colors.white} />
          <Text style={styles.reportButtonText}>Report Traffic</Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity onPress={initializeLocation}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  trafficMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  reportButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: colors.danger + '10',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    flex: 1,
  },
  retryText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MapScreen; 