# Enhanced AI Voice Integration Guide

## 🎯 Overview
Your avatar application now features AI voice synthesis integrated into the quiz system:

### 🎤 **Voice Quiz Mode** (`/conversation`)
- AI character **speaks every question and greeting** using your backend API
- Interactive quizzes appear after questions 2, 4, and 6 
- AI provides **spoken feedback** after each quiz
- Progress tracking and analytics
- **Perfect for the experience you described!**

### 💬 **Free Chat Mode** (`/ai-conversation`) 
- Open-ended conversation with 3D avatar
- Real-time voice synthesis and lip-sync
- No structured questions or quizzes

## 🚀 Quick Start

### 1. Start Your Backend Server
Make sure your backend server is running on `http://localhost:3000`:

```bash
# In your backend directory
npm start
# or
node server.js
```

### 2. Start Frontend Development Server
```bash
# In this directory
npm run dev
```

### 3. Test the Integration
1. Navigate to `http://localhost:5173`
2. Sign in with Clerk authentication
3. Select a character (Ben10, Black Panther, Wanda Vision, or Dora)
4. Choose "AI Avatar Mode" to test backend integration
5. Start chatting and see the 3D avatar respond with voice and lip-sync!

## 🔧 Configuration

### Environment Variables
The following variables are configured in `.env.local`:

```env
VITE_API_URL=http://localhost:3000  # Your backend server URL
VITE_DEV_MODE=true                  # Development mode flag
```

### API Endpoints Used
- `POST /chat` - Send messages and receive AI responses with audio/lipsync
- `GET /voices` - Get available voice options

## 🎭 How It Works

### Backend Response Format Expected
Your backend should return responses in this format:

```json
{
  "messages": [
    {
      "text": "Hello! How can I help you today?",
      "audio": "base64-encoded-audio-data",
      "lipsync": {
        "metadata": {
          "duration": 2.5
        },
        "mouthCues": [
          {
            "start": 0.0,
            "end": 0.1,
            "value": "X"
          },
          {
            "start": 0.1,
            "end": 0.3,
            "value": "A"
          }
        ]
      },
      "facialExpression": "smile",
      "animation": "Talking_0"
    }
  ]
}
```

### Mouth Shape Mapping
The system maps these mouth shapes for lip-sync:
- `A` → `viseme_PP` (Closed mouth for P, B, M sounds)
- `B` → `viseme_kk` (Slightly open for K, S, T sounds)
- `C` → `viseme_I` (Open mouth for EH, AE sounds)
- `D` → `viseme_AA` (Wide open for AA sounds)
- `E` → `viseme_O` (Rounded for AO, ER sounds)
- `F` → `viseme_U` (Puckered for UW, OW, W sounds)
- `G` → `viseme_FF` (Teeth on lip for F, V sounds)
- `H` → `viseme_TH` (Tongue raised for L sounds)
- `X` → `viseme_PP` (Idle/silence)

### Available Animations
- `Talking_0`, `Talking_1`, `Talking_2` - Different talking animations
- `Idle` - Default idle animation
- `Crying`, `Laughing`, `Rumba` - Emotional animations
- `Terrified`, `Angry` - Expression animations

### Facial Expressions
- `default`, `smile`, `sad`, `angry`, `surprised`, `funnyFace`, `crazy`

## 🎮 User Experience

### Mode Selection
After character selection, users can choose between:

1. **Quiz Mode** (`/conversation`)
   - Interactive coaching with structured questions
   - Progressive quizzes after every 2 questions
   - Progress tracking and analytics
   - Character-themed quiz backgrounds

2. **AI Avatar Mode** (`/ai-conversation`)
   - Natural conversation with AI backend
   - Real-time voice synthesis and playback
   - 3D avatar lip-sync animation
   - Facial expressions and animations
   - Stop/control audio playback

### Features in AI Avatar Mode
- ✅ Real-time backend communication
- ✅ Base64 audio playback with lip-sync
- ✅ 3D avatar facial expressions
- ✅ Animation control based on response
- ✅ Connection status indicators
- ✅ Audio playback controls
- ✅ Character-themed UI
- ✅ Responsive chat interface

## 🛠 Troubleshooting

### Backend Connection Issues
1. Ensure backend server is running on `http://localhost:3000`
2. Check CORS is enabled in your backend
3. Verify API endpoints are responding correctly
4. Check browser console for network errors

### Audio Playback Issues
1. Ensure audio data is properly base64 encoded
2. Check browser audio permissions
3. Verify audio format is MP3
4. Test with shorter audio clips first

### Lip-sync Issues
1. Verify lipsync data format matches expected structure
2. Check mouth shape timing values
3. Ensure duration metadata is correct
4. Test with simpler mouth movements

## 📝 API Testing

You can test your backend endpoints with:

```bash
# Test basic chat endpoint
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Test voices endpoint  
curl http://localhost:3000/voices
```

## 🔄 Next Steps

1. **Test Basic Integration**: Start with simple text responses
2. **Add Audio**: Implement audio generation in your backend
3. **Add Lip-sync**: Generate mouth shape timing data
4. **Fine-tune**: Adjust facial expressions and animations
5. **Optimize**: Improve response times and audio quality

Your avatar is now ready for advanced AI conversations! 🎉