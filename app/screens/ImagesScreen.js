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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import roadAnalysisService from '../../services/roadAnalysisService';

const { width, height } = Dimensions.get('window');

// Sample road analysis results - replace with actual backend data
const SAMPLE_ANALYSIS_RESULTS = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    location: 'Yaoundé Central Market',
    coordinates: { latitude: 3.848033, longitude: 11.502075 },
    imageUri: null,
    captureType: 'cctv', // Added missing property
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
    captureType: 'drone', // Added missing property
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
  const [captureType, setCaptureType] = useState('cctv'); // 'cctv' or 'drone'

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
        aspect: [16, 9], // Better for road analysis
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
          { resize: { width: 1200, height: 675 } }, // 16:9 aspect ratio
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
      formData.append('image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'road_analysis.jpg',
      });
      formData.append('location', JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        name: locationName,
      }));
      formData.append('description', description);
      formData.append('captureType', captureType);
      formData.append('timestamp', new Date().toISOString());

      // TODO: Replace with actual backend endpoint
      // const response = await fetch('https://your-backend-api.com/analyze-road', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      // Simulate backend response
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockAnalysis = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        location: locationName,
        coordinates: location,
        imageUri: image.uri,
        captureType: captureType, // Added missing property
        analysis: {
          trafficLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
          congestionScore: Math.floor(Math.random() * 100),
          roadCondition: ['Poor', 'Fair', 'Good', 'Excellent'][Math.floor(Math.random() * 4)],
          weatherCondition: ['Clear', 'Cloudy', 'Rainy', 'Foggy'][Math.floor(Math.random() * 4)],
          vehicleCount: Math.floor(Math.random() * 100),
          pedestrianCount: Math.floor(Math.random() * 50),
          incidents: ['Normal traffic flow', 'Minor congestion', 'Construction work'],
          recommendations: ['Monitor traffic patterns', 'Consider route optimization']
        },
        status: 'completed'
      };

      setAnalysisResults(prev => [mockAnalysis, ...prev]);
      setSelectedAnalysis(mockAnalysis);
      setShowAnalysisModal(true);
      
      // Reset form
      setImage(null);
      setDescription('');
      
      console.log('✅ Analysis completed:', mockAnalysis);
      
    } catch (error) {
      console.error('❌ Analysis error:', error);
      Alert.alert('Analysis Failed', 'An error occurred while analyzing the image.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getTrafficLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return colors.success;
      case 'medium': return colors.warning;
      case 'high': return colors.danger;
      default: return colors.textSecondary;
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

  const renderAnalysisItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.analysisItem}
      onPress={() => {
        setSelectedAnalysis(item);
        setShowAnalysisModal(true);
      }}
    >
      <View style={styles.analysisHeader}>
        <View style={styles.analysisLocation}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.analysisLocationText}>{item.location}</Text>
        </View>
        <Text style={styles.analysisTime}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      
      <View style={styles.analysisMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Traffic</Text>
          <Text style={[styles.metricValue, { color: getTrafficLevelColor(item.analysis.trafficLevel) }]}>
            {item.analysis.trafficLevel}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Congestion</Text>
          <Text style={styles.metricValue}>{item.analysis.congestionScore}%</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Road</Text>
          <Text style={[styles.metricValue, { color: getRoadConditionColor(item.analysis.roadCondition) }]}>
            {item.analysis.roadCondition}
          </Text>
        </View>
      </View>
      
      <View style={styles.analysisFooter}>
        <View style={styles.captureTypeBadge}>
          <Ionicons 
            name={(item.captureType || 'cctv') === 'drone' ? 'airplane' : 'videocam'} 
            size={12} 
            color={colors.white} 
          />
          <Text style={styles.captureTypeText}>{(item.captureType || 'cctv').toUpperCase()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
          <Text style={styles.statusText}>Completed</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚦 Road Analysis</Text>
        <Text style={styles.headerSubtitle}>CCTV & Drone Image Analysis</Text>
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

      {/* Analysis Results */}
      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>Recent Analysis</Text>
        <FlatList
          data={analysisResults}
          renderItem={renderAnalysisItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
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
              <ScrollView style={styles.analysisDetails}>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsList: {
    paddingBottom: 20,
  },
  analysisItem: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  analysisLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analysisLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 5,
  },
  analysisTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  analysisMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  analysisFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  captureTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  captureTypeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
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
    width: '48%', // Two columns
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
