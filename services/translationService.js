const API_BASE = 'https://your-api-base-url.com'; // Replace with real backend URL

export async function translateMessage(message, targetLang) {
  // Placeholder for translation API call
  return fetch(`${API_BASE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, targetLang }),
  }).then(res => res.json());
} 