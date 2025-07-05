const API_BASE = 'https://your-api-base-url.com'; // Replace with real backend URL
 
export async function fetchAlerts() {
  // Placeholder for fetching congestion alerts
  return fetch(`${API_BASE}/alerts`).then(res => res.json());
} 