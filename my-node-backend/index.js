const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

const { GridFSBucket, ObjectId } = require('mongodb');

const UserProfile = require('./models/UserprofileModel');
const allowCors = require('./cors');

require("dotenv").config();


// const EduRoutes = require('./routes/EduRoute');
const UniRoutes = require('./routes/UniRoute');
// const ExpRoutes = require('./routes/ExpRoute');
// const CertRoutes = require('./routes/CertRoute');
// const InvRoutes = require('./routes/InvRoute');
// const ProRoutes = require('./routes/ProRoute');
// const profileRoutes = require('./routes/ProfilePhotoRoute');
const UserProfileRoutes = require('./routes/EduProfileRoute');

const ExpUserRoutes = require('./routes/ExpUserRoute');
const CertUserRoutes = require('./routes/CertUserRoute');
const ProUserRoutes = require('./routes/ProUserRoute');
const SumUserRoutes = require('./routes/SumUserRoute');
const InvUserRoutes = require('./routes/InvUserRoute');
const SkillUserRoutes = require('./routes/SkillUserRoute');
const ContactUserRoutes = require('./routes/ContactUserRoute');
const Google = require('./google');


const app = express();
const port = 3001;

// const corsOptions = {
//   origin: '*', // Explicitly allow your frontend domain
//   methods: 'GET,POST,PUT,DELETE', // Specify allowed methods as needed
//   credentials: true, // If your frontend needs to send cookies or credentials with the request
//   allowedHeaders: 'Content-Type,Authorization', // Specify allowed headers
// };


const corsOptions = {
  origin: 'https://www.boronatom.me', 
  methods: 'GET,POST,PUT,DELETE', 
  credentials: true, 
  allowedHeaders: 'Content-Type,Authorization', 
  preflightContinue: false,
  optionsSuccessStatus: 204
};


app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));



app.use('/run', (req,res)=> {
  res.send("server is running")
})

app.use(cors(corsOptions));


app.use(bodyParser.json());


mongoose.connect('mongodb+srv://tarunjanapati7:%4074run54I@educationdetaails.x0zu5mp.mongodb.net/?retryWrites=true&w=majority&appName=EducationDetaails');

const db = mongoose.connection;
// Handle MongoDB connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});




require('./routes/UserRoute')(app);







// app.use('/api/items', EduRoutes);
// app.use('/', profileRoutes);
// app.use('/api/experiences', ExpRoutes);
// app.use('/api/certifications',CertRoutes);
// // app.use('/api/involvements',InvRoutes);
// app.use('/api/projects', ProRoutes);
app.use('/', UniRoutes);


app.use('/api/userprofile', UserProfileRoutes);
app.use('/api/userprofile', ExpUserRoutes);
app.use('/api/userprofile', CertUserRoutes);
app.use('/api/userprofile', ProUserRoutes);
app.use('/api/userprofile', SumUserRoutes);
app.use('/api/userprofile', InvUserRoutes);
app.use('/api/userprofile', SkillUserRoutes);
app.use('/api/userprofile', ContactUserRoutes)
app.use('/api/userprofile', Google);


app.use('/run', (req,res)=> {
  res.send("server is running")
})


app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// In-memory storage for LaTeX code
let storedLatexCode = '';

// Endpoint to receive LaTeX code via POST
app.post('/store-latex', (req, res) => {
  const { latexCode } = req.body;

  // Check if LaTeX code is provided
  if (!latexCode) {
    return res.status(400).json({ message: 'No LaTeX code provided' });
  }

  // Store the LaTeX code in memory
  storedLatexCode = latexCode;

  res.json({ message: 'LaTeX code stored successfully' });
});

// Endpoint to view LaTeX code via GET
app.get('/:firstName_Resume', (req, res) => {
  if (!storedLatexCode) {
    return res.status(404).send('No LaTeX code stored');
  }

  // Respond with the stored LaTeX code as plain text
  res.setHeader('Content-Type', 'text/plain');
  res.send(storedLatexCode);
});



app.post('/compile-latex', (req, res) => {
  const { latexCode } = req.body;
  const texFilePath = path.join(__dirname, 'temp.tex');
  const pdfFilePath = path.join(__dirname, 'temp.pdf');

  // Write LaTeX code to a .tex file
  fs.writeFileSync(texFilePath, latexCode);

  // Compile LaTeX file to PDF using pdflatex

  exec(`pdflatex -interaction=nonstopmode ${texFilePath}`, { cwd: __dirname }, (error, stdout, stderr) => {

    if (error) {
      console.error(`LaTeX compilation error: ${error}`);
      console.error(`stderr: ${stderr}`);
      console.error(`stdout: ${stdout}`);
      return res.status(500).json({ message: 'LaTeX compilation error', error: stderr });
    }

    // Check if the PDF file was generated
    if (!fs.existsSync(pdfFilePath)) {
      console.error('PDF file not found after compilation');
      return res.status(500).json({ message: 'PDF file not found after compilation' });
    }

    // Send the generated PDF file as a response
    res.sendFile(pdfFilePath, (err) => {
      if (err) {
        console.error(`Error sending PDF file: ${err}`);
        return res.status(500).send('Error sending PDF file');
      }

    });
  });
});


const imageSchema = new mongoose.Schema({
  imageData: Buffer, // Store image data as Buffer
  filename: String,
});

// Create a model for the image collection
const Image = mongoose.model("Image", imageSchema);


app.post('/api/userprofile/:userID/image', async (req, res) => {
  const { userID } = req.params;
  const { imageData } = req.body;

  try {
      // Decode the base64 image
      const matches = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      const contentType = matches[1];
      const imageBuffer = Buffer.from(matches[2], 'base64');

      // Find the user profile by userID
      const userProfile = await UserProfile.findOne({ userID });

      if (!userProfile) {
          return res.status(404).json({ message: 'User profile not found' });
      }

      // Update the profile with the image
      userProfile.image = imageBuffer;
      userProfile.image.contentType = contentType;

      await userProfile.save();

      res.status(200).json({ message: 'Image saved successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error saving image', error });
  }
});



app.get('/api/userprofile/:userID/image', async (req, res) => {
  const { userID } = req.params;

  try {
      const userProfile = await UserProfile.findOne({ userID });

      if (!userProfile || !userProfile.image) {
          return res.status(404).json({ message: 'Image not found' });
      }

      res.set('Content-Type', userProfile.image.contentType);
      res.send(userProfile.image);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving image', error });
  }
});






app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
