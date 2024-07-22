const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

const { GridFSBucket, ObjectId } = require('mongodb');

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

const corsOptions = {
  origin: '*', // Explicitly allow your frontend domain
  methods: 'GET,POST,PUT,DELETE', // Specify allowed methods as needed
  credentials: true, // If your frontend needs to send cookies or credentials with the request
  allowedHeaders: 'Content-Type,Authorization', // Specify allowed headers
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// const corsOptions = {
//   origin: 'https://boronatom.me', 
//   methods: 'GET,POST,PUT,DELETE', 
//   credentials: true, 
//   allowedHeaders: 'Content-Type,Authorization', 
//   preflightContinue: false,
//   optionsSuccessStatus: 204
// };


app.use('/run', (req,res)=> {
  res.send("server is running")
})

app.use(cors(corsOptions));


app.use(bodyParser.json());


mongoose.connect(process.env.REACT_APP_MONGODB);

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







////////////////////////////Profile Photo Code///////////////////////////////////////

// // Define the destination folder and storage for Multer
// const storage = multer.diskStorage({
//   destination: './uploads',
//   filename: (req, file, cb) => {
//     const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
//     cb(null, uniqueFilename);
//   },
// });

// const upload = multer({ storage });

// // Serve static files from the 'uploads' folder
// const profilePhotoSchema = new mongoose.Schema({
//   imageUrl: String,
// });

// const ProfilePhoto = mongoose.model('ProfilePhoto', profilePhotoSchema);


// app.use('/uploads', express.static('uploads'));


const imageSchema = new mongoose.Schema({
  imageData: Buffer, // Store image data as Buffer
  filename: String,
});

// Create a model for the image collection
const Image = mongoose.model("Image", imageSchema);


app.post("/api/saveImage", async (req, res) => {
  const imageData = req.body.imageData;

  // Create a unique filename for the image
  const filename = "avatar_" + Date.now() + ".png";

  // Decode base64 image data
  const base64Data = imageData.replace(/^data:image\/png;base64,/, "");

  // Save the image to the MongoDB database
  try {
    const image = new Image({ imageData: Buffer.from(base64Data, "base64"), filename });
    await image.save();
    // console.log("Image saved successfully:", filename);
    res.json({ success: true, filename: filename });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Error saving image" });
  }
});




// app.get('/api/profile-photo', async (req, res) => {
//   try {
//     const profilePhoto = await ProfilePhoto.findOne();
//     if (profilePhoto) {
//       res.json({ imageUrl: profilePhoto.imageUrl });
//     } else {
//       res.json({ imageUrl: '' });
//     }
//   } catch (error) {
//     console.error('Error fetching profile photo:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });








// app.post('/upload', upload.single('photo'), async (req, res) => {
//   try {
//     const newImageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

//     // Find the old profile photo and delete it from 'uploads'
//     const oldProfilePhoto = await ProfilePhoto.findOne();
//     if (oldProfilePhoto) {
//       const oldImagePath = path.join(__dirname, 'uploads', path.basename(oldProfilePhoto.imageUrl));
//       fs.unlinkSync(oldImagePath);
//     }

//     // Replace the old photo URL with the new one
//     let updatedProfilePhoto;
//     if (oldProfilePhoto) {
//       updatedProfilePhoto = await ProfilePhoto.findByIdAndUpdate(
//         oldProfilePhoto._id,
//         { imageUrl: newImageUrl },
//         { new: true }
//       );
//     } else {
//       // If no old photo exists, create a new one
//       updatedProfilePhoto = new ProfilePhoto({ imageUrl: newImageUrl });
//       await updatedProfilePhoto.save();
//     }

//     res.json({ success: true, imageUrl: updatedProfilePhoto.imageUrl });
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

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
