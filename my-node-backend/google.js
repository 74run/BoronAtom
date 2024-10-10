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


router.post('/generate-project-description/:userID/:projectName', async (req, res) => {
  try {
    const userId = req.params.userID;
    const projectName = req.params.projectName;
    const { jobdescription } = req.body; // Use req.body to get jobdescription

    // Query the database to get user details by ID
    const user = await UserProfile.findOne({ userID: userId });

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
    const prompt = `Generate 3 impactful and ATS-friendly bullet points starting with "*" for the project "${project.name}" that will impress recruiters and effectively communicate your skills and achievements Important: "DO NOT generate * at all even to bold words. Incorporate the following:

1. Use skills from job description if the project is relevent to it.
2. Key activities: ${project.description}
3. Job description to align with: ${jobdescription}

Guidelines:

1. Start each bullet point with a strong, unique action verb
2. Incorporate relevant keywords and phrases from the job description
3. Quantify achievements with specific metrics, percentages, or numerical results wherever possible or use own points to quantify
4. Briefly indicate the challenge or problem addressed by each action
5. Highlight both technical skills and business/user impact
6. Use the STAR method (Situation/Task, Action, Result) to structure each point
7. Keep each bullet point concise (1-2 lines) and impactful
8. Avoid personal pronouns (I, we, my, our)
9. Ensure language is professional and industry-appropriate
10. Do not use any special formatting (NO bold, italics, underlining, or any other text formatting)
11. Present all text in plain, unformatted text only

Format for each bullet point:
[Action Verb] [specific task/achievement] by [using/leveraging] [relevant skills/tools], resulting in [quantifiable outcome and benefit to company/users/project]

Additional instructions:
- If the project details don't fully align with the job description, suggest 1-2 relevant additions or modifications to strengthen the match
- Prioritize the most impressive and relevant achievements
- Ensure technical terms are used accurately and appropriately for the industry
- If exact numbers aren't available, use phrases like "significantly reduced", "substantially improved", or provide estimated ranges
- Absolutely no text formatting or special characters should be used in the output

Example output structure (note: use plain text only, no special formatting):
* Developed [specific feature] using [technologies], resulting in [quantifiable outcome]
* Implemented [solution] to address [challenge], leading to [measurable improvement]
* Optimized [process/system] by [action taken], increasing [relevant metric] by [percentage/number]
* Collaborated with [team/stakeholders] to deliver [project outcome], exceeding [specific goal] by [amount]

Remember, the goal is to create clear, impactful, and ATS-friendly bullet points that effectively communicate your skills and achievements in the context of the target job description, using only plain, unformatted text.`;

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


// Endpoint to generate domain and skill name using Google AI
router.get('/generate/:userID/skills', async (req, res) => {
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
    const prompt = `Generate one new skill domain and their associated skills based on the following user information:
User Experience: ${user.project}
User Projects: ${user.experience}
User Certifications: ${user.certification}
User Involvements: ${user.involvement}
Do not repeat already existing User Skills : ${user.skills}
For each relevant domain, provide a domain name followed by a colon, then list the specific skills associated with that domain. Separate each skill with a comma. Use the following format:
Most Importantly
**Do not print any of these Domain Name: ${user.skills.domain} and skills : ${user.skills.name}**
**"Domain Name: Skill 1, Skill 2, Skill 3, ..."**


Avoid Unnecessory texts and bolding any words`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text_1 = await response.text();

    const text = text_1.replace(/\*/g, '')

    console.log(text)

    // Assuming the response contains domain and name in the text
    // Parse the AI-generated text to extract domain and name (this might depend on the structure of AI's response)
    const [domain, name] = text.split(':');

    // Send the generated domain and name to the front end
    res.json({ domain: domain.trim(), name: name.trim() });
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
  const aiMessage_1 = response.text();

  
  const aiMessage = aiMessage_1.replace(/\*/g, '')

  // console.log('Resume:', aiMessage)

  res.json({ message: aiMessage });
});



// Function to extract text from DOCX files
const extractTextFromDocx = async (fileBuffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw error;
  }
};

const extractTextFromPdf = async (fileBuffer) => {
  try {
    const pdfData = await pdfParse(fileBuffer);
    return pdfData.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};



const parseWithGemini = async (extractedText) => {
  try {
    const prompt = `
      Resume Text:
      ${extractedText}

      You are an AI language model that has been given structured resume data, and your task is to automatically fill out a web or digital form based on this information. Here's the structured data:

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
      1. Identify the corresponding field in the form for each category of the data provided.
      2. Automatically input the data from the resume into the matching fields.
      3. Ensure that all required fields are filled accurately and leave optional fields blank if no relevant data is available.
      4. If a field requires a specific format (e.g., date format), adjust the data accordingly before filling.
      5. Once the form is filled, review it for accuracy and completeness, then submit or prepare the form for further user review.

      Here is the specific mapping of the fields:
      Form Field 'Name' -> [Full Name]
      Form Field 'Email' -> [Email]
      Form Field 'Phone' -> [Phone]
      Form Field 'LinkedIn' -> [LinkedIn Profile]
      Form Field 'Address' -> [Location]
      Form Field 'Summary' -> [Professional Summary]
      Form Field 'Work Experience' -> [Job Title], [Company Name], [Employment Period], [Job Description]
      Form Field 'Education' -> [Degree], [Major], [Institution], [Start Date], [End Date]
      Form Field 'Skills' -> [Technical Skills], [Soft Skills]
      Form Field 'Certifications' -> [Certification Name], [Issuing Organization], [Date Obtained]
      Form Field 'Projects' -> [Project Title], [Organization], [Start Date], [End Date], [Description]
      Form Field 'Languages' -> [Language], [Proficiency Level]

      Please proceed to fill the form using the structured resume data provided.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error parsing resume with Google AI Gemini:', error);
    throw error;
  }
};

const parseSummary = (aiResponse) => {
  // Regular expression to capture the summary but exclude "Summary:" from the capture group
  const summaryMatch = aiResponse.match(/Professional Summary:\s*Summary:\s*(.+?)(?=(Work Experience|Education|Skills|Certifications|Projects|Languages|Other Relevant Information):)/s);

  // Check if a summary was found and clean it
  if (summaryMatch) {
      const summary = summaryMatch[1]
          .replace(/\n+/g, ' ')   // Replace newlines with spaces
          .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
          .trim();                // Trim any leading/trailing whitespace

      return summary;
  }
  return null; // Return null if no summary found
};
const parseEducation = (aiResponse) => {
  const educationEntries = [];

  // Regular expression to extract the Education block
  const educationMatch = aiResponse.match(/Education:\s*(.+?)(?=(Skills|Certifications|Projects|Languages|Other Relevant Information):)/s);
  
  if (educationMatch) {
      const educationBlock = educationMatch[1].trim();

      // Updated regular expression to handle multiple entries and avoid mixing
      const educationRegex = /Degree:\s*(.+?)\s*Institution:\s*(.+?)\s*Graduation Date:\s*(.+?)\s*GPA:\s*(.+?)(?=\n|Degree|$)/g;

      let match;
      while ((match = educationRegex.exec(educationBlock)) !== null) {
          const [_, degree, institution, graduationDate, gpa] = match;

          educationEntries.push({
              degree: degree.trim(),
              institution: institution.trim(),
              graduationDate: graduationDate.trim(),
              gpa: gpa.trim()
          });
      }
  }
  return educationEntries;
};

const parseProjects = (aiResponse) => {
  const projectEntries = [];

  // Regular expression to extract the Projects block
  const projectMatch = aiResponse.match(/Projects:\s*(.+?)(?=(Languages|Certifications|Other Relevant Information):)/s);
  
  if (projectMatch) {
      const projectBlock = projectMatch[1].trim();

      // Regular expression to extract each project entry (title and description)
      const projectRegex = /Project Title:\s*(.+?)\s*Description:\s*(.+?)(?=\n|Project Title|$)/g;

      let match;
      while ((match = projectRegex.exec(projectBlock)) !== null) {
          const [_, title, description] = match;

          projectEntries.push({
              title: title.trim(),
              description: description.trim()
          });
      }
  }
  return projectEntries;
};

const parseExperience = (aiResponse) => {
  const experienceEntries = [];

  // Extract the Work Experience block
  const experienceMatch = aiResponse.match(/Work Experience:\s*(.+?)(?=(Education|Skills|Certifications|Projects|Languages|Other Relevant Information):)/s);
  
  if (experienceMatch) {
      const experienceBlock = experienceMatch[1].trim();

      // Regular expression to extract each job experience separately
      const experienceRegex = /Job Title:\s*(.+?)\s*Company Name:\s*(.+?)\s*Employment Period:\s*(.+?)\s*Job Description:\s*([\s\S]+?)(?=(Job Title|$))/g;

      let match;
      while ((match = experienceRegex.exec(experienceBlock)) !== null) {
          const [_, jobTitle, companyName, employmentPeriod, jobDescription] = match;

          // Clean up the job description
          const cleanedJobDescription = jobDescription.replace(/\n+/g, ' ').trim();

          experienceEntries.push({
              jobTitle: jobTitle.trim(),
              companyName: companyName.trim(),
              employmentPeriod: employmentPeriod.trim(),
              jobDescription: cleanedJobDescription
          });
      }
  }
  return experienceEntries;
};

const parseCertifications = (aiResponse) => {
  const certificationEntries = [];

  // Extract the Certifications block
  const certificationMatch = aiResponse.match(/Certifications:\s*(.+?)(?=(Projects|Languages|Other Relevant Information|$))/s);
  
  if (certificationMatch) {
      const certificationBlock = certificationMatch[1].trim();

      // Regular expression to extract each certification entry properly
      const certificationRegex = /Certification Name:\s*(.+?)\s*Issuing Organization:\s*(.+?)\s*Date Obtained:\s*(.+?)(?=(Certification Name|$))/g;

      let match;
      while ((match = certificationRegex.exec(certificationBlock)) !== null) {
          const [_, certificationName, issuingOrganization, dateObtained] = match;

          certificationEntries.push({
              certificationName: certificationName.trim(),
              issuingOrganization: issuingOrganization.trim(),
              dateObtained: dateObtained.trim()
          });
      }
  }
  return certificationEntries;
};


const cleanAIResponse = (aiResponse) => {
  return aiResponse
      .replace(/\*\*/g, '')   // Remove double asterisks used for bold formatting
      .replace(/^\*\s*/gm, '') // Remove leading asterisks and spaces at the beginning of lines
      .replace(/\s*\n\s*/g, ' ') // Replace newlines with a single space
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
      .trim(); // Trim leading and trailing spaces
};


const parseInvolvements = (aiResponse) => {
  const involvementEntries = [];

  // Regular expression to extract the "Other Relevant Information" block
  const involvementMatch = aiResponse.match(/Other Relevant Information:\s*(.+?)(?=(Certifications|Projects|Languages|$))/s);
  
  if (involvementMatch) {
      const involvementBlock = involvementMatch[1].trim();

      // Regular expression to capture each involvement entry based on "role, organization" format
      const involvementRegex = /(.+?),\s*(.+?)\n/g;

      let match;
      while ((match = involvementRegex.exec(involvementBlock)) !== null) {
          const [_, role, organization] = match;

          involvementEntries.push({
              role: role.trim(),
              organization: organization.trim(),
          });
      }
  }
  return involvementEntries;
};


const parseSkills = (aiResponse) => {
  const skills = {
      technicalSkills: [],
      softSkills: []
  };

  // Extract the Skills block
  const skillsMatch = aiResponse.match(/Skills:\s*([\s\S]+?)(?=(Certifications|Projects|Languages|Other Relevant Information|$))/s);

  if (skillsMatch) {
      const skillsBlock = skillsMatch[1].trim();

      // Regular expression to capture Technical and Soft skills separately
      const technicalSkillsMatch = skillsBlock.match(/Technical Skills:\s*([\s\S]+?)(?=(Soft Skills|Certifications|Projects|Languages|$))/);
      const softSkillsMatch = skillsBlock.match(/Soft Skills:\s*([\s\S]+?)(?=(Certifications|Projects|Languages|$))/);

      // Process Technical Skills
      if (technicalSkillsMatch) {
          const technicalSkills = technicalSkillsMatch[1]
              .split(/[\n\*]+/)  // Split on newlines or bullet points
              .map(skill => skill.trim()) // Trim extra spaces
              .filter(skill => skill); // Remove empty entries
          skills.technicalSkills = technicalSkills;
      }

      // Process Soft Skills
      if (softSkillsMatch) {
          const softSkills = softSkillsMatch[1]
              .split(/[\n\*]+/)  // Split on newlines or bullet points
              .map(skill => skill.trim()) // Trim extra spaces
              .filter(skill => skill); // Remove empty entries
          skills.softSkills = softSkills;
      }
  }

  return skills;
};


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const parsedDataStore = new Map();


// POST request to handle file upload and parsing
router.post('/upload-resume/:userID', upload.single('resume'), async (req, res) => {
  try {
    const { buffer, mimetype } = req.file;
    let extractedText = '';

    // Check for supported file types (PDF or DOCX)
    if (mimetype === 'application/pdf') {
      extractedText = await extractTextFromPdf(buffer);
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await extractTextFromDocx(buffer);
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported file format' });
    }

   
   
    // Clean and parse extracted text
    const cleanedText = cleanAIResponse(extractedText);
    const parsedSummary = parseSummary(cleanedText);
    const parsedEducation = parseEducation(cleanedText);
    const parsedExperience = parseExperience(cleanedText);
    const parsedCertifications = parseCertifications(cleanedText);
    const parsedSkills = parseSkills(cleanedText);
    const parsedProjects = parseProjects(cleanedText);
    const parsedInvolvements = parseInvolvements(cleanedText);

    

    // Store the parsed data using user ID (you need to ensure userID is available)
    const userID = req.params.userID;
    
    // Assuming the user is authenticated and userID is available
    parsedDataStore.set(userID, {
      parsedSummary,
      parsedEducation,
      parsedExperience,
      parsedCertifications,
      parsedSkills,
      parsedProjects,
      parsedInvolvements,
    });

    res.json({
      success: true,
      parsedSummary,
      parsedEducation,
      parsedExperience,
      parsedCertifications,
      parsedSkills,
      parsedProjects,
      parsedInvolvements,
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ success: false, message: 'Failed to process resume' });
  }
});

// GET request to retrieve parsed resume data by user ID
router.get('/get-parsed-resume/:userID', (req, res) => {
  try {
    const { userID } = req.params;
    const parsedData = parsedData.get(userID);

    if (!parsedData) {
      return res.status(404).json({ success: false, message: 'No parsed data found for this user' });
    }

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

    // Filter details that are marked for inclusion in the resume
    const educations = (user.education || []).filter(education => education.includeInResume);
    const experiences = (user.experience || []).filter(experience => experience.includeInResume);
    const projects = (user.project || []).filter(project => project.includeInResume);
    const skills = (user.skills || []).filter(skill => skill.includeInResume);

    // Convert the filtered data to strings for use in the prompt
    // const educationText = educations.map(ed => `${ed.degree} from ${ed.institution}`).join(', ');
    // const experienceText = experiences.map(exp => `${exp.title} at ${exp.company}`).join(', ');
    // const projectText = projects.map(proj => proj.title).join(', ');
    // const skillsText = skills.map(skill => skill.name).join(', ');

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt using user data
    const prompt = `Write a professional cover letter for a job application. Do not include personal contact details of the user like name, address, phone number, or email. Do not even give the boxes to fill.
    Focus on the user's professional qualifications. Use the following information:
    Experience: ${experiences}, 
    Projects: ${projects}, 
    Education: ${educations}, 
    Skills: ${skills}. 
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
