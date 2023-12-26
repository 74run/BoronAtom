const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const Education = require('./routes/EduRoute');

const EduRoutes = require('./routes/EduRoute');
const UniRoutes = require('./routes/UniRoute');

const app = express();
const port = 3001;

// const universityNames = [];

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/EducationDetails', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
// Handle MongoDB connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.use('/api/items', EduRoutes);
app.use('/', UniRoutes);

// const itemSchema = new mongoose.Schema({
//   university: String,
//   degree: String,
//   graduationyear: String,
// });

// const Item = mongoose.model('Item', itemSchema);

// app.post('/api/items', async (req, res) => {
//   try {
//     const { university, degree, graduationyear } = req.body;
//     const newItem = new Item({ university, degree,graduationyear });
//     await newItem.save();
//     res.json(newItem);
//   } catch (error) {
//     console.error('Error saving item:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.put('/api/items/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { university, degree, graduationyear } = req.body;

//     // Find the education entry by ID
//     const updatedEducation = await Item.findByIdAndUpdate(id, { university, degree, graduationyear }, { new: true });

//     res.json(updatedEducation);
//   } catch (error) {
//     console.error('Error updating education entry:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.delete('/api/items/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the education entry by ID and delete
//     await Item.findByIdAndDelete(id);

//     // Send success response
//     res.json({ message: 'Education entry deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting education entry:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



// // app.use('/api/items', Education)



// // Read university names from UniName.json file
// fs.readFile('UniName.json', 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading JSON file:', err);
//     return;
//   }

//   const jsonData = JSON.parse(data);

//   // Assuming your JSON structure has an array of objects with a 'name' property
//   universityNames.push(...jsonData.map(entry => entry.name));

//   console.log('University names:', universityNames);
// });

// // Expose an API endpoint for retrieving universities
// app.get('/api/universities', (req, res) => {
//   res.json({ universities: universityNames });
// });





app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
