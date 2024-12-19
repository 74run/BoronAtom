import React, { useEffect, useRef, useState } from 'react';

import { Link, useParams, useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Menu, X, User, FileText, Briefcase, GraduationCap, Award, Users, Code, FileUp } from 'lucide-react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import ProjectsSection from '../resume/Projects';
import Skills from '../resume/Skills';
import EducationSection from '../resume/Education';
import ExperienceSection from '../resume/ExperienceSection';
import CertificationSection from '../resume/CertificationSection';
import InvolvementSection from '../resume/InvolvementSection';
import SummarySection from '../resume/SummarySection';

import NavigationBar from '../NavigationBar'

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
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2-second load
    return () => clearTimeout(timer);
  }, []);

  const renderSkeleton = () => (
    <div>
      <Skeleton height={30} width="80%" style={{ marginBottom: '1rem' }} />
      <Skeleton height={20} count={5} />
    </div>
  );

  
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

  // const handleDeleteProfile = () => {
  //   // Implement logic for image deletion on the client side
  //   // This example simply sets the profile photo URL to an empty string
  //   setImageUrl('');

  //   // Optional: You can also send a request to the server to delete the image from the server-side storage
  //   fetch('/delete-profile-photo', {
  //     method: 'DELETE',
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.success) {
  //         console.log('Image deleted successfully on the server');
  //       } else {
  //         console.error('Error deleting image on the server:', data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error deleting image on the server:', error);
  //     });
  // };


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
            background-color:rgb(0, 0, 0);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            
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


          .form-container,
.export-box {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.form-container::-webkit-scrollbar,
.export-box::-webkit-scrollbar {
  display: none;
}


          .navbar {
            position: sticky; /* sticky positioning */
  top: 0; /* attach to the top */
  z-index: 50; /* layer priority */
  width: 100%; /* full width */
  border-bottom: 1px solid var(--border-color); /* bottom border */
  background-color: rgba(var(--background-color), 0.6); /* semi-transparent background */
  backdrop-filter: blur(10px); /* backdrop blur effect */
          }

          @supports (backdrop-filter: blur(10px)) {
  .navbar {
    background-color: rgba(var(--background-color), 0.6); /* alternate background if supported */
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
            border: 2px solidrgb(6, 30, 53);
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
            margin-top: 4.5rem;
          
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
            background-color: rgba(28, 82, 136, 0.1);
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
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.375rem;
  padding: 0.5rem;
  background-color: #1a202c;
  border-radius: 8px;
}

/* Style adjustments for menu buttons */
.menu-button {
  flex: 1;
  min-width: calc(33.33% - 0.5rem);
  background-color: rgba(74, 85, 104, 0.8);
  border: 1px solid rgba(99, 179, 237, 0.1);
  color: #e2e8f0;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.01em;
  backdrop-filter: blur(4px);
}

.menu-button:hover {
  background-color: rgba(49, 130, 206, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-color: rgba(99, 179, 237, 0.3);
}

.menu-button.active {
  background-color: #3182ce;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-color: rgba(99, 179, 237, 0.5);
  font-weight: 600;
}

/* Adjustments for mobile */
@media (max-width: 1024px) {
  .form-container {
    width: 100%;
    max-height: none;
  }
  
  .sticky-header {
    position: sticky;
    top: 0;
  }
}

.menu-button:hover {
  background-color: rgba(49, 130, 206, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-color: rgba(99, 179, 237, 0.3);
}

.menu-button.active {
  background-color:rgb(35, 62, 75);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-color: rgba(99, 179, 237, 0.5);
  font-weight: 600;
}

.menu-button svg {
  width: 0.875rem;
  height: 0.875rem;
  margin-right: 0.375rem;
  opacity: 0.9;
}

@media (min-width: 640px) {
  .menu-button {
    min-width: auto;
    padding: 0.5rem 1rem;
  }
  
  .tabs {
    gap: 0.5rem;
  }
}

@media (hover: hover) {
  .menu-button:active {
    transform: translateY(0);
  }
}
  
          .export-container {
            width: 100%;
            background-color: rgba(20, 101, 168, 0.1);
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

      <NavigationBar UserDetail={userDetails} />
  
      
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
          { activeSection === 'Profile' && (
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
          {loading ? <Skeleton height={200} /> : <div className="export-box">
            <PDFHTML theme={'light'} />
          </div>}
        </div>
  
   
      </main>
  
    </div>
  );
};  

export default ResumeCraft;