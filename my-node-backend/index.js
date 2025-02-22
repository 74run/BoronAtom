const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { exec } = require('child_process');

const { GridFSBucket, ObjectId } = require('mongodb');

const UserProfile = require('./models/UserprofileModel');
const allowCors = require('./cors');

const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

require("dotenv").config();

const UserRoute = require('./routes/UserRoute');
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


const ResumeAI = require('./resumeai');


const app = express();
const port = 3001;

// const corsOptions = {
//   origin: '*', // Explicitly allow your frontend domain
//   methods: 'GET,POST,PUT,DELETE', // Specify allowed methods as needed
//   credentials: true, // If your frontend needs to send cookies or credentials with the request
//   allowedHeaders: 'Content-Type,Authorization', // Specify allowed headers
// };


const corsOptions = {
  origin: '*',
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

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
// Handle MongoDB connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2023-10-16'
// });

app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

UserRoute(app);


// require('./routes/UserRoute')(app);







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
app.use('/api/userprofile', ResumeAI);


app.use('/run', (req,res)=> {
  res.send("server is running")
})


app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});


app.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    try {
      const user = req.user;
      
      // Generate JWT token
      const token = jwt.sign(
        { uid: user._id }, // Changed from userId to uid
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Redirect to frontend with uid instead of userId
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&uid=${user._id}`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
    }
  }
);






// // Create a subscription
// app.post('/api/create-subscription', async (req, res) => {
//   try {
//     const { paymentMethodId, priceId, customerId } = req.body;

//     // Attach payment method to customer
//     await stripe.paymentMethods.attach(paymentMethodId, {
//       customer: customerId,
//     });

//     // Set as default payment method
//     await stripe.customers.update(customerId, {
//       invoice_settings: {
//         default_payment_method: paymentMethodId,
//       },
//     });

//     // Create subscription
//     const subscription = await stripe.subscriptions.create({
//       customer: customerId,
//       items: [{ price: priceId }],
//       expand: ['latest_invoice.payment_intent'],
//     });

//     res.json({ subscriptionId: subscription.id });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(400).json({ error: { message: error.message } });
//   }
// });

// // Webhook to handle subscription events
// app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     res.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   switch (event.type) {
//     case 'invoice.payment_succeeded':
//       const invoice = event.data.object;
//       // Handle successful payment
//       break;
//     case 'invoice.payment_failed':
//       // Handle failed payment
//       break;
//   }

//   res.json({ received: true });
// });

























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


app.delete('/api/userprofile/:userID/image', async (req, res) => {
  const { userID } = req.params;

  try {
    const userProfile = await UserProfile.findOne({ userID });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Remove the image and contentType
    userProfile.image = undefined;
    userProfile.image = { contentType: undefined };

    await userProfile.save();

    res.status(200).json({ message: 'Profile image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile image', error });
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


// const upload = multer({ dest: 'uploads/' });

// const parseResume = (extractedText) => {
//   // Initialize an object to hold the extracted information
//   const parsedData = {
//     name: '',
//     contact: {
//       email: '',
//       phone: '',
//       linkedin: '',
//     },
//     summary: '',
//     skills: [],
//     education: [],
//     experience: [],
//     projects: [],
//     certifications: [],
//     involvements: []
//   };

//   // Regular expressions to match different sections
//   const nameRegex = /^[A-Z][a-z]+\s+[A-Z][a-z]+/m;
//   const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
//   const phoneRegex = /(\+?\d{1,4}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
//   const linkedinRegex = /(linkedin\.com\/in\/[a-zA-Z0-9-]+)/i;

//   // Example section headers - may need to be adjusted based on the resumes being parsed
//   const summaryRegex = /summary|objective/i;
//   const skillsRegex = /skills/i;
//   const educationRegex = /education/i;
//   const experienceRegex = /experience|employment history|professional experience/i;
//   const projectRegex = /projects|relevant projects/i;
//   const certificationRegex = /certifications|licenses/i;
//   const involvementRegex = /involvements|volunteer work|extracurricular/i;

//   // Extract name
//   const nameMatch = extractedText.match(nameRegex);
//   if (nameMatch) {
//     parsedData.name = nameMatch[0];
//   }

//   // Extract contact information
//   const emailMatch = extractedText.match(emailRegex);
//   if (emailMatch) {
//     parsedData.contact.email = emailMatch[0];
//   }

//   const phoneMatch = extractedText.match(phoneRegex);
//   if (phoneMatch) {
//     parsedData.contact.phone = phoneMatch[0];
//   }

//   const linkedinMatch = extractedText.match(linkedinRegex);
//   if (linkedinMatch) {
//     parsedData.contact.linkedin = linkedinMatch[0];
//   }

//   // Extract sections
//   const sections = extractedText.split(/(?:\r\n|\r|\n)/);

//   let currentSection = '';
//   sections.forEach((line) => {
//     // Determine the section
//     if (summaryRegex.test(line)) {
//       currentSection = 'summary';
//     } else if (skillsRegex.test(line)) {
//       currentSection = 'skills';
//     } else if (educationRegex.test(line)) {
//       currentSection = 'education';
//     } else if (experienceRegex.test(line)) {
//       currentSection = 'experience';
//     } else if (projectRegex.test(line)) {
//       currentSection = 'projects';
//     } else if (certificationRegex.test(line)) {
//       currentSection = 'certifications';
//     } else if (involvementRegex.test(line)) {
//       currentSection = 'involvements';
//     } else if (line.trim().length === 0) {
//       // Skip empty lines
//       return;
//     } else {
//       // Process the line based on the current section
//       switch (currentSection) {
//         case 'summary':
//           parsedData.summary += line.trim() + ' ';
//           break;
//         case 'skills':
//           parsedData.skills.push(line.trim());
//           break;
//         case 'education':
//           parsedData.education.push(line.trim());
//           break;
//         case 'experience':
//           parsedData.experience.push(line.trim());
//           break;
//         case 'projects':
//           parsedData.projects.push(line.trim());
//           break;
//         case 'certifications':
//           parsedData.certifications.push(line.trim());
//           break;
//         case 'involvements':
//           parsedData.involvements.push(line.trim());
//           break;
//         default:
//           break;
//       }
//     }
//   });

//   // Clean up any trailing spaces in the summary
//   parsedData.summary = parsedData.summary.trim();

//   return parsedData;
// };


// // Function to extract text from DOCX files
// const extractTextFromDocx = async (filePath) => {
//   try {
//       const result = await mammoth.extractRawText({ path: filePath });
//       return result.value;
//   } catch (error) {
//       console.error('Error extracting text from DOCX:', error);
//       throw error;
//   }
// };

// // Function to extract text from PDF files
// const extractTextFromPdf = async (filePath) => {
//   const dataBuffer = fs.readFileSync(filePath);
//   const pdfData = await pdfParse(dataBuffer);
//   return pdfData.text;
// };

// // Endpoint to handle resume upload, read PDF or DOCX, and print text
// app.post('/upload-resume', upload.single('resume'), async (req, res) => {
//   try {
//       const { path: filePath, mimetype } = req.file; // Get the path and mimetype of the uploaded file
//       let extractedText = '';

//       // Extract text based on file type
//       if (mimetype === 'application/pdf') {
//           extractedText = await extractTextFromPdf(filePath);
//       } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//           extractedText = await extractTextFromDocx(filePath);
//       } else {
//           return res.status(400).json({ success: false, message: 'Unsupported file format' });
//       }

//       // Parse the extracted text
//       const parsedData = parseResume(extractedText);

//       // Send the parsed data back to the frontend
//       res.json({
//           success: true,
//           parsedData,
//       });

//       // Delete the file after processing
//       fs.unlinkSync(filePath);

//   } catch (error) {
//       console.error('Error processing resume:', error);
//       res.status(500).json({ success: false, message: 'Failed to process resume' });
//   }
// });


app.post("/chat", async (req, res) => {
  try {
      // Log the incoming user message
      console.log("Received message from frontend:", req.body.user_input);

      // Send the user input to the Python FastAPI chatbot
      const response = await axios.post("http://127.0.0.1:8000/chat", {
          user_input: req.body.user_input
      });

      // Log the chatbot's response from FastAPI
      console.log("Chatbot response:", response.data.response);

      // Send chatbot's response back to frontend
      res.json(response.data);
  } catch (error) {
      console.error("Error calling Python chatbot API:", error.message);
      res.status(500).json({ error: "Failed to communicate with chatbot" });
  }
});







app.listen(3001, () => console.log("Node.js API running on port 3001"));