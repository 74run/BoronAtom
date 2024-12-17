import React, { useEffect, useRef, useState } from 'react';

import { Link, useParams } from 'react-router-dom';
import { Menu, X, User, FileText, Briefcase, GraduationCap, Award, Users, Code, FileUp } from 'lucide-react';

import ProjectsSection from '../resume/Projects';
import Skills from '../resume/Skills';
import EducationSection from '../resume/Education';
import ExperienceSection from '../resume/ExperienceSection';
import CertificationSection from '../resume/CertificationSection';
import InvolvementSection from '../resume/InvolvementSection';
import SummarySection from '../resume/SummarySection';

import "react-image-crop/dist/ReactCrop.css";
import axios from 'axios';




import Footer from '../Footer';

import ProfileNew from '../profile-photo/ProfilePhoto';

import { FaFilePdf } from 'react-icons/fa';
import Modal from "../profile-photo/Model";


import PDFHTML from '../resume/PDFHTML'
import Profile from '../profile-photo/ProfilePhoto';


interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  // Add other fields as needed
}

interface ParsedData {
  name?: string;
  contact?: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  summary?: string;
  skills?: string[];
  education?: string[];
  experience?: string[];
  projects?: string[];
  certifications?: string[];
  involvements?: string[];
}


interface ContactDetails {
  name: string;
  email: string;
  phoneNumber: string;
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

interface Skill {
  _id: string;
  domain: string;
  name: string;
  includeInResume: boolean;
}

interface Education {
  _id: string;
  university: string;
  cgpa: string;
  degree: string;
  major: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  includeInResume: boolean;
  isPresent?: boolean;
}

interface Summary {
  _id: string;
content: string;
}

interface Experience {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
  includeInResume: boolean;
  isPresent?: boolean;
}

interface Involvement {
  _id: string;
  organization: string;
  role: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
  includeInResume: boolean;
  isPresent?: boolean;
 
}

interface Certification {
  _id: string;
  name: string;
  issuedBy: string;
  issuedDate: { month: string; year: string };
  expirationDate: { month: string; year: string };
  url: string;
  includeInResume: boolean;
  
}

interface Project {
  _id: string;
  name: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  skills: string;
  description: string;
  includeInResume: boolean;
  isPresent?: boolean;
}



const ResumeCraft: React.FC = () => {


  const [educations, setEducations] = useState<Education[]>([]);
  const [summarys, setSummarys] = useState<Summary[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [involvements, setInvolvements] = useState<Involvement[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const { userID } = useParams();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); 
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null); // Updated initial state
  const [eduDetails, setEduDetails] = useState<EduDetails | null>(null);
   const [imageUrl, setImageUrl] = useState<string>('');

     const [parsedData, setParsedData] = useState<ParsedData | null>(null);
     


  const [activeSection, setActiveSection] = useState('Profile'); // Manage active content

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768); // Track if screen is small

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const avatarUrl = useRef<string>(`https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const menuItems = [
    
    { name: 'Summary', icon: FileText },
    { name: 'Projects', icon: Code },
    { name: 'Experience', icon: Briefcase },
    { name: 'Education', icon: GraduationCap },
    { name: 'Certifications', icon: Award },
    { name: 'Involvements', icon: Users },
    {name: 'Skills', icon: Briefcase},
    { name: 'Profile', icon: User }
    
  ];



  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);




  useEffect(() => {
    // Fetch user details
    axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`)
      .then(response => {
        setUserDetails(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });

    // Fetch the profile image
    axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/image`, { responseType: 'arraybuffer' })
      .then(response => {
        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        const contentType = response.headers['content-type'];
        avatarUrl.current = `data:${contentType};base64,${base64Image}`;
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });

  }, [userID]);


  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
  };

  // Fetch user details and educations data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`);
        setUserDetails(userResponse.data.user);

        const eduResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/EduDetails/${userID}`);
        setEduDetails(eduResponse.data.user)

        const educationsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/education`);
        const fetchedEducations = educationsResponse.data.educations;
        setEducations(fetchedEducations);

        const contactsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/contact`);
        const fetchedContacts = contactsResponse.data.contact;
        setContactDetails(fetchedContacts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userID]);


  


  
  // useEffect(() => {
  //   // Fetch the current profile photo URL from the server on component mount
  //   axios.get(`${process.env.REACT_APP_API_URL}/api/profile-photo`)
  //     .then((response) => {
  //       setImageUrl(response.data.imageUrl);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching profile photo:', error);
  //     });
  // }, []); // Empty dependency array means this effect runs once on mount

  // const handleFileChange = (newFile: File | null) => {
  //   setFile(newFile);

  //   if (newFile) {
  //     const formData = new FormData();
  //     formData.append('photo', newFile);

  //     // Upload the new photo and update the profile photo URL
  //     axios.post('${process.env.REACT_APP_API_URL}/upload', formData)
  //       .then((response) => {
  //         setImageUrl(response.data.imageUrl);
  //       })
  //       .catch((error) => {
  //         console.error('Error uploading photo:', error);
  //       });
  //   }
  // };

  const handleDeleteProfile = () => {
    // Implement logic for image deletion on the client side
    // This example simply sets the profile photo URL to an empty string
    setImageUrl('');

    // Optional: You can also send a request to the server to delete the image from the server-side storage
    fetch('/delete-profile-photo', {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Image deleted successfully on the server');
        } else {
          console.error('Error deleting image on the server:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting image on the server:', error);
      });
  };


  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setEducations(data));
  }, []);

  const handleEditEdu = (id: string, data: {   
    university: string;
    cgpa: string;
    degree: string;
    major: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    includeInResume: boolean;
    isPresent?: boolean;
  }) => {
    // console.log('Sending data to server:', data);
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/education/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((res) => res.json())
    .then(() => {
      // Ensure educations is not undefined before mapping over it
      if (educations) {
        const updatedItems = educations.map((education) =>
          education._id === id ? { ...education, ...data } : education
        );
        setEducations(updatedItems);
      }
    });
  };

  const handleEditSkill = (id: string, data: {   
       domain: string; name: string; includeInResume: boolean;
  }) => {
    // console.log('Sending data to server:', data);
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/skill/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((res) => res.json())
    .then(() => {
      // Ensure educations is not undefined before mapping over it
      if (skills) {
        const updatedItems = skills.map((skill) =>
          skill._id === id ? { ...skill, ...data } : skill
        );
        setSkills(updatedItems);
      }
    });
  };
  
  const handleEditSum = (id: string, data: {content: string;}) => {
      // console.log('Sending data to server:', data);
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/summary/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = summarys.map((summary) =>
          summary._id === id ? { ...summary, ...data } : summary
        );
        setSummarys(updatedItems);
      });
  };

  const handleEditExp = (id: string, data: {  jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string; includeInResume: boolean; isPresent?: boolean; }) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experience/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = experiences.map((experience) =>
          experience._id === id ? { ...experience, ...data } : experience
        );
        setExperiences(updatedItems);
      });
  };

  const handleEditCert = (id: string, data: {  name: string;
    issuedBy: string;
    issuedDate: { month: string; year: string };
    expirationDate: { month: string; year: string };
    url: string; includeInResume: boolean; }) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/certification/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = certifications.map((certification) =>
          certification._id === id ? { ...certification, ...data } : certification
        );
        setCertifications(updatedItems);
      });
  };

  const handleEditInv = (id: string, data: {    organization: string;
    role: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string; includeInResume: boolean; isPresent?: boolean; }) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/involvement/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = involvements.map((involvement) =>
          involvement._id === id ? { ...involvement, ...data } : involvement
        );
        setInvolvements(updatedItems);
      });
  };

  const handleEditPro = (id: string, data: {      name: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    skills: string;
    description: string; includeInResume: boolean; isPresent?: boolean; }) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/project/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = projects.map((project) =>
          project._id === id ? { ...project, ...data } : project
        );
        setProjects(updatedItems);
      });
  };
  
  // Update onDelete in App.tsx or where you render ItemList
  const handleDeleteEdu = (id: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/education/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = educations.filter((education) => education._id !== id);
        setEducations(updatedItems);
      });
  };
  
  const handleDeleteExp = (id: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experience/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = experiences.filter((experience) => experience._id !== id);
        setExperiences(updatedItems);
      });
  };
  

  const handleDeleteCert = (id: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/certification/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = certifications.filter((certification) => certification._id !== id);
        setCertifications(updatedItems);
      });
  };

  const handleDeleteInv = (id: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/involvement/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = involvements.filter((involvement) => involvement._id !== id);
        setInvolvements(updatedItems);
      });
  };

  const handleDeletePro = (id: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/project/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = projects.filter((project) => project._id !== id);
        setProjects(updatedItems);
      });
  };

  const handleDeleteSum = (id: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/summary/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = summarys.filter((summary) => summary._id !== id);
        setSummarys(updatedItems);
      });
  };

  const handleDeleteSkill = (id: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/skill/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = skills.filter((skill) => skill._id !== id);
        setSkills(updatedItems);
      });
  };

  


  return (
    <div className="app-container">
      <style>
        {`
          body {
            margin: 0;
            font-family: Arial, sans-serif;
          }
  
          .app-container {
            background-color: #1a202c;
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
          }

          /* Custom scrollbar styling */
          * {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }

          *::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
  
          /* Enhanced Navbar Styling */
          header {
            background-color: rgba(45, 55, 72, 0.95);
            backdrop-filter: blur(8px);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 50;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }

          .navbar {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .logo-container h1 {
            font-size: clamp(1.25rem, 4vw, 1.5rem);
            font-weight: bold;
            color: #63b3ed;
            margin: 0;
          }

          .nav-buttons {
            display: flex;
            gap: 0.75rem;
            align-items: center;
          }

          .nav-button {
            background-color: transparent;
            border: 2px solid #3182ce;
            color: white;
            font-weight: 600;
            padding: 0.5rem 1.25rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: clamp(0.875rem, 2vw, 1rem);
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
          }

          .nav-button.active {
            background-color: #3182ce;
          }

          .nav-button:hover {
            background-color: #3182ce;
            transform: translateY(-2px);
          }

          .nav-button:active {
            transform: translateY(0);
          }
  
          main {
            display: flex;
            padding: 1rem;
            flex: 1;
            flex-direction: column;
            gap: 1rem;
            max-width: 1500px;
            margin: 0 auto;
            width: 100%;
          }
  
          @media (min-width: 1024px) {
            main {
              flex-direction: row;
              padding: 2rem;
            }
          }
  
          .form-container {
            width: 100%;
            background-color: #2d3748;
            padding: 1rem;
            border-radius: 12px;
            max-height: none;
            overflow-y: auto;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
  
          @media (min-width: 1024px) {
            .form-container {
              width: 55%;
              padding: 1.5rem;
              margin-right: 1rem;
              max-height: calc(100vh - 140px);
            }
          }
  
          .form-container h2 {
            font-size: clamp(1.5rem, 4vw, 1.75rem);
            font-weight: bold;
            color: #63b3ed;
            margin-bottom: 1.5rem;
          }
  
          .tabs {
            display: flex;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 0.5rem;
            background-color: #1a202c;
            border-radius: 8px;
          }
  
          .menu-button {
            flex: 1;
            min-width: calc(50% - 0.25rem);
            background-color: #4a5568;
            border: none;
            color: white;
            font-weight: 600;
            padding: 0.75rem 0.5rem;
            cursor: pointer;
            font-size: clamp(0.75rem, 2vw, 0.875rem);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all 0.2s ease;
          }
  
          @media (min-width: 640px) {
            .menu-button {
              min-width: auto;
            }
          }
  
          .menu-button:hover {
            background-color: #2b6cb0;
            transform: translateY(-1px);
          }
  
          .menu-button.active {
            background-color: #3182ce;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
  
          .menu-button svg {
            width: clamp(0.75rem, 2vw, 1rem);
            height: clamp(0.75rem, 2vw, 1rem);
            margin-right: 0.5rem;
          }
  
          .export-container {
            width: 100%;
            background-color: #2d3748;
            padding: 1rem;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
  
          @media (min-width: 1024px) {
            .export-container {
              width: 45%;
              padding: 1.5rem;
            }
          }
  
          .export-container h2 {
            font-size: clamp(1.25rem, 3vw, 1.5rem);
            font-weight: bold;
            color: #63b3ed;
            margin-bottom: 1.5rem;
          }
  
          .export-box {
            background-color: white;
            color: #1a202c;
            padding: 1.5rem;
            border-radius: 8px;
            max-height: 60vh;
            overflow-y: auto;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          }
  
          @media (min-width: 1024px) {
            .export-box {
              max-height: calc(100vh - 200px);
            }
          }
        `}
      </style>
  
      <header>
        <nav className="navbar">
          <div className="logo-container">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#63b3ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <h1>ResumeCraft</h1>
          </div>
          <div className="nav-buttons">
            <button className="nav-button active">Resume Builder</button>
            <button className="nav-button">Cover Letter</button>
          </div>
        </nav>
      </header>
  
      <main>
        <div className="form-container">
          <h2>Create Your Resume</h2>
          <div className="tabs">
            {menuItems.map((item) => (
              <button
                key={item.name}
                className={`menu-button ${activeSection === item.name ? 'active' : ''}`}
                onClick={() => setActiveSection(item.name)}
              >
                <item.icon style={{ marginRight: '4px', width: '1rem', height: '1rem' }} />
                {item.name}
              </button>
            ))}
          </div>
  
          <div className="content">
            {activeSection === 'Profile' && (
              <ProfileNew UserDetail={userDetails} ContactDetail={contactDetails} />
            )}
            {activeSection === 'Summary' && <SummarySection
              Summarys={summarys}
              onEdit={handleEditSum}
              onDelete={handleDeleteSum}
              parsedSummary={parsedData?.summary || ''}
            />}
            {activeSection === 'Projects' && <ProjectsSection
              onEdit={handleEditPro}
              onDelete={handleDeletePro}
              Projects={projects}
            />}
            {activeSection === 'Experience' && <ExperienceSection
              Experiences={experiences}
              onEdit={handleEditExp}
              onDelete={handleDeleteExp}
            />}
            {activeSection === 'Education' && <EducationSection
              Educations={educations}
              onEdit={handleEditEdu}
              onDelete={handleDeleteEdu}
              UserDetail={userDetails}
            />}
            {activeSection === 'Certifications' && <CertificationSection
              Certifications={certifications}
              onEdit={handleEditCert}
              onDelete={handleDeleteCert}
            />}
            {activeSection === 'Involvements' &&  <InvolvementSection
              Involvements={involvements}
              onEdit={handleEditInv}
              onDelete={handleDeleteInv}
            />}
                {activeSection === 'Skills' &&   <Skills
            Skills={skills}
            onEdit={handleEditSkill}
            onDelete={handleDeleteSkill}
          />}
          </div>
        </div>
  
        <div className="export-container">
          <h2>Export PDF</h2>
          <div className="export-box">
            <PDFHTML theme={'light'} />
          </div>
        </div>
      </main>
    </div>
  );
};  

export default ResumeCraft;