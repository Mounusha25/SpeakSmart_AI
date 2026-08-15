import mongoose from 'mongoose';

const characterSelectionSchema = new mongoose.Schema({
  // User Information (from Clerk)
  clerkUserId: {
    type: String,
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  
  // Character Information
  selectedCharacter: {
    type: String,
    required: true,
    enum: ['ben-10', 'black-panther', 'wanda-vision', 'dora'],
    index: true
  },
  characterName: {
    type: String,
    required: true
  },
  characterDialogue: {
    type: String,
    required: true
  },
  characterPersonality: {
    type: String,
    required: true
  },
  characterQuote: {
    type: String,
    required: true
  },
  
  // Selection Tracking
  selectionCount: {
    type: Number,
    default: 1,
    min: 1
  },
  lastSelectedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'character_selections'
});

// Compound indexes for efficient queries
characterSelectionSchema.index({ clerkUserId: 1, selectedCharacter: 1 }, { unique: true });
characterSelectionSchema.index({ clerkUserId: 1, lastSelectedAt: -1 });

// Static method to get character data
characterSelectionSchema.statics.getCharacterData = function(characterId) {
  const characterData = {
    'ben-10': {
      name: 'Ben 10',
      dialogue: "It's hero time! Ready to transform your conversation skills? Let me help you become the hero of any discussion!",
      personality: 'Adventurous • Brave • Determined',
      quote: "It's hero time!"
    },
    'black-panther': {
      name: 'Black Panther',
      dialogue: "Greetings. I am T'Challa. Let us prepare you for meaningful dialogue with the wisdom of Wakanda.",
      personality: 'Wise • Diplomatic • Honorable',
      quote: "Wakanda forever!"
    },
    'wanda-vision': {
      name: 'Wanda Vision',
      dialogue: "Hello there. I understand the power of words and emotions. Let's work together to strengthen your communication abilities.",
      personality: 'Empathetic • Powerful • Resilient',
      quote: "I can handle the truth."
    },
    'dora': {
      name: 'Dora',
      dialogue: "¡Hola! I'm Dora! Let's go on an adventure to improve your conversation skills. Are you ready to explore?",
      personality: 'Curious • Helpful • Educational',
      quote: "¡Vamos! Let's go!"
    }
  };
  
  return characterData[characterId] || null;
};

// Instance method to increment selection count
characterSelectionSchema.methods.incrementSelection = function() {
  this.selectionCount += 1;
  this.lastSelectedAt = new Date();
  return this.save();
};

const CharacterSelection = mongoose.model('CharacterSelection', characterSelectionSchema);

export default CharacterSelection;