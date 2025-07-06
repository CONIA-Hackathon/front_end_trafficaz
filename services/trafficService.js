// Traffic Service for handling location and speed data
// This service handles all API calls to your backend for traffic data

const API_BASE_URL = 'https://backend-traffic-detection-production.up.railway.app';

class TrafficService {
  // Send location and speed data to backend
  async sendLocationData(data) {
    try {
      const requestBody = {
        userId: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed, // Speed in km/h
        timestamp: data.timestamp, // ISO string format
      };

      console.log('🚀 Sending to Backend API:', {
        endpoint: `${API_BASE_URL}/api/v1/locations/submit`,
        method: 'POST',
        requestBody: requestBody,
        timestamp: new Date().toISOString()
      });

      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/api/v1/locations/submit`, {
      //   method: 'POST',
      //   headers: {
      //     'accept': 'application/json',
      //     'Content-Type': 'application/json',
      //     // 'Authorization': `Bearer ${authToken}`, // Add if needed
      //   },
      //   body: JSON.stringify(requestBody),
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const result = await response.json();
      // console.log('✅ Backend Response:', result);
      // return result;

      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
      const mockResponse = {
        success: true,
        message: 'Location data received successfully',
        dataId: `data_${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Mock Backend Response:', mockResponse);
      return mockResponse;

    } catch (error) {
      console.error('❌ Error sending location data to backend:', error);
      throw error;
    }
  }

  // Get traffic congestion analysis from backend
  async getTrafficAnalysis() {
    try {
      console.log('🧠 Fetching traffic congestion analysis from backend...');

      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/api/v1/congestion/analyze`, {
      //   method: 'POST',
      //   headers: {
      //     'accept': 'application/json',
      //     'Content-Type': 'application/json',
      //     // 'Authorization': `Bearer ${authToken}`, // Add if needed
      //   },
      //   body: JSON.stringify({}), // Empty body as per your API spec
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const result = await response.json();
      // console.log('🧠 Traffic analysis received:', result);
      // return result;

      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 300));
      const mockAnalysis = {
        success: true,
        statusCode: 0,
        message: "Traffic analysis completed successfully",
        data: [
          {
            clusterId: "cluster_central_yaounde",
            centroidLatitude: 3.848033,
            centroidLongitude: 11.502075,
            averageSpeed: 5.2,
            userCount: 8,
            detectedAt: new Date().toISOString()
          },
          {
            clusterId: "cluster_market_area",
            centroidLatitude: 3.846000,
            centroidLongitude: 11.500000,
            averageSpeed: 3.8,
            userCount: 6,
            detectedAt: new Date().toISOString()
          },
          {
            clusterId: "cluster_business_district",
            centroidLatitude: 3.850000,
            centroidLongitude: 11.504000,
            averageSpeed: 4.1,
            userCount: 5,
            detectedAt: new Date().toISOString()
          },
          {
            clusterId: "cluster_university_area",
            centroidLatitude: 3.844119,
            centroidLongitude: 11.501346,
            averageSpeed: 6.5,
            userCount: 4,
            detectedAt: new Date().toISOString()
          }
        ]
      };

      console.log('🧠 Mock traffic analysis received:', mockAnalysis);
      return mockAnalysis;

    } catch (error) {
      console.error('❌ Error fetching traffic analysis:', error);
      throw error;
    }
  }

  // Check traffic along a specific route
  async checkRouteTraffic(startLat, startLng, endLat, endLng) {
    try {
      console.log('🛣️ Checking traffic along route...', {
        start: { lat: startLat, lng: startLng },
        end: { lat: endLat, lng: endLng }
      });

      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/api/v1/congestion/route-check`, {
      //   method: 'POST',
      //   headers: {
      //     'accept': 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     startLatitude: startLat,
      //     startLongitude: startLng,
      //     endLatitude: endLat,
      //     endLongitude: endLng,
      //     routeRadius: 1000 // meters around the route
      //   }),
      // });

      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate route distance for realistic traffic simulation
      const routeDistance = Math.sqrt(
        Math.pow(endLat - startLat, 2) + Math.pow(endLng - startLng, 2)
      ) * 111000; // Convert to meters
      
      const mockRouteTraffic = {
        success: true,
        routeInfo: {
          distance: routeDistance,
          estimatedTime: routeDistance / 1000 * 2, // 2 min per km
          trafficLevel: 'moderate', // low, moderate, high, severe
          congestionPercentage: 35,
          averageSpeed: 18.5,
          userCount: 12
        },
        trafficClusters: [
          {
            clusterId: "route_cluster_1",
            latitude: (startLat + endLat) / 2,
            longitude: (startLng + endLng) / 2,
            averageSpeed: 15.2,
            userCount: 8,
            severity: 'moderate',
            description: 'Moderate traffic detected along route'
          }
        ],
        recommendations: [
          'Consider leaving 10 minutes earlier',
          'Alternative route available via Market Road',
          'Traffic expected to clear in 20 minutes'
        ]
      };

      console.log('🛣️ Route traffic analysis:', mockRouteTraffic);
      return mockRouteTraffic;

    } catch (error) {
      console.error('❌ Error checking route traffic:', error);
      throw error;
    }
  }

  // Get traffic data from backend
  async getTrafficData(region = null) {
    try {
      console.log('📡 Fetching traffic data from backend...');

      // TODO: Replace with actual API call
      // const params = region ? `?lat=${region.latitude}&lng=${region.longitude}&radius=5000` : '';
      // const response = await fetch(`${API_BASE_URL}/api/traffic/data${params}`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${authToken}`,
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const data = await response.json();
      // console.log('📊 Traffic data received:', data);
      // return data;

      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 200));
      const mockTrafficData = [
        // High traffic areas (low speed)
        { id: 'traffic1', latitude: 3.848033, longitude: 11.502075, speed: 5.2, timestamp: new Date().toISOString(), isTraffic: true },
        { id: 'traffic2', latitude: 3.848100, longitude: 11.502150, speed: 3.8, timestamp: new Date().toISOString(), isTraffic: true },
        { id: 'traffic3', latitude: 3.848200, longitude: 11.502200, speed: 4.1, timestamp: new Date().toISOString(), isTraffic: true },
        
        // Normal traffic areas (normal speed)
        { id: 'user1', latitude: 3.852000, longitude: 11.506000, speed: 25.5, timestamp: new Date().toISOString(), isTraffic: false },
        { id: 'user2', latitude: 3.845000, longitude: 11.503000, speed: 30.2, timestamp: new Date().toISOString(), isTraffic: false },
        { id: 'user3', latitude: 3.849000, longitude: 11.505000, speed: 28.7, timestamp: new Date().toISOString(), isTraffic: false },
      ];

      console.log('📊 Mock traffic data received:', mockTrafficData);
      return mockTrafficData;

    } catch (error) {
      console.error('❌ Error fetching traffic data:', error);
      throw error;
    }
  }

  // Analyze traffic congestion based on speed data
  analyzeTrafficCongestion(trafficData) {
    try {
      const congestionThreshold = 10; // km/h - speeds below this indicate congestion
      const congestedAreas = trafficData.filter(point => point.speed < congestionThreshold);
      
      const analysis = {
        totalPoints: trafficData.length,
        congestedPoints: congestedAreas.length,
        congestionPercentage: (congestedAreas.length / trafficData.length) * 100,
        averageSpeed: trafficData.reduce((sum, point) => sum + point.speed, 0) / trafficData.length,
        congestedAreas: congestedAreas
      };

      console.log('🚦 Traffic Analysis:', analysis);
      return analysis;

    } catch (error) {
      console.error('❌ Error analyzing traffic congestion:', error);
      throw error;
    }
  }

  // Get traffic alerts for a specific area
  async getTrafficAlerts(latitude, longitude, radius = 5000) {
    try {
      console.log('🚨 Fetching traffic alerts...');

      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/api/traffic/alerts?lat=${latitude}&lng=${longitude}&radius=${radius}`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${authToken}`,
      //     // 'Authorization': `Bearer ${authToken}`, // Add if needed
      //   },
      // });

      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 150));
      const mockAlerts = [
        {
          id: 'alert1',
          type: 'congestion',
          severity: 'medium',
          message: 'Heavy traffic detected in Central Yaoundé',
          location: { latitude: 3.848033, longitude: 11.502075 },
          timestamp: new Date().toISOString()
        }
      ];

      console.log('🚨 Traffic alerts received:', mockAlerts);
      return mockAlerts;

    } catch (error) {
      console.error('❌ Error fetching traffic alerts:', error);
      throw error;
    }
  }
}

export default new TrafficService(); 