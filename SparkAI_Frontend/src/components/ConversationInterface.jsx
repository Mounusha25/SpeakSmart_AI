import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery } from 'convex/react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { api } from '../../convex/_generated/api';
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Experience } from "./Experience";
import { useChat } from "../hooks/useChat";
import { generateSpeech } from "../services/elevenlabs";
import { fetchSessionByUser, getFormattedQuestionText, getFinalCompletionMessage } from "../services/mongodb";
import QuizModal from './QuizModal';
import { demoQuizData } from '../data/demoQuizData';

const ConversationInterface = ({ character, onComplete }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleLogout = () => {
    signOut();
  };

  console.log('ConversationInterface initialized with character:', character);
  const [conversation, setConversation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [conversationStarted, setConversationStarted] = useState(false);
  
  // MongoDB session data state
  const [sessionData, setSessionData] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  
  // Conversation history for better UI
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const chatContainerRef = useRef(null);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [hasSpokenGreeting, setHasSpokenGreeting] = useState(false);
  const [hasSpokenCurrentQuestion, setHasSpokenCurrentQuestion] = useState(false);
  const [hasSpokenInitialMessage, setHasSpokenInitialMessage] = useState(false);
  const inputRef = useRef(null);
  
  // Add refs to prevent duplicate calls in React 18 Strict Mode
  const initializationRef = useRef(false);
  const currentSpeechRef = useRef(null);
  const hasInitializedRef = useRef(false); // CRITICAL FIX for Strict Mode

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Audio recording refs
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const { chat, sendMessage, loading, cameraZoomed, setCameraZoomed, message, isPlaying, triggerQuizResult } = useChat();

  // Quiz trigger logic - every 3 questions (3, 6, 9, etc.) to match MongoDB database schema
  const shouldTriggerQuiz = (currentQuestionIndex + 1) % 3 === 0 && currentQuestionIndex >= 2;

  const startConversation = useMutation(api.conversations.startConversation);
  const submitResponse = useMutation(api.conversations.submitResponse);
  const completeConversation = useMutation(api.conversations.completeConversation);
  
  // MongoDB API base URL
  const API_BASE_URL = 'http://localhost:3001/api';

  // Character greetings and data with public folder images
  const characterData = {
    'ben-10': {
      name: 'Ben 10',
      image: '/Ben10.jpeg',
      greeting: "It's hero time! Ready to transform your conversation skills? Let me help you become the hero of any discussion!",
      color: 'from-green-500 to-emerald-500'
    },
    'black-panther': {
      name: 'Black Panther',
      image: '/BlackPanther.jpeg',
      greeting: "Greetings. I am T'Challa. Let us prepare you for meaningful dialogue with the wisdom of Wakanda.",
      color: 'from-purple-500 to-indigo-500'
    },
    'wanda-vision': {
      name: 'Wanda Vision',
      image: '/WandaVision.jpeg',
      greeting: "Hello there. I understand the power of words and emotions. Let's work together to strengthen your communication abilities.",
      color: 'from-red-500 to-pink-500'
    },
    'dora': {
      name: 'Dora',
      image: '/dora.jpeg',
      greeting: "¡Hola! I'm Dora! Let's go on an adventure to improve your conversation skills. Are you ready to explore?",
      color: 'from-orange-500 to-yellow-500'
    }
  };

  // Get questions from MongoDB session data
  const getQuestionsFromSession = () => {
    if (!sessionData?.history) {
      console.warn('⚠️ No session data available, using fallback questions');
      // Fallback questions in case session data is not loaded
      const currentCharacterData = characterData[character];
      return [
        { id: 1, text: `${currentCharacterData.greeting} Now, what's your role in organizing this festival?` },
        { id: 2, text: "How many people are you expecting?" },
        { id: 3, text: "What's the main challenge you're facing?" },
        { id: 4, text: "Have you prepared your speech points?" },
        { id: 5, text: "What tone do you want to convey?" },
        { id: 6, text: "How confident do you feel about this event?" },
      ];
    }

    // Convert MongoDB history to question format with dynamic feedback integration
    return sessionData.history.map((historyItem, index) => ({
      id: index + 1,
      text: getFormattedQuestionText(sessionData, index)
    }));
  };

  // Get current questions (will update when sessionData changes)
  const currentQuestions = getQuestionsFromSession();

  useEffect(() => {
    // Prevent double initialization in React 18 Strict Mode
    if (hasInitializedRef.current) {
      console.log('⚠️ Prevented duplicate initialization due to Strict Mode');
      return;
    }
    
    hasInitializedRef.current = true;
    initializeConversation();
    
    // Cleanup function for Strict Mode
    return () => {
      console.log('🧹 Cleanup called');
      // Don't reset hasInitializedRef here - we want to keep the guard
    };
  }, []);

  // Fetch quiz question from quiz_questions table when needed
  useEffect(() => {
    console.log('🔄 Quiz useEffect triggered:', { showQuiz, character, currentQuestionIndex });
    
    const fetchQuizQuestion = async () => {
      if (!showQuiz) {
        console.log('❌ Not fetching quiz - showQuiz is false');
        return;
      }
      
      const questionNumber = currentQuestionIndex + 1;
      
      console.log('🎮 Fetching quiz from MongoDB quiz_questions collection:', { 
        character,
        currentQuestionIndex,
        questionNumber,
        lookingForTriggerAfter: questionNumber,
        apiEndpoint: `${API_BASE_URL}/quiz-questions/quiz-question/${character}/${questionNumber}`
      });
      
      try {
        // MongoDB API endpoint - fetch quiz that triggers after this question number
        // This matches your MongoDB schema where triggerAfterQuestion = 3, 6, 9, etc.
        const response = await fetch(`${API_BASE_URL}/quiz-questions/quiz-question/${character}/${questionNumber}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          console.log('✅ Quiz data loaded from quiz_questions table:', result.data);
          
          // Transform the database schema to match QuizModal expected format
          const transformedQuizData = {
            id: result.data._id,
            dialogue: result.data.dialogue,
            question: result.data.question,
            options: result.data.options,
            correctAnswer: result.data.correctAnswer,
            explanation: result.data.explanation,
            character: result.data.character,
            questionNumber: result.data.questionNumber,
            triggerAfterQuestion: result.data.triggerAfterQuestion
          };
          
          setQuizQuestion(transformedQuizData);
        } else {
          console.error('❌ Quiz not found in quiz_questions table:', result.message);
          
          // Fallback: try to get any available quiz for this character
          try {
            const fallbackResponse = await fetch(`${API_BASE_URL}/quiz-questions/character-quizzes/${character}`);
            const fallbackResult = await fallbackResponse.json();
            
            if (fallbackResult.success && fallbackResult.data && fallbackResult.data.length > 0) {
              // Use the first available quiz for this character
              const availableQuiz = fallbackResult.data[0];
              console.log('✅ Using fallback quiz from quiz_questions table:', availableQuiz);
              
              const transformedQuizData = {
                id: availableQuiz._id,
                dialogue: availableQuiz.dialogue,
                question: availableQuiz.question,
                options: availableQuiz.options,
                correctAnswer: availableQuiz.correctAnswer,
                explanation: availableQuiz.explanation,
                character: availableQuiz.character,
                questionNumber: availableQuiz.questionNumber,
                triggerAfterQuestion: availableQuiz.triggerAfterQuestion
              };
              
              setQuizQuestion(transformedQuizData);
            } else {
              throw new Error('No quizzes found for character in quiz_questions table');
            }
          } catch (fallbackError) {
            console.error('❌ Fallback quiz fetch failed:', fallbackError);
            
            // Emergency fallback to demo data only if database is completely unavailable
            const demoQuiz = demoQuizData[character]?.[questionNumber] || demoQuizData[character]?.[3];
            if (demoQuiz) {
              console.warn('⚠️  EMERGENCY FALLBACK: Using demo data!', demoQuiz);
              setQuizQuestion(demoQuiz);
            } else {
              console.error('❌ No quiz data available anywhere!');
              setShowQuiz(false);
            }
          }
        }
      } catch (error) {
        console.error('❌ Error fetching quiz from quiz_questions table:', error);
        
        // Emergency fallback to demo data for network issues
        const demoQuiz = demoQuizData[character]?.[questionNumber] || demoQuizData[character]?.[3];
        if (demoQuiz) {
          console.warn('⚠️  NETWORK ERROR FALLBACK: Using demo data!', demoQuiz);
          setQuizQuestion(demoQuiz);
        } else {
          console.error('❌ No quiz data available anywhere!');
          setShowQuiz(false);
        }
      }
    };

    fetchQuizQuestion();
  }, [showQuiz, character, currentQuestionIndex]);





  const initializeConversation = async () => {
    // Additional guard against duplicate initialization
    if (initializationRef.current) {
      console.log('⚠️ initializeConversation already called, skipping');
      return;
    }
    
    if (!user || conversationStarted) {
      console.log('⚠️ User not ready or conversation already started');
      return;
    }
    
    initializationRef.current = true;
    setSessionLoading(true);
    
    try {
      console.log('🚀 Starting conversation initialization...');
      
      // Step 1: Fetch session data from MongoDB (hardcoded)
      console.log('📊 Fetching session data...');
      const sessionResult = await fetchSessionByUser(user.id, character);
      
      if (sessionResult.success) {
        console.log('✅ Session data loaded successfully');
        setSessionData(sessionResult.data);
        setSessionError(null);
      } else {
        console.error('❌ Failed to load session data:', sessionResult.error);
        setSessionError(sessionResult.error);
        // Continue with fallback behavior
      }
      
      // Step 2: Start conversation with Convex
      const newConversation = await startConversation({
        clerkUserId: user.id,
        character: character,
        occasion: 'Social Events Practice' // Updated to match MongoDB content
      });
      setConversation(newConversation);
      setConversationStarted(true);
      setQuestionStartTime(Date.now());
      
      // Step 3: Speak the first question with additional guard
      if (!hasSpokenGreeting && sessionResult.success) {
        console.log('🎤 Speaking initial greeting from MongoDB data');
        setHasSpokenGreeting(true);
        setHasSpokenCurrentQuestion(true);
        
        // Use first question from MongoDB data
        const firstQuestionText = getFormattedQuestionText(sessionResult.data, 0);
        
        // Add first question to conversation history
        setConversationHistory([{
          type: 'ai',
          text: firstQuestionText,
          questionIndex: 0,
          timestamp: Date.now()
        }]);
        
        await speakText(firstQuestionText);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setSessionError(error.message);
      initializationRef.current = false; // Reset on error
    } finally {
      setSessionLoading(false);
    }
  };

  // Enhanced speakText function with Strict Mode protection
  const speakText = async (text) => {
    // Guard against duplicate calls
    if (isAISpeaking) {
      console.log('❌ Already speaking, ignoring duplicate call for:', text.substring(0, 50));
      return;
    }
    
    // Check if we're trying to speak the same text again
    if (currentSpeechRef.current === text) {
      console.log('❌ Same text already being processed, ignoring:', text.substring(0, 50));
      return;
    }
    
    currentSpeechRef.current = text;
    setIsAISpeaking(true);
    
    try {
      console.log('🎤 Generating speech with ElevenLabs:', text);
      console.log('📝 Text length:', text.length, 'characters');
      
      // Generate speech using ElevenLabs
      const audioUrl = await generateSpeech(text, character);
      
      // Create audio element
      const audio = new Audio(audioUrl);
      
      // Set up event handlers
      audio.onloadstart = () => {
        console.log('Started loading audio:', text);
      };
      
      audio.oncanplay = () => {
        console.log('Audio ready to play:', text);
      };
      
      audio.onplay = () => {
        console.log('Started speaking with ElevenLabs:', text);
        
        // Create message for avatar animation
        const messageWithAnimation = {
          text: text,
          animation: 'Talking_0',
          facialExpression: 'default',
          audio: audioUrl.split(',')[1] || null // Extract base64 part if data URL
        };
        
        // Send message to avatar system
        try {
          sendMessage(messageWithAnimation);
        } catch (chatError) {
          console.warn('Failed to send message to avatar:', chatError);
        }
      };
      
      audio.onended = () => {
        console.log('✅ Finished speaking with ElevenLabs:', text.substring(0, 50) + '...');
        setIsAISpeaking(false);
        currentSpeechRef.current = null; // Clear reference
        
        // Clean up audio URL
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (event) => {
        console.error('❌ Audio playback error:', event);
        setIsAISpeaking(false);
        currentSpeechRef.current = null; // Clear reference
        URL.revokeObjectURL(audioUrl);
      };
      
      // Start playing
      await audio.play();
      
    } catch (error) {
      console.error('Failed to generate speech with ElevenLabs:', error);
      
      // Fallback to browser speech synthesis
      console.log('Falling back to browser speech synthesis');
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        // Send simple message to trigger talking animation
        const messageWithAnimation = {
          text: text,
          animation: 'Talking_0',
          facialExpression: 'default'
        };
        
        try {
          sendMessage(messageWithAnimation);
        } catch (chatError) {
          console.warn('Failed to send message to avatar:', chatError);
        }
      };
      
      utterance.onend = () => {
        console.log('Browser speech ended');
        setIsAISpeaking(false);
        currentSpeechRef.current = null; // Clear reference
      };
      
      utterance.onerror = () => {
        console.log('Browser speech error');
        setIsAISpeaking(false);
        currentSpeechRef.current = null; // Clear reference
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleResponseSubmit = async () => {
    // Check if we have audio recording
    if (!audioBlob || !conversation || isSubmitting) return;
    
    setIsSubmitting(true);
    const responseTime = (Date.now() - questionStartTime) / 1000; // in seconds
    
    try {
      // Save audio to localStorage
      saveAudioToLocalStorage(audioBlob, currentQuestionIndex);
      
      // Use MongoDB API instead of Convex
      const responseData = {
        conversationId: conversation._id,
        questionId: currentQuestionIndex + 1,
        response: `[Audio Response - ${formatTime(recordingTime)}]`,
        responseTime,
        inputType: 'audio',
        audioDuration: recordingTime,
        audioKey: `input_${currentQuestionIndex + 1}` // Reference to localStorage key
      };
      
      // Save response data to localStorage as well for backup
      const responseKey = `response_${currentQuestionIndex + 1}`;
      localStorage.setItem(responseKey, JSON.stringify(responseData));
      
      // Add user response to conversation history
      setConversationHistory(prev => [...prev, {
        type: 'user',
        text: `Voice Response (${formatTime(recordingTime)})`,
        questionIndex: currentQuestionIndex,
        timestamp: Date.now(),
        audioURL: audioURL,
        duration: recordingTime
      }]);

      // For now, just log the response data (MongoDB API will be added when server restarts)
      console.log('✅ Response saved to localStorage:', responseData);
      console.log('📝 Stored as:', responseKey);

      // Check if we should show a quiz (every 3 questions: 3, 6, 9, etc.) to match MongoDB database schema
      const questionNumber = currentQuestionIndex + 1;
      const shouldShowQuiz = questionNumber % 3 === 0 && questionNumber >= 3;
      
      console.log('🎯 QUIZ TRIGGER DEBUG:', {
        currentQuestionIndex,
        questionNumber,
        'questionNumber % 3': questionNumber % 3,
        'questionNumber >= 3': questionNumber >= 3,
        shouldShowQuiz,
        character,
        'Will show quiz?': shouldShowQuiz ? 'YES' : 'NO'
      });
      
      if (shouldShowQuiz) {
        console.log('🎮 TRIGGERING QUIZ after question', questionNumber);
        console.log('🎮 Setting showQuiz to true...');
        setShowQuiz(true);
      } else {
        console.log('➡️ No quiz needed, proceeding to next question');
        proceedToNextQuestion();
      }
      
      // Clear audio recording
      clearRecording();
    } catch (error) {
      console.error('Failed to submit response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const proceedToNextQuestion = () => {
    const totalQuestions = sessionData?.history?.length || currentQuestions.length;
    
    if (currentQuestionIndex < totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestionStartTime(Date.now());
      setHasSpokenCurrentQuestion(false);
      
      // Speak the next question (after small delay to ensure previous speech is done)
      setTimeout(() => {
        let nextQuestionText;
        
        if (sessionData?.history) {
          // Use MongoDB data with feedback integration
          nextQuestionText = getFormattedQuestionText(sessionData, nextIndex);
          console.log('🎤 Speaking next question from MongoDB with feedback:', nextQuestionText.substring(0, 100) + '...');
        } else {
          // Fallback to original questions
          nextQuestionText = currentQuestions[nextIndex].text;
          console.log('🎤 Speaking fallback question:', nextQuestionText);
        }
        
        // Add next question to conversation history
        setConversationHistory(prev => [...prev, {
          type: 'ai',
          text: nextQuestionText,
          questionIndex: nextIndex,
          timestamp: Date.now()
        }]);
        
        speakText(nextQuestionText);
        setHasSpokenCurrentQuestion(true);
      }, 500); // Small delay to ensure clean transition
    } else {
      // Handle conversation completion with final feedback
      handleConversationComplete();
    }
  };

  const handleQuizComplete = (isCorrect) => {
    console.log('🎯 Quiz completed with result:', isCorrect);
    setShowQuiz(false);
    
    // Step 1: Trigger avatar animation first (this might have its own sound)
    triggerQuizResult(isCorrect);
    
    // Step 2: Short delay before speaking response - keep speech delay minimal
    setTimeout(() => {
      const responseText = isCorrect 
        ? "Great job! That's correct. Let's continue with the next question."
        : "Don't worry, that's okay. Let's move on to the next question.";
      
      console.log('🔊 Speaking quiz response after short delay:', responseText);
      speakText(responseText);
    }, 800); // Short 0.8 second delay for speech
    
    // Step 3: Long wait after speech before proceeding - this is where we add +3 seconds
    setTimeout(() => {
      console.log('➡️ Proceeding to next question after extended pause');
      proceedToNextQuestion();
    }, 7000); // 7 seconds total (speech at 0.8s + 6.2s wait = plenty of time for speech to finish + 3 extra seconds)
  };

  const handleConversationComplete = async () => {
    if (!conversation) return;
    
    try {
      // Speak final completion message with feedback from MongoDB
      if (sessionData) {
        const finalMessage = getFinalCompletionMessage(sessionData);
        console.log('🎤 Speaking final completion message with feedback:', finalMessage.substring(0, 100) + '...');
        await speakText(finalMessage);
        
        // Wait for speech to complete before showing completion
        setTimeout(async () => {
          const completedConversation = await completeConversation({
            conversationId: conversation._id
          });
          onComplete(completedConversation);
        }, 5000); // Give time for final message to play
      } else {
        // Fallback completion without MongoDB data
        const completedConversation = await completeConversation({
          conversationId: conversation._id
        });
        onComplete(completedConversation);
      }
    } catch (error) {
      console.error('Failed to complete conversation:', error);
    }
  };

  // Enhanced stop speaking function
  const stopSpeaking = () => {
    console.log('🛑 Stopping all speech');
    
    // Stop browser speech synthesis
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    // Stop any playing audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    setIsAISpeaking(false);
    currentSpeechRef.current = null; // Clear reference
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus' // Better compression
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        setAudioBlob(audioBlob);
        
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Stop all tracks to free up microphone
        stream.getTracks().forEach(track => track.stop());
        
        console.log('🎤 Recording completed, size:', audioBlob.size, 'bytes');
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      console.log('🎤 Started recording...');
      
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      console.log('🛑 Stopped recording');
    }
  };

  const clearRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioBlob(null);
    setAudioURL(null);
    setRecordingTime(0);
    console.log('🗑️ Cleared recording');
  };

  const saveAudioToLocalStorage = (audioBlob, questionIndex) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result;
      const audioKey = `input_${questionIndex + 1}`;
      const audioData = {
        questionIndex: questionIndex + 1,
        audioData: base64Audio,
        timestamp: new Date().toISOString(),
        character: character,
        duration: recordingTime
      };
      
      localStorage.setItem(audioKey, JSON.stringify(audioData));
      console.log(`💾 Saved audio for question ${questionIndex + 1} to localStorage`);
      
      // Also save to a master list
      const savedAudios = JSON.parse(localStorage.getItem('conversation_audios') || '[]');
      const existingIndex = savedAudios.findIndex(audio => audio.questionIndex === questionIndex + 1);
      
      if (existingIndex >= 0) {
        savedAudios[existingIndex] = audioData;
      } else {
        savedAudios.push(audioData);
      }
      
      localStorage.setItem('conversation_audios', JSON.stringify(savedAudios));
    };
    reader.readAsDataURL(audioBlob);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => v.name));
    };
    
    // Load voices immediately if available
    loadVoices();
    
    // Also load when voices change (some browsers load them asynchronously)
    speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Enhanced auto-scroll to latest message with smooth animation
  useEffect(() => {
    if (chatContainerRef.current && conversationHistory.length > 0 && !isUserScrolling) {
      const scrollContainer = chatContainerRef.current;
      
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  }, [conversationHistory, isUserScrolling]);

  // Handle scroll events to detect user scrolling and show scroll-to-bottom button
  useEffect(() => {
    const scrollContainer = chatContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold
      
      setShowScrollToBottom(!isNearBottom && conversationHistory.length > 3);
      
      // Detect if user is manually scrolling
      if (!isNearBottom) {
        setIsUserScrolling(true);
      } else {
        setIsUserScrolling(false);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [conversationHistory.length]);

  // Function to scroll to bottom manually
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setIsUserScrolling(false);
      setShowScrollToBottom(false);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Component unmounting, cleaning up speech and recording');
      stopSpeaking();
      
      // Cleanup recording if in progress
      if (isRecording) {
        stopRecording();
      }
      
      // Cleanup audio URL
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      
      // Clear recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording, audioURL]);

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const currentCharacter = characterData[character];
  const totalQuestions = sessionData?.history?.length || currentQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  if (!conversationStarted || !currentCharacter || sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/logo.png" 
            alt="EmotiSphere Logo" 
            className="w-24 h-24 object-contain mx-auto mb-6"
          />
          <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">
            {sessionLoading ? 'Loading conversation data...' : 'Initializing conversation...'}
          </p>
          {sessionError && (
            <p className="text-red-500 text-sm mt-2">
              Warning: {sessionError} (Using fallback questions)
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative overflow-hidden">
        
        {/* 3D Avatar Section */}
        <div className="h-1/2 relative">
          <Loader />
          <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }} className="bg-transparent">
            <Experience />
          </Canvas>

          {/* Elegant Question Counter */}
          <div className="absolute top-4 left-4 z-10">
            <motion.div 
              className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 shadow-xl border border-white/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentCharacter.color} animate-pulse`}></div>
                <motion.span 
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gray-800 tracking-wider"
                >
                  {currentQuestionIndex + 1}/{totalQuestions}
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* Central Character Info */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <motion.div 
              className="bg-white/90 backdrop-blur-md rounded-3xl px-8 py-4 shadow-xl border border-white/50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className={`w-16 h-16 rounded-full overflow-hidden border-3 shadow-lg ${
                    isAISpeaking ? 'border-green-400 shadow-green-400/30' : 'border-white shadow-gray-200'
                  }`}
                  animate={{ 
                    boxShadow: isAISpeaking 
                      ? ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 10px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0.4)"]
                      : "0 4px 20px rgba(0, 0, 0, 0.1)"
                  }}
                  transition={{ duration: 1.5, repeat: isAISpeaking ? Infinity : 0 }}
                >
                  <img 
                    src={currentCharacter.image} 
                    alt={currentCharacter.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="text-center">
                  <motion.h2 
                    className="text-xl font-bold text-gray-900 mb-1"
                    animate={{ 
                      color: isAISpeaking ? "#059669" : "#111827"
                    }}
                  >
                    {currentCharacter.name}
                  </motion.h2>
                  <motion.p 
                    className="text-sm font-medium"
                    animate={{ 
                      color: isAISpeaking ? "#059669" : "#6B7280"
                    }}
                  >
                    {isAISpeaking ? (
                      <span className="flex items-center justify-center space-x-2">
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          🎤
                        </motion.span>
                        <span>Speaking...</span>
                      </span>
                    ) : (
                      'Your AI Coach'
                    )}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating Progress Indicator */}
          <div className="absolute top-4 right-4 z-10 space-y-3">
            <motion.div 
              className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-white/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {[...Array(totalQuestions)].map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index <= currentQuestionIndex 
                          ? `bg-gradient-to-r ${currentCharacter.color}` 
                          : 'bg-gray-300'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: index <= currentQuestionIndex ? [1, 1.3, 1] : 1,
                        opacity: index <= currentQuestionIndex ? 1 : 0.5
                      }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.1,
                        repeat: index === currentQuestionIndex ? Infinity : 0,
                        repeatDelay: 2
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-600">Progress</span>
              </div>
            </motion.div>

            {/* Logout Button */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleLogout}
                  className="bg-white/90 backdrop-blur-md text-gray-700 p-3 rounded-2xl shadow-xl border border-white/50 hover:bg-white hover:text-rose-600 transition-all duration-200 block w-full"
                  title="Sign Out"
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </motion.div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="absolute bottom-24 right-4 z-10 space-y-3">
            <button
              onClick={() => setCameraZoomed(!cameraZoomed)}
              className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 block"
              title={cameraZoomed ? "Zoom Out" : "Zoom In"}
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </button>
            
            {/* Stop Speaking Button */}
            {isAISpeaking && (
              <button
                onClick={stopSpeaking}
                className="bg-red-500/80 backdrop-blur-sm hover:bg-red-500 text-white p-3 rounded-full shadow-lg transition-all duration-200 block animate-pulse"
                title="Stop Speaking"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Modern Chat Interface */}
        <div className="h-1/2 bg-gradient-to-b from-gray-50 to-white relative flex flex-col">
          
          {/* Conversation Context Header */}
          <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentCharacter.color}`}></div>
                  <span className="text-sm font-semibold text-gray-800">
                    Practice Session: Social Events & Networking
                  </span>
                </div>
                {sessionData?.takeaways && currentQuestionIndex > 0 && (
                  <div className="text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                    💡 {sessionData.takeaways[currentQuestionIndex - 1]?.quick_tip?.substring(0, 50)}...
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>{conversationHistory.length} messages</span>
                <span>•</span>
                <span>Question {currentQuestionIndex + 1}/{totalQuestions}</span>
              </div>
            </div>
          </div>
          
          {/* Chat Messages Area - Full Conversation History */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-4 scroll-smooth"
          >
            {/* Render all conversation history */}
            {conversationHistory.map((message, index) => (
              <motion.div
                key={`${message.type}-${message.questionIndex}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}
              >
                {message.type === 'ai' && (
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
                      <img 
                        src={currentCharacter.image} 
                        alt={currentCharacter.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isAISpeaking && index === conversationHistory.length - 1 && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    )}
                  </div>
                )}
                
                <div className={`flex-1 max-w-[85%] ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                  {message.type === 'ai' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{currentCharacter.name}</span>
                      <span className="text-xs text-gray-500">AI Coach</span>
                      <span className="text-xs text-gray-400">
                        Question {message.questionIndex + 1}
                      </span>
                      {isAISpeaking && index === conversationHistory.length - 1 && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`${
                    message.type === 'ai' 
                      ? `bg-gradient-to-r ${currentCharacter.color} text-white rounded-2xl rounded-tl-md` 
                      : 'bg-blue-500 text-white rounded-2xl rounded-tr-md'
                  } p-4 shadow-lg`}>
                    {message.type === 'ai' ? (
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.896-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.829a1 1 0 011.414 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.758 2.828 1 1 0 01-1.414-1.414A3.987 3.987 0 0013 12a3.987 3.987 0 00-.172-1.414 1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Voice Message</p>
                            <p className="text-xs opacity-75">{message.text}</p>
                          </div>
                        </div>
                        {message.audioURL && (
                          <audio controls className="w-32">
                            <source src={message.audioURL} type="audio/webm" />
                          </audio>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    You
                  </div>
                )}
              </motion.div>
            ))}

            {/* Current audio recording preview (if recording) */}
            {audioBlob && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3 justify-end"
              >
                <div className="flex-1 max-w-[85%] flex justify-end">
                  <div className="bg-green-100 border-2 border-green-300 text-green-800 rounded-2xl rounded-tr-md p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Ready to Send</p>
                          <p className="text-xs opacity-75">{formatTime(recordingTime)}</p>
                        </div>
                      </div>
                      <audio controls className="w-32">
                        <source src={audioURL} type="audio/webm" />
                      </audio>
                    </div>
                  </div>
                </div>
                
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  You
                </div>
              </motion.div>
            )}
          </div>

          {/* Scroll to Bottom Button */}
          {showScrollToBottom && (
            <div className="absolute bottom-20 right-4 z-10">
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToBottom}
                className={`w-12 h-12 rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-200 flex items-center justify-center bg-gradient-to-r ${currentCharacter.color} text-white hover:shadow-xl`}
                title="Scroll to bottom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                {conversationHistory.length > 5 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{conversationHistory.length - 5}</span>
                  </div>
                )}
              </motion.button>
            </div>
          )}

          {/* Fixed Bottom Input Area */}
          <div className="border-t border-gray-200 bg-white/95 backdrop-blur-sm px-4 py-3">
            {!audioBlob ? (
              // Recording Interface
              <div className="flex items-center space-x-3">
                {!isRecording ? (
                  // Start Recording State
                  <>
                    <div className="flex-1 bg-gray-100 rounded-full px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-500 flex-1">
                          {isAISpeaking ? "AI is speaking, please wait..." : "Tap to record your voice response"}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={startRecording}
                      disabled={isAISpeaking || isSubmitting}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                        !isAISpeaking && !isSubmitting
                          ? `bg-gradient-to-r ${currentCharacter.color} text-white hover:shadow-xl hover:scale-105`
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 715 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
                ) : (
                  // Recording Active State
                  <>
                    <div className="flex-1 bg-red-50 border-2 border-red-200 rounded-full px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <span className="text-red-600 font-medium flex-1">Recording...</span>
                        <span className="text-red-600 font-mono text-lg">{formatTime(recordingTime)}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={stopRecording}
                      className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ) : (
              // Audio Review & Submit State
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-green-50 border-2 border-green-200 rounded-full px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-green-700 font-medium flex-1">Ready to send • {formatTime(recordingTime)}</span>
                  </div>
                </div>
                
                <button
                  onClick={clearRecording}
                  className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
                  title="Re-record"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  onClick={handleResponseSubmit}
                  disabled={isSubmitting}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                    !isSubmitting
                      ? `bg-gradient-to-r ${currentCharacter.color} text-white hover:shadow-xl hover:scale-105`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <PaperAirplaneIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && quizQuestion && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          style={{ zIndex: 9999 }}
        >
          <QuizModal
            isOpen={showQuiz}
            quizData={quizQuestion}
            character={character}
            conversationId={conversation?._id}
            quizNumber={Math.ceil((currentQuestionIndex + 1) / 2)}
            onComplete={handleQuizComplete}
            onClose={() => setShowQuiz(false)}
          />
        </div>
      )}
    </>
  );
};

export default ConversationInterface;