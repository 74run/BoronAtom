import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { FaFilePdf, FaPhone, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import jsPDF from 'jspdf';
// Import the library
import html2pdf from 'html2pdf.js';

import 'jspdf-autotable';


interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface ContactDetails {
  phoneNumber: string;
  linkedIn: string;
}

interface Summary {
  content: string;
}

interface Education {
  university: string;
  degree: string;
  major: string;
  cgpa: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  includeInResume: boolean;
  isPresent?: boolean;
}

interface Experience {
  jobTitle: string;
  company: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
  includeInResume: boolean;
  isPresent?: boolean;
}

interface Project {
  name: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  skills: string;
  description: string;
  includeInResume: boolean;
  isPresent?: boolean;
}

interface Skill {
  domain: string;
  name: string;
  includeInResume: boolean;
}

interface EduDetails {
  contact: ContactDetails[];
  summary: Summary[];
  education: Education[];
  experience: Experience[];
  project: Project[];
  skills: Skill[];
}

interface PDFResumeProps {
  theme: 'light' | 'dark';
}

const PDFResume: React.FC<PDFResumeProps> = ({ theme }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [eduDetails, setEduDetails] = useState<EduDetails | null>(null);
  const { userID } = useParams<{ userID: string }>();
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`)
      .then(response => setUserDetails(response.data.user))
      .catch(error => console.error('Error fetching user details:', error));

    axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/EduDetails/${userID}`)
      .then(response => response.data.success ? setEduDetails(response.data.user) : console.error(response.data.message))
      .catch(error => console.error('Error fetching education details:', error));
  }, [userID]);


  const generatePDF = (userDetails: UserDetails, eduDetails: EduDetails) => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    let cursorY = margin;

    // Theme colors
    const colors = theme === 'dark' ? {
      text: '#ffffff',
      header: '#63b3ed',
      subtext: '#a0aec0',
      line: '#4a5568'
    } : {
      text: '#000000',
      header: '#2d3748',
      subtext: '#4a5568',
      line: '#cbd5e0'
    };

    // Helper functions
    const addPageIfNeeded = (height: number = 20) => {
      if (cursorY + height > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
        return true;
      }
      return false;
    };

    // Style configurations
    doc.setFont("helvetica");
    
    // Header Section
    doc.setFontSize(24);
    doc.setTextColor(colors.header);
    const name = `${userDetails.firstName} ${userDetails.lastName}`;
    doc.text(name, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 25;

    // Contact Information
    doc.setFontSize(10);
    doc.setTextColor(colors.subtext);
    const contactInfo = [
      eduDetails.contact[0]?.phoneNumber,
      userDetails.email,
      eduDetails.contact[0]?.linkedIn
    ].filter(Boolean).join(" | ");
    doc.text(contactInfo, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 30;

    // Section Helper
    const addSection = (title: string, content: () => void) => {
      addPageIfNeeded(60);
      doc.setFontSize(14);
      doc.setTextColor(colors.header);
      doc.setFont("helvetica", "bold");
      doc.text(title.toUpperCase(), margin, cursorY);
      
      // Section line
      cursorY += 5;
      doc.setDrawColor(colors.line);
      doc.setLineWidth(0.5);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 20;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text);
      doc.setFontSize(10);
      
      content();
      cursorY += 20;
    };

    // Add Summary Section
    if (eduDetails.summary[0]?.content) {
      addSection("Summary", () => {
        const summaryLines = doc.splitTextToSize(
          eduDetails.summary[0].content,
          pageWidth - (margin * 2)
        );
        summaryLines.forEach((line: string | string[]) => {
          if (addPageIfNeeded()) return;
          doc.text(line, margin, cursorY);
          cursorY += 15;
        });
      });
    }

    // Add Education Section
    const includedEducation = eduDetails.education.filter(edu => edu.includeInResume);
    if (includedEducation.length > 0) {
      addSection("Education", () => {
        includedEducation.forEach(edu => {
          if (addPageIfNeeded(60)) return;
          
          doc.setFont("helvetica", "bold");
          doc.text(edu.university, margin, cursorY);
          
          const dateText = edu.isPresent ? 'Present' : `${edu.endDate.month}/${edu.endDate.year}`;
          doc.setFont("helvetica", "normal");
          doc.text(dateText, pageWidth - margin, cursorY, { align: 'right' });
          cursorY += 15;

          doc.text(`${edu.degree} in ${edu.major} - GPA: ${edu.cgpa}`, margin + 10, cursorY);
          cursorY += 25;
        });
      });
    }

    // Add Experience Section
    const includedExperience = eduDetails.experience.filter(exp => exp.includeInResume);
    if (includedExperience.length > 0) {
      addSection("Experience", () => {
        includedExperience.forEach(exp => {
          if (addPageIfNeeded(60)) return;

          doc.setFont("helvetica", "bold");
          doc.text(`${exp.jobTitle} - ${exp.company}`, margin, cursorY);
          
          const dateText = exp.isPresent ? 'Present' : `${exp.endDate.month}/${exp.endDate.year}`;
          doc.setFont("helvetica", "normal");
          doc.text(dateText, pageWidth - margin, cursorY, { align: 'right' });
          cursorY += 15;

          const description = exp.description.split('\n').map(line => 
            line.trim().startsWith('•') ? line : `• ${line}`
          );

          description.forEach(line => {
            if (addPageIfNeeded()) return;
            const wrappedLines = doc.splitTextToSize(line, pageWidth - (margin * 2) - 20);
            wrappedLines.forEach((wrappedLine: string | string[]) => {
              doc.text(wrappedLine, margin + 10, cursorY);
              cursorY += 15;
            });
          });
          cursorY += 10;
        });
      });
    }

    // Add Skills Section
    const includedSkills = eduDetails.skills.filter(skill => skill.includeInResume);
    if (includedSkills.length > 0) {
      addSection("Skills", () => {
        includedSkills.forEach(skill => {
          if (addPageIfNeeded(20)) return;
          doc.setFont("helvetica", "bold");
          doc.text(`${skill.domain}:`, margin, cursorY);
          doc.setFont("helvetica", "normal");
          const skillText = doc.splitTextToSize(skill.name, pageWidth - (margin * 2) - 100);
          doc.text(skillText, margin + 80, cursorY);
          cursorY += skillText.length * 15 + 5;
        });
      });
    }

    // Add Projects Section
    const includedProjects = eduDetails.project.filter(proj => proj.includeInResume);
    if (includedProjects.length > 0) {
      addSection("Projects", () => {
        includedProjects.forEach(proj => {
          if (addPageIfNeeded(60)) return;

          doc.setFont("helvetica", "bold");
          doc.text(proj.name, margin, cursorY);
          
          const dateText = proj.isPresent ? 'Present' : `${proj.endDate.month}/${proj.endDate.year}`;
          doc.setFont("helvetica", "normal");
          doc.text(dateText, pageWidth - margin, cursorY, { align: 'right' });
          cursorY += 15;

          const description = proj.description.split('\n').map(line => 
            line.trim().startsWith('•') ? line : `• ${line}`
          );

          description.forEach(line => {
            if (addPageIfNeeded()) return;
            const wrappedLines = doc.splitTextToSize(line, pageWidth - (margin * 2) - 20);
            wrappedLines.forEach((wrappedLine: string | string[]) => {
              doc.text(wrappedLine, margin + 10, cursorY);
              cursorY += 15;
            });
          });
          cursorY += 10;
        });
      });
    }

    doc.save(`${userDetails.username || "resume"}.pdf`);
  };


  const formatDescription = (text: string) => {
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const points = formattedText.split('*').filter(point => point.trim() !== '');
    return points.map(point => `<li>${point.trim()}</li>`).join('');
  };

  const themeStyles = {
    backgroundColor: theme === 'dark' ? '#333' : '#ffffff',
    color: theme === 'dark' ? '#ddd' : '#333',
    headerColor: theme === 'dark' ? '#e6e6e6' : '#000',
    contactInfoColor: theme === 'dark' ? '#cccccc' : '#666',
    sectionDividerColor: theme === 'dark' ? '#888' : '#000'
  };

  return (
    <div className="flex flex-col gap-6 p-4">
    {/* Download buttons container outside the resume */}
    <div className="flex gap-4 justify-end max-w-[8.5in] mx-auto w-full">
      <button 
        onClick={() => userDetails && eduDetails && generatePDF(userDetails, eduDetails)}
        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 
          text-white rounded-full hover:transform hover:scale-105 transition-all duration-200 
          shadow-lg hover:shadow-xl"
      >
        <FaFilePdf className="text-lg" />
        Download Resume
      </button>
     
    </div>





      <div id="resume" ref={resumeRef} style={styles.resumeContainer}>
        <div className="text-center mb-4" style={styles.header}>
          <h1 style={styles.mainTitle}>{`${userDetails?.firstName || ''} ${userDetails?.lastName || ''}`}</h1>
          <div className="flex justify-center space-x-4 mt-2 text-gray-600" style={styles.contactInfo}>
            <div><FaPhone /> {eduDetails?.contact[0]?.phoneNumber || ''}</div>
            <div><FaEnvelope /> {userDetails?.email || ''}</div>
            <div><FaLinkedin /> <a href={eduDetails?.contact[0]?.linkedIn} target="_blank" rel="noopener noreferrer">{eduDetails?.contact[0]?.linkedIn || ''}</a></div>
          </div>
        </div>

        {eduDetails?.summary && eduDetails.summary[0]?.content && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Summary</h2>
            <div style={styles.sectionDivider}></div>
            <p style={styles.contentIndent}>{eduDetails.summary[0].content}</p>
          </div>
        )}

        {eduDetails?.education && eduDetails.education.some(edu => edu.includeInResume) && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Education</h2>
            <div style={styles.sectionDivider}></div>
            {eduDetails.education.filter(edu => edu.includeInResume).map((edu, index) => (
              <p key={index} style={styles.contentIndent}>
                <strong>{edu.university}</strong> • {edu.degree}, {edu.major}
                <span style={styles.dateText}>{edu.isPresent ? 'Present' : `${edu.endDate.month}/${edu.endDate.year}`}</span><br />
                GPA: {edu.cgpa}
              </p>
            ))}
          </div>
        )}

        {eduDetails?.experience && eduDetails.experience.some(exp => exp.includeInResume) && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Experience</h2>
            <div style={styles.sectionDivider}></div>
            {eduDetails.experience.filter(exp => exp.includeInResume).map((exp, index) => (
              <div key={index} style={styles.contentIndent}>
                <p style={styles.entryTitle}><strong>{exp.jobTitle}</strong> - {exp.company}</p>
                <span style={styles.dateText}>{exp.isPresent ? 'Present' : `${exp.endDate.month}/${exp.endDate.year}`}</span>
                <ul style={styles.bulletList} dangerouslySetInnerHTML={{ __html: formatDescription(exp.description) }} />
              </div>
            ))}
          </div>
        )}

        {eduDetails?.skills && eduDetails.skills.some(skill => skill.includeInResume) && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Skills</h2>
            <div style={styles.sectionDivider}></div>
            <div style={styles.contentIndent}>
              {eduDetails.skills.filter(skill => skill.includeInResume).map((skill, index) => (
                <p key={index} style={styles.skillItem}><strong>{skill.domain}</strong>: {skill.name}</p>
              ))}
            </div>
          </div>
        )}

        {eduDetails?.project && eduDetails.project.some(proj => proj.includeInResume) && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Projects</h2>
            <div style={styles.sectionDivider}></div>
            {eduDetails.project.filter(proj => proj.includeInResume).map((proj, index) => (
              <div key={index} style={styles.contentIndent}>
                <p style={styles.entryTitle}><strong>{proj.name}</strong></p>
                <span style={styles.dateText}>{proj.isPresent ? 'Present' : `${proj.endDate.month}/${proj.endDate.year}`}</span>
                <ul style={styles.bulletList} dangerouslySetInnerHTML={{ __html: formatDescription(proj.description) }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

const styles: {
  resumeContainer: React.CSSProperties;
  header: React.CSSProperties;
  mainTitle: React.CSSProperties;
  contactInfo: React.CSSProperties;
  section: React.CSSProperties;
  sectionTitle: React.CSSProperties;
  sectionDivider: React.CSSProperties;
  contentIndent: React.CSSProperties;
  dateText: React.CSSProperties;
  bulletList: React.CSSProperties;
  entryTitle: React.CSSProperties;
  skillItem: React.CSSProperties;
  pageBreak: React.CSSProperties;
} = {
  resumeContainer: {
    fontFamily: "'Times New Roman', Times, serif",
    padding: '0in', // Reduced padding
    color: '#333',
    lineHeight: '1.2', // Slightly reduced line height
    maxWidth: '8.5in',
    width: '100%',
  },
  header: {
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
  },
  contactInfo: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    fontSize: '0.75rem',
    color: '#666',
  },
  section: {
    marginBottom: '0.5rem',
  },
  sectionTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '1rem',
    color: '#4B4B4B',
    letterSpacing: '0.05em',
    marginBottom: '0.1rem',
    textAlign: 'left',
  },
  sectionDivider: {
    borderBottom: '1px solid #000',
    margin: '0.1rem 0 0.2rem 0',
  },
  contentIndent: {
    marginLeft: '0.3rem',
    fontSize: '0.8rem',
    lineHeight: '1.2',
    marginBottom: '0.15rem',
    color: '#000', // Ensuring summary and education content is black
  },
  dateText: {
    float: 'right',
    fontSize: '0.75rem',
    color: '#000',
  },
  bulletList: {
    paddingLeft: '1.2rem',
    listStyleType: 'disc',
    marginTop: '0.1rem',
    lineHeight: '1.2',
  },
  entryTitle: {
    fontWeight: 'bold',
    display: 'inline-block',
    marginBottom: '0.1rem',
    fontSize: '0.8rem',
    color: '#000',
  },
  skillItem: {
    fontSize: '0.75rem',
    marginBottom: '0.1rem',
    color: '#000',
  },
  pageBreak: {
    borderTop: '1px dotted #666',
    margin: '0.2in 0',
    height: '0.1px',
    pageBreakBefore: 'always',
  },
};

export default PDFResume;
