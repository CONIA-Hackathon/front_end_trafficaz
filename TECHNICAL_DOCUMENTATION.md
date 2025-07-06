# 🛠️ TrafficAZ Technical Documentation

## 📋 Table of Contents

- [🏗️ System Architecture](#️-system-architecture)
- [📁 Project Structure](#-project-structure)
- [🔧 Core Services](#-core-services)
- [🎨 UI Components](#-ui-components)
- [🌐 API Integration](#-api-integration)
- [🗄️ Data Management](#️-data-management)
- [🔐 Security & Permissions](#-security--permissions)
- [🧪 Testing Strategy](#-testing-strategy)
- [📱 Platform-Specific Implementation](#-platform-specific-implementation)
- [🚀 Performance Optimization](#-performance-optimization)

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        TrafficAZ System                        │
├─────────────────────────────────────────────────────────────────┤
│  📱 Mobile Application (React Native + Expo)                   │
│  ├── 🎨 Presentation Layer (Components & Screens)              │
│  ├── 🔧 Business Logic Layer (Services & Context)              │
│  └── 📊 Data Access Layer (API Clients & Storage)              │
├─────────────────────────────────────────────────────────────────┤
│  🔗 Backend Services                                           │
│  ├── 🧠 AI Analytics Engine                                    │
│  ├── 📡 Real-time Data Processing                              │
│  └── 🗄️ Database Management                                    │
├─────────────────────────────────────────────────────────────────┤
│  🌐 External Integrations                                      │
│  ├── 🌤️ OpenWeather API                                        │
│  ├── 🗺️ Google Maps Platform                                   │
│  └── 🎤 Voice Recognition Services                             │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
App/
├── 📄 Entry Points
│   ├── index.js                 # Main app entry
│   ├── _layout.jsx             # Root layout configuration
│   └── App.js                  # App wrapper
├── 🎨 UI Components
│   ├── Button.js               # Reusable button component
│   ├── InputField.js           # Form input component
│   ├── WeatherWidget.js        # Weather display widget
│   ├── VoiceCommandGuide.js    # Voice command interface
│   └── BottomNav.js            # Bottom navigation
├── 📱 Screens
│   ├── HomeScreen.js           # Main dashboard
│   ├── MapScreen.js            # Interactive map
│   ├── WeatherScreen.js        # Weather details
│   ├── RouteSetupScreen.js     # Route planning
│   └── ScheduledRoutesScreen.js # Route management
├── 🔧 Services
│   ├── trafficService.js       # Traffic data management
│   ├── weatherService.js       # Weather API integration
│   ├── locationService.js      # GPS and location
│   ├── voiceService.js         # Voice recognition
│   └── authService.js          # Authentication
├── 🌐 Context
│   ├── AuthContext.js          # Authentication state
│   ├── LanguageContext.js      # Internationalization
│   └── AlertContext.js         # Notification management
└── 🎯 Constants
    ├── colors.js               # Color palette
    ├── fonts.js                # Typography
    └── config.js               # App configuration
```

---

## 📁 Project Structure

### Directory Organization

```
front_end_trafficaz/
├── 📱 app/                          # Main application screens
│   ├── 📄 (main)/                   # Main tab navigation
│   ├── 🔐 auth/                     # Authentication screens
│   ├── 🗺️ screens/                  # Individual screen components
│   ├── 🧭 navigation/               # Navigation configuration
│   ├── index.js                     # App entry point
│   ├── _layout.jsx                  # Root layout
│   └── onboarding.js               # Onboarding flow
├── 🎨 components/                   # Reusable UI components
│   ├── Button.js                   # Custom button component
│   ├── InputField.js               # Form input component
│   ├── WeatherWidget.js            # Weather display widget
│   ├── VoiceCommandGuide.js        # Voice command interface
│   ├── BottomNav.js                # Bottom navigation
│   ├── AlertCard.js                # Alert display component
│   ├── LoadingSpinner.js           # Loading indicator
│   ├── MapViewComponent.js         # Map wrapper component
│   ├── PhoneInput.js               # Phone number input
│   ├── SafeAreaWrapper.js          # Safe area wrapper
│   └── Toggle.js                   # Toggle switch component
├── 🔧 services/                    # Business logic services
│   ├── trafficService.js           # Traffic data management
│   ├── weatherService.js           # Weather API integration
│   ├── locationService.js          # GPS and location services
│   ├── RealVoiceRecognitionService.js # Voice recognition
│   ├── VoiceActivationService.js   # Voice activation
│   ├── roadAnalysisService.js      # Road condition analysis
│   ├── notificationService.js      # Push notifications
│   ├── userService.js              # User management
│   ├── authService.js              # Authentication
│   ├── alertService.js             # Alert management
│   └── translationService.js       # Internationalization
├── 🌐 context/                     # React Context providers
│   ├── AuthContext.js              # Authentication state
│   ├── LanguageContext.js          # Language management
│   └── AlertContext.js             # Alert state management
├── 🎯 constants/                   # Application constants
│   ├── colors.js                   # Color definitions
│   ├── fonts.js                    # Typography configuration
│   ├── theme.js                    # Theme configuration
│   └── config.js                   # App configuration
├── 🛠️ utils/                       # Utility functions
├── 📦 assets/                      # Static assets
├── ⚙️ config/                      # Configuration files
├── 📄 package.json                 # Dependencies and scripts
├── 📄 app.json                     # Expo configuration
├── 📄 README.md                    # Project documentation
└── 📄 TECHNICAL_DOCUMENTATION.md   # This file
```

---

## 🔧 Core Services

### 1. Traffic Service (`services/trafficService.js`)

**Purpose**: Manages all traffic-related data operations and API communications.

#### Key Methods

```javascript
class TrafficService {
  // Send location and speed data to backend
  async sendLocationData(data) {
    const requestBody = {
      userId: data.userId,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed,
      timestamp: data.timestamp
    };
    // Implementation...
  }

  // Get traffic congestion analysis
  async getTrafficAnalysis() {
    // Fetches and analyzes traffic patterns
    // Returns cluster data with speed and user count
  }

  // Check traffic along specific route
  async checkRouteTraffic(startLat, startLng, endLat, endLng) {
    // Analyzes traffic conditions along a route
    // Returns traffic level, estimated time, and recommendations
  }

  // Get traffic alerts for area
  async getTrafficAlerts(latitude, longitude, radius = 5000) {
    // Fetches traffic alerts within specified radius
  }
}
```

#### Data Flow

```
User Location → GPS Tracking → Speed Calculation → Traffic Service → Backend API
     ↓
Traffic Analysis → Clustering Algorithm → Traffic Patterns → UI Display
```

### 2. Weather Service (`services/weatherService.js`)

**Purpose**: Integrates with OpenWeather API to provide weather data and traffic impact analysis.

#### Key Features

```javascript
class WeatherService {
  // Get current weather for location
  async getCurrentLocationWeather() {
    // Fetches current weather data
    // Calculates traffic impact based on weather conditions
  }

  // Calculate traffic impact from weather
  calculateTrafficImpact(weatherData) {
    const { main, wind, visibility, rainChance } = weatherData;
    // Analyzes weather impact on traffic
    // Returns impact level and reasons
  }

  // Generate weather-based recommendations
  generateWeatherRecommendations(weatherData) {
    // Provides driving recommendations based on weather
  }
}
```

#### Weather Impact Analysis

| Weather Condition | Traffic Impact | Delay (minutes) | Recommendations |
|------------------|----------------|-----------------|-----------------|
| Heavy Rain | Very High | 15-30 | Reduce speed, increase following distance |
| Light Rain | High | 5-15 | Use windshield wipers, maintain safe distance |
| Fog | High | 10-20 | Use fog lights, reduce speed significantly |
| Strong Winds | Medium | 5-10 | Hold steering wheel firmly, avoid high vehicles |
| Clear | Low | 0-5 | Normal driving conditions |

### 3. Voice Recognition Service (`services/RealVoiceRecognitionService.js`)

**Purpose**: Handles voice commands and natural language processing for hands-free operation.

#### Voice Commands

```javascript
const voiceCommands = {
  // Traffic queries
  'traffic_situation': {
    patterns: ['traffic situation', 'traffic condition', 'how is traffic'],
    handler: handleTrafficQuery
  },
  
  // Traffic reporting
  'report_traffic': {
    patterns: ['report traffic', 'traffic report', 'report congestion'],
    handler: handleReportTraffic
  },
  
  // Weather queries
  'weather_info': {
    patterns: ['weather', 'weather condition', 'temperature'],
    handler: handleWeatherQuery
  },
  
  // Route queries
  'route_traffic': {
    patterns: ['route traffic', 'my route', 'commute traffic'],
    handler: handleRouteTraffic
  }
};
```

#### Voice Processing Flow

```
Voice Input → Speech Recognition → Text Processing → Command Matching → Action Execution
     ↓
Response Generation → Text-to-Speech → Audio Feedback
```

### 4. Location Service (`services/locationService.js`)

**Purpose**: Manages GPS tracking, location permissions, and geolocation operations.

#### Key Functionality

```javascript
class LocationService {
  // Request location permissions
  async requestLocationPermission() {
    // Handles location permission requests
  }

  // Get current location
  async getCurrentLocation() {
    // Fetches current GPS coordinates
  }

  // Start location tracking
  async startLocationTracking(callback) {
    // Continuously tracks user location
    // Calculates speed and movement patterns
  }

  // Calculate distance between points
  calculateDistance(lat1, lon1, lat2, lon2) {
    // Uses Haversine formula for distance calculation
  }
}
```

---

## 🎨 UI Components

### Component Design System

#### 1. Button Component (`components/Button.js`)

```javascript
const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null 
}) => {
  // Component implementation
};
```

**Variants**: `primary`, `secondary`, `outline`, `danger`, `success`
**Sizes**: `small`, `medium`, `large`

#### 2. Weather Widget (`components/WeatherWidget.js`)

```javascript
const WeatherWidget = ({ 
  onPress, 
  compact = false 
}) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Displays current weather with traffic impact
  // Supports compact and full-size modes
};
```

**Features**:
- Real-time weather display
- Traffic impact analysis
- Weather-based recommendations
- Responsive design

#### 3. Voice Command Guide (`components/VoiceCommandGuide.js`)

```javascript
const VoiceCommandGuide = ({ 
  isVisible, 
  onClose, 
  onCommand 
}) => {
  // Provides voice command interface
  // Shows available commands and examples
};
```

### Styling System

#### Color Palette (`constants/colors.js`)

```javascript
export default {
  primary: '#FF3951',        // Main brand color
  secondary: '#6C757D',      // Secondary elements
  success: '#28A745',        // Success states
  warning: '#FFC107',        // Warning states
  danger: '#DC3545',         // Error states
  info: '#17A2B8',          // Information states
  background: '#F8F9FA',     // App background
  surface: '#FFFFFF',        // Card backgrounds
  textPrimary: '#212529',    // Primary text
  textSecondary: '#6C757D',  // Secondary text
};
```

#### Typography (`constants/fonts.js`)

```javascript
export const fontFamily = {
  regular: 'Mulish-Regular',
  medium: 'Mulish-Medium',
  semiBold: 'Mulish-SemiBold',
  bold: 'Mulish-Bold'
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36
};
```

---

## 🌐 API Integration

### Backend API Endpoints

#### Base URL
```
https://backend-traffic-detection-production.up.railway.app
```

#### 1. Traffic Data Submission

```http
POST /api/v1/locations/submit
Content-Type: application/json

Request Body:
{
  "userId": "string",
  "latitude": "number",
  "longitude": "number", 
  "speed": "number",
  "timestamp": "ISO 8601 string"
}

Response:
{
  "success": "boolean",
  "message": "string",
  "dataId": "string",
  "timestamp": "ISO 8601 string"
}
```

#### 2. Traffic Analysis

```http
POST /api/v1/congestion/analyze
Content-Type: application/json

Response:
{
  "success": "boolean",
  "statusCode": "number",
  "message": "string",
  "data": [
    {
      "clusterId": "string",
      "centroidLatitude": "number",
      "centroidLongitude": "number",
      "averageSpeed": "number",
      "userCount": "number",
      "detectedAt": "ISO 8601 string"
    }
  ]
}
```

#### 3. Route Traffic Check

```http
POST /api/v1/congestion/route-check
Content-Type: application/json

Request Body:
{
  "startLatitude": "number",
  "startLongitude": "number",
  "endLatitude": "number",
  "endLongitude": "number",
  "routeRadius": "number"
}

Response:
{
  "success": "boolean",
  "routeInfo": {
    "distance": "number",
    "estimatedTime": "number",
    "trafficLevel": "string",
    "congestionPercentage": "number",
    "averageSpeed": "number",
    "userCount": "number"
  },
  "trafficClusters": [...],
  "recommendations": ["string"]
}
```

### External API Integrations

#### OpenWeather API

```javascript
// Current Weather
GET https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric

// 5-Day Forecast
GET https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric
```

#### Google Maps API

```javascript
// Places Autocomplete
GET https://maps.googleapis.com/maps/api/place/autocomplete/json?input={input}&key={API_KEY}

// Geocoding
GET https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={API_KEY}
```

---

## 🗄️ Data Management

### State Management Architecture

#### Context Providers

```javascript
// AuthContext.js
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Authentication methods
  const login = async (credentials) => { /* ... */ };
  const logout = async () => { /* ... */ };
  const register = async (userData) => { /* ... */ };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Local Storage

```javascript
// AsyncStorage Keys
const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  LANGUAGE: 'app_language',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  VOICE_SETTINGS: 'voice_settings',
  TRAFFIC_PREFERENCES: 'traffic_preferences'
};
```

### Data Models

#### Traffic Data Model

```javascript
const TrafficDataPoint = {
  id: 'string',
  userId: 'string',
  latitude: 'number',
  longitude: 'number',
  speed: 'number', // km/h
  timestamp: 'ISO 8601 string',
  accuracy: 'number',
  heading: 'number',
  altitude: 'number?'
};
```

#### Weather Data Model

```javascript
const WeatherData = {
  current: {
    temperature: 'number', // Celsius
    feelsLike: 'number',
    humidity: 'number', // Percentage
    pressure: 'number', // hPa
    windSpeed: 'number', // km/h
    windDirection: 'number', // Degrees
    description: 'string',
    icon: 'string',
    visibility: 'number', // km
    trafficImpact: {
      level: 'low' | 'medium' | 'high' | 'very_high',
      reasons: ['string'],
      delayMinutes: 'number'
    }
  },
  forecast: {
    hourly: [WeatherHourlyData],
    daily: [WeatherDailyData]
  }
};
```

---

## 🔐 Security & Permissions

### Required Permissions

#### iOS Permissions (`app.json`)

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "TrafficAZ needs location access to provide real-time traffic updates and route planning.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "TrafficAZ uses background location to track traffic patterns and provide alerts.",
        "NSMicrophoneUsageDescription": "TrafficAZ uses microphone access for voice commands and hands-free operation.",
        "NSCameraUsageDescription": "TrafficAZ uses camera access for traffic incident reporting with photos."
      }
    }
  }
}
```

#### Android Permissions (`app.json`)

```json
{
  "expo": {
    "android": {
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "RECORD_AUDIO",
        "CAMERA",
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "WAKE_LOCK"
      ]
    }
  }
}
```

### Security Measures

#### API Security

```javascript
// Request interceptor for authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add authentication token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

---

## 🧪 Testing Strategy

### Testing Framework

```javascript
// Jest configuration
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation)'
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js'
  ]
};
```

### Test Categories

#### 1. Unit Tests

```javascript
// services/trafficService.test.js
describe('TrafficService', () => {
  test('should send location data successfully', async () => {
    const mockData = {
      userId: 'test123',
      latitude: 3.848033,
      longitude: 11.502075,
      speed: 25.5,
      timestamp: new Date().toISOString()
    };
    
    const result = await trafficService.sendLocationData(mockData);
    expect(result.success).toBe(true);
  });
});
```

#### 2. Component Tests

```javascript
// components/WeatherWidget.test.js
import { render, fireEvent } from '@testing-library/react-native';

describe('WeatherWidget', () => {
  test('should display weather data correctly', () => {
    const mockWeatherData = {
      current: {
        temperature: 25,
        description: 'Sunny',
        trafficImpact: { level: 'low' }
      }
    };
    
    const { getByText } = render(
      <WeatherWidget weatherData={mockWeatherData} />
    );
    
    expect(getByText('25°')).toBeTruthy();
    expect(getByText('Sunny')).toBeTruthy();
  });
});
```

### Test Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --testPathPattern=WeatherWidget
```

---

## 📱 Platform-Specific Implementation

### iOS Specific Features

#### Voice Recognition

```javascript
// iOS-specific voice recognition setup
import Voice from '@react-native-voice/voice';

const setupVoiceRecognition = () => {
  Voice.onSpeechStart = onSpeechStart;
  Voice.onSpeechEnd = onSpeechEnd;
  Voice.onSpeechResults = onSpeechResults;
  Voice.onSpeechError = onSpeechError;
  
  // iOS-specific settings
  Voice.setSpeechRecognitionLanguage('en-US');
  Voice.setSpeechRecognitionContinuous(true);
};
```

#### Location Services

```javascript
// iOS location accuracy settings
const locationOptions = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 1000,
  distanceInterval: 1,
  showsBackgroundLocationIndicator: true,
  activityType: Location.ActivityType.AutomotiveNavigation
};
```

### Android Specific Features

#### Background Location

```javascript
// Android background location handling
const startBackgroundLocation = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  
  if (status === 'granted') {
    await Location.startLocationUpdatesAsync('background-location', {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000,
      distanceInterval: 10,
      foregroundService: {
        notificationTitle: 'TrafficAZ Tracking',
        notificationBody: 'Tracking traffic patterns'
      }
    });
  }
};
```

---

## 🚀 Performance Optimization

### React Native Performance

#### 1. Component Optimization

```javascript
// Use React.memo for expensive components
const WeatherWidget = React.memo(({ weatherData, onPress }) => {
  // Component implementation
});

// Use useMemo for expensive calculations
const trafficAnalysis = useMemo(() => {
  return analyzeTrafficData(trafficData);
}, [trafficData]);

// Use useCallback for event handlers
const handleLocationUpdate = useCallback((location) => {
  setCurrentLocation(location);
  updateTrafficData(location);
}, []);
```

#### 2. List Optimization

```javascript
// Optimize FlatList rendering
const TrafficList = ({ data }) => {
  const renderItem = useCallback(({ item }) => (
    <TrafficItem data={item} />
  ), []);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={5}
    />
  );
};
```

### Memory Management

#### 1. Location Tracking Cleanup

```javascript
useEffect(() => {
  let locationSubscription;
  
  const startTracking = async () => {
    locationSubscription = await Location.watchPositionAsync(
      locationOptions,
      handleLocationUpdate
    );
  };
  
  startTracking();
  
  return () => {
    if (locationSubscription) {
      locationSubscription.remove();
    }
  };
}, []);
```

#### 2. Voice Recognition Cleanup

```javascript
useEffect(() => {
  return () => {
    Voice.destroy().then(Voice.removeAllListeners);
  };
}, []);
```

### Network Optimization

#### 1. API Request Caching

```javascript
// Implement request caching
const cache = new Map();

const cachedRequest = async (url, options) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes
      return data;
    }
  }
  
  const response = await fetch(url, options);
  const data = await response.json();
  
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
};
```

---

## 📚 Additional Resources

### Documentation Links

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [OpenWeather API Documentation](https://openweathermap.org/api)
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)

### Development Tools

- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/) - Mobile app debugger
- [Reactotron](https://github.com/infinitered/reactotron) - React Native debugging

---

<div align="center">

**TrafficAZ Technical Documentation v1.0**

*Last updated: January 2024*

[![Documentation](https://img.shields.io/badge/Documentation-Complete-brightgreen.svg)](https://docs.trafficaz.com)
[![API](https://img.shields.io/badge/API-Stable-green.svg)](https://api.trafficaz.com)

</div> 