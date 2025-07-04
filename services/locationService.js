const API_BASE = 'https://your-api-base-url.com'; // Replace with real backend URL

export async function submitLocation(lat, lng) {
  // Placeholder for location submission API call
  return fetch(`${API_BASE}/location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng }),
  }).then(res => res.json());
} 