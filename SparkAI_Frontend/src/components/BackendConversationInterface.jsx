import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Experience } from "./Experience";
import { useChat } from "../hooks/useChat";
import { sendMessage, testConnection } from "../services/api";

const BackendConversationInterface = ({ character, onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const inputRef = useRef(null);
  
  const { 
    chat, 
    sendMessage: chatSendMessage, 
    startConversation, 
    loading, 
    cameraZoomed, 
    setCameraZoomed, 
    message,
    isPlaying,
    stopAudio 
  } = useChat();

  // Character data matching your existing structure
  const characterData = {
    'ben-10': {
      name: 'Ben 10',
      image: '/src/assets/Ben10.jpeg',
      greeting: "It's hero time! Ready to transform your conversation skills?",
      color: 'from-green-500 to-emerald-500'
    },
    'black-panther': {
      name: 'Black Panther',
      image: '/src/assets/BlackPanther.jpeg',
      greeting: "Greetings. I am T'Challa. Let us prepare you for meaningful dialogue.",
      color: 'from-purple-500 to-indigo-500'
    },
    'wanda-vision': {
      name: 'Wanda Vision',
      image: '/src/assets/WandaVision.jpeg',
      greeting: "Hello there. I understand the power of words and emotions.",
      color: 'from-red-500 to-pink-500'
    },
    'dora': {
      name: 'Dora',
      image: '/src/assets/dora.jpeg',
      greeting: "¡Hola! I'm Dora! Let's go on an adventure to improve your conversation skills!",
      color: 'from-orange-500 to-yellow-500'
    }
  };

  const currentCharacter = characterData[character] || characterData['ben-10'];

  // Test backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      const connected = await testConnection();
      setBackendConnected(connected);
      if (connected && !conversationStarted) {
        await initializeConversation();
      }
    };
    checkBackend();
  }, []);

  // Initialize conversation with backend
  const initializeConversation = async () => {
    if (conversationStarted) return;
    
    try {
      setIsLoading(true);
      setConversationStarted(true);
      
      // Start conversation with empty message to get intro from backend
      await startConversation();
      
      // Don't add local greeting - let backend handle the intro message
      
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
      setConversationStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending user message
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading || !backendConnected) return;
    
    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsLoading(true);
    
    try {
      // Add user message to local state immediately
      const userMsg = {
        id: Date.now(),
        type: 'user',
        text: userMessage,
        timestamp: new Date()
      };
      setMessages(prev => [userMsg, ...prev]);

      // Send to backend and get AI response
      await chatSendMessage(userMessage);
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      const errorMsg = {
        id: Date.now() + 1,
        type: 'error',
        text: 'Sorry, I had trouble processing your message. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [errorMsg, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Focus input when not playing
  useEffect(() => {
    if (!isPlaying && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${currentCharacter.color} p-6 text-white shadow-lg`}
      >
        <div className="flex items-center space-x-4">
          <img
            src={currentCharacter.image}
            alt={currentCharacter.name}
            className="w-12 h-12 rounded-full border-2 border-white/30"
          />
          <div>
            <h2 className="text-2xl font-bold">{currentCharacter.name}</h2>
            <p className="text-sm opacity-90">
              {backendConnected ? (
                isPlaying ? 'Speaking...' : 'Ready to chat'
              ) : (
                'Connecting to backend...'
              )}
            </p>
          </div>
          {!backendConnected && (
            <div className="ml-auto">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* 3D Avatar Section */}
        <div className="flex-1 relative">
          <Canvas
            shadows
            camera={{ position: [0, 0, 8], fov: 42 }}
            className="bg-transparent"
          >
            <Experience />
          </Canvas>
          <Loader />

          {/* Avatar Controls */}
          <div className="absolute top-4 left-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCameraZoomed(!cameraZoomed)}
              className="bg-white/20 backdrop-blur-md rounded-full p-3 text-white hover:bg-white/30 transition-colors"
            >
              {cameraZoomed ? '🔍' : '📷'}
            </motion.button>
          </div>

          {/* Stop Audio Button */}
          {isPlaying && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={stopAudio}
              className="absolute top-4 right-4 bg-red-500/20 backdrop-blur-md rounded-full p-3 text-red-600 hover:bg-red-500/30 transition-colors"
            >
              <StopIcon className="h-6 w-6" />
            </motion.button>
          )}
        </div>

        {/* Chat Section */}
        <div className="w-1/3 bg-white/80 backdrop-blur-sm border-l border-gray-200/50 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {[...messages].reverse().map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white ml-4'
                      : msg.type === 'error'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-gray-100 text-gray-800 mr-4'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {(isLoading || loading) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-2xl p-3 mr-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex space-x-3 items-end">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    !backendConnected 
                      ? "Connecting to backend..." 
                      : isPlaying 
                      ? "Listening to response..." 
                      : "Type your message..."
                  }
                  disabled={!backendConnected || isLoading || isPlaying}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/70 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  rows="2"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading || !backendConnected || isPlaying}
                className={`px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentMessage.trim() && backendConnected && !isLoading && !isPlaying
                    ? `bg-gradient-to-r ${currentCharacter.color} text-white shadow-lg hover:shadow-xl`
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-sm text-gray-500 bg-white/50 border-t border-gray-200/50">
        {backendConnected ? (
          <span className="text-green-600">✓ Connected to AI Backend</span>
        ) : (
          <span className="text-red-600">⚠ Backend Connection Required</span>
        )}
      </div>
    </div>
  );
};

export default BackendConversationInterface;