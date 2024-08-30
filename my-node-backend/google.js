const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');



const UserProfile = require('./models/UserprofileModel');

require('dotenv').config();


const API  = process.env.REACT_APP_GOOGLE_API;
// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API);


router.get('/generate-project-description/:userID/:projectName', async (req, res) => {
  try {
    const userId = req.params.userID;
    const projectName = req.params.projectName;

    // Query the database to get user details by ID
    const user = await UserProfile.findOne({ userID: userId });

    console.log(projectName);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the specific project based on the project name
    const project = user.project.find(proj => proj.name.toLowerCase() === projectName.toLowerCase());

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Instantiate the generative model (adjust according to your specific SDK or API)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt using the project data
    const prompt = `Write 4 project description points for the project named "${project.name}". The project involved ${project.skills} and included the following activities: ${project.description}. 
    Note: Do not use any numbering. Start each point with *`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send the generated text to the front end
    res.json({ text });
  } catch (error) {
    console.error('Error generating project description:', error);
    res.status(500).json({ error: 'An error occurred while generating the project description' });
  }
});


router.get('/generate-job-description/:userID/:jobTitle', async (req, res) => {
  try {
    const userId = req.params.userID;
    const jobTitle = req.params.jobTitle;

    // Query the database to get user details by ID
    const user = await UserProfile.findOne({ userID: userId });

    console.log(jobTitle)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the specific experience based on the job title
    const experience = user.experience.find(exp => exp.jobTitle.toLowerCase() === jobTitle.toLowerCase());

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt using the experience data
    const prompt = `Write a 4 job description points for the role "${experience.jobTitle}". The role involved working at ${experience.company} in ${experience.location} with responsibilities including ${experience.description}.
    "Note: Do not use any numbering. Start the point with *"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send the generated text to the front end
    res.json({ text });
  } catch (error) {
    console.error('Error generating job description:', error);
    res.status(500).json({ error: 'An error occurred while generating job description' });
  }
});


router.get('/generate-involvement-description/:userID/:organization/:role', async (req, res) => {
  try {
    const { userID, organization, role } = req.params;

    // Query the database to get user details by ID
    const user = await UserProfile.findOne({ userID: userID });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the specific involvement based on the organization and role
    const involvement = user.involvement.find(inv => 
      inv.organization.toLowerCase() === organization.toLowerCase() && 
      inv.role.toLowerCase() === role.toLowerCase()
    );

    if (!involvement) {
      return res.status(404).json({ success: false, message: 'Involvement not found' });
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt using the involvement data
    const prompt = `Write a 4 description points for the role of "${involvement.role}" at "${involvement.organization}". The role involved the following activities: ${involvement.description}. 
    "Note: Do not use any numbering. Start the point with *"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send the generated text to the front end
    res.json({ text });
  } catch (error) {
    console.error('Error generating involvement description:', error);
    res.status(500).json({ error: 'An error occurred while generating involvement description' });
  }
});





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
    const prompt = `Write a short 50 words Resume summary based on experience: ${user.experience}, projects: ${user.project}, education: ${user.education} and skills: ${user.skills}`;

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

    console.log('Summaries:');
user.summary.forEach((summary, index) => {
  console.log(`Summary ${index + 1}: ${summary.content}`);
});

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt using user data
    const prompt = `Your task is to help build a resume that is tailored to a specific job description, with the goal of achieving a high ATS (Applicant Tracking System) score. To do this, you will need to modify the summary, education, experience, projects, certificates, and involvements sections of the resume to align with the job description. Consider all the factors that influence the ATS score and aim to create the perfect resume for the job.

    <job_description>
    {{${user.text}}}
    </job_description>
    
    
    <summary>
    {{${user.summary.content}}}
    </summary>

    <projects>
    {{${user.project}}}
    </projects>

    <experiences>
{{${user.experience}}}
</experiences>
    
    <scratchpad>
    First, analyze the job description to identify the key skills, qualifications, and keywords that the employer is looking for. Make a list of these items.
    
    Next, review the resume and identify areas that need improvement to better align with the job description. Consider each section of the resume (summary, education, experience, projects, certificates, and involvements) and how it can be modified to showcase relevant skills and experiences.
    </scratchpad>
    
    Now, modify each section of the resume as follows:
    
    1. Summary: Rewrite the summary to highlight the most relevant skills and experiences for the job. Use keywords from the job description.
    
    2. Education: Emphasize any degrees, courses, or training that are directly relevant to the job.
    
    3. Experience: For each job listed, focus on achievements and responsibilities that demonstrate the skills and qualifications required for the new job. Use bullet points and action verbs, quantify each description point.
    
    4. Projects: Include projects that showcase skills and knowledge relevant to the job. Provide brief descriptions that highlight your contributions and the project's impact, quantify each description point.
    
    5. Certificates: List any certificates or licenses that are relevant to the job or industry.
    
    6. Involvements: Include volunteer work, professional associations, or extracurricular activities that demonstrate relevant skills or interests, quantify each description point.
    
    <scratchpad>
    Review the modified resume to ensure that it is well-aligned with the job description and optimized for ATS scoring. Consider factors such as:
    
    - Keyword density: Have relevant keywords been used throughout the resume?
    - Formatting: Is the resume easy to read and parse by an ATS?
    - Relevance: Does the resume clearly demonstrate the skills and qualifications required for the job?
    - Achievements: Are accomplishments and impacts clearly highlighted?
    </scratchpad>
    
    Generate the final, optimized resume inside <optimized_resume> tags. Remember to aim for the perfect resume that will achieve a high ATS score for the specific job description provided.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const aiMessage = response.text();

  // console.log('Resume:', aiMessage)

  res.json({ message: aiMessage });
});






const extractTextFromDocx = async (filePath) => {
  try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
  } catch (error) {
      console.error('Error extracting text from DOCX:', error);
      throw error;
  }
};

// Function to extract text from PDF files
const extractTextFromPdf = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
};

// Function to parse the resume using Google AI Gemini
const parseWithGemini = async (extractedText) => {
  try {
      // Create a prompt for Gemini AI
      const prompt = `
  "Resume Text:
          ${extractedText}"


          "You are an AI language model that has been given structured resume data, and your task is to automatically fill out a web or digital form based on this information. Here’s the structured data:

Personal Information:

Full Name: [Extracted Name]
Contact Information:
Email: [Extracted Email]
Phone: [Extracted Phone Number]
LinkedIn Profile: [Extracted LinkedIn Profile]
Location: [Extracted Address/City/Country]
Professional Summary:

Summary: [Extracted Summary]
Work Experience:

Job Title: [Extracted Job Title]
Company Name: [Extracted Company Name]
Employment Period: [Start Date - End Date]
Job Description: [Brief Description of Duties and Achievements]
Education:

Degree: [Extracted Degree]
Institution: [Extracted Institution Name]
Graduation Date: [Graduation Date]
Skills:

Technical Skills: [List of Extracted Technical Skills]
Soft Skills: [List of Extracted Soft Skills]
Certifications & Awards:

Certification Name: [Extracted Certification Name]
Issuing Organization: [Extracted Issuing Organization]
Date Obtained: [Date Obtained]
Projects:

Project Title: [Extracted Project Title]
Description: [Brief Description of the Project]
Languages:

Language: [Language]
Proficiency Level: [Proficiency Level]
Other Relevant Information:

[Any additional information found]
Instructions for Form Filling:

Identify the corresponding field in the form for each category of the data provided.
Automatically input the data from the resume into the matching fields.
Ensure that all required fields are filled accurately and leave optional fields blank if no relevant data is available.
If a field requires a specific format (e.g., date format), adjust the data accordingly before filling.
Once the form is filled, review it for accuracy and completeness, then submit or prepare the form for further user review.
Here is the specific mapping of the fields:

Form Field 'Name' -> [Full Name]
Form Field 'Email' -> [Email]
Form Field 'Phone' -> [Phone]
Form Field 'LinkedIn' -> [LinkedIn Profile]
Form Field 'Address' -> [Location]
Form Field 'Summary' -> [Professional Summary]
Form Field 'Work Experience' -> [Job Title], [Company Name], [Employment Period], [Job Description]
Form Field 'Education' -> [Degree], [Institution], [Graduation Date]
Form Field 'Skills' -> [Technical Skills], [Soft Skills]
Form Field 'Certifications' -> [Certification Name], [Issuing Organization], [Date Obtained]
Form Field 'Projects' -> [Project Title], [Description]
Form Field 'Languages' -> [Language], [Proficiency Level]
Please proceed to fill the form using the structured resume data provided."

        

        
      `;

      // Instantiate the generative model (adjust according to your specific SDK or API)
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Send the prompt to Gemini AI
      const result = await model.generateContent( prompt );
      const response = await result.response;
      const parsedData = response.text();
    // This will contain the parsed resume data

      return parsedData;
  } catch (error) {
      console.error('Error parsing resume with Google AI Gemini:', error);
      throw error;
  }
};

const parseTextResponse = (aiResponse) => {
  const parsedData = {
    name: '',
    contact: {
      email: '',
      phone: '',
      linkedin: '',
      location: '',
    },
    summary: '',
    skills: {
      technical: [],
      soft: [],
    },
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    languages: [],
    other: '',
  };


  // Example patterns for parsing the text
  const nameMatch = aiResponse.match(/Full Name:\s*(.+)/i);
  const emailMatch = aiResponse.match(/Email:\s*(.+)/i);
  const phoneMatch = aiResponse.match(/Phone:\s*(.+)/i);
  const linkedinMatch = aiResponse.match(/LinkedIn Profile:\s*(.+)/i);
  const locationMatch = aiResponse.match(/Location:\s*(.+)/i);
  const summaryMatch = aiResponse.match(/Summary:\s*([\s\S]*?)(?=\*\*Work Experience:|\*\*Skills:|$)/i);
  
  // Skill extraction can be directly taken from the AI output if provided
  const technicalSkillsMatch = aiResponse.match(/Technical Skills:\s*([\s\S]*?)(?=\*\*Soft Skills:|\*\*|$)/i);
  const softSkillsMatch = aiResponse.match(/Soft Skills:\s*([\s\S]*?)(?=\*\*|$)/i);
  
  // Education extraction
  const educationMatches = [...aiResponse.matchAll(/\*\*(.+)\*\*\n(.+)\nGraduation:\s*(.+)\n(.+)\nGPA:\s*(.+)/gi)];
  
  // Experience extraction
  const experienceMatches = [...aiResponse.matchAll(/\*\*(.+)\*\*\n(.+)\n(.+)\n(.+)\n([\s\S]*?)(?=\n\*\*|\n$)/gi)];

  // Project extraction
  const projectMatches = [...aiResponse.matchAll(/\*\*(.+)\*\*\n([\s\S]*?)(?=\n\*\*|\n$)/gi)];

  // Certifications and Languages might need specific patterns depending on your data
  const certificationsMatch = aiResponse.match(/Certifications & Awards:\s*([\s\S]*?)(?=\*\*Languages:|$)/i);
  const languagesMatch = aiResponse.match(/Languages:\s*([\s\S]*?)(?=\*\*Other Relevant Information:|$)/i);

  const otherMatch = aiResponse.match(/Other Relevant Information:\s*(.+)/i);

  // Assign the matched values to the parsedData structure
  if (nameMatch) parsedData.name = nameMatch[1].trim();
  if (emailMatch) parsedData.contact.email = emailMatch[1].trim();
  if (phoneMatch) parsedData.contact.phone = phoneMatch[1].trim();
  if (linkedinMatch) parsedData.contact.linkedin = linkedinMatch[1].trim();
  if (locationMatch) parsedData.contact.location = locationMatch[1].trim();
  if (summaryMatch) parsedData.summary = summaryMatch[1].trim();

  if (technicalSkillsMatch) {
    parsedData.skills.technical = technicalSkillsMatch[1].split('\n').map(skill => skill.replace('* ', '').trim());
  }

  if (softSkillsMatch) {
    parsedData.skills.soft = softSkillsMatch[1].split('\n').map(skill => skill.replace('* ', '').trim());
  }

  if (educationMatches.length > 0) {
    parsedData.education = educationMatches.map(eduParts => ({
      degree: eduParts[1].trim(),
      institution: eduParts[2].trim(),
      graduationDate: eduParts[3].trim(),
      program: eduParts[4].trim(),
      gpa: eduParts[5].trim()
    }));
  }

  if (experienceMatches.length > 0) {
    parsedData.experience = experienceMatches.map(expParts => ({
      jobTitle: expParts[1].trim(),
      companyName: expParts[2].trim(),
      employmentPeriod: expParts[3].trim(),
      location: expParts[4].trim(),
      jobDescription: expParts[5].trim(),
    }));
  }

  if (projectMatches.length > 0) {
    parsedData.projects = projectMatches.map(projParts => ({
      projectTitle: projParts[1].trim(),
      description: projParts[2].trim(),
    }));
  }

  if (certificationsMatch) {
    parsedData.certifications = certificationsMatch[1].split('\n\n').map(cert => cert.trim());
  }

  if (languagesMatch) {
    parsedData.languages = languagesMatch[1].split('\n\n').map(lang => {
      const langParts = lang.match(/\*\*(.+)\*\*\nProficiency Level:\s*(.+)/i);
      return {
        language: langParts ? langParts[1].trim() : '',
        proficiencyLevel: langParts ? langParts[2].trim() : '',
      };
    });
  }

  if (otherMatch) {
    parsedData.other = otherMatch[1].trim();
  }

  return parsedData;
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Resume upload and parsing route
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
      const { path: filePath, mimetype } = req.file; // Get the path and mimetype of the uploaded file
      let extractedText = '';

      // Extract text based on file type
      if (mimetype === 'application/pdf') {
          extractedText = await extractTextFromPdf(filePath);
      } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          extractedText = await extractTextFromDocx(filePath);
      } else {
          return res.status(400).json({ success: false, message: 'Unsupported file format' });
      }

      const aiResponse = await parseWithGemini(extractedText);

      // Convert the AI response text to the ParsedData structure
      const parsedData = parseTextResponse(aiResponse);

      console.log("AI Response")
      console.log(aiResponse)

      console.log("Parsed Data")

      console.log(parsedData)

      // Send the parsed data back to the frontend
      res.json({
          success: true,
          parsedData,
      });

      // Delete the file after processing
      fs.unlinkSync(filePath);

  } catch (error) {
      console.error('Error processing resume:', error);
      res.status(500).json({ success: false, message: 'Failed to process resume' });
  }
});


const parsedDataStore = {}; // In-memory storage

router.get('/get-parsed-resume/:userID', (req, res) => {
  try {
      const { userID } = req.params;

      // Retrieve the parsed data from the in-memory store
      const parsedData = parsedDataStore[userID];

      if (!parsedData) {
          return res.status(404).json({ success: false, message: 'No parsed data found for this user' });
      }

      // Send the parsed data back to the frontend
      res.json({
          success: true,
          parsedData,
      });
  } catch (error) {
      console.error('Error retrieving parsed data:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve parsed data' });
  }
});


router.post('/generate-cover-letter/:userID', async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const userId = req.params.userID;

    // Query the database to get user details by ID
    const user = await UserProfile.findOne({ userID: userId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt using user data
    const prompt = `Write a professional cover letter for a job application based on the following information: 
    contact: ${user.contact[0]},
    Experience: ${user.experience}, 
    Projects: ${user.project}, 
    Education: ${user.education}, 
    Skills: ${user.skills}. 
    Tailor the cover letter for a position in ${jobDescription}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Send the generated cover letter text to the front end
    res.json({ coverLetter: text });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: 'An error occurred while generating the cover letter' });
  }
});



module.exports = router;
