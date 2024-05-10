const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const axios = require('axios');

router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    res.json(conversation);
  } catch (error) {
    res.status(404).json({ message: 'Conversation not found' });
  }
});

router.post('/', async (req, res) => {
  const newConversation = new Conversation({ messages: [] });
  try {
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:id/messages', async (req, res) => {
  const { text } = req.body;
  try {
    const conversation = await Conversation.findById(req.params.id);
    conversation.messages.push({ text, isUser: true });

    const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
      prompt: text,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    conversation.messages.push({ text: response.data.choices[0].text, isUser: false });
    await conversation.save();
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;