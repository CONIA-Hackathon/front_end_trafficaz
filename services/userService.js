import { API_BASE_URL } from '../constants/config';

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  const data = await response.json();
  
  console.log('User API Response Status:', response.status);
  console.log('User API Response Data:', data);
  
  if (!response.ok) {
    console.error('User API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    
    const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }
  
  return data;
};

// Get user profile data
export async function getUserProfile(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(token, userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
}

// Get user statistics
export async function getUserStats(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Get user stats error:', error);
    throw error;
  }
}

// Change password
export async function changePassword(token, currentPassword, newPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
}

// Delete account
export async function deleteAccount(token, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/delete-account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        password,
      }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Delete account error:', error);
    throw error;
  }
}

// Mock data for development (when API is not available)
export const getMockUserData = () => ({
  id: 'user_123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+237612345678',
  avatar: null,
  language: 'en',
  createdAt: '2024-01-15T10:30:00Z',
  lastLogin: '2024-01-20T14:45:00Z',
  isVerified: true,
  preferences: {
    notifications: true,
    locationSharing: true,
    language: 'en'
  }
});

export const getMockUserStats = () => ({
  totalRoutes: 24,
  totalAlerts: 156,
  totalReports: 89,
  totalDistance: 1250.5, // km
  totalTime: 45.2, // hours
  averageSpeed: 28.5, // km/h
  favoriteRoutes: 5,
  contributionScore: 1250
}); 