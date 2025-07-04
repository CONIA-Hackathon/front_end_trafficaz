const API_BASE = 'https://your-api-base-url.com'; // Replace with real backend URL

export async function subscribeToNotifications(type, phoneNumber) {
  // Placeholder for subscribing to notifications (SMS, PUSH, VOICE)
  return fetch(`${API_BASE}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, phoneNumber }),
  }).then(res => res.json());
} 