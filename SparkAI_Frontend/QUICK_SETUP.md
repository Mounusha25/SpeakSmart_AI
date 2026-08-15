# ConversAI - Setup Instructions

## 🚀 Quick Start Guide

This is a conversational AI avatar application built with React, Convex, and Clerk authentication.

### Prerequisites
- Node.js 16+ 
- npm or yarn
- A Clerk account (free)
- A Convex account (free)

### 1. Environment Setup

#### Get Clerk API Keys
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Sign up for a free account if you don't have one
3. Create a new application
4. Go to **API Keys** section
5. Copy the **Publishable Key** (starts with `pk_test_...`)
   - ⚠️ **Important**: Use the PUBLISHABLE key, NOT the secret key
   - Publishable keys start with `pk_test_...`
   - Secret keys start with `sk_test_...` (don't use these in frontend)

#### Update Environment Variables
Update `.env.local` file:
```bash
# Replace with your actual Clerk publishable key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here

# Convex (already configured)
CONVEX_DEPLOYMENT=dev:posh-cobra-874
VITE_CONVEX_URL=https://posh-cobra-874.convex.cloud
```

### 2. Install Dependencies & Start

```bash
# Install dependencies
npm install

# Start Convex in one terminal
npx convex dev

# Start React app in another terminal  
npm run dev
```

### 3. Application Flow

1. **Landing Page**: Welcome screen with authentication
2. **Character Selection**: Choose Iron Man, Hulk, or Black Panther
3. **Conversation Interface**: Practice conversations with 3D avatar
4. **Interactive Quizzes**: Marvel character-themed questions
5. **Progress Dashboard**: Detailed performance analytics

### 4. Features

- 🦾 **3D Avatar Integration**: Animated character interactions
- 🎯 **Real-time Scoring**: Confidence, fluency, and response quality metrics
- 📊 **Progress Tracking**: Historical performance analytics  
- 🧠 **Character-based Learning**: Marvel superhero coaching styles
- ✨ **Interactive Quizzes**: Knowledge testing with famous dialogues
- 📱 **Responsive Design**: Works on desktop and mobile

### 5. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Authentication**: Clerk
- **Backend**: Convex (real-time database)
- **Charts**: Recharts
- **Icons**: Heroicons

### 6. Troubleshooting

#### Common Issues

**Clerk Authentication Error**
- Make sure you're using the publishable key (`pk_test_...`)
- Check that the key is properly set in `.env.local`
- Restart the dev server after changing environment variables

**Convex Connection Issues**  
- Ensure `npx convex dev` is running
- Check that `VITE_CONVEX_URL` matches your deployment

**3D Avatar Not Loading**
- Verify model files exist in `public/models/`
- Check browser console for WebGL errors
- Try refreshing the page

---

## 📝 Development Notes

This application demonstrates:
- Modern React patterns with hooks and context
- Real-time data with Convex
- 3D graphics integration in web apps  
- Progressive web app principles
- Comprehensive user experience flow

Built for the SparkAI Hackathron 2024 🚀