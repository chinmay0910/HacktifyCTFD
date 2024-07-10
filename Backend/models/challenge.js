const mongoose = require('mongoose');

// Define Challenge Schema
const challengeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        default: ''
    },
    flag_data: {
        type: String,
    },
    langauge: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        enum: ['visible', 'hidden'], // Example of enum for state
        default: 'visible'
    },
    max_attempts: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['standard', 'code', 'dynamic', 'manual_verification', 'multiple_choice'],
        required: true
    },
    solves: {
        type: Number,
        default: 0
    },
    solved_by_me: {
        type: Boolean,
        default: false
    },
    attempts: {
        type: Number,
        default: 0
    },
    files: { type: [String], default: [] }, // Array of file paths or references
    tags: [String], // Array of tags
    hints: [String] // Array of hint strings
});

// Compile model from schema
const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;