import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import roadAnalysisService from '../../services/roadAnalysisService';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Sample road analysis results - replace with actual backend data
const SAMPLE_ANALYSIS_RESULTS = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    location: 'Yaoundé Central Market',
    coordinates: { latitude: 3.848033, longitude: 11.502075 },
    imageUri: null,
    captureType: 'cctv',
    analysis: {
      trafficLevel: 'High',
      congestionScore: 85,
      roadCondition: 'Good',
      weatherCondition: 'Clear',
      vehicleCount: 45,
      pedestrianCount: 23,
      incidents: ['Minor congestion', 'Slow moving traffic'],
      recommendations: ['Consider alternative route', 'Traffic light optimization needed']
    },
    status: 'completed'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    location: 'Douala Port Road',
    coordinates: { latitude: 4.0511, longitude: 9.7679 },
    imageUri: null,
    captureType: 'drone',
    analysis: {
      trafficLevel: 'Medium',
      congestionScore: 45,
      roadCondition: 'Fair',
      weatherCondition: 'Cloudy',
      vehicleCount: 28,
      pedestrianCount: 12,
      incidents: ['Normal traffic flow'],
      recommendations: ['Monitor for peak hours']
    },
    status: 'completed'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    location: 'Bamenda Main Street',
    coordinates: { latitude: 5.9597, longitude: 10.1459 },
    imageUri: null,
    captureType: 'cctv',
    analysis: {
      trafficLevel: 'Low',
      congestionScore: 25,
      roadCondition: 'Excellent',
      weatherCondition: 'Clear',
      vehicleCount: 15,
      pedestrianCount: 8,
      incidents: ['Clear road conditions'],
      recommendations: ['Optimal driving conditions']
    },
    status: 'completed'
  }
];

export default function ImagesScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [analysisResults, setAnalysisResults] = useState(SAMPLE_ANALYSIS_RESULTS);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [captureType, setCaptureType] = useState('cctv');
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for road analysis.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      
      // Reverse geocode to get location name
      const geocodeResult = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      
      if (geocodeResult.length > 0) {
        const address = geocodeResult[0];
        setLocationName(`${address.street || 'Unknown Street'}, ${address.city || 'Unknown City'}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cameraStatus.status === 'granted' && mediaStatus.status === 'granted';
  };

  const handleImageCapture = async (source) => {
    const permission = await requestPermissions();
    if (!permission) {
      Alert.alert('Permission denied', 'Camera and media access are required.');
      return;
    }

    let result;

    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.9,
        aspect: [16, 9],
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.9,
      });
    }

    if (!result.canceled) {
      const asset = result.assets[0];
      const { width, height, uri } = asset;

      // Optimize image for analysis
      const optimized = await ImageManipulator.manipulateAsync(
        uri,
        [
          { resize: { width: 1200, height: 675 } },
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImage(optimized);
      setShowCaptureModal(false);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert("No image selected", "Please capture an image first.");
      return;
    }

    if (!location) {
      Alert.alert("Location required", "Please ensure location services are enabled.");
      return;
    }

    try {
      setAnalyzing(true);

      // Prepare data for backend
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      // Try real endpoint first
      let analysisResult = null;
      let usedMock = false;
      try {
        const response = await fetch('https://853a-41-202-219-160.ngrok-free.app/api/v1/congestion/image-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data', 'accept': 'application/json' },
          body: formData,
        });
        if (!response.ok) throw new Error('Upload failed');
        const result = await response.json();
        if (!result.success || !result.data) throw new Error('Invalid response');

        // Parse the response
        const d = result.data;
        analysisResult = {
          id: d.id?.toString() || Date.now().toString(),
          timestamp: d.created_at || new Date().toISOString(),
          location: locationName,
          coordinates: location,
          imageUri: d.cloudinary_url || image.uri,
          captureType: captureType,
          analysis: {
            trafficLevel: d.congestion_level || 'Unknown',
            congestionScore: d.congestion_score || 0,
            roadCondition: 'Unknown', // Not provided by backend
            weatherCondition: 'Unknown', // Not provided by backend
            vehicleCount: d.total_vehicles || 0,
            pedestrianCount: 0, // Not provided by backend
            incidents: [], // Not provided by backend
            recommendations: [], // Not provided by backend
            detections: d.analysis_data?.detections || [],
          },
          status: 'completed',
          raw: d,
        };
      } catch (err) {
        // Fallback to mock analysis
        usedMock = true;
        // Simulate backend response
        await new Promise(resolve => setTimeout(resolve, 3000));
        const mockAnalysis = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          location: locationName,
          coordinates: location,
          imageUri: image.uri,
          captureType: captureType,
          analysis: {
            trafficLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            congestionScore: Math.floor(Math.random() * 100),
            roadCondition: ['Poor', 'Fair', 'Good', 'Excellent'][Math.floor(Math.random() * 4)],
            weatherCondition: ['Clear', 'Cloudy', 'Rainy', 'Foggy'][Math.floor(Math.random() * 4)],
            vehicleCount: Math.floor(Math.random() * 100),
            pedestrianCount: Math.floor(Math.random() * 50),
            incidents: ['Normal traffic flow', 'Minor congestion', 'Construction work'],
            recommendations: ['Monitor traffic patterns', 'Consider route optimization'],
            detections: [],
          },
          status: 'completed',
          raw: null,
        };
        analysisResult = mockAnalysis;
      }

      setAnalysisResults(prev => [analysisResult, ...prev]);
      setSelectedAnalysis(analysisResult);
      setShowAnalysisModal(true);

      // Reset form
      setImage(null);
      setDescription('');

      if (usedMock) {
        console.log('⚠️ Used mock analysis due to endpoint failure.');
      } else {
        console.log('✅ Analysis completed:', analysisResult);
      }
    } catch (error) {
      console.error('❌ Analysis error:', error);
      Alert.alert('Analysis Failed', 'An error occurred while analyzing the image.');
    } finally {
      setAnalyzing(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const loadMoreResults = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    // Simulate loading more data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoadingMore(false);
  };

  const getTrafficLevelColor = (level) => {
    if (!level) return colors.textSecondary;
    switch (level.toUpperCase()) {
      case 'NO_TRAFFIC':
        return colors.success; // Green
      case 'LIGHT':
        return '#4FC3F7'; // Light Blue
      case 'MODERATE':
        return colors.warning; // Orange/Yellow
      case 'HEAVY':
        return '#6A1B9A'; // Red
      case 'SEVERE':
        return colors.danger; // Deep Purple
      default:
        return colors.textSecondary;
    }
  };

  const getRoadConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return colors.success;
      case 'good': return colors.primary;
      case 'fair': return colors.warning;
      case 'poor': return colors.danger;
      default: return colors.textSecondary;
    }
  };

  const renderAnalysisItem = ({ item, index }) => (
    <TouchableOpacity 
      style={[styles.analysisItem, index === 0 && styles.firstAnalysisItem]}
      onPress={() => {
        setSelectedAnalysis(item);
        setShowAnalysisModal(true);
      }}
      activeOpacity={0.7}
    >
      {/* Header with location and time */}
      <View style={styles.analysisHeader}>
        <View style={styles.analysisLocation}>
          <View style={styles.locationIconContainer}>
            <Ionicons name="location" size={16} color={colors.white} />
          </View>
          <Text style={styles.analysisLocationText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.analysisTime}>{formatTimeAgo(item.timestamp)}</Text>
        </View>
      </View>
      
      {/* Main metrics */}
      <View style={styles.analysisMetrics}>
        <View style={styles.metricItem}>
          <View style={styles.metricIconContainer}>
            <Ionicons name="car" size={16} color={colors.primary} />
          </View>
          <Text style={styles.metricLabel}>Traffic</Text>
          <Text style={[styles.metricValue, { color: getTrafficLevelColor(item.analysis.trafficLevel) }]}>
            {item.analysis.trafficLevel}
          </Text>
        </View>
        
        <View style={styles.metricDivider} />
        
        <View style={styles.metricItem}>
          <View style={styles.metricIconContainer}>
            <Ionicons name="trending-up" size={16} color={colors.warning} />
          </View>
          <Text style={styles.metricLabel}>Congestion</Text>
          <Text style={styles.metricValue}>{item.analysis.congestionScore}%</Text>
        </View>
        
        <View style={styles.metricDivider} />
        
        <View style={styles.metricItem}>
          <View style={styles.metricIconContainer}>
            <Ionicons name="navigate" size={16} color={colors.success} />
          </View>
          <Text style={styles.metricLabel}>Road</Text>
          <Text style={[styles.metricValue, { color: getRoadConditionColor(item.analysis.roadCondition) }]}>
            {item.analysis.roadCondition}
          </Text>
        </View>
      </View>
      
      {/* Footer with badges */}
      <View style={styles.analysisFooter}>
        <View style={styles.badgeContainer}>
          <View style={[styles.captureTypeBadge, { backgroundColor: item.captureType === 'drone' ? colors.warning : colors.primary }]}>
            <Ionicons 
              name={item.captureType === 'drone' ? 'airplane' : 'videocam'} 
              size={12} 
              color={colors.white} 
            />
            <Text style={styles.captureTypeText}>{item.captureType.toUpperCase()}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
            <Ionicons name="checkmark-circle" size={12} color={colors.white} />
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>Details</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name="analytics-outline" size={64} color={colors.textSecondary} />
      </View>
      <Text style={styles.emptyStateTitle}>No Analysis Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Capture your first image to start analyzing traffic conditions
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={() => setShowCaptureModal(true)}
      >
        <Ionicons name="camera" size={20} color={colors.white} />
        <Text style={styles.emptyStateButtonText}>Capture First Image</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Road Analysis</Text>
        <Text style={styles.headerSubtitle}>CCTV & Drone Image Analysis</Text>
      </View>

      {/* Add View on Map Button */}
      <View style={{alignItems: 'flex-end', marginHorizontal: 20, marginBottom: 5}}>
        <TouchableOpacity
          style={{backgroundColor: colors.primary, padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center'}}
          onPress={() => navigation.navigate('RouteSetup', { analysisResults })}
        >
          <Ionicons name="map" size={18} color={colors.white} style={{marginRight: 6}} />
          <Text style={{color: colors.white, fontWeight: 'bold'}}>View on Map</Text>
        </TouchableOpacity>
      </View>

      {/* Capture Section */}
      <View style={styles.captureSection}>
        <View style={styles.captureHeader}>
          <Text style={styles.sectionTitle}>Capture New Image</Text>
          <TouchableOpacity 
            style={styles.captureTypeToggle}
            onPress={() => setCaptureType(captureType === 'cctv' ? 'drone' : 'cctv')}
          >
            <Ionicons 
              name={captureType === 'drone' ? 'airplane' : 'videocam'} 
              size={20} 
              color={colors.white} 
            />
            <Text style={styles.captureTypeToggleText}>
              {captureType.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {image ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <Ionicons name="close-circle" size={24} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={() => setShowCaptureModal(true)}
          >
            <Ionicons name="camera" size={48} color={colors.white} />
            <Text style={styles.captureButtonText}>
              Capture {captureType === 'drone' ? 'Drone' : 'CCTV'} Image
            </Text>
            <Text style={styles.captureButtonSubtext}>
              Tap to take photo or select from gallery
            </Text>
          </TouchableOpacity>
        )}

        {image && (
          <View style={styles.analysisForm}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
            
            <TouchableOpacity 
              style={[styles.analyzeButton, analyzing && styles.analyzeButtonDisabled]}
              onPress={analyzeImage}
              disabled={analyzing}
            >
              {analyzing ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="analytics" size={20} color={colors.white} />
                  <Text style={styles.analyzeButtonText}>Analyze Image</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Analysis Results ////////////////////////////////////////////////////////*/} 
      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>Recent Analysis</Text>
          <Text style={styles.resultsCount}>{analysisResults.length} results</Text>
        </View>
        
        <FlatList
          data={analysisResults}
          renderItem={renderAnalysisItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          onEndReached={loadMoreResults}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.loadingMoreText}>Loading more...</Text>
              </View>
            ) : null
          }
        />
      </View>

      {/* Capture Modal */}
      <Modal
        visible={showCaptureModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCaptureModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Capture Image</Text>
              <TouchableOpacity onPress={() => setShowCaptureModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.captureOptions}>
              <TouchableOpacity
                style={styles.captureOption}
                onPress={() => handleImageCapture('camera')}
              >
                <Ionicons name="camera" size={48} color={colors.primary} />
                <Text style={styles.captureOptionText}>Take Photo</Text>
                <Text style={styles.captureOptionSubtext}>Use camera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.captureOption}
                onPress={() => handleImageCapture('gallery')}
              >
                <Ionicons name="images" size={48} color={colors.primary} />
                <Text style={styles.captureOptionText}>Choose from Gallery</Text>
                <Text style={styles.captureOptionSubtext}>Select existing photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
     

      {/* Analysis Details Modal */}
      <Modal
        visible={showAnalysisModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAnalysisModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.analysisModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Analysis Results</Text>
              <TouchableOpacity onPress={() => setShowAnalysisModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {selectedAnalysis && (
              <ScrollView style={styles.analysisDetails} showsVerticalScrollIndicator={false}>
                <View style={styles.analysisLocationInfo}>
                  <Ionicons name="location" size={20} color={colors.primary} />
                  <Text style={styles.analysisLocationName}>{selectedAnalysis.location}</Text>
                </View>
                
                <Text style={styles.analysisTimestamp}>
                  {new Date(selectedAnalysis.timestamp).toLocaleString()}
                </Text>

                <View style={styles.analysisGrid}>
                  <View style={styles.analysisCard}>
                    <Text style={styles.analysisCardTitle}>Traffic Level</Text>
                    <Text style={[styles.analysisCardValue, { color: getTrafficLevelColor(selectedAnalysis.analysis.trafficLevel) }]}>
                      {selectedAnalysis.analysis.trafficLevel}
                    </Text>
                  </View>
                  
                  <View style={styles.analysisCard}>
                    <Text style={styles.analysisCardTitle}>Congestion Score</Text>
                    <Text style={styles.analysisCardValue}>{selectedAnalysis.analysis.congestionScore}%</Text>
                  </View>
                  
                  <View style={styles.analysisCard}>
                    <Text style={styles.analysisCardTitle}>Road Condition</Text>
                    <Ionicons name="navigate" size={16} color={getRoadConditionColor(selectedAnalysis.analysis.roadCondition)} style={{marginBottom: 4}} />
                    <Text style={[styles.analysisCardValue, { color: getRoadConditionColor(selectedAnalysis.analysis.roadCondition) }]}>
                      {selectedAnalysis.analysis.roadCondition}
                    </Text>
                  </View>
                  
                  <View style={styles.analysisCard}>
                    <Text style={styles.analysisCardTitle}>Weather</Text>
                    <Text style={styles.analysisCardValue}>{selectedAnalysis.analysis.weatherCondition}</Text>
                  </View>
                  
                  <View style={styles.analysisCard}>
                    <Text style={styles.analysisCardTitle}>Vehicles</Text>
                    <Text style={styles.analysisCardValue}>{selectedAnalysis.analysis.vehicleCount}</Text>
                  </View>
                  
                  <View style={styles.analysisCard}>
                    <Text style={styles.analysisCardTitle}>Pedestrians</Text>
                    <Text style={styles.analysisCardValue}>{selectedAnalysis.analysis.pedestrianCount}</Text>
                  </View>
                </View>

                <View style={styles.incidentsSection}>
                  <Text style={styles.incidentsTitle}>Detected Incidents</Text>
                  {selectedAnalysis.analysis.incidents.map((incident, index) => (
                    <View key={index} style={styles.incidentItem}>
                      <Ionicons name="warning" size={16} color={colors.warning} />
                      <Text style={styles.incidentText}>{incident}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.recommendationsSection}>
                  <Text style={styles.recommendationsTitle}>Recommendations</Text>
                  {selectedAnalysis.analysis.recommendations.map((rec, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Ionicons name="bulb" size={16} color={colors.primary} />
                      <Text style={styles.recommendationText}>{rec}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
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
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  captureSection: {
    backgroundColor: colors.white,
    margin: 15,
    borderRadius: 15,
    padding: 20,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  captureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  captureTypeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  captureTypeToggleText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  captureButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  captureButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  captureButtonSubtext: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.white,
    borderRadius: 15,
  },
  analysisForm: {
    marginTop: 15,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: colors.background,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  analyzeButton: {
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  analyzeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultsSection: {
    flex: 1,
    backgroundColor: colors.white,
    margin: 15,
    borderRadius: 15,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0,
    elevation: 2,
    height: 40
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  resultsList: {
    paddingBottom: 20,
  },
  analysisItem: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  firstAnalysisItem: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.white,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  analysisLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIconContainer: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 6,
    marginRight: 8,
  },
  analysisLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  timeContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  analysisTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  analysisMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricIconContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 6,
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  analysisFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  captureTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  captureTypeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  captureOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  captureOption: {
    alignItems: 'center',
    width: '45%',
  },
  captureOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 10,
  },
  captureOptionSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },
  analysisModalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
  },
  analysisDetails: {
    width: '100%',
  },
  analysisLocationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  analysisLocationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 10,
  },
  analysisTimestamp: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  analysisCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  analysisCardTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  analysisCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  incidentsSection: {
    marginBottom: 15,
  },
  incidentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  recommendationsSection: {
    marginBottom: 15,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
  },
});
