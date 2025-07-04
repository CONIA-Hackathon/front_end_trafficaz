export function isValidPhoneNumber(phone) {
  // Simple regex for phone number validation
  return /^\d{10,15}$/.test(phone);
} 