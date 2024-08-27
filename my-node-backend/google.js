const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

const UserProfile = require('./models/UserprofileModel');

require('dotenv').config();


const API  = process.env.REACT_APP_GOOGLE_API;
// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API);


// Define an endpoint to generate project description
router.get('/generate-project-description/:userID/:projectName', async (req, res) => {
  try {
    const userId = req.params.userID;
    const projectName = req.params.projectName;

    // Query the database to get user details by ID
    const user = await UserProfile.findOne({ userID: userId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the specific project based on the project name
    const project = user.project.find(p => p.name.toLowerCase() === projectName.toLowerCase());

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt using the project data
    const prompt = `Write a 4 project description points for the project named "${project.name}". The project involved ${project.skills} and included the following activities: ${project.description}.
    "Note: Do not use any numbering. Start the point with *"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Send the generated text to the front end
    res.json({ text });
  } catch (error) {
    console.error('Error generating project description:', error);
    res.status(500).json({ error: 'An error occurred while generating project description' });
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



module.exports = router;
