const API_BASE = 'https://your-api-base-url.com'; // Replace with real backend URL

export async function login(phoneNumber) {
  // Placeholder for login API call
  return fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  }).then(res => res.json());
}

export async function register(phoneNumber) {
  // Placeholder for register API call
  return fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  }).then(res => res.json());
}

export async function verifyOtp(phoneNumber, otp) {
  // Placeholder for OTP verification API call
  return fetch(`${API_BASE}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, otp }),
  }).then(res => res.json());
} 