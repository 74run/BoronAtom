const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const EduRoutes = require('./routes/EduRoute');
const UniRoutes = require('./routes/UniRoute');
const ExpRoutes = require('./routes/ExpRoute');

const app = express();
const port = 3001;


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
app.use('/api/experiences', ExpRoutes);
app.use('/', UniRoutes);







app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
