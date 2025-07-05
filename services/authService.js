import { API_BASE_URL, API_ENDPOINTS } from '../constants/config';

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  const data = await response.json();
  
  console.log('API Response Status:', response.status);
  console.log('API Response Data:', data);
  
  if (!response.ok) {
    // Log the full error details
    console.error('API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    
    // Return more specific error message
    const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }
  
  return data;
};

export async function register(userData) {
  try {
    console.log('Register API - Sending data:', userData);
    
    // Format phone number to include + prefix if not present
    const formattedPhoneNumber = userData.phoneNumber.startsWith('+') 
      ? userData.phoneNumber 
      : `+${userData.phoneNumber}`;
    
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name || 'User',
        phoneNumber: formattedPhoneNumber,
        email: userData.email || '',
        password: userData.password,
        language: userData.language || 'en'
      }),
    });

    console.log('Register API - Response received');
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

export async function sendOtp(phoneNumber) {
  try {
    // Format phone number to include + prefix if not present
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber}`;
      
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SEND_OTP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: formattedPhoneNumber
      }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Send OTP error:', error);
    throw error;
  }
}

export async function verifyOtp(phoneNumber, otpCode) {
  try {
    // Format phone number to include + prefix if not present
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber}`;
      
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VERIFY_OTP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: formattedPhoneNumber,
        otpCode: otpCode
      }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
}

export async function login(phoneNumber, password) {
  try {
    // Format phone number to include + prefix if not present
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber}`;
      
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: formattedPhoneNumber,
        password: password
      }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
} 