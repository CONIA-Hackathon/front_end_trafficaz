# 🚦 TrafficAZ - Intelligent Traffic Management System

<div align="center">

![TrafficAZ Logo](https://i.pinimg.com/originals/08/a4/67/08a467875def4f8c3cda15bb693263ee.gif)

**Revolutionizing Traffic Management in Cameroon with AI-Powered Real-Time Analytics**

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.17-black.svg)](https://expo.dev/)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [🚀 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [📱 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Configuration](#️-configuration)
- [📖 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Overview

**TrafficAZ** is a cutting-edge mobile application designed to revolutionize traffic management in Cameroon. Built with React Native and Expo, this intelligent system provides real-time traffic analytics, weather integration, voice commands, and community-driven traffic reporting.

### 🎯 Mission
To create a smarter, safer, and more efficient transportation ecosystem in Cameroon by leveraging real-time data, AI analytics, and community participation.

### 🌟 Vision
To become the leading traffic intelligence platform in Central Africa, empowering citizens and authorities with data-driven insights for better urban mobility.

---

## ✨ Key Features

### 🗺️ **Real-Time Traffic Analytics**
- **Live Traffic Monitoring**: Real-time tracking of vehicle speeds and congestion patterns
- **AI-Powered Analysis**: Machine learning algorithms for traffic pattern recognition
- **Heat Map Visualization**: Interactive maps showing traffic density and flow
- **Route Optimization**: Smart routing with traffic-aware pathfinding

### 🎤 **Voice-Activated Commands**
- **Hands-Free Operation**: "Hey TrafficAZ" wake word activation
- **Natural Language Processing**: Conversational traffic queries and reports
- **Multi-Language Support**: English and French voice recognition
- **Voice Feedback**: Audio responses for accessibility

### 🌤️ **Weather Integration**
- **Real-Time Weather Data**: OpenWeather API integration
- **Traffic-Weather Correlation**: Analysis of weather impact on traffic
- **Forecast Integration**: 5-day weather predictions affecting route planning
- **Smart Recommendations**: Weather-based driving suggestions

### 📍 **Location Services**
- **GPS Tracking**: High-accuracy location monitoring
- **Speed Detection**: Real-time speed calculation and analysis
- **Geofencing**: Location-based alerts and notifications
- **Route Planning**: Start-to-end navigation with traffic consideration

### 🚨 **Community Reporting**
- **Crowdsourced Alerts**: User-generated traffic reports
- **Real-Time Notifications**: Instant alerts to nearby users
- **Verification System**: Community validation of reports
- **Emergency Reporting**: Quick accident and incident reporting

### 📊 **Advanced Analytics**
- **Traffic Clustering**: AI-powered traffic pattern identification
- **Predictive Analytics**: Traffic forecasting based on historical data
- **Performance Metrics**: Detailed traffic statistics and insights
- **Export Capabilities**: Data export for analysis and reporting

---

## 🏗️ Architecture

```
TrafficAZ/
├── 📱 Frontend (React Native + Expo)
│   ├── 🎨 Components/          # Reusable UI components
│   ├── 📄 App/                 # Screen components and navigation
│   ├── 🔧 Services/            # API and business logic services
│   ├── 🌐 Context/             # React Context for state management
│   ├── 🎯 Constants/           # App configuration and constants
│   └── 🛠️ Utils/              # Helper functions and utilities
├── 🔗 Backend Integration
│   ├── 📡 REST API             # Traffic data endpoints
│   ├── 🧠 AI Analytics         # Machine learning models
│   └── 📊 Database             # Traffic and user data storage
└── 🌐 External APIs
    ├── 🌤️ OpenWeather         # Weather data
    ├── 🗺️ Google Maps         # Mapping and geolocation
    └── 🎤 Voice Recognition    # Speech-to-text processing
```

---

## 🛠️ Technology Stack

### **Frontend Framework**
- **React Native 0.79.5** - Cross-platform mobile development
- **Expo SDK 53** - Development platform and tools
- **Expo Router 5.1.3** - File-based navigation system

### **UI & Design**
- **React Native Vector Icons** - Icon library
- **Expo Linear Gradient** - Gradient effects
- **React Native Maps** - Interactive mapping
- **Custom Design System** - Consistent UI components

### **State Management**
- **React Context API** - Global state management
- **AsyncStorage** - Local data persistence
- **Expo Constants** - Environment configuration

### **Location & Maps**
- **Expo Location** - GPS and location services
- **React Native Maps** - Map visualization
- **Google Places Autocomplete** - Location search

### **Voice & Speech**
- **@react-native-voice/voice** - Voice recognition
- **Expo Speech** - Text-to-speech synthesis
- **Custom Voice Service** - Command processing

### **External Services**
- **OpenWeather API** - Weather data integration
- **Custom Backend API** - Traffic analytics backend
- **Real-time Communication** - WebSocket connections

### **Development Tools**
- **Expo CLI** - Development and build tools
- **Babel** - JavaScript transpilation
- **Metro Bundler** - React Native bundler

---

## 📱 Screenshots

<div align="center">

| Home Dashboard | Real-Time Map | Weather Integration |
|:---:|:---:|:---:|
| ![Home](assets/screenshots/home.png) | ![Map](assets/screenshots/map.png) | ![Weather](assets/screenshots/weather.png) |

| Voice Commands | Traffic Analytics | Route Planning |
|:---:|:---:|:---:|
| ![Voice](assets/screenshots/voice.png) | ![Analytics](assets/screenshots/analytics.png) | ![Routes](assets/screenshots/routes.png) |

</div>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (for iOS development)
- **Android Studio** (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/trafficaz-frontend.git
   cd trafficaz-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

### Development Commands

```bash
# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web

# Build for production
expo build:ios
expo build:android

# Eject from Expo (if needed)
expo eject
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Weather API Configuration
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Backend API Configuration
BACKEND_API_URL=https://backend-traffic-detection-production.up.railway.app

# Google Maps API Key (for Android)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Voice Recognition Configuration
VOICE_RECOGNITION_LANGUAGE=en-US

# App Configuration
APP_ENV=development
DEBUG_MODE=true
```

### API Keys Setup

#### 1. OpenWeather API
1. Visit [OpenWeather API](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add the key to your `.env` file

#### 2. Google Maps API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Maps SDK for Android/iOS
4. Generate API keys
5. Add keys to your configuration

### Platform-Specific Setup

#### iOS Configuration
```json
// app.json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "TrafficAZ needs location access to provide real-time traffic updates.",
        "NSMicrophoneUsageDescription": "TrafficAZ uses microphone access for voice commands."
      }
    }
  }
}
```

#### Android Configuration
```json
// app.json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FF3951"
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "RECORD_AUDIO"
      ]
    }
  }
}
```

---

## 📖 API Documentation

### Backend API Endpoints

#### Traffic Data Submission
```http
POST /api/v1/locations/submit
Content-Type: application/json

{
  "userId": "user123",
  "latitude": 3.848033,
  "longitude": 11.502075,
  "speed": 25.5,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Traffic Analysis
```http
POST /api/v1/congestion/analyze
Content-Type: application/json

Response:
{
  "success": true,
  "data": [
    {
      "clusterId": "cluster_central_yaounde",
      "centroidLatitude": 3.848033,
      "centroidLongitude": 11.502075,
      "averageSpeed": 5.2,
      "userCount": 8,
      "detectedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Route Traffic Check
```http
POST /api/v1/congestion/route-check
Content-Type: application/json

{
  "startLatitude": 3.848033,
  "startLongitude": 11.502075,
  "endLatitude": 3.850000,
  "endLongitude": 11.504000,
  "routeRadius": 1000
}
```

### Weather API Integration

#### Current Weather
```javascript
// Get current weather for location
const weather = await weatherService.getCurrentLocationWeather();

// Response structure
{
  current: {
    temperature: 25,
    feelsLike: 27,
    humidity: 65,
    windSpeed: 12,
    description: "Partly cloudy",
    trafficImpact: {
      level: "medium",
      reasons: ["Light rain affecting visibility"],
      delayMinutes: 5
    }
  }
}
```

### Voice Recognition API

#### Voice Commands
```javascript
// Available voice commands
const commands = {
  'traffic_situation': ['traffic situation', 'how is traffic'],
  'report_traffic': ['report traffic', 'traffic report'],
  'check_alerts': ['check alerts', 'notifications'],
  'weather_info': ['weather', 'temperature'],
  'route_traffic': ['route traffic', 'my route']
};
```

---

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting pull requests.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style Guidelines

- Follow **ESLint** configuration
- Use **Prettier** for code formatting
- Write meaningful commit messages
- Add JSDoc comments for functions
- Follow React Native best practices

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=WeatherWidget
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenWeather API** for weather data
- **Expo Team** for the amazing development platform
- **React Native Community** for continuous improvements
- **Cameroon Tech Community** for support and feedback

---

## 📞 Support

- **Email**: support@trafficaz.com
- **Documentation**: [docs.trafficaz.com](https://docs.trafficaz.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/trafficaz-frontend/issues)
- **Discord**: [TrafficAZ Community](https://discord.gg/trafficaz)

---

<div align="center">

**Made with ❤️ in Cameroon**

[![GitHub stars](https://img.shields.io/github/stars/your-username/trafficaz-frontend?style=social)](https://github.com/your-username/trafficaz-frontend)
[![GitHub forks](https://img.shields.io/github/forks/your-username/trafficaz-frontend?style=social)](https://github.com/your-username/trafficaz-frontend)
[![GitHub issues](https://img.shields.io/github/issues/your-username/trafficaz-frontend)](https://github.com/your-username/trafficaz-frontend/issues)

</div>
