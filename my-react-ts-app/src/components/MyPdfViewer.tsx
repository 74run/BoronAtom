
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
    }>;
    experience: Array<{
      jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
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
    }>
    involvement: Array<{
    organization: string;
    role: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    }>
    certification: Array<{
    name: string;
    issuedBy: string;
    issuedDate: { month: string; year: string };
    expirationDate: { month: string; year: string };
    url: string;
    }>
    skills: Array<{
      domain: string;
      name: string;
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
      axios.get(`http://localhost:3001/api/userprofile/details/${userID}`)
        .then(response => {
          setUserDetails(response.data.user);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    }, [userID]);
  
  
    useEffect(() => {
      axios.get(`http://localhost:3001/api/userprofile/EduDetails/${userID}`)
        .then(response => {
          if (response.data && response.data.success) {
            console.log('user details:',response.data.user)
            setEduDetails(response.data.user);
          } else {
            console.error('Error fetching user details:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    }, [userID]);
    
  
    const generatePdf = () => {
      
      const educations = eduDetails?.education || [];
  
      const experiences = eduDetails?.experience || [];
  
      
    
      
    
      // Add sections for projects, certifications, skills, involvements as needed
    
      const educationSection = educations.map(
        (education) => `
        \\school{${education.university}}{${education.degree}}{Graduation: ${education.endDate.year}}{\\textit{${education.major} \\labelitemi ${education.startDate.year}}}
        `
      ).join("\n");
  
  
    
      const experienceSection = experiences.map(
          (experience) => `
            \\subsection*{${experience.jobTitle} - ${experience.company}}
            ${experience.location} -- ${experience.startDate.year} to ${experience.endDate.year}
           
          `
        )
        .join("\n");
    
      // Add similar sections for projects, certifications, skills, involvements
    
      const latexCode = `
      \\documentclass{article}
      \\usepackage{geometry}
      \\geometry{margin=1in}
      \\usepackage{enumitem}
      \\setlist{nosep}
      \\usepackage{hyperref}
      \\usepackage{fancyhdr}
      \\pagestyle{fancy}
      \\renewcommand{\\headrulewidth}{0pt}
      \\rfoot{Page \\thepage}
      \\usepackage{fontawesome}
  
  
      \\textheight=10in
      \\pagestyle{fancy}
      \\raggedright
      \\fancyhf{}
      \\renewcommand{\\headrulewidth}{0pt}
  
      \\setlength{\\hoffset}{-2pt}
      \\setlength{\\footskip}{20pt}
  
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
  
  
  
      \\begin{document}
  
      \\small
      \\smallskip
      \\vspace*{-44pt}
  
      \\begin{center}
        {\\LARGE \\textbf{Tarun Sai Janapati}} \\\\
        \\faPhone\\ 551-755-1991 \\quad
        \\faEnvelope\\ \\href{mailto:tarunsai.janapati@slu.edu}{tarunsai.janapati@slu.edu} \\quad
        \\faLinkedin\\ \\url{https://www.linkedin.com/in/tarun-janapati/}
      \\end{center}
  
      \\vspace*{4pt}%
      \\header{Summary}
  
      \\vspace{15pt}
  
     \\header{Education}
  
      {${educationSection}}
  
      \\vspace*{4pt}%
      \\header{Experience}
  
      {${experienceSection}}
      \\vspace*{4pt}%
      \\header{Skills}

  
      \\vspace*{4pt}%
      \\header{Projects}
  
      \\vspace*{4pt}%
      \\header{Certifications}
  
      \\vspace*{4pt}%
      \\header{Involvements}
  
  
      \\end{document}
    `;
    const firstName = userDetails?.firstName;
    const lastName = userDetails?.lastName;
    axios
      .post('http://localhost:3001/compile-latex', { latexCode }, { responseType: 'blob' })
      .then((response) => {
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
  
        // Create a download link for the PDF
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = `${firstName}_${lastName}_resume.pdf`;
  
  
        // Append the link to the document body
        document.body.appendChild(downloadLink);
  
        // Trigger the download
        downloadLink.click();
  
        // Remove the link from the document body
        document.body.removeChild(downloadLink);
  
        // Cleanup
        URL.revokeObjectURL(downloadLink.href);
      })
      .catch((error) => {
        console.error('Error compiling LaTeX:', error);
      });
  };
    
  
  
  
    
  const previewPdf = async () => {
    try {
      const educations = eduDetails?.education || [];
    
      const experiences = eduDetails?.experience || [];
  
      const summarys = eduDetails?.summary || [];
  
      const projects = eduDetails?.project || [];
  
      const certifications = eduDetails?.certification || [];
  
      const involvements = eduDetails?.involvement || [];

      const skills = eduDetails?.skills || [];
      // Add sections for projects, certifications, skills, involvements as needed
  
      const summarySection = summarys.map(
        (summary)=>`
        \\textit{${summary.content}}
        `
      ).join("\n");
  
      const projectSection = projects.map((project) => `
      \\project{${project.name}}{${project.skills}}{${project.startDate.year} -- ${project.endDate.year}}{
          \\begin{bullet-list-minor}
              ${project.description.split('*').slice(1).map((part, index) => `\\item ${part.trim()}`).join('\n')}
          \\end{bullet-list-minor}
      }
  `).join("\n");
  
    
      const educationSection = educations.map(
        (education) => `
        \\school{${education.university}}{${education.degree}}{Graduation: ${education.endDate.year}}{\\textit{${education.major} \\labelitemi ${education.cgpa}}}
        `
      ).join("\n");
  
      const experienceSection = experiences.map((experience) => `
      \\employer{${experience.jobTitle}}{--${experience.company}}{${experience.startDate.year} -- ${experience.endDate.year}}{${experience.location}}
      \\begin{bullet-list-minor}
          ${experience.description.split('*').slice(1).map((part, index) => `\\item ${part.trim()}`).join('\n')}
      \\end{bullet-list-minor}
  `).join("\n\n");
  
  
  
      const involvementSection = involvements.map(
        (involvement) => `
            \\begin{bullet-list-major}
            \\item \\textbf{${involvement.role}} \\labelitemi ${involvement.organization} \\hfill ${involvement.startDate.year} -- ${involvement.endDate.year}
            ${involvement.description.split('*').slice(1).map((part, index) => `\\newline -{${part}}`).join('')}
            \\end{bullet-list-major}
            `
      ).join("\n");
      
  
      const certificationSection = certifications.map(
        (certification) => `
        \\begin{bullet-list-major}
        \\item \\textbf{${certification.name}} \\labelitemi ${certification.issuedBy} \\hfill ${certification.issuedDate.year} -- ${certification.expirationDate.year}
        \\end{bullet-list-major}
        `
      )
      .join("\n");

      const skillSection = skills.map(
        (skill) => `
        \\begin{bullet-list-major}
        \\item \\textbf{${skill.domain}:} ${skill.name}
        \\end{bullet-list-major}
        `
      )
      .join("\n");
  
  
  
  
  
    
      // Add similar sections for projects, certifications, skills, involvements
    
      const latexCode = `
      \\documentclass{article}
      \\usepackage{geometry}
      \\geometry{margin=1in}
      \\usepackage{enumitem}
      \\setlist{nosep}
      \\usepackage{hyperref}
      \\usepackage{fancyhdr}
      \\pagestyle{fancy}
      \\renewcommand{\\headrulewidth}{0pt}
      \\rfoot{Page \\thepage}
      \\usepackage{fontawesome}
  
  
      \\textheight=10in
      \\pagestyle{fancy}
      \\raggedright
      \\fancyhf{}
      \\renewcommand{\\headrulewidth}{0pt}
  
      \\setlength{\\hoffset}{-2pt}
      \\setlength{\\footskip}{20pt}
  
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
        {\\LARGE \\textbf{${userDetails?.firstName} ${userDetails?.lastName}}} \\\\
        \\faPhone\\ 551-755-1991 \\quad
        \\faEnvelope\\ \\href{mailto:${userDetails?.email}}{${userDetails?.email}} \\quad
        \\faLinkedin\\ \\url{https://www.linkedin.com/in/tarun-janapati/}
      \\end{center}
     \\vspace*{4pt}%
      \\header{Summary}
  
      {${summarySection}}
  
      \\vspace{15pt}
  
     \\header{Education}
  
      {${educationSection}}
  
      \\vspace*{4pt}%
      \\header{Experience}
  
      {${experienceSection}}
      \\vspace*{4pt}%
      \\header{Skills}
      {${skillSection}}
  
      \\vspace*{4pt}%
      \\header{Projects}
      {${projectSection}}
  
      \\vspace*{4pt}%
      \\header{Certifications}
      {${certificationSection}}
      \\vspace*{4pt}%
      \\header{Involvements}
      {${involvementSection}}
      \\end{document}
    `;
  
    const response = await axios.post('http://localhost:3001/compile-latex', { latexCode }, { responseType: 'blob' });
    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
  
    // Open the PDF in a new window without asking for confirmation
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  
    // Clean up the data URL
    URL.revokeObjectURL(pdfUrl);
  } catch (error) {
    console.error('Error compiling or previewing PDF:', error);
  }
  };
  
  
    return (
      <div className="container mt-(-3)">
      <div className="d-flex flex-column align-items-center pt-0">
         
          {/* PDF Download and Preview Buttons */}
          <div className="d-flex justify-content-end">
    <button className="btn btn-primary mr-2" onClick={generatePdf} style={{ marginRight: '10px' }}>
      Download PDF
    </button>
    
    <button className="btn btn-secondary" onClick={previewPdf}>
      Preview PDF
    </button>
  </div>
  
          {/* PDF Preview */}
          {previewPdfUrl && (
            <iframe
              title="PDF Preview"
              src={previewPdfUrl}
              style={{ width: '100%', height: '500px', border: 'none' }}
            />
          )}
        </div>
      </div>
    );
  };
  
  export default PDFResume;
  