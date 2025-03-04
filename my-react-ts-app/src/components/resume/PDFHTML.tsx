import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { FaFilePdf, FaPhone, FaEnvelope, FaLinkedin, FaSync } from 'react-icons/fa';
import jsPDF from 'jspdf';
// Import the library
import html2pdf from 'html2pdf.js';
import { useAuth } from '../../context/AuthContext';

import 'jspdf-autotable';


interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface ContactDetails {
  name: string;
  email: string;
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
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [eduDetails, setEduDetails] = useState<EduDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userID } = useParams<{ userID: string }>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const previousDataRef = useRef({ userDetails: null, eduDetails: null });

    // Function to fetch data
    const fetchData = useCallback(async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
      }
      
      try {
        const [userResponse, eduResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/EduDetails/${userID}`)
        ]);
  
        if (userResponse.data.user) {
          setUserDetails(userResponse.data.user);
        }
  
        if (eduResponse.data.success && eduResponse.data.user) {
          setEduDetails(eduResponse.data.user);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
        if (isManualRefresh) {
          setIsRefreshing(false);
        }
      }
    }, [userID]);
  
    // Initial data fetch
    useEffect(() => {
      fetchData();
    }, [fetchData]);


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

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  
  return ( <div className="flex flex-col gap-6 p-4">
 <button 
    onClick={() => fetchData(true)}
    disabled={isRefreshing}
    className="flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 
      text-gray-700 rounded-full transition-all duration-200 shadow-lg 
      hover:shadow-xl disabled:opacity-50"
  >
    <FaSync className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
    {isRefreshing ? 'Refreshing...' : 'Refresh'}
  </button>

   
    {/* Download buttons container outside the resume */}
    
   



    <div id="resume" ref={resumeRef} style={{...styles.resumeContainer, ...themeStyles}}>
        <div className="text-center mb-4" style={styles.header}>
          <h1 style={styles.mainTitle}>
            {eduDetails?.contact?.[0]?.name || 
             (userDetails?.firstName && userDetails?.lastName && 
              `${userDetails.firstName} ${userDetails.lastName}`) || 
             'Add Your Name'}
          </h1>
     
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
            {eduDetails?.contact[0]?.phoneNumber && (
              <div className="flex items-center gap-2 min-w-fit">
                <FaPhone className="text-gray-500 flex-shrink-0 w-3 h-3" /> 
                <span className="whitespace-nowrap">{eduDetails.contact[0].phoneNumber}</span>
              </div>
            )}
           
            {userDetails?.email && (
              <div className="flex items-center gap-2 min-w-fit">
                <FaEnvelope className="text-gray-500 flex-shrink-0 w-3 h-3" /> 
                <span className="whitespace-nowrap">{userDetails.email}</span>
              </div>
            )}
           
            {eduDetails?.contact[0]?.linkedIn && (
              <div className="flex items-center gap-2 min-w-fit">
                <FaLinkedin className="text-gray-500 flex-shrink-0 w-3 h-3" /> 
                <a 
                  href={eduDetails.contact[0].linkedIn} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors whitespace-nowrap max-w-[200px] truncate"
                >
                  {eduDetails.contact[0].linkedIn.replace('https://www.linkedin.com/in/', '')}
                </a>
              </div>
            )}
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
                <strong>{edu.university}</strong> • {edu.degree} • {edu.major}
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
    marginBottom: '0.5rem',
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
