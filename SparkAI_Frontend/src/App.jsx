import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

// Components
import LandingPage from './components/LandingPage';
import CharacterSelection from './components/CharacterSelection';
import ConversationInterface from './components/ConversationInterface';
import BackendConversationInterface from './components/BackendConversationInterface';
import BackendConnectionTest from './components/BackendConnectionTest';
import ProgressDashboard from './components/ProgressDashboard';
import DebugPage from './components/DebugPage';
import CharacterSelectionDashboard from './components/CharacterSelectionDashboard';

function App() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [completedConversation, setCompletedConversation] = useState(null);
  
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const seedCharacters = useMutation(api.characters.seedCharacters);
  const seedQuizQuestions = useMutation(api.characters.seedQuizQuestions);
  
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkUserId: user.id } : 'skip'
  );

  // Debug logging
  console.log('App render:', { user: !!user, isLoaded, userData, selectedCharacter });

  // Initialize user and seed data when user logs in
  useEffect(() => {
    const initializeUser = async () => {
      if (user && !userData) {
        try {
          await getOrCreateUser({
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress || ''
          });
          
          // Seed initial data if needed
          await seedCharacters();
          await seedQuizQuestions();
        } catch (error) {
          console.error('Failed to initialize user:', error);
        }
      }
    };

    if (isLoaded && user) {
      initializeUser();
    }
  }, [user, isLoaded, userData]);

  // Set selected character from user data
  useEffect(() => {
    if (userData?.selectedCharacter) {
      setSelectedCharacter(userData.selectedCharacter);
    }
  }, [userData]);

  const handleCharacterSelection = (character) => {
    setSelectedCharacter(character);
    navigate('/conversation');
  };

  const handleConversationComplete = (conversation) => {
    setCompletedConversation(conversation);
    navigate('/results');
  };

  const handleStartNewConversation = () => {
    setCompletedConversation(null);
    if (selectedCharacter) {
      navigate('/conversation');
    } else {
      navigate('/character-selection');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/logo.png" 
            alt="EmotiSphere Logo" 
            className="w-24 h-24 object-contain mx-auto mb-6"
          />
          <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading EmotiSphere...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* FIXED: Single root route that handles both signed in and signed out */}
      <Route path="/" element={
        <>
          <SignedOut>
            <LandingPage />
          </SignedOut>
          <SignedIn>
            <Navigate to="/character-selection" replace />
          </SignedIn>
        </>
      } />
      
      <Route path="/character-selection" element={
        <SignedIn>
          <CharacterSelection onComplete={handleCharacterSelection} />
        </SignedIn>
      } />
      
      <Route path="/conversation" element={
        <SignedIn>
          {selectedCharacter ? (
            <ConversationInterface 
              character={selectedCharacter}
              onComplete={handleConversationComplete}
            />
          ) : (
            <Navigate to="/character-selection" replace />
          )}
        </SignedIn>
      } />
      
      <Route path="/ai-conversation" element={
        <SignedIn>
          {selectedCharacter ? (
            <BackendConversationInterface 
              character={selectedCharacter}
              onComplete={handleConversationComplete}
            />
          ) : (
            <Navigate to="/character-selection" replace />
          )}
        </SignedIn>
      } />
      
      <Route path="/results" element={
        <SignedIn>
          <ProgressDashboard 
            completedConversation={completedConversation || {
              sessionId: "d411d0d0-81b8-4f35-aeb1-09a1a03467ab",
              character: "ben-10"
            }}
            onStartNew={handleStartNewConversation}
          />
        </SignedIn>
      } />
      
      <Route path="/debug" element={
        <SignedIn>
          <DebugPage />
        </SignedIn>
      } />

      <Route path="/backend-test" element={
        <SignedIn>
          <BackendConnectionTest />
        </SignedIn>
      } />

      <Route path="/admin-dashboard" element={
        <SignedIn>
          <CharacterSelectionDashboard />
        </SignedIn>
      } />
      
      {/* Fallback routes */}
      <Route path="*" element={
        <>
          <SignedOut>
            <Navigate to="/" replace />
          </SignedOut>
          <SignedIn>
            <Navigate to="/character-selection" replace />
          </SignedIn>
        </>
      } />
    </Routes>
  );
}

export default App;
