import * as Location from 'expo-location';

class LocationService {
  constructor() {
    this.hasPermission = false;
    this.currentLocation = null;
    this.watchId = null;
  }

  // Request location permissions
  async requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      this.hasPermission = status === 'granted';
      
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }
      
      return this.hasPermission;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      throw error;
    }
  }

  // Check if we have location permissions
  async checkPermissions() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      this.hasPermission = status === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return false;
    }
  }

  // Get current location
  async getCurrentLocation(options = {}) {
    try {
      if (!this.hasPermission) {
        await this.requestPermissions();
      }

      const defaultOptions = {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
        ...options
      };

      const location = await Location.getCurrentPositionAsync(defaultOptions);
      this.currentLocation = location;
      
      console.log('Location obtained:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp).toLocaleString()
      });

      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  // Start watching location changes
  async startLocationUpdates(callback, options = {}) {
    try {
      if (!this.hasPermission) {
        await this.requestPermissions();
      }

      const defaultOptions = {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // 10 seconds
        distanceInterval: 50, // 50 meters
        ...options
      };

      this.watchId = await Location.watchPositionAsync(
        defaultOptions,
        (location) => {
          this.currentLocation = location;
          callback(location);
        }
      );

      console.log('Location updates started');
      return this.watchId;
    } catch (error) {
      console.error('Error starting location updates:', error);
      throw error;
    }
  }

  // Stop watching location changes
  stopLocationUpdates() {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
      console.log('Location updates stopped');
    }
  }

  // Get last known location
  getLastKnownLocation() {
    return this.currentLocation;
  }

  // Geocode an address
  async geocodeAddress(address) {
    try {
      const results = await Location.geocodeAsync(address);
      return results;
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  }

  // Reverse geocode coordinates
  async reverseGeocode(latitude, longitude) {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      return results;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }

  // Calculate distance between two points
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  // Convert degrees to radians
  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Get region for map display
  getMapRegion(latitude, longitude, delta = 0.01) {
    return {
      latitude,
      longitude,
      latitudeDelta: delta,
      longitudeDelta: delta,
    };
  }

  // Get region that fits multiple points
  getRegionForPoints(points, padding = 1.5) {
    if (points.length === 0) {
      return this.getMapRegion(3.848033, 11.502075); // Default to Yaoundé
    }

    const latitudes = points.map(p => p.latitude);
    const longitudes = points.map(p => p.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLng + maxLng) / 2;

    // Add padding so markers don't stick to edges
    const latitudeDelta = (maxLat - minLat) * padding || 0.01;
    const longitudeDelta = (maxLng - minLng) * padding || 0.01;

    return {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    };
  }

  // Check if location services are enabled
  async isLocationEnabled() {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      return enabled;
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }
}

export default new LocationService(); 