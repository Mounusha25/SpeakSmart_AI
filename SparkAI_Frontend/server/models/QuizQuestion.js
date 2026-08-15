import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  character: {
    type: String,
    required: true,
    enum: ['ben-10', 'black-panther', 'wanda-vision', 'dora'],
    index: true
  },
  triggerAfterQuestion: {
    type: Number,
    required: true,
    index: true
  },
  questionNumber: {
    type: Number,
    required: true,
    index: true,
    min: 1
  },
  dialogue: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length >= 2 && arr.length <= 6;
      },
      message: 'Options must contain between 2 and 6 choices'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value >= 0 && value < this.options.length;
      },
      message: 'Correct answer index must be valid for the options array'
    }
  },
  explanation: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'quiz_questions'
});

// Compound indexes for efficient queries
quizQuestionSchema.index({ character: 1, triggerAfterQuestion: 1 }, { unique: true });
quizQuestionSchema.index({ character: 1, questionNumber: 1 });
quizQuestionSchema.index({ questionNumber: 1 });

// Static method to seed initial quiz questions
quizQuestionSchema.statics.seedQuizQuestions = async function() {
  console.log('🌱 Seeding quiz questions...');
  
  // Clear existing quiz questions
  await this.deleteMany({});
  console.log('🗑️ Cleared existing quiz questions');

  const quizQuestions = [
    // Ben 10 Quizzes
    {
      character: "ben-10",
      triggerAfterQuestion: 2,
      questionNumber: 1,
      dialogue: "It's hero time!",
      question: "Based on your role and guest count, what's the most heroic approach to preparation?",
      options: [
        "Creating a detailed timeline and delegate responsibilities",
        "Just winging it and hoping for the best", 
        "Focusing only on decorations",
        "Avoiding all planning until last minute"
      ],
      correctAnswer: 0,
      explanation: "Like Ben 10, true heroes prepare thoroughly and work as a team to handle any challenge."
    },
    {
      character: "ben-10",
      triggerAfterQuestion: 4,
      questionNumber: 2,
      dialogue: "I can handle this!",
      question: "How will you handle unexpected challenges during the festival?",
      options: [
        "Panic and abandon the plan",
        "Stay flexible and adapt quickly with backup solutions",
        "Ignore problems and hope they resolve themselves",
        "Blame others for not preventing issues"
      ],
      correctAnswer: 1,
      explanation: "Ben 10's heroic nature teaches us to stay adaptable and confident when facing unexpected situations."
    },
    {
      character: "ben-10",
      triggerAfterQuestion: 6,
      questionNumber: 3,
      dialogue: "Let's save the day!",
      question: "What's your key takeaway for delivering a heroic message?",
      options: [
        "Speak quietly and hope people listen",
        "Own your message with conviction and clear purpose",
        "Apologize before saying anything important",
        "Focus on what might go wrong"
      ],
      correctAnswer: 1,
      explanation: "Ben 10's heroism comes from speaking with confidence and taking responsibility for positive outcomes."
    },
    // Wanda Vision Quizzes
    {
      character: "wanda-vision",
      triggerAfterQuestion: 2,
      questionNumber: 1,
      dialogue: "I can handle the truth.",
      question: "Based on your role and guest count, what shows emotional intelligence in leadership?",
      options: [
        "Doing everything yourself to avoid emotions",
        "Understanding people's needs and building connections",
        "Making all decisions without considering feelings",
        "Avoiding difficult emotional conversations"
      ],
      correctAnswer: 1,
      explanation: "Wanda's emotional strength teaches us that true power comes from understanding and connecting with others."
    },
    {
      character: "wanda-vision",
      triggerAfterQuestion: 4,
      questionNumber: 2,
      dialogue: "You don't know what you've unleashed.",
      question: "How should you handle festival challenges with emotional wisdom?",
      options: [
        "Suppress all emotions and be robotic",
        "Channel emotions constructively while staying focused on solutions",
        "Let emotions overwhelm decision-making",
        "Hide from emotional challenges"
      ],
      correctAnswer: 1,
      explanation: "Wanda's journey shows us how to harness emotional power constructively while maintaining focus on our goals."
    },
    {
      character: "wanda-vision",
      triggerAfterQuestion: 6,
      questionNumber: 3,
      dialogue: "I'm not a monster. I'm a mother.",
      question: "What does it mean to communicate with Wanda's compassionate strength?",
      options: [
        "Always put others' needs before your own message",
        "Balance compassion with clear, honest communication",
        "Avoid difficult truths to protect feelings",
        "Never show vulnerability in your message"
      ],
      correctAnswer: 1,
      explanation: "Wanda's wisdom teaches us that true strength comes from balancing compassion with honest, clear communication."
    },
    // Black Panther Quizzes
    {
      character: "black-panther",
      triggerAfterQuestion: 2,
      questionNumber: 1,
      dialogue: "Wakanda forever!",
      question: "Based on your role and guest count, what demonstrates true leadership wisdom?",
      options: [
        "Making decisions in isolation",
        "Building unity and considering community impact",
        "Focusing only on personal gain",
        "Following others without question"
      ],
      correctAnswer: 1,
      explanation: "T'Challa's leadership focuses on unity and considering the greater good of the community."
    },
    {
      character: "black-panther",
      triggerAfterQuestion: 4,
      questionNumber: 2,
      dialogue: "In times of crisis, the wise build bridges while the foolish build barriers.",
      question: "How should you approach festival challenges with wisdom?",
      options: [
        "Create divisions to assign blame",
        "Build connections and collaborative solutions",
        "Isolate yourself from the problems",
        "Point out everyone else's mistakes"
      ],
      correctAnswer: 1,
      explanation: "Black Panther's wisdom teaches us to build bridges and find collaborative solutions during challenges."
    },
    {
      character: "black-panther",
      triggerAfterQuestion: 6,
      questionNumber: 3,
      dialogue: "The world is changing. Soon there will only be the conquered and the conquerors.",
      question: "What does Wakandan wisdom teach about confident communication?",
      options: [
        "Dominate every conversation",
        "Lead with purpose, honor, and strategic thinking",
        "Conquer others through manipulation",
        "Always be the loudest voice"
      ],
      correctAnswer: 1,
      explanation: "T'Challa's approach combines strategic thinking with honor and purposeful communication."
    },
    // Dora Quizzes
    {
      character: "dora",
      triggerAfterQuestion: 2,
      questionNumber: 1,
      dialogue: "¡Vamos! Let's go!",
      question: "Based on your role and guest count, what's the most exploratory approach to preparation?",
      options: [
        "Making a map and planning the adventure step by step",
        "Just wandering around without direction",
        "Focusing only on the destination",
        "Avoiding all planning and exploration"
      ],
      correctAnswer: 0,
      explanation: "Like Dora, successful exploration requires careful planning and step-by-step preparation for the journey ahead."
    },
    {
      character: "dora",
      triggerAfterQuestion: 4,
      questionNumber: 2,
      dialogue: "We did it! ¡Lo hicimos!",
      question: "How should you handle festival challenges with Dora's adventurous spirit?",
      options: [
        "Give up when things get difficult",
        "Celebrate small wins and keep exploring solutions",
        "Rush through problems without learning",
        "Avoid challenges completely"
      ],
      correctAnswer: 1,
      explanation: "Dora teaches us to celebrate progress and maintain a positive, solution-focused attitude during challenges."
    },
    {
      character: "dora",
      triggerAfterQuestion: 6,
      questionNumber: 3,
      dialogue: "Come on! ¡Vámonos!",
      question: "What does Dora's teaching style show about effective communication?",
      options: [
        "Always speak in multiple languages",
        "Make learning interactive and encourage participation",
        "Talk at people without waiting for responses",
        "Keep all knowledge to yourself"
      ],
      correctAnswer: 1,
      explanation: "Dora's approach shows that the best communication is interactive, encouraging, and helps others learn and grow."
    },

    // Additional quiz questions for extended play (trigger points 8, 10, 12, etc.)
    // Ben 10 Extended Quizzes
    {
      character: "ben-10",
      triggerAfterQuestion: 8,
      questionNumber: 4,
      dialogue: "It's hero time!",
      question: "How do you maintain heroic energy throughout a long conversation?",
      options: [
        "Take breaks and lose focus",
        "Stay engaged and adapt your energy to the audience",
        "Use the same tone throughout",
        "Avoid difficult topics"
      ],
      correctAnswer: 1,
      explanation: "Heroes like Ben 10 adapt their approach while maintaining their core energy and commitment."
    },
    {
      character: "ben-10",
      triggerAfterQuestion: 10,
      questionNumber: 5,
      dialogue: "I can handle this!",
      question: "What's the heroic way to handle complex group dynamics?",
      options: [
        "Ignore group conflicts",
        "Address issues directly while keeping the group focused on common goals",
        "Take sides immediately",
        "Avoid making any decisions"
      ],
      correctAnswer: 1,
      explanation: "Ben 10's leadership involves addressing challenges head-on while uniting people around shared objectives."
    },

    // Wanda Vision Extended Quizzes
    {
      character: "wanda-vision",
      triggerAfterQuestion: 8,
      questionNumber: 4,
      dialogue: "I can handle the truth.",
      question: "How do you use emotional intelligence to navigate complex conversations?",
      options: [
        "Suppress all emotions completely",
        "Read the room and adjust your approach while staying authentic",
        "Let emotions control every decision",
        "Avoid emotional topics entirely"
      ],
      correctAnswer: 1,
      explanation: "Wanda's wisdom teaches us to be emotionally aware while maintaining our authentic voice and purpose."
    },
    {
      character: "wanda-vision",
      triggerAfterQuestion: 10,
      questionNumber: 5,
      dialogue: "You don't know what you've unleashed.",
      question: "What does emotional mastery look like in challenging conversations?",
      options: [
        "Never showing any vulnerability",
        "Channeling emotions into clear, purposeful communication",
        "Overwhelming others with intense emotions",
        "Avoiding all difficult conversations"
      ],
      correctAnswer: 1,
      explanation: "Wanda's journey shows us that true emotional mastery means channeling our feelings into clear, effective communication."
    },

    // Black Panther Extended Quizzes
    {
      character: "black-panther",
      triggerAfterQuestion: 8,
      questionNumber: 4,
      dialogue: "Wakanda forever!",
      question: "How do you build lasting connections in professional relationships?",
      options: [
        "Focus only on immediate transactions",
        "Invest in understanding others' long-term goals and values",
        "Avoid personal connections at work",
        "Always prioritize your own agenda"
      ],
      correctAnswer: 1,
      explanation: "T'Challa's leadership emphasizes building meaningful, lasting relationships based on mutual understanding and respect."
    },
    {
      character: "black-panther",
      triggerAfterQuestion: 10,
      questionNumber: 5,
      dialogue: "In times of crisis, the wise build bridges while the foolish build barriers.",
      question: "What's the Wakandan approach to handling disagreements?",
      options: [
        "Always win at any cost",
        "Seek understanding first, then find solutions that honor all perspectives",
        "Avoid all conflicts",
        "Force others to agree with you"
      ],
      correctAnswer: 1,
      explanation: "Black Panther's wisdom involves seeking to understand different viewpoints and finding solutions that respect everyone's dignity."
    },

    // Dora Extended Quizzes
    {
      character: "dora",
      triggerAfterQuestion: 8,
      questionNumber: 4,
      dialogue: "¡Vamos! Let's go!",
      question: "How do you keep conversations engaging and educational?",
      options: [
        "Talk at people without interaction",
        "Ask questions, encourage participation, and celebrate learning moments",
        "Stick to boring, formal language",
        "Avoid teaching anything new"
      ],
      correctAnswer: 1,
      explanation: "Dora's method involves making learning interactive, fun, and celebrating every step of progress."
    },
    {
      character: "dora",
      triggerAfterQuestion: 10,
      questionNumber: 5,
      dialogue: "We did it! ¡Lo hicimos!",
      question: "What's the explorer's approach to overcoming communication barriers?",
      options: [
        "Give up when things get difficult",
        "Try different approaches, stay curious, and celebrate small breakthroughs",
        "Use only one communication style",
        "Avoid challenging conversations"
      ],
      correctAnswer: 1,
      explanation: "Dora teaches us to stay curious, try different approaches, and celebrate every breakthrough in understanding."
    },
  ];

  const result = await this.insertMany(quizQuestions);
  console.log(`✅ Seeded ${result.length} quiz questions`);
  return result;
};

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);

export default QuizQuestion;