// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API Error ${response.status}: ${errorData}`);
  }
  return response.json();
};

// Send message to virtual girlfriend backend
export const sendMessage = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message || '' // Empty message triggers intro
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get available voices from backend
export const getVoices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/voices`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error;
  }
};

// Test backend connection
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/voices`);
    return response.ok;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};

// Mouth shape mapping for lip sync (matching your Avatar component)
export const MOUTH_SHAPES = {
  A: 'viseme_PP',    // Closed mouth (P, B, M sounds)
  B: 'viseme_kk',    // Slightly open, clenched teeth (K, S, T sounds)  
  C: 'viseme_I',     // Open mouth (EH, AE sounds)
  D: 'viseme_AA',    // Wide open (AA sounds)
  E: 'viseme_O',     // Slightly rounded (AO, ER sounds)
  F: 'viseme_U',     // Puckered lips (UW, OW, W sounds)
  G: 'viseme_FF',    // Upper teeth on lower lip (F, V sounds)
  H: 'viseme_TH',    // Tongue raised (L sounds)
  X: 'viseme_PP'     // Idle/silence position
};

// Facial expression mapping (matching your Avatar component)
export const FACIAL_EXPRESSIONS = {
  smile: 'smile',
  sad: 'sad',
  angry: 'angry',
  surprised: 'surprised',
  funnyFace: 'funnyFace',
  default: 'default',
  crazy: 'crazy'
};

// Animation mapping (you can extend this based on your available animations)
export const ANIMATIONS = {
  Talking_0: 'Talking_0',
  Talking_1: 'Talking_1', 
  Talking_2: 'Talking_2',
  Crying: 'Crying',
  Laughing: 'Laughing',
  Rumba: 'Rumba',
  Idle: 'Idle',
  Terrified: 'Terrified',
  Angry: 'Angry'
};

// Helper to convert base64 to blob
export const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// Helper to create audio URL from base64
export const createAudioFromBase64 = (base64Audio) => {
  const audioBlob = base64ToBlob(base64Audio, 'audio/mp3');
  return URL.createObjectURL(audioBlob);
};