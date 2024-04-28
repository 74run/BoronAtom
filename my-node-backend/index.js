const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const { latex } = require('latex.js');

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


app.use(cors({
  origin: ["https://boron-atom-chi.vercel.app"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://tarunjanapati7:%4074run54I@educationdetaails.x0zu5mp.mongodb.net/?retryWrites=true&w=majority&appName=EducationDetaails', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
// Handle MongoDB connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.use(express.json());





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



app.post('/compile-latex', (req, res) => {
  const { latexCode } = req.body;

  // Save the LaTeX code to a .tex file
  const texFilePath = path.join(__dirname, './latex-files/file.tex');
  require('fs').writeFileSync(texFilePath, latexCode);

  // Full path to pdflatex executable
  const pdflatexPath = 'C:/Users/74run/AppData/Local/Programs/MiKTeX/miktex/bin/x64/pdflatex'; // Replace with the actual path on your server

  // Use pdflatex to compile the LaTeX code to PDF
  exec(`${pdflatexPath} -output-directory=${path.join(__dirname, './latex-files')} ${texFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Compilation error: ${stderr}`);
      return res.status(500).send({ error: 'Compilation failed' });
    }

    // Assuming pdflatex generates a file named file.pdf
    const pdfFilePath = path.join(__dirname, './latex-files/file.pdf');
    res.sendFile(pdfFilePath);
  });
});







////////////////////////////Profile Photo Code///////////////////////////////////////

// // Define the destination folder and storage for Multer
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

// Serve static files from the 'uploads' folder
const profilePhotoSchema = new mongoose.Schema({
  imageUrl: String,
});

const ProfilePhoto = mongoose.model('ProfilePhoto', profilePhotoSchema);


app.use('/uploads', express.static('uploads'));



app.get('/api/profile-photo', async (req, res) => {
  try {
    const profilePhoto = await ProfilePhoto.findOne();
    if (profilePhoto) {
      res.json({ imageUrl: profilePhoto.imageUrl });
    } else {
      res.json({ imageUrl: '' });
    }
  } catch (error) {
    console.error('Error fetching profile photo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const newImageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

    // Find the old profile photo and delete it from 'uploads'
    const oldProfilePhoto = await ProfilePhoto.findOne();
    if (oldProfilePhoto) {
      const oldImagePath = path.join(__dirname, 'uploads', path.basename(oldProfilePhoto.imageUrl));
      fs.unlinkSync(oldImagePath);
    }

    // Replace the old photo URL with the new one
    let updatedProfilePhoto;
    if (oldProfilePhoto) {
      updatedProfilePhoto = await ProfilePhoto.findByIdAndUpdate(
        oldProfilePhoto._id,
        { imageUrl: newImageUrl },
        { new: true }
      );
    } else {
      // If no old photo exists, create a new one
      updatedProfilePhoto = new ProfilePhoto({ imageUrl: newImageUrl });
      await updatedProfilePhoto.save();
    }

    res.json({ success: true, imageUrl: updatedProfilePhoto.imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// router.delete('/delete-profile-photo', async (req, res) => {
//   try {
//     const profilePhoto = await ProfilePhoto.findOne();
//     if (profilePhoto) {
//       // Delete the image from 'uploads'
//       const imagePath = path.join(__dirname, 'uploads', path.basename(profilePhoto.imageUrl));
//       fs.unlinkSync(imagePath);

//       // Delete the profile photo document from the database
//       await ProfilePhoto.findByIdAndRemove(profilePhoto._id);

//       res.json({ success: true });
//     } else {
//       res.json({ success: false, message: 'No profile photo found' });
//     }
//   } catch (error) {
//     console.error('Error deleting profile photo:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


////////////////////////////Profile Photo Code///////////////////////////////////////












app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
