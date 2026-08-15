import express from 'express';
import CharacterSelection from '../models/CharacterSelection.js';

const router = express.Router();

// Save or update character selection
router.post('/save-selection', async (req, res) => {
  try {
    const { clerkUserId, username, email, selectedCharacter } = req.body;
    
    // Validate required fields
    if (!clerkUserId || !username || !email || !selectedCharacter) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: clerkUserId, username, email, selectedCharacter'
      });
    }
    
    // Get character data
    const characterData = CharacterSelection.getCharacterData(selectedCharacter);
    if (!characterData) {
      return res.status(400).json({
        success: false,
        message: `Invalid character: ${selectedCharacter}`
      });
    }
    
    // Check if selection already exists
    let selection = await CharacterSelection.findOne({
      clerkUserId,
      selectedCharacter
    });
    
    if (selection) {
      // Update existing selection
      selection.username = username; // Update in case name changed
      selection.email = email; // Update in case email changed
      await selection.incrementSelection();
      
      console.log(`✅ Updated character selection for user ${username}: ${characterData.name}`);
    } else {
      // Create new selection
      selection = new CharacterSelection({
        clerkUserId,
        username,
        email,
        selectedCharacter,
        characterName: characterData.name,
        characterDialogue: characterData.dialogue,
        characterPersonality: characterData.personality,
        characterQuote: characterData.quote,
        selectionCount: 1,
        lastSelectedAt: new Date()
      });
      
      await selection.save();
      console.log(`✅ Created new character selection for user ${username}: ${characterData.name}`);
    }
    
    res.json({
      success: true,
      data: selection,
      message: 'Character selection saved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error saving character selection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save character selection',
      error: error.message
    });
  }
});

// Get user's character selections
router.get('/user-selections/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    
    const selections = await CharacterSelection.find({ clerkUserId })
      .sort({ lastSelectedAt: -1 });
    
    res.json({
      success: true,
      data: selections
    });
    
  } catch (error) {
    console.error('❌ Error fetching user selections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user selections',
      error: error.message
    });
  }
});

// Get all character selections (admin view)
router.get('/all-selections', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    const selections = await CharacterSelection.find()
      .sort({ lastSelectedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await CharacterSelection.countDocuments();
    
    res.json({
      success: true,
      data: selections,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching all selections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch selections',
      error: error.message
    });
  }
});

// Get character selection statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total selections and unique users
    const totalSelections = await CharacterSelection.countDocuments();
    const uniqueUsers = await CharacterSelection.distinct('clerkUserId').then(users => users.length);
    
    // Get character popularity
    const popularityAgg = await CharacterSelection.aggregate([
      {
        $group: {
          _id: '$selectedCharacter',
          totalSelections: { $sum: '$selectionCount' },
          uniqueUsers: { $addToSet: '$clerkUserId' }
        }
      },
      {
        $project: {
          character: '$_id',
          totalSelections: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { totalSelections: -1 } }
    ]);
    
    // Format character popularity
    const characterPopularity = {};
    popularityAgg.forEach(item => {
      characterPopularity[item.character] = item.totalSelections;
    });
    
    // Get recent selections
    const recentSelections = await CharacterSelection.find()
      .sort({ lastSelectedAt: -1 })
      .limit(10)
      .select('username email selectedCharacter characterName selectionCount lastSelectedAt');
    
    res.json({
      success: true,
      data: {
        totalSelections,
        uniqueUsers,
        characterPopularity,
        recentSelections,
        characterStats: popularityAgg
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Get user's latest character selection
router.get('/latest-selection/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    
    const latestSelection = await CharacterSelection.findOne({ clerkUserId })
      .sort({ lastSelectedAt: -1 });
    
    res.json({
      success: true,
      data: latestSelection
    });
    
  } catch (error) {
    console.error('❌ Error fetching latest selection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest selection',
      error: error.message
    });
  }
});

export default router;