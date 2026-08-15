import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const QuizModal = ({ isOpen, quizData, character, conversationId, quizNumber, onComplete, onClose }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitQuizResult = useMutation(api.conversations.submitQuizResult);

  // Character data for QuizModal - images, names, colors
  const characterData = {
    'ben-10': {
      name: 'Ben 10',
      image: '/Ben10.jpeg',
      color: 'from-green-500 to-emerald-500'
    },
    'black-panther': {
      name: 'Black Panther',
      image: '/BlackPanther.jpeg',
      color: 'from-purple-500 to-indigo-500'
    },
    'wanda-vision': {
      name: 'Wanda Vision',
      image: '/WandaVision.jpeg',
      color: 'from-red-500 to-pink-500'
    },
    'dora': {
      name: 'Dora',
      image: '/dora.jpeg',
      color: 'from-orange-500 to-yellow-500'
    }
  };

  // Get current character data
  const currentCharacter = characterData[character] || characterData['ben-10']; // fallback to Ben 10

  // Guard clause for invalid quiz data
  if (!quizData) {
    console.warn('QuizModal: No quiz data provided, waiting...', { 
      isOpen, 
      character, 
      quizNumber, 
      quizData,
      characterImage: character?.image
    });
    
    // Return loading state instead of null
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p>Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (isOpen) {
      setSelectedAnswer(null);
      setShowResult(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (selectedAnswer === null || !quizData || !conversationId) return;
    
    setIsSubmitting(true);
    
    try {
      await submitQuizResult({
        conversationId,
        quizNumber,
        dialogue: quizData.dialogue,
        question: quizData.question,
        options: quizData.options,
        userAnswer: selectedAnswer,
        correctAnswer: quizData.correctAnswer
      });
      
      setShowResult(true);
      
      // Auto close after showing result - increased time to allow for sound intervals
      setTimeout(() => {
        onComplete(selectedAnswer === quizData.correctAnswer);
      }, 2000); // Reduced to 2 seconds since ConversationInterface now handles timing
      
    } catch (error) {
      console.error('Failed to submit quiz result:', error);
      setIsSubmitting(false);
    }
  };

  const isCorrect = selectedAnswer === quizData?.correctAnswer;

  if (!isOpen || !quizData) return null;

  // Debug: Log character data
  console.log('🖼️ QuizModal character data:', { 
    characterKey: character,
    characterName: currentCharacter.name, 
    image: currentCharacter.image,
    hasImage: !!currentCharacter.image,
    color: currentCharacter.color
  });

  // Helper function to get character-specific styles
  const getCharacterStyles = (characterName) => {
    switch(characterName) {
      case 'wanda-vision':
        return {
          color: 'red',
          border: 'border-red-500',
          bgGradient: 'bg-gradient-to-r from-red-50 to-pink-50',
          hoverBorder: 'hover:border-red-500',
          hoverBg: 'hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50',
          hoverLetterBg: 'group-hover:bg-red-500',
          hoverLetterBorder: 'group-hover:border-red-500',
          selectedLetterBg: 'bg-red-500',
          selectedLetterBorder: 'border-red-500',
          submitBg: 'bg-gradient-to-r from-red-500 to-pink-500',
          submitHover: 'hover:from-red-600 hover:to-pink-600',
          submitShadow: 'shadow-red-300/50',
          submitHoverShadow: 'hover:shadow-red-400/60'
        };
      case 'black-panther':
        return {
          color: 'purple',
          border: 'border-purple-500',
          bgGradient: 'bg-gradient-to-r from-purple-50 to-violet-50',
          hoverBorder: 'hover:border-purple-500',
          hoverBg: 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50',
          hoverLetterBg: 'group-hover:bg-purple-500',
          hoverLetterBorder: 'group-hover:border-purple-500',
          selectedLetterBg: 'bg-purple-500',
          selectedLetterBorder: 'border-purple-500',
          submitBg: 'bg-gradient-to-r from-purple-500 to-indigo-500',
          submitHover: 'hover:from-purple-600 hover:to-indigo-600',
          submitShadow: 'shadow-purple-300/50',
          submitHoverShadow: 'hover:shadow-purple-400/60'
        };
      default: // ben-10, dora
        return {
          color: 'green',
          border: 'border-green-500',
          bgGradient: 'bg-gradient-to-r from-green-50 to-emerald-50',
          hoverBorder: 'hover:border-green-500',
          hoverBg: 'hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50',
          hoverLetterBg: 'group-hover:bg-green-500',
          hoverLetterBorder: 'group-hover:border-green-500',
          selectedLetterBg: 'bg-green-500',
          selectedLetterBorder: 'border-green-500',
          submitBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          submitHover: 'hover:from-green-600 hover:to-emerald-600',
          submitShadow: 'shadow-green-300/50',
          submitHoverShadow: 'hover:shadow-green-400/60'
        };
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        {/* Character Background - Full Screen Coverage */}
        {currentCharacter?.image && (
          <div 
            className="fixed inset-0 w-full h-full"
            style={{ 
              backgroundImage: `url(${currentCharacter.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(1px) brightness(0.4)'
            }}
          />
        )}
        
        {/* Character-themed Gradient Overlay for better text readability */}
        <div className={`fixed inset-0 bg-gradient-to-br ${currentCharacter.color} opacity-60`} />
        <div className="fixed inset-0 bg-black/40" />
        
        {/* Floating Particles Effect - Character themed */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 50 }}
          transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] relative z-10 border border-white/30 ring-1 ring-black/10 overflow-y-auto"
        >
          {/* Modern Header */}
          <div className={`bg-gradient-to-r ${currentCharacter.color} p-8 relative overflow-hidden`}>
            {/* Animated Geometric Background */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full -translate-x-20 -translate-y-20 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/15 rounded-full translate-x-16 translate-y-16 animate-bounce"></div>
              <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/10 rounded-full -translate-x-10 -translate-y-10 animate-ping"></div>
              <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-white/25 rotate-45 animate-spin"></div>
              <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-white/20 rotate-12 animate-pulse"></div>
            </div>
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/90 hover:text-white hover:bg-white/20 p-3 rounded-xl transition-all duration-200 z-10 backdrop-blur-sm"
            >
              <XMarkIcon className="w-7 h-7" />
            </button>
            
            <div className="text-center text-white relative z-10">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl mx-auto mb-6 ring-4 ring-white/30 backdrop-blur-sm">
                {currentCharacter?.image ? (
                  <img 
                    src={currentCharacter.image} 
                    alt={currentCharacter.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Failed to load character image:', currentCharacter.image);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/30 flex items-center justify-center">
                    <span className="text-5xl">👤</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                <svg className="w-8 h-8 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l1.09 3.63L16 4.5l-2.91 1.09L16 8.5l-3.63-1.09L10.5 12l-1.09-3.63L6 8.5l2.91-1.09L6 4.5l3.63 1.09z"/>
                </svg>
                <h2 className="text-3xl font-bold drop-shadow-lg tracking-wide">Knowledge Check</h2>
                <svg className="w-6 h-6 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l1.09 3.63L16 4.5l-2.91 1.09L16 8.5l-3.63-1.09L10.5 12l-1.09-3.63L6 8.5l2.91-1.09L6 4.5l3.63 1.09z"/>
                </svg>
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center justify-center gap-3 text-white/90">
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                  <span className="text-sm font-semibold">Question #{quizNumber}</span>
                </div>
                <span className="text-white/70">•</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span className="text-sm font-medium">{currentCharacter.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {!showResult ? (
              <div className="space-y-8">
                {/* Character Dialogue Section */}
                <div className="bg-gradient-to-br from-slate-50/80 to-gray-50/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 shadow-xl">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-2xl ring-2 ring-gray-200/50">
                      {currentCharacter?.image ? (
                        <img 
                          src={currentCharacter.image} 
                          alt={currentCharacter.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Failed to load character image in dialogue:', currentCharacter.image);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-3xl">👤</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                        </svg>
                        <span className="text-lg font-bold text-gray-800">{currentCharacter.name} says:</span>
                      </div>
                      <blockquote className="text-xl font-medium text-gray-900 leading-relaxed italic">
                        "{quizData.dialogue}"
                      </blockquote>
                    </div>
                  </div>
                </div>

                {/* Question Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${currentCharacter.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.07 12.85c.77-1.39 2.25-2.21 3.11-3.44.91-1.29.4-3.7-2.18-3.7-1.69 0-2.52 1.28-2.87 2.34L6.54 6.96C7.25 4.83 9.18 3 11.99 3c2.35 0 3.96 1.07 4.78 2.41.7 1.15.6 3.05-.85 4.49-.77.77-1.98 1.28-2.8 2.34-.46.61-.51 1.26-.51 2.02h-2.55c-.06-.76-.04-1.61.51-2.41zM12 16c.83 0 1.5.67 1.5 1.5S12.83 19 12 19s-1.5-.67-1.5-1.5S11.17 16 12 16z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 flex-1">
                      {quizData.question}
                    </h3>
                  </div>
                  
                  {/* Answer Options Grid */}
                  <div className="grid gap-4">
                    {quizData.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedAnswer(index)}
                        className={`group relative w-full text-left p-6 rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                          selectedAnswer === index
                            ? getCharacterStyles(currentCharacter.name).border + ' ' + getCharacterStyles(currentCharacter.name).bgGradient + ' shadow-' + getCharacterStyles(currentCharacter.name).color + '-200/50 ring-2 ring-' + getCharacterStyles(currentCharacter.name).color + '-200'
                            : `border-gray-300 ${getCharacterStyles(currentCharacter.name).hoverBorder} ${getCharacterStyles(currentCharacter.name).hoverBg} bg-white/90 backdrop-blur-sm`
                        }`}
                      >
                        <div className="flex items-center space-x-5">
                          <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-lg shadow-md transition-all duration-300 ${
                            selectedAnswer === index
                              ? getCharacterStyles(currentCharacter.name).selectedLetterBorder + ' ' + getCharacterStyles(currentCharacter.name).selectedLetterBg + ' text-white shadow-' + getCharacterStyles(currentCharacter.name).color + '-300/50'
                              : `border-gray-400 text-gray-700 bg-gray-50 ${getCharacterStyles(currentCharacter.name).hoverLetterBorder} group-hover:text-white ${getCharacterStyles(currentCharacter.name).hoverLetterBg}`
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-gray-800 flex-1 leading-relaxed font-semibold text-lg">{option}</span>
                          {selectedAnswer === index && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", duration: 0.3 }}
                            >
                              <svg className={`w-7 h-7 text-${getCharacterStyles(currentCharacter.name).color}-600`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={selectedAnswer !== null && !isSubmitting ? { scale: 1.03, y: -3 } : {}}
                  whileTap={selectedAnswer !== null && !isSubmitting ? { scale: 0.97 } : {}}
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null || isSubmitting}
                  animate={selectedAnswer !== null && !isSubmitting ? { 
                    boxShadow: [
                      `0 10px 25px ${getCharacterStyles(currentCharacter.name).color === 'red' ? 'rgba(239, 68, 68, 0.3)' : 
                                   getCharacterStyles(currentCharacter.name).color === 'purple' ? 'rgba(147, 51, 234, 0.3)' : 
                                   'rgba(34, 197, 94, 0.3)'}`,
                      `0 15px 35px ${getCharacterStyles(currentCharacter.name).color === 'red' ? 'rgba(239, 68, 68, 0.5)' : 
                                   getCharacterStyles(currentCharacter.name).color === 'purple' ? 'rgba(147, 51, 234, 0.5)' : 
                                   'rgba(34, 197, 94, 0.5)'}`,
                      `0 10px 25px ${getCharacterStyles(currentCharacter.name).color === 'red' ? 'rgba(239, 68, 68, 0.3)' : 
                                   getCharacterStyles(currentCharacter.name).color === 'purple' ? 'rgba(147, 51, 234, 0.3)' : 
                                   'rgba(34, 197, 94, 0.3)'}`
                    ]
                  } : {}}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 0.2 },
                    y: { duration: 0.2 }
                  }}
                  className={`w-full py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-xl transform ${
                    selectedAnswer !== null && !isSubmitting
                      ? `${getCharacterStyles(currentCharacter.name).submitBg} ${getCharacterStyles(currentCharacter.name).submitHover} text-white hover:shadow-2xl ${getCharacterStyles(currentCharacter.name).submitShadow} ${getCharacterStyles(currentCharacter.name).submitHoverShadow} hover:scale-[1.02] hover:-translate-y-1`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-gray-200/50 scale-100'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing Answer...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <span>Submit Answer</span>
                    </div>
                  )}
                </motion.button>
              </div>
            ) : (
              /* Modern Result Display */
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                className="text-center space-y-8"
              >
                {/* Result Icon with Animation */}
                <div className="relative">
                  <div className={`w-32 h-32 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl ${
                    isCorrect 
                      ? 'bg-gradient-to-br from-emerald-400 to-green-500' 
                      : 'bg-gradient-to-br from-orange-400 to-red-500'
                  }`}>
                    {isCorrect ? (
                      <CheckCircleIcon className="w-20 h-20 text-white drop-shadow-lg" />
                    ) : (
                      <XCircleIcon className="w-20 h-20 text-white drop-shadow-lg" />
                    )}
                  </div>
                  
                  {/* Animated Ring */}
                  <div className={`absolute inset-0 w-32 h-32 rounded-2xl mx-auto border-4 ${
                    isCorrect ? 'border-emerald-300' : 'border-orange-300'
                  } animate-ping opacity-75`}></div>
                </div>

                {/* Result Title */}
                <div>
                  <h3 className={`text-4xl font-bold mb-2 ${
                    isCorrect ? 'text-emerald-600' : 'text-orange-600'
                  }`}>
                    {isCorrect ? '🎉 Excellent!' : '🤔 Learning Moment'}
                  </h3>
                  <p className="text-xl text-gray-600 font-medium">
                    {isCorrect ? 'You got it right!' : 'Let\'s learn from this'}
                  </p>
                </div>

                {/* Explanation Card */}
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-200/50 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Why this matters:</h4>
                  </div>
                  <p className="text-gray-800 leading-relaxed text-lg mb-4">{quizData.explanation}</p>
                  
                  {!isCorrect && (
                    <div className="mt-6 p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 shadow-md">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span className="text-lg font-bold text-emerald-800">Correct Answer:</span>
                      </div>
                      <p className="text-emerald-900 font-medium text-lg">
                        {quizData.options[quizData.correctAnswer]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-3 text-gray-500 bg-gray-50/80 rounded-xl py-4 px-6 backdrop-blur-sm border border-gray-200/50">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <p className="font-medium">Continuing conversation...</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuizModal;