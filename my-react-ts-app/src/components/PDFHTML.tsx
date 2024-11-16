import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { FaFilePdf, FaPhone, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import jsPDF from 'jspdf';
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

  const generatePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const marginTop = 40;

  
    
  
    // Add Header
    doc.setFontSize(16);
    doc.text(`${userDetails?.firstName || ''} ${userDetails?.lastName || ''}`, 40, marginTop);
    doc.setFontSize(10);
    doc.text([
      `Phone: ${eduDetails?.contact[0]?.phoneNumber || ''}`,
      `Email: ${userDetails?.email || ''}`,
      `LinkedIn: ${eduDetails?.contact[0]?.linkedIn || ''}`,
    ].join(' | '), 40, marginTop + 20);
  
    // Summary Section
    if (eduDetails?.summary && eduDetails.summary[0]?.content) {
      doc.setFontSize(12);
      doc.text("Summary", 40, marginTop + 40);
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(eduDetails.summary[0].content, 500), 40, marginTop + 60);
    }
  
    // Education Section
    if (eduDetails?.education && eduDetails.education.some(edu => edu.includeInResume)) {
      doc.autoTable({
        startY: marginTop + 80,
        head: [["University", "Degree", "Major", "CGPA", "Date"]],
        body: eduDetails.education.filter(edu => edu.includeInResume).map(edu => [
          edu.university,
          `${edu.degree}, ${edu.major}`,
          edu.cgpa,
          edu.isPresent ? 'Present' : `${edu.endDate.month}/${edu.endDate.year}`
        ]),
        margin: { top: 10 },
        theme: 'striped',
      });
    }
  
    // Experience Section
    if (eduDetails?.experience && eduDetails.experience.some(exp => exp.includeInResume)) {
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10 || marginTop + 120,
        head: [["Job Title", "Company", "Description", "Date"]],
        body: eduDetails.experience.filter(exp => exp.includeInResume).map(exp => [
          exp.jobTitle,
          exp.company,
          exp.description,
          exp.isPresent ? 'Present' : `${exp.endDate.month}/${exp.endDate.year}`
        ]),
        margin: { top: 10 },
        theme: 'striped',
      });
    }
  
    // Projects Section
    if (eduDetails?.project && eduDetails.project.some(proj => proj.includeInResume)) {
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10 || marginTop + 160,
        head: [["Project Name", "Skills", "Description", "Date"]],
        body: eduDetails.project.filter(proj => proj.includeInResume).map(proj => [
          proj.name,
          proj.skills,
          proj.description,
          proj.isPresent ? 'Present' : `${proj.endDate.month}/${proj.endDate.year}`
        ]),
        margin: { top: 10 },
        theme: 'striped',
      });
    }
  
    // Skills Section
    if (eduDetails?.skills && eduDetails.skills.some(skill => skill.includeInResume)) {
      doc.setFontSize(12);
      doc.text("Skills", 40, doc.lastAutoTable.finalY + 20 || marginTop + 200);
      doc.setFontSize(10);
      eduDetails.skills
        .filter(skill => skill.includeInResume)
        .forEach((skill, index) => {
          doc.text(`• ${skill.domain}: ${skill.name}`, 40, doc.lastAutoTable.finalY + 40 + index * 10);
        });
    }

    (doc as any).autoTable({
      head: [["Header 1", "Header 2"]],
      body: [["Row 1 Col 1", "Row 1 Col 2"]],
    });
  
    doc.save(`${userDetails?.username || 'Resume'}.pdf`);
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
    <div className="container mx-auto">
      <button className="btn btn-secondary mb-4" onClick={generatePDF}>
        <FaFilePdf /> Download PDF
      </button>

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
    backgroundColor: '#ffffff',
    padding: '0.2in 0.5in 0.2in 0.5in',
    color: '#333',
    lineHeight: '1.3',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '9.5in',
    margin: 'auto',
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
    marginBottom: '0.8rem',
  },
  sectionTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '1rem',
    color: '#4B4B4B',
    letterSpacing: '0.05em',
    marginBottom: '0.15rem',
    textAlign: 'left',
  },
  sectionDivider: {
    borderBottom: '1px solid #000',
    margin: '0.1rem 0 0.2rem 0',
  },
  contentIndent: {
    marginLeft: '0.5rem',
    fontSize: '0.8rem',
    lineHeight: '1.3',
    marginBottom: '0.2rem',
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
