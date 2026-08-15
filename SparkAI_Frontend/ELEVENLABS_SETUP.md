# 🎤 ElevenLabs Integration Setup

## 🔑 Step 1: Add Your API Key

**Replace `your_elevenlabs_api_key_here` in `.env.local` with your actual API key:**

```bash
# ElevenLabs Configuration
VITE_ELEVENLABS_API_KEY=sk_your_actual_elevenlabs_api_key_here
```

## 🎭 Step 2: Customize Character Voices (Optional)

Edit `/src/services/elevenlabs.js` to change voice IDs:

```javascript
export const CHARACTER_VOICES = {
  'ben-10': 'EXAVITQu4vr4xnSDxMaL',     // Change to your preferred voice
  'black-panther': 'onwK4e9ZLuTAKqWW03F9', // Change to your preferred voice
  'wanda-vision': 'EXAVITQu4vr4xnSDxMaL',  // Change to your preferred voice
  'dora': 'jsCqWAovK2LkecY7zXl4',         // Change to your preferred voice
};
```

### How to Find Voice IDs:
1. Go to ElevenLabs dashboard
2. Click on "Voices" 
3. Copy the Voice ID of voices you want to use

## 🚀 Step 3: Test It!

1. **Add your API key** to `.env.local`
2. **Restart your dev server**: `npm run dev`
3. **Go to**: `http://localhost:5173`
4. **Sign in** → Select Character → Choose **"Voice Quiz Mode"**
5. **Listen** as your character speaks with ElevenLabs voice!

## ⚡ What Happens Now:

✅ **Ben 10 speaks**: "It's hero time!" with ElevenLabs voice
✅ **All questions spoken** using your AI voice generation  
✅ **Quiz feedback** delivered with natural speech
✅ **Fallback protection** - uses browser speech if ElevenLabs fails
✅ **Audio controls** - stop button, visual indicators

## 🔧 Voice Settings (Optional)

Customize voice quality in `/src/services/elevenlabs.js`:

```javascript
const DEFAULT_VOICE_SETTINGS = {
  stability: 0.75,        // 0-1: Lower = more expressive
  similarity_boost: 0.85, // 0-1: Higher = more similar to original
  style: 0.5,            // 0-1: Style strength 
  use_speaker_boost: true // Better quality
};
```

## 🎯 Files Modified:

1. **`.env.local`** - Added ElevenLabs API key
2. **`/src/services/elevenlabs.js`** - New ElevenLabs service  
3. **`/src/components/ConversationInterface.jsx`** - Updated speakText function

## 🛠 Troubleshooting:

**If you get API errors:**
- Check your API key is correct
- Verify you have credits in ElevenLabs
- Check browser console for detailed error messages

**If no sound:**
- Check browser isn't muted
- Try different voice IDs
- System will fallback to browser speech automatically

Your ElevenLabs integration is ready! 🎉🎤