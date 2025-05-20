const chatService = require('../service/chatService');

const generateResponse = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const response = await chatService.generateChatResponse(messages);
    res.json({ message: response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
};

module.exports = {
  generateResponse,
}; 