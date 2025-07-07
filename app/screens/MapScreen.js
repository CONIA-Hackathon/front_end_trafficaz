import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  TextInput,
  FlatList,
  Keyboard,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import locationService from '../../services/locationService';
import * as Location from 'expo-location';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 3.848033,
    longitude: 11.502075,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [fieldFocus, setFieldFocus] = useState(null);
  const mapRef = useRef(null);

  const route = useRoute();
  const analysisResults = route.params?.analysisResults || [];

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
    return () => locationService.stopLocationUpdates();
  }, []);

  const initializeLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const locationEnabled = await locationService.isLocationEnabled();
      if (!locationEnabled) {
        setErrorMsg('Please enable location services.');
        setLoading(false);
        return;
      }
      const currentLocation = await locationService.getCurrentLocation();
      setLocation(currentLocation);
      const newRegion = locationService.getMapRegion(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      setRegion(newRegion);
    } catch (error) {
      console.error(error);
      setErrorMsg('Location permissions not granted.');
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async (text) => {
    if (!text) return;
    const results = await Location.geocodeAsync(text);
    setSuggestions(results);
  };

  const handleSelectLocation = (locationObj) => {
    const label = `${locationObj.name || ''} ${locationObj.street || ''} ${locationObj.city || ''}`.trim();
    const coords = {
      latitude: locationObj.latitude,
      longitude: locationObj.longitude
    };
    if (fieldFocus === 'start') setStart(label);
    else setEnd(label);
    setRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
    mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 1000);
    setSuggestions([]);
    Keyboard.dismiss();
  };

  const centerOnUserLocation = async () => {
    if (location) {
      const newRegion = locationService.getMapRegion(location.coords.latitude, location.coords.longitude);
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    } else await initializeLocation();
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
    Alert.alert('Report Traffic', 'Feature coming soon!', [{ text: 'OK' }]);
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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Traffic Map</Text>
          <Text style={styles.headerSubtitle}>Real-time traffic alerts</Text>
        </View>
        <TouchableOpacity style={styles.locationButton} onPress={centerOnUserLocation}>
          <Ionicons name="locate" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Start location"
          value={start}
          onFocus={() => setFieldFocus('start')}
          onChangeText={(text) => {
            setStart(text);
            searchLocation(text);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="End location"
          value={end}
          onFocus={() => setFieldFocus('end')}
          onChangeText={(text) => {
            setEnd(text);
            searchLocation(text);
          }}
        />
        {suggestions.length > 0 && (
          <FlatList
            style={styles.suggestionList}
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectLocation(item)} style={styles.suggestionItem}>
                <Text>{item.name || item.street || `${item.latitude}, ${item.longitude}`}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

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

        {/* Render analysis results as markers */}
        {analysisResults.map((result) => (
          <Marker
            key={result.id}
            coordinate={{
              latitude: result.coordinates.latitude,
              longitude: result.coordinates.longitude,
            }}
            pinColor={
              result.analysis.trafficLevel === 'SEVERE' ? 'red' :
              result.analysis.trafficLevel === 'NO_TRAFFIC' ? 'orange' :
              result.analysis.trafficLevel === 'MEDIUM' ? 'yellow' :
              'green'
            }
          >
            <View style={[styles.trafficMarker, {
              backgroundColor:
                result.analysis.trafficLevel === 'SEVERE' ? colors.danger :
                result.analysis.trafficLevel === 'NO_TRAFFIC' ? colors.warning :
                result.analysis.trafficLevel === 'MEDIUM' ? colors.info :
                colors.success
            }]}
            >
              <Ionicons name="car" size={16} color={colors.white} />
            </View>
            <MapView.Callout>
              <View style={{minWidth: 120}}>
                <Text style={{fontWeight: 'bold'}}>Congestion: {result.analysis.trafficLevel}</Text>
                <Text>Vehicles: {result.analysis.vehicleCount}</Text>
                <Text>Time: {new Date(result.timestamp).toLocaleTimeString()}</Text>
                {result.location && <Text>Location: {result.location}</Text>}
              </View>
            </MapView.Callout>
          </Marker>
        ))}

        {/* Existing static traffic markers (optional, can remove) */}
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
  },
  inputContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 999,
  },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionList: {
    backgroundColor: colors.white,
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
