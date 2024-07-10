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
        cb(null, './uploads/'); // Destination folder for uploads
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Unique filename
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

        // Handle file uploads and update files array
        if (req.files && req.files.length > 0) {
            console.log("recieved files");
            const newFiles = req.files.map(file => file.filename);
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

module.exports = router;