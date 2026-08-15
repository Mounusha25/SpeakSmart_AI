import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Enhanced chat function with proper backend integration
  const chat = async (message = "") => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Process each message from backend response
      const processedMessages = data.messages.map(msg => ({
        ...msg,
        id: Date.now() + Math.random(), // Add unique ID for each message
        timestamp: new Date()
      }));

      setMessages((prevMessages) => [...prevMessages, ...processedMessages]);
      setLoading(false);
      
      return data;
    } catch (error) {
      console.error('Error in chat:', error);
      setLoading(false);
      throw error;
    }
  };

  // Function to send a specific user message and get AI response
  const sendMessage = async (userMessage) => {
    // Handle both string and object inputs
    if (typeof userMessage === 'object') {
      // If it's an object (like avatar animation data), just add to messages
      const messageObj = {
        ...userMessage,
        id: userMessage.id || Date.now(),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, messageObj]);
      return;
    }
    
    if (!userMessage || !userMessage.trim()) return;
    
    // Add user message to chat
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    // Get AI response
    return await chat(userMessage);
  };

  // Function to start conversation with intro
  const startConversation = async () => {
    return await chat(""); // Empty message triggers intro
  };

  // Function to get available voices from backend
  const getVoices = async () => {
    try {
      const response = await fetch(`${backendUrl}/voices`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  };

  // Handle audio playback completion
  const onMessagePlayed = () => {
    setIsPlaying(false);
    setCurrentAudio(null);
    setMessages((messages) => messages.slice(1));
  };

  // Stop current audio if playing
  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

  // Function to trigger quiz result animations
  const triggerQuizResult = (isCorrect) => {
    setQuizResult(isCorrect);
    // Clear after animation
    setTimeout(() => setQuizResult(null), 4000);
  };

  useEffect(() => {
    if (messages.length > 0) {
      const nextMessage = messages.find(msg => msg.type !== 'user');
      if (nextMessage && !isPlaying) {
        setMessage(nextMessage);
      }
    } else {
      setMessage(null);
    }
  }, [messages, isPlaying]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        sendMessage,
        startConversation,
        getVoices,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        messages,
        isPlaying,
        setIsPlaying,
        currentAudio,
        setCurrentAudio,
        stopAudio,
        quizResult,
        triggerQuizResult,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
