const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Challenge = require('../models/challenge');

// POST route to create a new challenge
router.post('/create', async (req, res) => {
    try {
        const { name, description, category, value, type } = req.body;
        console.log(type);
        // Create a new challenge instance
        const newChallenge = new Challenge({
            name,
            value,
            description,
            category,
            type
        });

        // Save the challenge to the database
        const savedChallenge = await newChallenge.save();

        // Extract the challenge ID from the saved challenge document
        const challengeId = savedChallenge._id;

        // Respond with the challenge ID
        res.status(201).json({ challengeId });
    } catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).json({ error: 'Failed to create challenge' });
    }
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/');
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath); // Destination folder for uploads
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const uniqueFilename = file.originalname + '-' + uniqueSuffix + extension;
        file.uniqueFilename = uniqueFilename; // Add unique filename to file object
        cb(null, uniqueFilename); // Unique filename
    }
});

// Multer file filter
const fileFilter = (req, file, cb) => {
    // Accept all file types for this example
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// POST route to update an existing challenge with additional data
router.post('/update/:challengeId', upload.array('file', 5), async (req, res) => {
    const { challengeId } = req.params;
    try {
        // Find the existing challenge by ID
        const existingChallenge = await Challenge.findById(challengeId);
        if (!existingChallenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        // Additional data to update
        const { flag, flag_data, state } = req.body;

        // Update challenge properties
        existingChallenge.flag = flag;
        existingChallenge.flag_data = flag_data;
        existingChallenge.state = state;

        // Handle specific fields based on selectedOption (e.g., language for 'code', choices for 'multiple_choice')
        if (existingChallenge.type === 'code') {
            existingChallenge.langauge = req.body.language;
        } else if (existingChallenge.type === 'multiple_choice') {
            existingChallenge.choices = JSON.parse(req.body.choices);
        }

        // Handle file uploads and update files array
        if (req.files && req.files.length > 0) {
            const newFiles = req.files.map(file => file.uniqueFilename); // Use unique filenames
            existingChallenge.files = existingChallenge.files.concat(newFiles);
        }

        // Save the updated challenge
        const updatedChallenge = await existingChallenge.save();

        // Respond with the updated challenge document
        res.status(200).json({ message: 'Challenge updated successfully', challenge: updatedChallenge });
    } catch (error) {
        console.error('Error updating challenge:', error);
        res.status(500).json({ error: 'Failed to update challenge' });
    }
   
});

// search challenge by ID
router.get('/details/:id', async (req, res) => {
    try {
        const challenges = await Challenge.findOne({_id: req.params.id});
        res.status(200).json(challenges);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ error: 'Failed to fetch challenges', message: error.message });
    }
    });

router.get('/all', async (req, res) => {
    try {
        const challenges = await Challenge.find().select('name value category type description');
        res.status(200).json(challenges);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ error: 'Failed to fetch challenges', message: error.message });
    }
    });

router.get('/toDisplayAllChallenges', async (req, res) => {
    try {
        const challenges = await Challenge.find().select('name value category type state');
        res.status(200).json(challenges);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ error: 'Failed to fetch challenges', message: error.message });
    }
    });

// Delete challenges by IDs
router.delete('/deleteChallenges', async (req, res) => {
    const { ids } = req.body;
  
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid input. Please provide an array of IDs.' });
    }
  
    try {
      const result = await Challenge.deleteMany({ _id: { $in: ids } });
      res.status(200).json({ message: `${result.deletedCount} challenges deleted successfully.` });
    } catch (error) {
      console.error('Error deleting challenges:', error);
      res.status(500).json({ error: 'Failed to delete challenges', message: error.message });
    }
  });
  

module.exports = router;
