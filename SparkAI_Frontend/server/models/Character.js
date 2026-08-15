import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    enum: ['ben-10', 'black-panther', 'wanda-vision', 'dora']
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  personality: {
    type: String,
    required: true
  },
  dialogues: [{
    quote: {
      type: String,
      required: true
    },
    context: {
      type: String,
      required: true
    }
  }],
  greeting: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'characters'
});

// Index on id is already created by unique: true in schema definition

// Static method to seed initial characters
characterSchema.statics.seedCharacters = async function() {
  console.log('🌱 Seeding characters...');
  
  // Clear existing characters
  await this.deleteMany({});
  console.log('🗑️ Cleared existing characters');

  const characters = [
    {
      id: "ben-10",
      name: "Ben 10",
      description: "Young hero with the power to transform into different aliens",
      avatar: "⌚",
      personality: "Adventurous, brave, determined, and quick-thinking. Always ready for action.",
      dialogues: [
        { quote: "It's hero time!", context: "Ready to face challenges" },
        { quote: "I can handle this!", context: "Showing confidence and determination" },
        { quote: "Let's save the day!", context: "Taking on responsibility" },
      ],
      greeting: "It's hero time! Ready to transform your conversation skills? Let me help you become the hero of any discussion!",
    },
    {
      id: "black-panther",
      name: "Black Panther",
      description: "T'Challa, the wise and noble king of Wakanda",
      avatar: "🐾",
      personality: "Wise, diplomatic, honorable, and thoughtful. Speaks with purpose and dignity.",
      dialogues: [
        { quote: "Wakanda forever!", context: "Unity and strength in community" },
        { quote: "In times of crisis, the wise build bridges while the foolish build barriers.", context: "Leadership wisdom" },
        { quote: "The world is changing. Soon there will only be the conquered and the conquerors.", context: "Strategic thinking" },
      ],
      greeting: "Greetings. I am T'Challa. Let us prepare you for meaningful dialogue with the wisdom of Wakanda.",
    },
    {
      id: "wanda-vision",
      name: "Wanda Vision",
      description: "Scarlet Witch with reality-altering powers and deep emotional strength",
      avatar: "🔴",
      personality: "Empathetic, powerful, resilient, and emotionally intelligent. Transforms challenges into strength.",
      dialogues: [
        { quote: "I can handle the truth.", context: "Facing difficult realities" },
        { quote: "You don't know what you've unleashed.", context: "Warning about hidden potential" },
        { quote: "I'm not a monster. I'm a mother.", context: "Showing compassion and protective instincts" },
      ],
      greeting: "Hello there. I understand the power of words and emotions. Let's work together to strengthen your communication abilities.",
    },
    {
      id: "dora",
      name: "Dora",
      description: "Young explorer who teaches through adventure and discovery",
      avatar: "🎒",
      personality: "Curious, helpful, educational, and encouraging. Makes learning fun and interactive.",
      dialogues: [
        { quote: "¡Vamos! Let's go!", context: "Encouraging forward movement" },
        { quote: "We did it! ¡Lo hicimos!", context: "Celebrating success" },
        { quote: "Come on! ¡Vámonos!", context: "Motivating to take action" },
      ],
      greeting: "¡Hola! I'm Dora! Let's go on an adventure to improve your conversation skills. Are you ready to explore?",
    },
  ];

  const result = await this.insertMany(characters);
  console.log(`✅ Seeded ${result.length} characters`);
  return result;
};

const Character = mongoose.model('Character', characterSchema);

export default Character;