// ElevenLabs Text-to-Speech Service
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs for different characters (you can change these to your preferred voices)
export const CHARACTER_VOICES = {
  'ben-10': 'EXAVITQu4vr4xnSDxMaL', // Bella - Young, energetic
  'black-panther': 'onwK4e9ZLuTAKqWW03F9', // Daniel - Deep, authoritative  
  'wanda-vision': 'EXAVITQu4vr4xnSDxMaL', // Bella - Confident, mysterious
  'dora': 'jsCqWAovK2LkecY7zXl4', // Freya - Young, cheerful
};

// Default voice settings
const DEFAULT_VOICE_SETTINGS = {
  stability: 0.75,
  similarity_boost: 0.85,
  style: 0.5,
  use_speaker_boost: true
};

// Generate speech using ElevenLabs API
export const generateSpeech = async (text, character = 'ben-10') => {
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
    throw new Error('ElevenLabs API key not configured');
  }

  const voiceId = CHARACTER_VOICES[character] || CHARACTER_VOICES['ben-10'];
  
  try {
    const response = await fetch(`${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2_5', // Updated to newer model that works on free tier
        voice_settings: DEFAULT_VOICE_SETTINGS,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Get audio blob
    const audioBlob = await response.blob();
    
    // Create audio URL
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return audioUrl;
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    throw error;
  }
};

// Get available voices from ElevenLabs
export const getVoices = async () => {
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
    throw new Error('ElevenLabs API key not configured');
  }

  try {
    const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error;
  }
};

// Test ElevenLabs connection
export const testConnection = async () => {
  try {
    await getVoices();
    return true;
  } catch (error) {
    console.error('ElevenLabs connection test failed:', error);
    return false;
  }
};