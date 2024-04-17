const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

const UserProfile = require('./models/UserprofileModel');



// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI('AIzaSyDvzpWVZ-KvenyOUtbMi3QJ-sYwdbJwnoU');

// Define an endpoint to generate text
router.get('/generate/:userID', async (req, res) => {
  try {
    const userId = req.params.userID;

    // Query the database to get user details by ID
    const user = await UserProfile.findOne({ userID: userId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt using user data
    const prompt = `Write a Resume summary for ${user.education}, ${user.experience}, and ${user.project}.`;

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

router.post('/chat/:userID', async (req, res) => {
  const { text } = req.body;
  const userId = req.params.userID;

    // Query the database to get user details by ID
    const user = await UserProfile.findOne({ userID: userId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt using user data
    const prompt = `You are my Resume Builder for my "${user.education}", "${user.experience}", and "${user.project}" with this job details "${text}".`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const aiMessage = response.text();

  res.json({ message: aiMessage });
});



module.exports = router;
