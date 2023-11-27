// models/message-model.js
const mongoose = require('mongoose')

// Schema for messages
const MessageSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      default: 'Anonymous',
    },
    to: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: String,
      required: true
    }
    // Add more fields as needed for your message schema
});

module.exports = mongoose.model('Message', MessageSchema);