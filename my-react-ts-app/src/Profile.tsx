
import { Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import ProjectsSection from './components/resume/Projects';
import Skills from './components/resume/Skills';
import EducationSection from './components/resume/Education';
import ExperienceSection from './components/resume/ExperienceSection';
import CertificationSection from './components/resume/CertificationSection';
import InvolvementSection from './components/resume/InvolvementSection';
import SummarySection from './components/resume/SummarySection';

import Newprofile from './newprofile'



import Footer from './components/Footer';

import ProfileNew from './components/profile-photo/ProfilePhoto';

import { FaFilePdf } from 'react-icons/fa';
import Modal from "./components/profile-photo/Model";


import PDFHTML from './components/resume/PDFHTML'

import "react-image-crop/dist/ReactCrop.css";
import axios from 'axios';


import React, { useEffect, useRef, useState } from 'react';


import { Menu, X, User, FileText, Briefcase, GraduationCap, Award, Users, Code, FileUp } from 'lucide-react';





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


const Profile: React.FC = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [summarys, setSummarys] = useState<Summary[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [involvements, setInvolvements] = useState<Involvement[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const [profileImage, setProfileImage] = useState<string>('');
  
  const { userID } = useParams();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); 
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null); // Updated initial state
  const [eduDetails, setEduDetails] = useState<EduDetails | null>(null);
  

  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  


  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('Profile'); // Manage active content

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768); // Track if screen is small

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const avatarUrl = useRef<string>(`https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`);

  const menuItems = [
    { name: 'Profile', icon: User },
    { name: 'Summary', icon: FileText },
    { name: 'Projects', icon: Code },
    { name: 'Experience', icon: Briefcase },
    { name: 'Education', icon: GraduationCap },
    { name: 'Certifications', icon: Award },
    { name: 'Involvements', icon: Users },
    { name: 'Resume', icon: FileUp }
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
  
  
  
  const renderSection = () => {
    switch (activeSection) {
      case 'Profile':
        return <ProfileNew UserDetail={userDetails} ContactDetail={contactDetails} />;
      case 'Summary':
        return (
          <SummarySection
            Summarys={summarys}
            onEdit={handleEditSum}
            onDelete={handleDeleteSum}
            parsedSummary={parsedData?.summary || ''}
          />
        );
      case 'Projects':
        return (
          <ProjectsSection
            onEdit={handleEditPro}
            onDelete={handleDeletePro}
            Projects={projects}
          />
        );
      case 'Experience':
        return (
          <ExperienceSection
            Experiences={experiences}
            onEdit={handleEditExp}
            onDelete={handleDeleteExp}
          />
        );
      case 'Education':
        return (
          <EducationSection
            Educations={educations}
            onEdit={handleEditEdu}
            onDelete={handleDeleteEdu}
            UserDetail={userDetails}
          />
        );
      case 'Skills':
        return (
          <Skills
            Skills={skills}
            onEdit={handleEditSkill}
            onDelete={handleDeleteSkill}
          />
        );
      case 'Certifications':
        return (
          <CertificationSection
            Certifications={certifications}
            onEdit={handleEditCert}
            onDelete={handleDeleteCert}
          />
        );
      case 'Involvements':
        return (
          <InvolvementSection
            Involvements={involvements}
            onEdit={handleEditInv}
            onDelete={handleDeleteInv}
          />
        );
        case 'PDFHTML':
          return <PDFHTML theme={'light'}  />;
        default:
          return <ProfileNew UserDetail={userDetails} ContactDetail={contactDetails} />;
      }


  
  };

 
  return (
    <>
    
      {/* Full page layout */}
      <div
  className="Full-Profile"
  style={{
    display: "flex",
    flexDirection: "column",
    
    paddingTop: "50px",
    paddingLeft: "25px",
    paddingRight: "15px",
    overflow: "hidden"
  }}
>




      

        <div className="pt-16 flex">
        {/* Sidebar */}
  
          
      <Newprofile />

    


        {/* Main Content Area */}
        <div
        className="flex-container"
          style={{
            display: "flex",
            justifyContent: "space-between", // Change to "space-between" for better separation
            gap: "20px",
            borderRadius: "10px",
            flexDirection: isMobileView ? "column" : "row",
           
           
            paddingTop: "20px", // Added padding to give spacing from the top
            height: "100%", // Ensures it takes up the available space
            marginTop: "20px"
          }}
        >
          {/* Left Sidebar (Profile Info and Navigation Menu) */}
          <div
          
          className="sidebar"
            style={{
              flex: "0.3",
              display: "flex",
              flexDirection: "column",
              borderRadius: "0px",
              
              gap: "30px",
             
              height: "auto",
            }}
          >
        <div className="bg-gray-800 text-white p-6 rounded-lg w-60">

       
        <div
  className="profile-photo"
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
     marginTop: "2.5rem",
    marginBottom: "1.5rem",
    
  }}
>
  <img
    onClick={() => setModalOpen(true)}
    src={avatarUrl.current}
    alt="Avatar"
    className="rounded-circle"
    style={{
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      border: "4px solid #2d2d30",
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.5)",
      objectFit: "cover",
      cursor: "pointer",
      marginBottom: "1rem",
      borderColor: 'black', // Add space between image and text
    }}
    loading="lazy"
  />

{modalOpen && (
        <Modal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
          currentAvatar={avatarUrl.current}
        />
      )}

  <div style={{ textAlign: "center" }}>
    <h2 className="text-lg font-semibold">
      {userDetails?.firstName} {userDetails?.lastName}
    </h2>
    <p className="text-gray-400 text-sm">{userDetails?.email}</p>
  </div>
</div>


<div className="d-flex flex-column"
style={{cursor: "pointer"}}>
  <a
    
    className={`nav-link ${activeSection === 'Profile' ? 'active' : ''} custom-nav-link mx-2 px-4 py-2`}
    onClick={() => setActiveSection('Profile')}
  >
    <i className="fas fa-user-circle text-lg me-2"></i> 
    <span className="text-sm font-medium">Profile</span>
  </a>
  <a
    
    className={`nav-link ${activeSection === 'Summary' ? 'active' : ''} custom-nav-link mx-2 px-4 py-2`}
    onClick={() => setActiveSection('Summary')}
  >
<i className="fas fa-file-alt text-lg me-2"></i> 
<span className="text-sm font-medium">Summary</span>

  </a>
  <a
 
    className={`nav-link ${activeSection === 'Projects' ? 'active' : ''} custom-nav-link mx-2 px-4 py-2`}
    onClick={() => setActiveSection('Projects')}
  >
    <i className="fas fa-tasks text-lg me-2"></i> 
    <span className="text-sm font-medium">Projects</span>
  </a>

  <a
    
    className={`nav-link ${activeSection === 'Experience' ? 'active' : ''} custom-nav-link mx-2 px-4 py-2`}
    onClick={() => setActiveSection('Experience')}
  >
    <i className="fas fa-briefcase text-lg me-2"></i> 
    <span className="text-sm font-medium">Experience</span>
  </a>

  <a
  
    className={`nav-link ${activeSection === 'Education' ? 'active' : ''} custom-nav-link mx-2 px-4 py-2`}
    onClick={() => setActiveSection('Education')}
  >
    <i className="fas fa-graduation-cap text-lg me-2"></i> 
    <span className="text-sm font-medium">Education</span>
  </a>

  <a
   
    className={`nav-link ${activeSection === 'Certifications' ? 'active' : ''} custom-nav-link mx-2 px-4 py-2`}
    onClick={() => setActiveSection('Certifications')}
  >
    <i className="fas fa-certificate text-lg me-2"></i> 
    <span className="text-sm font-medium">Certifications</span>
  </a>

  <a
    
    className={`nav-link ${activeSection === 'Involvements' ? 'active' : ''} custom-nav-link mx-2 px-4 py-2`}
    onClick={() => setActiveSection('Involvements')}
  >
    <i className="fas fa-users text-lg me-2"></i> 
    <span className="text-sm font-medium">Involvements</span>
  </a>

  <a
   
    className={`nav-link ${activeSection === 'Skills' ? 'active' : ''} custom-nav-link mx-2 px-4 py-2`}
    onClick={() => setActiveSection('Skills')}
  >
    <i className="fas fa-lightbulb text-lg me-2"></i> 
    <span className="text-sm font-medium">Skills</span>
  </a>

  <a
                  className={`nav-link ${activeSection === 'PDFHTML' ? 'active' : ''} custom-nav-link mx-2 px-4 py-2`}
                  onClick={() => setActiveSection('PDFHTML')}
                >
                  <FaFilePdf className="me-2" />
                  <span className="text-sm font-medium">PDF Resume</span>
                </a>
</div>

</div>

          </div>
  
          {/* Right Column (Main Content Area) */}
          <div
          className="main-content"
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              
              height: "100vh",
               // Padding to improve spacing
              borderRadius: "0px", // Rounded edges for the section
              
              // Slight shadow for separation
              overflowY: "auto",
               // Ensures it doesn't overflow the viewport
            }}
          >
            {/* Section Rendering */}
            <section className="bg-gray-100 p-6" >
              {renderSection()}
            </section>
          </div>
        </div>
      </div>
</div>
      
  
        <Footer />
    </>
  
  );

  
};





export default Profile;