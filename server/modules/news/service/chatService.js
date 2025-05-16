const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const generateChatResponse = async (messages) => {
  try {
    // Format the conversation context
    const conversationHistory = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => msg.content)
      .join('\n');

    // Get system message if exists
    const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';

    // Combine system message and conversation
    const input = `${systemMessage}\n\n${conversationHistory}`;

    // Generate response using Hugging Face's DialoGPT model
    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: input,
      parameters: {
        max_length: 100,
        num_return_sequences: 1,
        no_repeat_ngram_size: 2,
        temperature: 0.7,
        do_sample: true,
      },
    });

    // Clean up the response
    const generatedText = response.generated_text || '';
    const cleanedResponse = generatedText
      .replace(input, '')
      .trim()
      .replace(/^[^a-zA-Z0-9]*/, '');

    return cleanedResponse || 'I apologize, but I am unable to provide a response at this moment.';
  } catch (error) {
    console.error('DialoGPT error:', error);
    throw new Error('Failed to generate response');
  }
};

module.exports = {
  generateChatResponse,
}; 