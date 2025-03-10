const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Groq } = require("groq-sdk");

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

// Initialize Groq API
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
});

// Optimize resume endpoint
router.post('/generate-resume/:userID/optimize', async (req, res) => {
  try {
    console.log("Received request params:", req.params); 
    console.log("Received request body:", req.body); 
    
    const { jobDescription } = req.body;

    const userId = req.params.userID.trim();

    const sanitizedJobDescription = jobDescription.trim();

    const user = await UserProfile.findOne({ userID: userId });
    
    console.log("Found user:", user ? "yes" : "no"); 

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create prompt for GPT
    const prompt = `
      Analyze the following job description and optimize the resume to match it:

      Job Description:
      ${sanitizedJobDescription}

      Current Resume summary:
      ${user.summary}

      Please provide an optimized version of the resume summary
    

      Return the response in valid JSON format with the following structure:
      {
        "summary": generated summary,
        
      }
    `;

    const result = await model.generateContent(prompt);
const generatedText = result.response ? result.response.text() : result.text;

if (!generatedText) {
  res.status(500).json({ 
    success: false,
    message: 'Failed to optimize resume',
    error: error.message 
  });
  }
  try {
    const generatedText = result.response ? result.response.text() : result.text;
    const parsedResponse = JSON.parse(generatedText);
    res.json({ success: true, summary: parsedResponse.summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid response format' });
  }
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize resume' });
  }
});

router.post('/generate-project-description/:userID/:projectName', async (req, res) => {
  try {
    console.log("Received request params:", req.params); // Add this
    console.log("Received request body:", req.body); // Add this
    
    const userId = req.params.userID.trim();
    const projectName = req.params.projectName.trim();
    
    console.log("After trim - userId:", userId, "projectName:", projectName); // Add this

    const { jobdescription = '' } = req.body;
    const sanitizedJobDescription = jobdescription.trim();

    const user = await UserProfile.findOne({ userID: userId });
    
    console.log("Found user:", user ? "yes" : "no"); // Add this

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the specific project
    const project = user.project.find(proj => {
      console.log("Comparing:", {
        existingName: proj.name.toLowerCase().trim(),
        receivedName: projectName.toLowerCase().trim()
      }); // Add this
      return proj.name.toLowerCase().trim() === projectName.toLowerCase().trim();
    });

    console.log("Found project:", project ? "yes" : "no"); // Add this

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create a prompt using the project data
    const prompt = `Generate 3 impactful and ATS-friendly bullet points starting with "*" for the project "${project.name}" that will impress recruiters and effectively communicate your skills and achievements Important: "DO NOT generate * at all even to bold words. Incorporate the following:
    
1. Use skills from job description if the project is relevant to it.
2. Key activities: ${project.description}
3. Job description to align with: ${sanitizedJobDescription}

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
const generatedText = result.response ? await result.response.text() : result.text;

if (!generatedText) {
  return res.status(500).json({ 
    success: false, 
    message: 'Failed to generate description' 
  });
}

res.json({ text: generatedText });

} catch (error) {
console.error('Error generating project description:', error);
res.status(500).json({ 
  error: 'An error occurred while generating the project description' 
});
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

    // For text-only input, use the gemini-1.5-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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

    // For text-only input, use the gemini-1.5-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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

    // For text-only input, use the gemini-1.5-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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

    // For text-only input, use the gemini-1.5-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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

    // For text-only input, use the gemini-1.5-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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

const parseWithGroq = async (extractedText) => {
  try {
    const prompt = `
      Parse the following resume text into a detailed structured format. Extract ALL information and categorize it precisely.
      You must respond ONLY with a valid JSON object, no additional text or explanations.

      Resume Text:
      ${extractedText}

      Format your response EXACTLY as this JSON structure, with no additional text:
      {
        "personalInfo": {
          "name": "",
          "email": "",
          "phone": "",
          "location": "",
          "linkedIn": ""
        },
        "summary": "",
        "experience": [{
          "jobTitle": "",
          "company": "",
          "location": "",
          "startDate": "",
          "endDate": "",
          "isPresent": false,
          "description": "",
          "achievements": [],
          "technologies": [],
          "includeInResume": true
        }],
        "education": [{
          "university": "",
          "degree": "",
          "major": "",
          "cgpa": "",
          "startDate": "",
          "endDate": "",
          "isPresent": false,
          "universityUrl": "",
          "includeInResume": true
        }],
        "skills": {
          "technical": [{
            "domain": "",
            "skills": []
          }],
          "soft": []
        },
        "certifications": [{
          "name": "",
          "issuingOrganization": "",
          "issueDate": "",
          "expiryDate": "",
          "credentialId": "",
          "credentialUrl": "",
          "includeInResume": true
        }],
        "projects": [{
          "name": "",
          "description": "",
          "technologies": [],
          "startDate": "",
          "endDate": "",
          "isPresent": false,
          "githubUrl": "",
          "liveUrl": "",
          "includeInResume": true
        }],
        "involvement": [{
          "organization": "",
          "role": "",
          "startDate": "",
          "endDate": "",
          "isPresent": false,
          "description": "",
          "includeInResume": true
        }]
      }`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a resume parser that must return ONLY valid JSON. Do not include any other text or explanations in your response."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.1, // Reduced temperature for more consistent output
      max_tokens: 4000,
    });

    const response = chatCompletion.choices[0].message.content;
    
    // Clean the response to ensure it's valid JSON
    const cleanedResponse = response.trim().replace(/^```json\s*|\s*```$/g, '');
    
    try {
      const parsedData = JSON.parse(cleanedResponse);
      return parsedData;
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      console.error('Raw response:', response);
      throw new Error('Failed to parse AI response as JSON');
    }

  } catch (error) {
    console.error('Error parsing resume with Groq API:', error);
    // Fallback to a simpler structure if parsing fails
    return {
      personalInfo: { name: "", email: "", phone: "", location: "", linkedIn: "" },
      summary: extractedText.substring(0, 500), // First 500 characters as summary
      experience: [],
      education: [],
      skills: { technical: [], soft: [] },
      certifications: [],
      projects: [],
      involvement: []
    };
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

    if (mimetype === 'application/pdf') {
      extractedText = await extractTextFromPdf(buffer);
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await extractTextFromDocx(buffer);
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported file format' });
    }

    let parsedData;
    try {
      parsedData = await parseWithGroq(extractedText);
    } catch (groqError) {
      console.error('Error with Groq API, falling back to Gemini:', groqError);
      parsedData = await parseWithGemini(extractedText);
    }

    // Store the parsed data temporarily
    const userID = req.params.userID;
    parsedDataStore.set(userID, parsedData);

    // Return the parsed data for preview
    res.json({
      success: true,
      message: 'Resume parsed successfully',
      data: parsedData
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
    const parsedData = parsedDataStore.get(userID);

    if (!parsedData) {
      return res.status(404).json({ success: false, message: 'No parsed data found for this user' });
    }

    res.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    console.error('Error retrieving parsed resume data:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve parsed resume data' });
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

    // For text-only input, use the gemini-1.5-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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

const parseWithGemini = async (extractedText) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const prompt = `
      Parse this resume text into JSON format. Return ONLY the JSON object, no other text.
      Resume: ${extractedText}

      Required JSON structure:
      {
        "personalInfo": {
          "name": "",
          "email": "",
          "phone": "",
          "location": "",
          "linkedIn": ""
        },
        "summary": "",
        "experience": [{
          "jobTitle": "",
          "company": "",
          "location": "",
          "startDate": "",
          "endDate": "",
          "isPresent": false,
          "description": "",
          "achievements": [],
          "technologies": [],
          "includeInResume": true
        }],
        "education": [{
          "university": "",
          "degree": "",
          "major": "",
          "cgpa": "",
          "startDate": "",
          "endDate": "",
          "isPresent": false,
          "universityUrl": "",
          "includeInResume": true
        }],
        "skills": {
          "technical": [{
            "domain": "",
            "skills": []
          }],
          "soft": []
        },
        "certifications": [{
          "name": "",
          "issuingOrganization": "",
          "issueDate": "",
          "expiryDate": "",
          "credentialId": "",
          "credentialUrl": "",
          "includeInResume": true
        }],
        "projects": [{
          "name": "",
          "description": "",
          "technologies": [],
          "startDate": "",
          "endDate": "",
          "isPresent": false,
          "githubUrl": "",
          "liveUrl": "",
          "includeInResume": true
        }],
        "involvement": [{
          "organization": "",
          "role": "",
          "startDate": "",
          "endDate": "",
          "isPresent": false,
          "description": "",
          "includeInResume": true
        }]
      }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to ensure it's valid JSON
    const cleanedResponse = text.trim().replace(/^```json\s*|\s*```$/g, '');
    
    try {
      const parsedData = JSON.parse(cleanedResponse);
      return parsedData;
    } catch (jsonError) {
      console.error('JSON parsing error in Gemini:', jsonError);
      console.error('Raw Gemini response:', text);
      throw new Error('Failed to parse Gemini response as JSON');
    }
  } catch (error) {
    console.error('Error parsing resume with Gemini:', error);
    throw error;
  }
};

// POST request to save parsed resume data to user profile
router.post('/save-parsed-resume/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const { parsedData, includeSections } = req.body;

    if (!parsedData) {
      return res.status(404).json({ success: false, message: 'No parsed data found' });
    }

    let userProfile = await UserProfile.findOne({ userID });
    if (!userProfile) {
      userProfile = new UserProfile({ userID });
    }

    // Only update sections that are included
    if (includeSections.summary && parsedData.summary) {
      userProfile.summary = parsedData.summary;
    }

    if (includeSections.education && parsedData.education?.length > 0) {
      // Update education section
      parsedData.education.forEach(edu => {
        if (!userProfile.education.some(existing => 
          existing.university === edu.university && 
          existing.degree === edu.degree
        )) {
          userProfile.education.push(edu);
        }
      });
    }

    // Similar conditional updates for other sections...

    await userProfile.save();
    res.json({
      success: true,
      message: 'Resume data saved to profile successfully',
      profile: userProfile
    });

  } catch (error) {
    console.error('Error saving parsed resume data:', error);
    res.status(500).json({ success: false, message: 'Failed to save resume data' });
  }
});

module.exports = router;
