// Road Analysis Service for TrafficAZ
// Handles image uploads and analysis requests for CCTV and drone images

const API_BASE_URL = 'https://your-backend-api.com'; // Replace with actual backend URL

class RoadAnalysisService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Upload and analyze road image
  async analyzeRoadImage(imageData, locationData, metadata) {
    try {
      const formData = new FormData();
      
      // Add image file
      formData.append('image', {
        uri: imageData.uri,
        type: 'image/jpeg',
        name: `road_analysis_${Date.now()}.jpg`,
      });

      // Add location data
      formData.append('location', JSON.stringify({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        name: locationData.name,
        accuracy: locationData.accuracy || null,
        timestamp: locationData.timestamp || new Date().toISOString(),
      }));

      // Add metadata
      formData.append('metadata', JSON.stringify({
        captureType: metadata.captureType, // 'cctv' or 'drone'
        description: metadata.description || '',
        deviceInfo: metadata.deviceInfo || {},
        weather: metadata.weather || null,
        timestamp: metadata.timestamp || new Date().toISOString(),
      }));

      const response = await fetch(`${this.baseURL}/api/road-analysis/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${metadata.authToken || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };

    } catch (error) {
      console.error('❌ Road analysis error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get analysis history for a location
  async getAnalysisHistory(locationData, limit = 20) {
    try {
      const response = await fetch(
        `${this.baseURL}/api/road-analysis/history?` +
        `lat=${locationData.latitude}&` +
        `lng=${locationData.longitude}&` +
        `limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${locationData.authToken || ''}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.analyses || [],
      };

    } catch (error) {
      console.error('❌ Get analysis history error:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Get real-time traffic analysis for a location
  async getRealTimeAnalysis(locationData) {
    try {
      const response = await fetch(
        `${this.baseURL}/api/road-analysis/realtime?` +
        `lat=${locationData.latitude}&` +
        `lng=${locationData.longitude}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${locationData.authToken || ''}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };

    } catch (error) {
      console.error('❌ Get real-time analysis error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get analysis statistics for dashboard
  async getAnalysisStats(timeRange = '24h') {
    try {
      const response = await fetch(
        `${this.baseURL}/api/road-analysis/stats?range=${timeRange}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken || ''}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };

    } catch (error) {
      console.error('❌ Get analysis stats error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Upload multiple images for batch analysis
  async batchAnalyzeImages(imagesData, locationData, metadata) {
    try {
      const formData = new FormData();
      
      // Add multiple images
      imagesData.forEach((imageData, index) => {
        formData.append('images', {
          uri: imageData.uri,
          type: 'image/jpeg',
          name: `batch_analysis_${index}_${Date.now()}.jpg`,
        });
      });

      // Add location data
      formData.append('location', JSON.stringify({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        name: locationData.name,
        timestamp: locationData.timestamp || new Date().toISOString(),
      }));

      // Add metadata
      formData.append('metadata', JSON.stringify({
        captureType: metadata.captureType,
        description: metadata.description || '',
        batchSize: imagesData.length,
        timestamp: metadata.timestamp || new Date().toISOString(),
      }));

      const response = await fetch(`${this.baseURL}/api/road-analysis/batch`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${metadata.authToken || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };

    } catch (error) {
      console.error('❌ Batch analysis error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get analysis by ID
  async getAnalysisById(analysisId, authToken) {
    try {
      const response = await fetch(
        `${this.baseURL}/api/road-analysis/${analysisId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken || ''}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };

    } catch (error) {
      console.error('❌ Get analysis by ID error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Delete analysis
  async deleteAnalysis(analysisId, authToken) {
    try {
      const response = await fetch(
        `${this.baseURL}/api/road-analysis/${analysisId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken || ''}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Analysis deleted successfully',
      };

    } catch (error) {
      console.error('❌ Delete analysis error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Export analysis data
  async exportAnalysisData(filters, format = 'json', authToken) {
    try {
      const response = await fetch(
        `${this.baseURL}/api/road-analysis/export?format=${format}`,
        {
          method: 'POST',
          body: JSON.stringify(filters),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken || ''}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };

    } catch (error) {
      console.error('❌ Export analysis error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Mock analysis for development/testing
  async mockAnalysis(imageData, locationData, metadata) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalysis = {
      id: `analysis_${Date.now()}`,
      timestamp: new Date().toISOString(),
      location: locationData.name,
      coordinates: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      },
      imageUri: imageData.uri,
      captureType: metadata.captureType,
      analysis: {
        trafficLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        congestionScore: Math.floor(Math.random() * 100),
        roadCondition: ['Poor', 'Fair', 'Good', 'Excellent'][Math.floor(Math.random() * 4)],
        weatherCondition: ['Clear', 'Cloudy', 'Rainy', 'Foggy'][Math.floor(Math.random() * 4)],
        vehicleCount: Math.floor(Math.random() * 100),
        pedestrianCount: Math.floor(Math.random() * 50),
        incidents: [
          'Normal traffic flow',
          'Minor congestion detected',
          'Construction work in progress',
          'Traffic light malfunction',
          'Road maintenance required'
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        recommendations: [
          'Monitor traffic patterns',
          'Consider route optimization',
          'Schedule maintenance',
          'Update traffic signals',
          'Deploy traffic management'
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        processingTime: Math.floor(Math.random() * 2000) + 1000, // 1-3 seconds
      },
      status: 'completed',
      metadata: {
        ...metadata,
        modelVersion: 'v1.2.0',
        processingEngine: 'AI-Traffic-Analyzer',
      }
    };

    return {
      success: true,
      data: mockAnalysis,
    };
  }
}

// Create singleton instance
const roadAnalysisService = new RoadAnalysisService();

export default roadAnalysisService; 