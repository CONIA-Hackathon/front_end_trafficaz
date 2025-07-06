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
  Alert,
  Animated,
  FlatList,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import locationService from '../../services/locationService';
import trafficService from '../../services/trafficService';

const { width, height } = Dimensions.get('window');

// Popular locations in Cameroon
const POPULAR_LOCATIONS = [
  { name: 'Yaoundé Central Market', address: 'Yaoundé, Cameroon', type: 'market' },
  { name: 'Douala International Airport', address: 'Douala, Cameroon', type: 'airport' },
  { name: 'Yaoundé Nsimalen Airport', address: 'Yaoundé, Cameroon', type: 'airport' },
  { name: 'University of Yaoundé I', address: 'Yaoundé, Cameroon', type: 'university' },
  { name: 'Douala Port', address: 'Douala, Cameroon', type: 'port' },
  { name: 'Bamenda City', address: 'Bamenda, Cameroon', type: 'city' },
  { name: 'Buea City', address: 'Buea, Cameroon', type: 'city' },
  { name: 'Garoua City', address: 'Garoua, Cameroon', type: 'city' },
  { name: 'Maroua City', address: 'Maroua, Cameroon', type: 'city' },
  { name: 'Kribi Beach', address: 'Kribi, Cameroon', type: 'beach' },
  { name: 'Limbe Beach', address: 'Limbe, Cameroon', type: 'beach' },
  { name: 'Mount Cameroon', address: 'Buea, Cameroon', type: 'mountain' },
  { name: 'Waza National Park', address: 'Waza, Cameroon', type: 'park' },
  { name: 'Korup National Park', address: 'Korup, Cameroon', type: 'park' },
  { name: 'Cameroon Baptist Convention', address: 'Bamenda, Cameroon', type: 'church' },
  { name: 'St. Joseph Cathedral', address: 'Yaoundé, Cameroon', type: 'church' },
  { name: 'Douala Central Market', address: 'Douala, Cameroon', type: 'market' },
  { name: 'Bamenda Market', address: 'Bamenda, Cameroon', type: 'market' },
  { name: 'Buea Market', address: 'Buea, Cameroon', type: 'market' },
  { name: 'Garoua Market', address: 'Garoua, Cameroon', type: 'market' },
];

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
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState([]);
  const pulseAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnim2 = useRef(new Animated.Value(0.1)).current;
  const mapRef = useRef(null);
  
  // New state for enhanced search
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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
    startPulseAnimation();
    
    // Cleanup subscription on unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const startPulseAnimation = () => {
    // First pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Second pulse animation (delayed for layered effect)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim2, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim2, {
          toValue: 0.1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const initializeMap = async () => {
    try {
      setLoading(true);
      
      // First, request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        Alert.alert(
          'Location Permission Required',
          'This app needs location permission to show your current location and provide traffic information. Please enable location services in your device settings.',
          [
            { text: 'OK', onPress: () => {} }
          ]
        );
        setLoading(false);
        return;
      }

      // Check if location services are enabled
      const locationEnabled = await Location.hasServicesEnabledAsync();
      if (!locationEnabled) {
        console.log('Location services disabled');
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings to use this feature.',
          [
            { text: 'OK', onPress: () => {} }
          ]
        );
        setLoading(false);
        return;
      }

      // Get user's current location with error handling
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          maximumAge: 10000, // Accept cached location up to 10 seconds old
          timeout: 15000, // Timeout after 15 seconds
        });

        setUserLocation(currentLocation);
        
        // Set map region to user's location
        const newRegion = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        
        console.log('User location set:', {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        });

        // Start location tracking after getting initial location
        startLocationTracking();
        
      } catch (locationError) {
        console.error('Error getting current location:', locationError);
        
        // Fallback to using locationService if available
        try {
          const currentLocation = await locationService.getCurrentLocation();
          setUserLocation(currentLocation);
          
          const newRegion = locationService.getMapRegion(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude
          );
          setRegion(newRegion);
          
          console.log('User location set via locationService:', {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude
          });

          // Start location tracking after getting initial location
          startLocationTracking();
          
        } catch (serviceError) {
          console.error('Error getting location via service:', serviceError);
          Alert.alert(
            'Location Error',
            'Unable to get your current location. Please make sure location services are enabled and try again.',
            [
              { text: 'Retry', onPress: initializeMap },
              { text: 'Cancel', onPress: () => {} }
            ]
          );
        }
      }
      
    } catch (error) {
      console.error('Error initializing map:', error);
      Alert.alert(
        'Map Initialization Error',
        'There was an error setting up the map. Please try again.',
        [
          { text: 'Retry', onPress: initializeMap },
          { text: 'Cancel', onPress: () => {} }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = async () => {
    try {
      // Check permissions again
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for traffic tracking');
        return;
      }

      // Check if location services are enabled
      const locationEnabled = await Location.hasServicesEnabledAsync();
      if (!locationEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services to start tracking.',
          [
            { text: 'OK', onPress: () => {} }
          ]
        );
        return;
      }

      // Start watching position with high accuracy
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced, // Better for walking
          timeInterval: 3000, // Update every 3 seconds for more responsive tracking
          distanceInterval: 5, // Update every 5 meters for walking detection
        },
        (location) => {
          handleLocationUpdate(location);
        }
      );

      setLocationSubscription(subscription);
      setIsTracking(true);
      console.log('Location tracking started');
      
    } catch (error) {
      console.error('Error starting location tracking:', error);
      Alert.alert(
        'Tracking Error',
        'Could not start location tracking. Please check your location settings.',
        [
          { text: 'Retry', onPress: startLocationTracking },
          { text: 'Cancel', onPress: () => {} }
        ]
      );
    }
  };

  const handleLocationUpdate = (location) => {
    const { coords } = location;
    let speed = coords.speed || 0; // Speed in meters per second
    
    // Handle cases where GPS doesn't provide speed (common when walking)
    if (speed === 0 || speed === null) {
      // Calculate speed from distance traveled if we have previous location
      if (userLocation && userLocation.coords) {
        const distance = calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          coords.latitude,
          coords.longitude
        );
        const timeDiff = (Date.now() - userLocation.timestamp) / 1000; // seconds
        if (timeDiff > 0) {
          speed = distance / timeDiff; // meters per second
        }
      }
    }
    
    // Convert speed to km/h for display
    const speedKmh = speed * 3.6;
    setCurrentSpeed(speedKmh);
    
    // Update user location
    setUserLocation(location);
    
    // Prepare data for backend
    const trackingDataPoint = {
      userId: 'user_' + Math.floor(Math.random() * 1000000), // Consistent user ID for session
      latitude: coords.latitude,
      longitude: coords.longitude,
      speed: speedKmh, // Send speed in km/h
      timestamp: new Date().toISOString(),
      accuracy: coords.accuracy,
      altitude: coords.altitude,
      heading: coords.heading,
    };
    
    // Log the data with more details
    console.log('📍 Location Update:', {
      ...trackingDataPoint,
      speedKmh: speedKmh.toFixed(2) + ' km/h',
      speedMps: speed.toFixed(2) + ' m/s',
      accuracy: coords.accuracy + 'm',
      altitude: coords.altitude,
      heading: coords.heading,
      gpsSpeed: coords.speed,
      calculatedSpeed: speed
    });
    
    // Add to tracking data array
    setTrackingData(prev => [...prev.slice(-9), trackingDataPoint]); // Keep last 10 points
    
    // Send to backend (mock implementation)
    sendToBackend(trackingDataPoint);
  };

  const sendToBackend = async (data) => {
    try {
      // Use the traffic service to send data to backend
      const response = await trafficService.sendLocationData(data);
      console.log('✅ Backend Response:', response);
      
    } catch (error) {
      console.error('❌ Error sending to backend:', error);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
      setIsTracking(false);
      console.log('Location tracking stopped');
    }
  };

  const fetchBackendData = async () => {
    try {
      // Use traffic service to get congestion analysis from backend
      const analysisResult = await trafficService.getTrafficAnalysis();
      
      if (analysisResult.success && analysisResult.data) {
        // Convert analysis clusters to map markers
        const trafficClusters = analysisResult.data.map(cluster => ({
          id: cluster.clusterId,
          latitude: cluster.centroidLatitude,
          longitude: cluster.centroidLongitude,
          speed: cluster.averageSpeed,
          userCount: cluster.userCount,
          timestamp: cluster.detectedAt,
          isTraffic: cluster.averageSpeed < 10, // Consider traffic if speed < 10 km/h
          clusterData: cluster
        }));
        
        setBackendUsers(trafficClusters);
        
        console.log('🧠 Traffic analysis loaded:', {
          clusters: trafficClusters.length,
          totalUsers: trafficClusters.reduce((sum, cluster) => sum + cluster.userCount, 0),
          congestedAreas: trafficClusters.filter(c => c.isTraffic).length
        });
      } else {
        throw new Error('Invalid analysis response');
      }
      
    } catch (error) {
      console.error('Error fetching traffic analysis:', error);
      // Fallback to sample data if API fails
      setBackendUsers(sampleBackendUsers);
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
    try {
      // Use user's current location as start point
      let startPoint = null;
      let endPoint = null;

      if (userLocation) {
        startPoint = {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        };
        setStartCoords(startPoint);
      } else {
        Alert.alert('Error', 'Could not get your current location. Please make sure location services are enabled.');
        return;
      }

      // Use the selected end location
      if (endCoords) {
        endPoint = endCoords;
      } else if (endLocation) {
        // Try to geocode the end location
        const endResult = await geocodeLocation(endLocation, country);
        if (endResult) {
          endPoint = {
            latitude: endResult.latitude,
            longitude: endResult.longitude,
          };
          setEndCoords(endPoint);
        } else {
          Alert.alert('Error', 'Could not find coordinates for the destination.');
          return;
        }
      } else {
        Alert.alert('Error', 'Please select a destination.');
        return;
      }

      if (startPoint && endPoint) {
        // Check traffic along the route
        console.log('🛣️ Checking traffic for route:', {
          start: startPoint,
          end: endPoint
        });

        const routeTraffic = await trafficService.checkRouteTraffic(
          startPoint.latitude,
          startPoint.longitude,
          endPoint.latitude,
          endPoint.longitude
        );

        // Show traffic information to user
        if (routeTraffic.success) {
          const { routeInfo, recommendations } = routeTraffic;
          
          let alertMessage = `Route Analysis:\n\n`;
          alertMessage += `Distance: ${(routeInfo.distance / 1000).toFixed(1)} km\n`;
          alertMessage += `Estimated Time: ${Math.round(routeInfo.estimatedTime)} min\n`;
          alertMessage += `Traffic Level: ${routeInfo.trafficLevel.toUpperCase()}\n`;
          alertMessage += `Average Speed: ${routeInfo.averageSpeed.toFixed(1)} km/h\n`;
          alertMessage += `Users in Area: ${routeInfo.userCount}\n\n`;
          
          if (recommendations.length > 0) {
            alertMessage += `Recommendations:\n${recommendations.join('\n')}`;
          }

          Alert.alert('Traffic Analysis', alertMessage);
        }

        // Calculate and set region to fit start and end locations
        const newRegion = getRegionFromPoints([startPoint, endPoint]);
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
        
        // Close modal after successful route setup
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error checking route traffic:', error);
      Alert.alert('Error', 'Could not analyze traffic for this route.');
    }
  };

  // Calculate distance between two points in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const centerOnUserLocation = () => {
    if (userLocation) {
      const newRegion = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    } else {
      initializeMap();
    }
  };

  // Enhanced search functions
  const getLocationIcon = (type) => {
    switch (type) {
      case 'airport': return 'airplane';
      case 'market': return 'cart';
      case 'university': return 'school';
      case 'port': return 'boat';
      case 'city': return 'business';
      case 'beach': return 'umbrella';
      case 'mountain': return 'triangle';
      case 'park': return 'leaf';
      case 'church': return 'church';
      default: return 'location';
    }
  };

  const searchLocations = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    
    try {
      // Filter popular locations
      const filteredPopular = POPULAR_LOCATIONS.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.address.toLowerCase().includes(query.toLowerCase())
      );

      // Get geocoding results
      const geocodeResults = await Location.geocodeAsync(`${query}, Cameroon`);
      
      // Combine results
      const allResults = [
        ...filteredPopular.map(location => ({
          ...location,
          isPopular: true,
          coordinates: null // Will be geocoded when selected
        })),
        ...geocodeResults.map((result, index) => ({
          name: `${query} (${index + 1})`,
          address: `${query}, Cameroon`,
          type: 'location',
          isPopular: false,
          coordinates: {
            latitude: result.latitude,
            longitude: result.longitude
          }
        }))
      ];

      setSuggestions(allResults);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching locations:', error);
      // Fallback to popular locations only
      const filteredPopular = POPULAR_LOCATIONS.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.address.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredPopular.map(location => ({
        ...location,
        isPopular: true,
        coordinates: null
      })));
      setShowSuggestions(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = async (location) => {
    setSearchingLocation(location.name);
    setShowSuggestions(false);
    
    try {
      let coordinates = location.coordinates;
      
      // If no coordinates, geocode the location
      if (!coordinates) {
        const geocodeResults = await Location.geocodeAsync(`${location.name}, ${location.address}`);
        if (geocodeResults.length > 0) {
          coordinates = {
            latitude: geocodeResults[0].latitude,
            longitude: geocodeResults[0].longitude
          };
        }
      }
      
      if (coordinates) {
        // Set as end location
        setEndLocation(location.name);
        
        // Update map to show the selected location
        const newRegion = {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
        
        // Set end coordinates for route planning
        setEndCoords(coordinates);
        
        console.log('📍 Selected location:', {
          name: location.name,
          coordinates: coordinates
        });
      }
    } catch (error) {
      console.error('Error selecting location:', error);
      Alert.alert('Error', 'Could not get coordinates for this location.');
    }
  };

  const handleSearchInputChange = (text) => {
    setSearchingLocation(text);
    if (text.length >= 2) {
      searchLocations(text);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
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
              : 'Search destination route ...'
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

      {/* Speed Indicator */}
      <View style={styles.speedIndicator}>
        <View style={styles.speedContainer}>
          <View style={styles.trackingStatusContainer}>
            <Ionicons 
              name={isTracking ? "radio-button-on" : "radio-button-off"} 
              size={16} 
              color={isTracking ? colors.success : colors.textSecondary} 
            />
            {isTracking && (
              <>
                <Animated.View style={[styles.trackingGlow, { opacity: pulseAnim }]} />
                <Animated.View style={[styles.trackingGlow2, { opacity: pulseAnim2 }]} />
              </>
            )}
          </View>
          <Text style={styles.speedText}>
            {isTracking ? `${currentSpeed.toFixed(1)} km/h` : 'Not tracking'}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.trackingButton, { backgroundColor: isTracking ? colors.danger : colors.success }]}
          onPress={isTracking ? stopLocationTracking : startLocationTracking}
        >
          <Text style={styles.trackingButtonText}>
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Text>
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
            description={`Speed: ${currentSpeed.toFixed(1)} km/h`}
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
        
        {/* Tracking Data Summary */}
        {trackingData.length > 0 && (
          <View style={styles.trackingSummary}>
            <Text style={styles.trackingSummaryText}>
              📊 Tracking: {trackingData.length} data points | 
              Avg Speed: {(trackingData.reduce((sum, point) => sum + point.speed, 0) / trackingData.length).toFixed(1)} km/h
            </Text>
          </View>
        )}
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
            
            {/* Enhanced Search Input */}
            <View style={styles.searchInputContainer}>
              <View style={styles.searchInputWrapper}>
                <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchInputIcon} />
                <TextInput
                  style={styles.enhancedSearchInput}
                  placeholder="Search for destination..."
                  value={searchingLocation}
                  onChangeText={handleSearchInputChange}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {isSearching && (
                  <ActivityIndicator size="small" color={colors.primary} style={styles.searchLoading} />
                )}
              </View>
              
              {/* Location Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <ScrollView style={styles.suggestionsList} keyboardShouldPersistTaps="handled">
                    {suggestions.map((location, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => handleLocationSelect(location)}
                      >
                        <View style={styles.suggestionIconContainer}>
                          <Ionicons 
                            name={getLocationIcon(location.type)} 
                            size={20} 
                            color={location.isPopular ? colors.primary : colors.textSecondary} 
                          />
                        </View>
                        <View style={styles.suggestionTextContainer}>
                          <Text style={styles.suggestionName}>{location.name}</Text>
                          <Text style={styles.suggestionAddress}>{location.address}</Text>
                        </View>
                        {location.isPopular && (
                          <View style={styles.popularBadge}>
                            <Text style={styles.popularBadgeText}>Popular</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            
            {/* Popular Locations */}
            {!showSuggestions && (
              <View style={styles.popularLocationsContainer}>
                <Text style={styles.popularLocationsTitle}>Popular Destinations</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularLocationsList}>
                  {POPULAR_LOCATIONS.slice(0, 8).map((location, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.popularLocationItem}
                      onPress={() => handleLocationSelect(location)}
                    >
                      <Ionicons 
                        name={getLocationIcon(location.type)} 
                        size={24} 
                        color={colors.primary} 
                      />
                      <Text style={styles.popularLocationName}>{location.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            
            {/* Current Route Display */}
            {endLocation && (
              <View style={styles.currentRouteContainer}>
                <Text style={styles.currentRouteTitle}>Selected Route:</Text>
                <View style={styles.routeDisplay}>
                  <View style={styles.routePoint}>
                    <View style={styles.routePointIcon}>
                      <Ionicons name="location" size={16} color={colors.success} />
                    </View>
                    <Text style={styles.routePointText}>Your Location</Text>
                  </View>
                  <View style={styles.routeArrow}>
                    <Ionicons name="arrow-down" size={16} color={colors.textSecondary} />
                  </View>
                  <View style={styles.routePoint}>
                    <View style={styles.routePointIcon}>
                      <Ionicons name="location" size={16} color={colors.primary} />
                    </View>
                    <Text style={styles.routePointText}>{endLocation}</Text>
                  </View>
                </View>
              </View>
            )}
            
            <TouchableOpacity 
              style={[styles.searchButton, !endLocation && styles.searchButtonDisabled]} 
              onPress={handleRouteSearch}
              disabled={!endLocation}
            >
              <Text style={styles.searchButtonText}>
                {endLocation ? 'Find Route' : 'Select Destination'}
              </Text>
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
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  speedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingStatusContainer: {
    position: 'relative',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingGlow: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.success,
    opacity: 0.3,
  },
  trackingGlow2: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.success,
    opacity: 0.1,
  },
  speedText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  trackingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackingButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  map: {
    flex: 1,
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    opacity: 0.2,
  },
  trafficDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  userDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
  },
  infoPanel: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  trackingSummary: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  trackingSummaryText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.background,
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  searchInputContainer: {
    marginBottom: 20,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  enhancedSearchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 8,
    color: colors.textPrimary,
  },
  searchInputIcon: {
    marginRight: 8,
  },
  searchLoading: {
    marginLeft: 10,
  },
  suggestionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 150, // Limit height for suggestions
    overflow: 'hidden',
  },
  suggestionsList: {
    paddingVertical: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  suggestionIconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  suggestionAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  popularBadge: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  popularBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  popularLocationsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  popularLocationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  popularLocationsList: {
    flexDirection: 'row',
  },
  popularLocationItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  popularLocationName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  currentRouteContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  currentRouteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  routeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  routePoint: {
    alignItems: 'center',
  },
  routePointIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routePointText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },
  routeArrow: {
    marginHorizontal: 10,
  },
  searchButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.7,
  },
});