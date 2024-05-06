
import { BrowserRouter as Router } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CoverPage from './components/CoverPage';
import ProjectsSection from './components/Projects';
import Skills from './components/Skills';
import EducationSection from './components/Education';
import ExperienceSection from './components/ExperienceSection';
import CertificationSection from './components/CertificationSection';
import InvolvementSection from './components/InvolvementSection';
import SummarySection from './components/SummarySection';
import ProfilePhoto from './components/ProfilePhotoWithUpload';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import SectionWrapper from './components/SectionWrapper';
import ProfileNew from './components/ProfilePhoto';
import ChatBox from './components/ChatBox';

// import LatexTemplate from './components/MyPdfViewer';
import "react-image-crop/dist/ReactCrop.css";
import axios from 'axios';
import './index.css';
import './css/profile.css';
import './App.css';

import PDFResume from './components/MyPdfViewer';

import React, { useEffect, useState } from 'react';


interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  // Add other fields as needed
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
}

interface Education {
  _id: string;
  university: string;
  cgpa: string;
  degree: string;
  major: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
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
}

interface Involvement {
  _id: string;
  organization: string;
  role: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
 
}

interface Certification {
  _id: string;
  name: string;
  issuedBy: string;
  issuedDate: { month: string; year: string };
  expirationDate: { month: string; year: string };
  url: string;
  
}

interface Project {
  _id: string;
  name: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  skills: string;
  description: string;
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
  
  const { userID } = useParams();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); 
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null); // Updated initial state
  const [eduDetails, setEduDetails] = useState<EduDetails | null>(null);
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


  


  
  useEffect(() => {
    // Fetch the current profile photo URL from the server on component mount
    axios.get(`${process.env.REACT_APP_API_URL}/api/profile-photo`)
      .then((response) => {
        setImageUrl(response.data.imageUrl);
      })
      .catch((error) => {
        console.error('Error fetching profile photo:', error);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);

    if (newFile) {
      const formData = new FormData();
      formData.append('photo', newFile);

      // Upload the new photo and update the profile photo URL
      axios.post('${process.env.REACT_APP_API_URL}/upload', formData)
        .then((response) => {
          setImageUrl(response.data.imageUrl);
        })
        .catch((error) => {
          console.error('Error uploading photo:', error);
        });
    }
  };

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
       domain: string; name: string;
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
    description: string; }) => {
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
    url: string; }) => {
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
    description: string; }) => {
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
    description: string; }) => {
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
    <>
      {/* NavigationBar is used outside the Switch to ensure it's always rendered */}
      <NavigationBar />
  
      {/* Three Sections Layout */}
      <div className='Full-Profile' style={{ display: 'flex', position: 'relative', backgroundColor:'black', paddingTop: '80px', paddingBottom:'50px' }}>


      <div className='empty' style={{ flex: '0 0 5%' }}>
          {/* Add content for the right section */}
      
          {/* For example: */}
        </div>





        {/* Middle Section (60%) */}
        
        <div className= 'Full-Resume' style={{ flex: '0 0 45%', position: 'relative', borderRadius: '20px' }}>
          {/* Content for the middle section goes here */}
          <div style={{ marginBottom: '0px' }}>
            <CoverPage onUpload={(file: File): void => { } } />
            <div style={{ marginTop: '-80px'}}>
  <ProfileNew UserDetail={userDetails} ContactDetail={contactDetails} />

  <PDFResume userDetails={userDetails} eduDetails={eduDetails} />
</div>

            <div></div>
          </div>
          <SectionWrapper>
            <div style={{  padding: '10px' }} />
            <SummarySection Summarys={summarys} onEdit={handleEditSum} onDelete={handleDeleteSum} />
            <ProjectsSection onEdit={handleEditPro} onDelete={handleDeletePro} Projects={projects} />
            <Skills Skills={skills} onEdit={handleEditSkill} onDelete={handleDeleteSkill} />
            <EducationSection Educations={educations} onEdit={handleEditEdu} onDelete={handleDeleteEdu} UserDetail={userDetails} />
            <ExperienceSection Experiences={experiences} onEdit={handleEditExp} onDelete={handleDeleteExp}/>
            <CertificationSection Certifications={certifications} onEdit={handleEditCert} onDelete={handleDeleteCert}/>
            <InvolvementSection Involvements={involvements} onEdit={handleEditInv} onDelete={handleDeleteInv} />
          </SectionWrapper>
        </div>
  
        {/* Right Section (20%) */}
        <div className='chatbox' style={{ flex: '0 0 30%' }}>
          {/* Add content for the right section */}
          <ChatBox />
          {/* For example: */}
        </div>

        
      </div>
  
      <div>
        <Footer />
      </div>
    </>
  );
};  

export default Profile;
