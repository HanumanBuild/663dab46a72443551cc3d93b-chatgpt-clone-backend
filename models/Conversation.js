const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  messages: [{
    text: String,
    createdAt: { type: Date, default: Date.now },
    isUser: Boolean
  }]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;