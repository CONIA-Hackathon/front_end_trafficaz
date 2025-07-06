// Test file to verify backend integration
// Run this to test the actual API endpoint

const API_BASE_URL = 'https://backend-traffic-detection-production.up.railway.app';

// Test data matching your backend requirements
const testData = {
  userId: "test_user_123",
  latitude: 3.848033,
  longitude: 11.502075,
  speed: 25.5,
  timestamp: new Date().toISOString()
};

async function testBackendIntegration() {
  try {
    console.log('🧪 Testing Backend Integration...');
    console.log('📡 Endpoint:', `${API_BASE_URL}/api/v1/locations/submit`);
    console.log('📦 Request Body:', JSON.stringify(testData, null, 2));

    const response = await fetch(`${API_BASE_URL}/api/v1/locations/submit`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success Response:', result);
    } else {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
    }

  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

// Run the test
testBackendIntegration();

// Export for use in other files
export { testBackendIntegration, testData }; 