import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useUser, useClerk } from '@clerk/clerk-react';

const CharacterSelection = ({ onComplete }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  // MongoDB API base URL
  const API_BASE_URL = 'http://localhost:3001/api';
  
  // Fallback to localStorage if API fails
  const saveToLocalStorage = (character) => {
    localStorage.setItem('selectedCharacter', JSON.stringify({
      character: character,
      username: username,
      email: email,
      timestamp: new Date().toISOString()
    }));
  };

  const characterOptions = [
    {
      id: 'ben-10',
      name: 'Ben 10',
      image: '/Ben10.jpeg',
      description: 'Young hero with the power to transform into different aliens',
      personality: 'Adventurous • Brave • Driven ',
      color: 'from-green-500 to-emerald-500',
      quote: '"It\'s hero time!"',
      traits: ['Builds courage through challenges', 'Quick thinking & adaptability', 'Learns from every adventure']
    },
    {
      id: 'black-panther',
      name: 'Black Panther',
      image: '/BlackPanther.jpeg',
      description: 'T\'Challa, the wise and noble king of Wakanda',
      personality: 'Wise • Diplomatic • Honorable',
      color: 'from-purple-500 to-indigo-500',
      quote: '"Wakanda forever!"',
      traits: ['Diplomatic leadership style', 'Thoughtful and purposeful', 'Combines wisdom with action']
    },
    {
      id: 'wanda-vision',
      name: 'Wanda Vision',
      image: '/WandaVision.jpeg',
      description: 'Scarlet Witch with reality-altering powers and deep emotional strength',
      personality: 'Empathetic • Powerful • Resilient',
      color: 'from-red-500 to-pink-500',
      quote: '"I can handle the truth."',
      traits: ['Emotional intelligence and empathy', 'Transforms challenges into strength', 'Creates reality through willpower']
    },
    {
      id: 'dora',
      name: 'Dora',
      image: '/dora.jpeg',
      description: 'Young explorer who teaches through adventure and discovery',
      personality: 'Curious • Helpful • Educational',
      color: 'from-orange-500 to-yellow-500',
      quote: '"¡Vamos! Let\'s go!"',
      traits: ['Interactive learning approach', 'Problem-solving exploration', 'Builds confidence through practice']
    }
  ];

  const handleSubmit = async () => {
    if (!selectedCharacter || !user) return;
    
    setIsSubmitting(true);
    try {
      // Get user information from Clerk
      const username = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';
      const email = user.emailAddresses[0]?.emailAddress || '';

      console.log('💾 Saving character selection to MongoDB:', {
        user: username,
        character: selectedCharacter,
        email: email
      });

      // Try to save character selection to MongoDB API
      try {
        const response = await fetch(`${API_BASE_URL}/character-selections/save-selection`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkUserId: user.id,
            username: username,
            email: email,
            selectedCharacter: selectedCharacter,
          }),
        });

        const result = await response.json();

        if (result.success) {
          console.log('✅ Character selection saved successfully to MongoDB:', result.data);
        } else {
          console.warn('⚠️ MongoDB save failed, using localStorage fallback');
          saveToLocalStorage(selectedCharacter);
        }
      } catch (apiError) {
        console.warn('⚠️ API not available, using localStorage fallback:', apiError.message);
        saveToLocalStorage(selectedCharacter);
      }
      
      // Always complete the selection (even if API fails)
      onComplete(selectedCharacter);
      
    } catch (error) {
      console.error('❌ Error in character selection:', error);
      // Save to localStorage as fallback
      saveToLocalStorage(selectedCharacter);
      onComplete(selectedCharacter);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative"
        >
          {/* Logout Button */}
          {user && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-0 right-0 z-20"
            >
              <button
                onClick={handleLogout}
                className="bg-white/70 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-xl shadow-lg border border-white/50 hover:bg-white hover:text-rose-600 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm">Sign Out</span>
              </button>
            </motion.div>
          )}

          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-rose-300 rounded-full"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}

          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            animate={{ 
              textShadow: [
                "0 0 0px rgba(244, 63, 94, 0)",
                "0 0 20px rgba(244, 63, 94, 0.3)", 
                "0 0 0px rgba(244, 63, 94, 0)"
              ] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Choose Your{' '}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              AI Coach
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Select your favorite superhero to guide your conversation training journey. 
            Each character offers a unique coaching style and personality.
          </motion.p>

          {/* Selection Indicator */}
          {selectedCharacter && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 inline-flex items-center space-x-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              <CheckCircleIcon className="w-4 h-4" />
              <span>
                {characterOptions.find(c => c.id === selectedCharacter)?.name} Selected
              </span>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {characterOptions.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                y: -8, 
                rotateY: 5, 
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative cursor-pointer group ${
                selectedCharacter === character.id ? 'z-10' : ''
              }`}
              onClick={() => setSelectedCharacter(character.id)}
            >
              <motion.div 
                className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-3 transition-all duration-500 overflow-hidden min-h-[380px] flex flex-col ${
                  selectedCharacter === character.id 
                    ? 'border-rose-500 shadow-2xl shadow-rose-500/25' 
                    : 'border-white/60 hover:border-rose-300 hover:shadow-2xl'
                }`}
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
                }}
              >
                {/* Animated Background Glow */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${character.color} opacity-0 rounded-2xl transition-opacity duration-300 ${
                    selectedCharacter === character.id ? 'opacity-10' : 'group-hover:opacity-5'
                  }`}
                  initial={false}
                />

                {/* Selection Indicator */}
                {selectedCharacter === character.id && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="absolute -top-3 -right-3 z-10"
                  >
                    <div className="bg-rose-500 rounded-full p-1 shadow-lg">
                      <CheckCircleIcon className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                )}

                {/* Character Image */}
                <motion.div 
                  className="mb-4 flex justify-center relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-lg relative">
                    <img 
                      src={character.image} 
                      alt={character.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Animated Ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-full border-2 ${
                        selectedCharacter === character.id ? 'border-rose-400' : 'border-transparent'
                      }`}
                      animate={{ 
                        rotate: selectedCharacter === character.id ? 360 : 0 
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: selectedCharacter === character.id ? Infinity : 0,
                        ease: "linear" 
                      }}
                    />
                  </div>
                </motion.div>

                {/* Character Name & Info */}
                <div className="text-center mb-4">
                  <motion.h3 
                    className="text-lg font-bold text-gray-900 mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {character.name}
                  </motion.h3>
                  <motion.div 
                    className={`inline-block bg-gradient-to-r ${character.color} text-white px-3 py-1 rounded-full text-xs font-medium mb-2`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {character.personality}
                  </motion.div>
                  <motion.p 
                    className="text-gray-700 italic font-medium text-sm mb-2"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1.02 }}
                  >
                    {character.quote}
                  </motion.p>
                  <p className="text-gray-600 text-xs leading-relaxed">{character.description}</p>
                </div>

                {/* Full Traits */}
                <div className="space-y-1 mt-auto">
                  <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wide mb-2">Style:</h4>
                  {character.traits.map((trait, traitIndex) => (
                    <motion.div 
                      key={traitIndex} 
                      className="flex items-start space-x-2 min-h-[20px]"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 + traitIndex * 0.1 }}
                    >
                      <motion.div 
                        className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0"
                        animate={{ 
                          scale: selectedCharacter === character.id ? [1, 1.3, 1] : 1,
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: selectedCharacter === character.id ? Infinity : 0 
                        }}
                      />
                      <p className="text-xs text-gray-700 leading-tight">{trait}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Hover Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                  initial={false}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center relative"
        >
          {/* Animated Success Confetti */}
          {selectedCharacter && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-rose-400 rounded-full"
                  style={{
                    left: `${45 + Math.random() * 10}%`,
                    top: `${20 + Math.random() * 20}%`,
                  }}
                  animate={{
                    y: [-20, 40],
                    x: [0, (Math.random() - 0.5) * 60],
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}

          <motion.button
            onClick={handleSubmit}
            disabled={!selectedCharacter || isSubmitting}
            className={`relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl overflow-hidden ${
              selectedCharacter && !isSubmitting
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 hover:shadow-2xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={selectedCharacter && !isSubmitting ? { 
              scale: 1.05,
              boxShadow: "0 20px 40px -12px rgba(244, 63, 94, 0.4)"
            } : {}}
            whileTap={selectedCharacter && !isSubmitting ? { scale: 0.98 } : {}}
            animate={selectedCharacter && !isSubmitting ? {
              boxShadow: [
                "0 10px 30px -12px rgba(244, 63, 94, 0.2)",
                "0 15px 35px -12px rgba(244, 63, 94, 0.3)",
                "0 10px 30px -12px rgba(244, 63, 94, 0.2)"
              ]
            } : {}}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
              scale: { type: "spring", stiffness: 300 }
            }}
          >
            {/* Button Glow Effect */}
            {selectedCharacter && !isSubmitting && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 opacity-0"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            
            <span className="relative z-10">
              {isSubmitting ? (
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Saving...</span>
                </motion.div>
              ) : selectedCharacter ? (
                <motion.span
                  key={selectedCharacter}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  Start Training with {characterOptions.find(c => c.id === selectedCharacter)?.name}
                </motion.span>
              ) : (
                'Select a Character to Continue'
              )}
            </span>
          </motion.button>
          
          {selectedCharacter && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mt-4 text-sm"
            >
              You can change your character selection anytime in settings
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CharacterSelection;