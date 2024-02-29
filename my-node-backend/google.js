const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI('AIzaSyDvzpWVZ-KvenyOUtbMi3QJ-sYwdbJwnoU');

// Define an endpoint to generate text
router.get('/generate', async (req, res) => {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = "Write a Resume summary for my Mechanical Engineering background in 25 words.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send the generated text to the front end
    res.json({ text });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'An error occurred while generating content' });
  }
});

module.exports = router;
