const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Education = require('./models/Education');


const app = express();
const port = 3001;

const universityNames = [];

app.use(cors());
app.use(bodyParser.json());

app.put('/api/educations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { university, degree, graduationYear } = req.body;

    // Find the education entry by ID
    const existingEducation = await Education.findById(id);

    if (!existingEducation) {
      return res.status(404).json({ error: 'Education entry not found' });
    }

    // Update the fields
    existingEducation.university = university;
    existingEducation.degree = degree;
    existingEducation.graduationYear = graduationYear;

    // Save the updated education entry to MongoDB
    const updatedEducation = await existingEducation.save();

    // Send the updated education entry as the response
    res.json(updatedEducation);
  } catch (error) {
    console.error('Error updating education entry:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.delete('/api/educations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the education entry by ID
    const existingEducation = await Education.findById(id);

    if (!existingEducation) {
      return res.status(404).json({ error: 'Education entry not found' });
    }

    // Remove the education entry from MongoDB
    await existingEducation.remove();

    // Send success response
    res.json({ message: 'Education entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting education entry:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Read university names from UniName.json file
fs.readFile('UniName.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  const jsonData = JSON.parse(data);

  // Assuming your JSON structure has an array of objects with a 'name' property
  universityNames.push(...jsonData.map(entry => entry.name));

  console.log('University names:', universityNames);
});

// Expose an API endpoint for retrieving universities
app.get('/api/universities', (req, res) => {
  res.json({ universities: universityNames });
});

app.get('/api/educations', async (req, res) => {
  try {
    // Retrieve all education entries from MongoDB
    const educations = await Education.find();
    res.json(educations);
  } catch (error) {
    console.error('Error fetching education entries:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/EducationDetails', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.post('/api/educations', async (req, res) => {
  try {
    const { university, degree, graduationYear } = req.body;

    // Create a new education entry
    const newEducation = new Education({
      university,
      degree,
      graduationYear,
    });

    // Save the new education entry to MongoDB
    const savedEducation = await newEducation.save();

    // Send the saved education entry as the response
    res.json(savedEducation);
  } catch (error) {
    console.error('Error creating education entry:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/api/educations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { university, degree, graduationYear } = req.body;

    // Find the education entry by ID
    const existingEducation = await Education.findById(id);

    if (!existingEducation) {
      return res.status(404).json({ error: 'Education entry not found' });
    }

    // Update the fields
    existingEducation.university = university;
    existingEducation.degree = degree;
    existingEducation.graduationYear = graduationYear;

    // Save the updated education entry to MongoDB
    const updatedEducation = await existingEducation.save();

    // Send the updated education entry as the response
    res.json(updatedEducation);
  } catch (error) {
    console.error('Error updating education entry:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Handle MongoDB connection events
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
