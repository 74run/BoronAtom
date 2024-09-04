
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaFilePdf, FaEye, FaLeaf } from 'react-icons/fa';


import React, { useRef, useState, useEffect } from "react";

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    // Add other fields as needed
  }

interface EduDetails {
    education: Array<{
      university: string;
      cgpa: string;
      degree: string;
      major: string;
      startDate: { month: string; year: string };
      endDate: { month: string; year: string };
      includeInResume: boolean;
      isPresent?: boolean;
    }>;
    experience: Array<{
      jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
    }>
    summary: Array<{
        content: string;
      
    }>
    project: Array<{
      name: string;
      startDate: { month: string; year: string };
      endDate: { month: string; year: string };
      skills: string;
      description: string;
      includeInResume: boolean;
      isPresent?: boolean;
    }>

    involvement: Array<{
    organization: string;
    role: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
    }>
    certification: Array<{
    name: string;
    issuedBy: string;
    issuedDate: { month: string; year: string };
    expirationDate: { month: string; year: string };
    url: string;
    includeInResume: boolean;
    }>
    skills: Array<{
      domain: string;
      name: string;
      includeInResume: boolean;
    }>
    contact: Array<{
      name: string;
      email: string;
      phoneNumber: string;
      linkedIn: string;
    }>
  }

interface PDFGeneratorProps {
  userDetails: UserDetails | null;
  eduDetails: EduDetails | null;
}


const PDFResume: React.FC<PDFGeneratorProps> = () => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [eduDetails, setEduDetails] = useState<EduDetails | null>(null);

    
    const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  
    const { userID } = useParams();
  

    useEffect(() => {
      // Make an HTTP request to fetch user details based on the user ID
      axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`)
        .then(response => {
          setUserDetails(response.data.user);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    }, [userID]);
  
  
    useEffect(() => {
      axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/EduDetails/${userID}`)
        .then(response => {
          if (response.data && response.data.success) {
            
            setEduDetails(response.data.user);
          } else {
            console.error('Error fetching user details:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    }, [userID]);
    
  
   

  function convertToLatex(description: string): string {
    // Define a map of special characters and their LaTeX equivalents
    const symbolMap: { [key: string]: string } = {
        '%': '\\%',
      // Replace % with \%
        
        // Add more symbols and their replacements as needed
    };

    // Replace special symbols with their LaTeX equivalents
    let convertedDescription: string = description;
    for (const symbol in symbolMap) {
        convertedDescription = convertedDescription.replace(new RegExp(symbol, 'g'), symbolMap[symbol]);
    }

    return convertedDescription;
};
  

    
const previewPdf = async () => {
  try {
    const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`);
    setUserDetails(userResponse.data.user);

    const eduResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/EduDetails/${userID}`);
    if (eduResponse.data && eduResponse.data.success) {
      setEduDetails(eduResponse.data.user);
    } else {
      console.error('Error fetching education details:', eduResponse.data.message);
      return;
    }

    // Wait for the state to update fully
    await new Promise(resolve => setTimeout(resolve, 300));

    const educations = (eduDetails?.education || []).filter(education => education.includeInResume);
    const experiences = (eduDetails?.experience || []).filter(experience => experience.includeInResume);
    const summarys = eduDetails?.summary || [];
    const projects = (eduDetails?.project || []).filter(project => project.includeInResume);
    const certifications = (eduDetails?.certification || []).filter(certification => certification.includeInResume);
    const involvements = (eduDetails?.involvement || []).filter(involvement => involvement.includeInResume);
    const skills = (eduDetails?.skills || []).filter(skill => skill.includeInResume);
    const contacts = eduDetails?.contact || [];

    const summarySection = summarys.length > 0 ? `
      \\header{Summary}
      ${summarys.map(summary => `\\textit{${summary.content}}`).join("\n")}
    ` : '';

    const educationSection = educations.length > 0 ? `
  \\header{Education}
  ${educations.map(education => `
    \\school{${education.university}}{${education.degree}}{
      Graduation: ${education.isPresent ? 'Present' : `${education.endDate.month}/${education.endDate.year}`}
    }{\\textit{${education.major} \\labelitemi GPA: ${education.cgpa}}}
  `).join("\n")}
` : '';

    const experienceSection = experiences.length > 0 ? `
      \\header{Experience}
      ${experiences.map(experience => `
        \\employer{${experience.jobTitle}}{--${experience.company}}{${experience.startDate.month}/${experience.startDate.year} -- ${experience.isPresent ? 'Present' : `${experience.endDate.month}/${experience.endDate.year}`}{${experience.location}}
        ${experience.description && experience.description.trim() !== '' ? `
        \\begin{bullet-list-minor}
          ${convertToLatex(experience.description.split('*').slice(1).map(part => `\\item ${part.trim()}`).join('\n'))}
        \\end{bullet-list-minor}` : ''}
      `).join("\n")}
    ` : '';

    const projectSection = projects.length > 0 ? `
      \\header{Projects}
      ${projects.map(project => `
        \\project{${project.name}}{${project.skills}}{${project.startDate.month}/${project.startDate.year} -- ${project.isPresent ? 'Present' : `${project.endDate.month}/${project.endDate.year}`}{
          \\begin{bullet-list-minor}
            ${convertToLatex(project.description.split('*').slice(1).map(part => `\\item ${part.trim()}`).join('\n'))}
          \\end{bullet-list-minor}
        }
      `).join("\n")}
    ` : '';

    const certificationSection = certifications.length > 0 ? `
      \\header{Certifications}
      ${certifications.map(certification => `
        \\begin{bullet-list-major}
          \\item \\textbf{${certification.name}} \\labelitemi ${certification.issuedBy} \\hfill ${certification.issuedDate.month}/${certification.issuedDate.year} -- ${certification.expirationDate.month}/${certification.expirationDate.year}
        \\end{bullet-list-major}
      `).join("\n")}
    ` : '';

    const involvementSection = involvements.length > 0 ? `
      \\header{Involvements}
      ${involvements.map(involvement => `
        \\begin{bullet-list-major}
          \\item \\textbf{${involvement.role}} \\labelitemi ${involvement.organization} \\hfill ${involvement.startDate.month}/${involvement.startDate.year} -- ${involvement.isPresent ? 'Present' : `${involvement.endDate.month}/${involvement.endDate.year}`}
          ${involvement.description.split('*').slice(1).map(part => `\\newline -{${part}}`).join('')}
        \\end{bullet-list-major}
      `).join("\n")}
    ` : '';

    const skillSection = skills.length > 0 ? `
      \\header{Skills}
      ${skills.map(skill => `
        \\begin{bullet-list-major}
          \\item \\textbf{${skill.domain}:} ${skill.name}
        \\end{bullet-list-major}
      `).join("\n")}
    ` : '';

    // Construct the LaTeX code with only sections that have content
    const latexCode = `
    \\documentclass{article}
    \\usepackage{geometry}
    \\usepackage{lipsum}
    % Set margins for the first page
    \\newgeometry{top=0.5in, bottom=1in, left=1in, right=1in}
    \\usepackage{enumitem}
    \\setlist{nosep}
    \\usepackage{hyperref}
    \\usepackage{fancyhdr}
    \\pagestyle{fancy}
    \\renewcommand{\\headrulewidth}{0pt}
    \\rfoot{Page \\thepage}
    \\usepackage{fontawesome}
    \\setlength{\\textheight}{9.5in}
    \\setlength{\\footskip}{30pt} 
    \\pagestyle{fancy}
    \\raggedright
    \\fancyhf{}
    \\renewcommand{\\headrulewidth}{0pt}
    \\setlength{\\hoffset}{-2pt}
    \\setlength{\\footskip}{30pt}
    \\def\\bull{\\vrule height 0.8ex width .7ex depth -.1ex }

    \\newcommand{\\contact}[3]{
      \\vspace*{5pt}
      \\begin{center}
        {\\LARGE \\scshape {#1}}\\\\
        \\vspace{3pt}
        #2 
        \\vspace{2pt}
        #3
      \\end{center}
      \\vspace*{-8pt}
    }
    \\newcommand{\\school}[4]{
      \\textbf{#1} \\labelitemi #2 \\hfill #3 \\\\ #4 \\vspace*{5pt}
    }
    \\newcommand{\\employer}[4]{{
      \\vspace*{2pt}%
      \\textbf{#1} #2 \\hfill #3\\\\ #4 \\vspace*{2pt}}
    }
    \\newcommand{\\project}[4]{{
      \\vspace*{2pt}% 
      \\textbf{#1} #2 \\hfill #3\\\\ #4 \\vspace*{2pt}}
    }
    \\newcommand{\\lineunder}{
      \\vspace*{-8pt} \\\\ \\hspace*{-18pt} 
      \\hrulefill \\\\
    }
    \\newcommand{\\header}[1]{{
      \\hspace*{-15pt}\\vspace*{6pt} \\textsc{#1}} \\vspace*{-6pt} 
      \\lineunder
    }
    \\newcommand{\\content}{
      \\vspace*{2pt}%
    }
    \\renewcommand{\\labelitemi}{
      $\\vcenter{\\hbox{\\tiny$\\bullet$}}$\\hspace*{3pt}
    }
    \\renewcommand{\\labelitemii}{
      $\\vcenter{\\hbox{\\tiny$\\bullet$}}$\\hspace*{-3pt}
    }
    \\newenvironment{bullet-list-major}{
      \\begin{list}{\\labelitemii}{\\setlength\\leftmargin{3pt} 
      \\topsep 0pt \\itemsep -2pt}}{\\vspace*{4pt}\\end{list}
    }
    \\newenvironment{bullet-list-minor}{
      \\begin{list}{\\labelitemii}{\\setlength\\leftmargin{15pt} 
      \\topsep 0pt \\itemsep -2pt}}{\\vspace*{4pt}\\end{list}
    }
    \\begin{document}
    \\small
    \\smallskip
    \\vspace*{-44pt}
    \\begin{center}
      {\\LARGE \\textbf{${
        contacts[0]?.name ? contacts[0].name : `${userDetails?.firstName} ${userDetails?.lastName}`
    }}} \\\\
      \\faPhone\\ ${contacts[0]?.phoneNumber} \\quad
      \\faEnvelope\\ \\href{mailto:${contacts[0]?.email ? contacts[0].email : `${userDetails?.email}`}}{
        ${contacts[0]?.email ? contacts[0].email : `${userDetails?.email}`}
    } \\quad
      \\faLinkedin\\ \\url{${contacts[0]?.linkedIn}}
    \\end{center}
    ${summarySection}
    ${educationSection}
    ${experienceSection}
    ${skillSection}
    ${projectSection}
    ${certificationSection}
    ${involvementSection}
    \\end{document}
    `;

    // Step 3: Store the LaTeX code on your server
    await axios.post(`${process.env.REACT_APP_API_URL}/store-latex`, { latexCode });

    // Step 4: Use the stored LaTeX code URL in the Overleaf link
    const texFileUrl = `${process.env.REACT_APP_API_URL}/${userDetails?.firstName}_Resume`;
    const encodedUri = encodeURIComponent(texFileUrl);
    const overleafUrl = `https://www.overleaf.com/docs?snip_uri=${encodedUri}`;

    // Step 5: Open the Overleaf link in a new window
    window.open(overleafUrl, '_blank');
  } catch (error) {
    console.error('Error storing or viewing LaTeX code:', error);
  }
};

    return (
      <div className="container mt-(-3)">
      <div className="d-flex flex-column align-items-center pt-0">
         
          {/* PDF Download and Preview Buttons */}
          <div className="d-flex justify-content-end">
          

<button className="btn btn-secondary" onClick={previewPdf} style={{
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "25px",
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  marginLeft: "auto",// Adjusted font size
}}>
  <FaLeaf />  Preview Overleaf PDF
</button>
  </div>
  
          {/* PDF Preview */}
          {previewPdfUrl && (
            <iframe
              title="PDF Overleaf Preview"
              src={previewPdfUrl}
              style={{ width: '100%', height: '500px', border: 'none' }}
            />
          )}
        </div>
      </div>
    );
  };
  
  export default PDFResume;
  