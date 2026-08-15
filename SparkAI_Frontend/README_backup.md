# ConversAI - AI-Powered Conversation Training

A modern React application that helps users practice conversations with AI-powered superhero coaches. Built with React, Clerk authentication, Convex backend, and featuring Marvel character-themed training sessions.

## ✨ Features

- **🦾 Superhero Coaching**: Train with Iron Man, Hulk, or Black Panther as your AI coach
- **🔐 Secure Authentication**: Powered by Clerk for seamless user management
- **💬 Interactive Conversations**: Practice real scenarios with progressive questioning
- **🧠 Smart Quizzes**: Character-themed quizzes with famous Marvel dialogues
- **📊 Progress Tracking**: Detailed analytics and score breakdowns
- **🎨 Beautiful UI**: Modern design with subtle pink theme and smooth animations
- **📱 Responsive Design**: Works perfectly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Authentication**: Clerk
- **Backend**: Convex (real-time database)
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js + React Three Fiber
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Heroicons

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Clerk account ([signup here](https://clerk.com))

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Clerk Authentication

1. Create a new application at [Clerk Dashboard](https://dashboard.clerk.com)
2. Copy your **Publishable Key** from the dashboard
3. Update `.env.local`:

```bash
# Replace with your actual Clerk key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### 3. Run the Application

```bash
# Start the development server
npm run dev

# In another terminal, start Convex
npx convex dev
```

Visit `http://localhost:5173` to see the application!

## 📱 How to Use

1. **Sign Up/Login** - Create your account using Clerk authentication
2. **Choose Your Coach** - Select Iron Man, Hulk, or Black Panther
3. **Start Conversation** - Practice festival preparation dialogue
4. **Take Quizzes** - Answer character-themed questions after every 2 questions
5. **View Progress** - Get detailed scores and improvement insights
6. **Repeat** - Start new conversations to keep improving

## 🎯 Application Flow

```
Landing Page → Authentication → Character Selection → Conversation → Quizzes → Results Dashboard
```

### Character Personalities

- **🦾 Iron Man**: Confident, strategic, witty coaching style
- **💚 Hulk**: Direct, powerful, strength-focused approach  
- **🐾 Black Panther**: Wise, diplomatic, thoughtful guidance

## 📊 Scoring System

- **Confidence** (0-100): Based on response completeness and quiz performance
- **Fluency** (0-100): Measured by response time and smoothness
- **Response Quality** (0-100): Evaluated on detail and thoughtfulness

## 🎨 Design Features

- Subtle pink gradient theme throughout
- Glassmorphism effects and backdrop blur
- Smooth page transitions with Framer Motion
- Interactive 3D avatar integration
- Responsive design for all devices

## 🔧 Environment Variables

```bash
# Convex (auto-generated)
CONVEX_DEPLOYMENT=dev:your-deployment
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk (required)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

---

**Built with ❤️ for better communication skills**
