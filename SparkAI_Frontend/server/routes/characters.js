import express from 'express';
import Character from '../models/Character.js';

const router = express.Router();

// Get all characters
router.get('/all', async (req, res) => {
  try {
    const characters = await Character.find().sort({ id: 1 });
    
    res.json({
      success: true,
      data: characters
    });
    
  } catch (error) {
    console.error('❌ Error fetching characters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch characters',
      error: error.message
    });
  }
});

// Get character by ID
router.get('/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    
    const character = await Character.findOne({ id: characterId });
    
    if (!character) {
      return res.status(404).json({
        success: false,
        message: `Character with id '${characterId}' not found`
      });
    }
    
    res.json({
      success: true,
      data: character
    });
    
  } catch (error) {
    console.error('❌ Error fetching character:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch character',
      error: error.message
    });
  }
});

// Seed characters (admin endpoint)
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Starting characters seeding...');
    const result = await Character.seedCharacters();
    
    res.json({
      success: true,
      message: 'Characters seeded successfully',
      data: {
        count: result.length,
        characters: result
      }
    });
    
  } catch (error) {
    console.error('❌ Error seeding characters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed characters',
      error: error.message
    });
  }
});

export default router;